import { Router, type Response } from 'express';
import type { D1Database } from '../db.ts';
import { sendPasswordChangedEmail } from '../mail.ts';
import {
  clearSessionCookie,
  hashPassword,
  requireAuth,
  verifyPassword,
  type AuthenticatedRequest,
} from '../security.ts';
import { buildUserPayload } from './auth.ts';

export function createUserRouter(db: D1Database) {
  const router = Router();
  router.use(requireAuth);

  router.patch('/profile', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const {
        displayName,
        interfaceLang,
        theme,
        leaderboardVisible,
        reducedMotion,
        practicePrefs,
      } = req.body || {};

      const userId = req.authUser!.id;
      const nowIso = new Date().toISOString();

      const cleanDisplayName =
        typeof displayName === 'string' && displayName.trim().length >= 2 && displayName.trim().length <= 32
          ? displayName.trim()
          : req.authUser!.display_name;

      const cleanLang =
        interfaceLang === 'en' || interfaceLang === 'fr' || interfaceLang === 'de'
          ? interfaceLang
          : req.authUser!.interface_lang;

      const cleanTheme = theme === 'dark' || theme === 'light' ? theme : req.authUser!.theme;

      const cleanLb =
        typeof leaderboardVisible === 'boolean' ? (leaderboardVisible ? 1 : 0) : req.authUser!.leaderboard_visible;

      const cleanRm =
        typeof reducedMotion === 'boolean' ? (reducedMotion ? 1 : 0) : req.authUser!.reduced_motion;

      if (practicePrefs !== undefined) {
        await db
          .prepare('UPDATE users SET practice_prefs_json = ?, updated_at = ? WHERE id = ?')
          .bind(JSON.stringify(practicePrefs), nowIso, userId)
          .run();
      }

      await db
        .prepare(
          `UPDATE users
           SET display_name = ?, interface_lang = ?, theme = ?, timezone = 'UTC',
               leaderboard_visible = ?, reduced_motion = ?, updated_at = ?
           WHERE id = ?`
        )
        .bind(cleanDisplayName, cleanLang, cleanTheme, cleanLb, cleanRm, nowIso, userId)
        .run();

      const userPayload = await buildUserPayload(db, userId);
      res.json({ user: userPayload });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to update profile.' });
    }
  });

  router.post('/change-password', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body || {};
      if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
        res.status(400).json({ error: 'Current and new passwords are required.' });
        return;
      }
      if (newPassword.length < 8) {
        res.status(400).json({ error: 'New password must be at least 8 characters.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        res.status(400).json({ error: 'New passwords do not match.' });
        return;
      }

      const row = await db
        .prepare('SELECT password_hash FROM users WHERE id = ?')
        .bind(req.authUser!.id)
        .first<{ password_hash: string }>();

      if (!row || !verifyPassword(currentPassword, row.password_hash)) {
        res.status(403).json({ error: 'Current password is incorrect.' });
        return;
      }

      const nowIso = new Date().toISOString();
      const updatePasswordStmt = db
        .prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?')
        .bind(hashPassword(newPassword), nowIso, req.authUser!.id);

      // Revoke other active sessions for security
      const revokeOtherStmt = db
        .prepare('UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND id != ? AND revoked_at IS NULL')
        .bind(nowIso, req.authUser!.id, req.authUser!.sessionId);

      await db.batch([updatePasswordStmt, revokeOtherStmt]);

      await sendPasswordChangedEmail({
        toEmail: req.authUser!.email,
        username: req.authUser!.username,
        lang: req.authUser!.interface_lang,
      });

      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to change password.' });
    }
  });

  // Export learning progress JSON (strictly excludes credentials and tokens)
  router.get('/export', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.authUser!.id;

      const [
        profile,
        practiceSessions,
        studyDays,
        lessonProgress,
        rewardEvents,
        inventory,
        achievements,
      ] = await Promise.all([
        db
          .prepare(
            `SELECT id, username, display_name, interface_lang, theme, timezone,
                    xp_total, coins_balance, current_streak, best_streak, last_study_date, created_at
             FROM users WHERE id = ?`
          )
          .bind(userId)
          .first(),
        db
          .prepare(
            `SELECT id, mode, selected_topics_json, selected_lessons_json, parameters_json,
                    total_questions, correct_count, incorrect_count, skipped_count, timed_out_count,
                    elapsed_seconds, results_json, xp_awarded, coins_awarded, created_at
             FROM practice_sessions WHERE user_id = ? ORDER BY created_at DESC`
          )
          .bind(userId)
          .all(),
        db
          .prepare('SELECT local_date, qualifying_actions, xp_earned, is_frozen FROM study_activity_days WHERE user_id = ?')
          .bind(userId)
          .all(),
        db
          .prepare(
            'SELECT lesson_id, bookmarked, first_completed_at, last_reviewed_at, review_count FROM lesson_progress WHERE user_id = ?'
          )
          .bind(userId)
          .all(),
        db
          .prepare(
            'SELECT action_type, xp_delta, coin_delta, reference_id, local_date, created_at FROM reward_events WHERE user_id = ? ORDER BY created_at DESC'
          )
          .bind(userId)
          .all(),
        db
          .prepare('SELECT item_id, quantity, equipped, purchased_at FROM user_inventory WHERE user_id = ?')
          .bind(userId)
          .all(),
        db
          .prepare('SELECT achievement_id, unlocked_at, claimed_at FROM user_achievements WHERE user_id = ?')
          .bind(userId)
          .all(),
      ]);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="sprachwerk-export-${req.authUser!.username}.json"`);
      res.send(
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            profile,
            studyDays: studyDays.results,
            lessonProgress: lessonProgress.results,
            practiceSessions: practiceSessions.results,
            rewardEvents: rewardEvents.results,
            inventory: inventory.results,
            achievements: achievements.results,
          },
          null,
          2
        )
      );
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to export learning progress.' });
    }
  });

  router.delete('/account', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { password } = req.body || {};
      if (typeof password !== 'string' || !password) {
        res.status(400).json({ error: 'Password confirmation is required to delete your account.' });
        return;
      }

      const row = await db
        .prepare('SELECT password_hash FROM users WHERE id = ?')
        .bind(req.authUser!.id)
        .first<{ password_hash: string }>();

      if (!row || !verifyPassword(password, row.password_hash)) {
        res.status(403).json({ error: 'Incorrect password.' });
        return;
      }

      await db.prepare('DELETE FROM users WHERE id = ?').bind(req.authUser!.id).run();
      clearSessionCookie(req, res);
      res.json({ deleted: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to delete account.' });
    }
  });

  return router;
}
