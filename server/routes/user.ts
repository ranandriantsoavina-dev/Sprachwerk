import { Router, type Response } from 'express';
import type { DatabaseSync } from 'node:sqlite';
import { sendPasswordChangedEmail } from '../mail.ts';
import { clearSessionCookie, hashPassword, requireAuth, verifyPassword, type AuthenticatedRequest } from '../security.ts';
import { buildUserPayload } from './auth.ts';

export function createUserRouter(db: DatabaseSync) {
  const router = Router();
  router.use(requireAuth);

  router.patch('/profile', (req: AuthenticatedRequest, res: Response) => {
    const {
      displayName,
      interfaceLang,
      theme,
      timezone,
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

    const cleanTz =
      typeof timezone === 'string' && timezone.trim().length > 0 && timezone.trim().length <= 64
        ? timezone.trim()
        : req.authUser!.timezone;

    const cleanLb =
      typeof leaderboardVisible === 'boolean' ? (leaderboardVisible ? 1 : 0) : req.authUser!.leaderboard_visible;

    const cleanRm =
      typeof reducedMotion === 'boolean' ? (reducedMotion ? 1 : 0) : req.authUser!.reduced_motion;

    if (practicePrefs !== undefined) {
      db.prepare('UPDATE users SET practice_prefs_json = ?, updated_at = ? WHERE id = ?').run(
        JSON.stringify(practicePrefs),
        nowIso,
        userId
      );
    }

    db.prepare(
      `UPDATE users
       SET display_name = ?, interface_lang = ?, theme = ?, timezone = ?,
           leaderboard_visible = ?, reduced_motion = ?, updated_at = ?
       WHERE id = ?`
    ).run(cleanDisplayName, cleanLang, cleanTheme, cleanTz, cleanLb, cleanRm, nowIso, userId);

    res.json({ user: buildUserPayload(db, userId) });
  });

  router.post('/change-password', async (req: AuthenticatedRequest, res: Response) => {
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

    const row = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.authUser!.id) as {
      password_hash: string;
    };
    if (!verifyPassword(currentPassword, row.password_hash)) {
      res.status(403).json({ error: 'Current password is incorrect.' });
      return;
    }

    const nowIso = new Date().toISOString();
    db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(
      hashPassword(newPassword),
      nowIso,
      req.authUser!.id
    );
    // Revoke other active sessions for security
    db.prepare(
      'UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND id != ? AND revoked_at IS NULL'
    ).run(nowIso, req.authUser!.id, req.authUser!.sessionId);

    await sendPasswordChangedEmail({
      toEmail: req.authUser!.email,
      username: req.authUser!.username,
      lang: req.authUser!.interface_lang,
    });

    res.json({ ok: true });
  });

  // Export learning progress JSON (strictly excludes credentials and tokens)
  router.get('/export', (req: AuthenticatedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const profile = db
      .prepare(
        `SELECT id, username, display_name, interface_lang, theme, timezone,
                xp_total, coins_balance, current_streak, best_streak, last_study_date, created_at
         FROM users WHERE id = ?`
      )
      .get(userId);

    const practiceSessions = db
      .prepare(
        `SELECT id, mode, selected_topics_json, selected_lessons_json, parameters_json,
                total_questions, correct_count, incorrect_count, skipped_count, timed_out_count,
                elapsed_seconds, results_json, xp_awarded, coins_awarded, created_at
         FROM practice_sessions WHERE user_id = ? ORDER BY created_at DESC`
      )
      .all(userId);

    const studyDays = db
      .prepare('SELECT local_date, qualifying_actions, xp_earned, is_frozen FROM study_activity_days WHERE user_id = ?')
      .all(userId);

    const lessonProgress = db
      .prepare(
        'SELECT lesson_id, bookmarked, first_completed_at, last_reviewed_at, review_count FROM lesson_progress WHERE user_id = ?'
      )
      .all(userId);

    const rewardEvents = db
      .prepare('SELECT action_type, xp_delta, coin_delta, reference_id, local_date, created_at FROM reward_events WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId);

    const inventory = db
      .prepare('SELECT item_id, quantity, equipped, purchased_at FROM user_inventory WHERE user_id = ?')
      .all(userId);

    const achievements = db
      .prepare('SELECT achievement_id, unlocked_at, claimed_at FROM user_achievements WHERE user_id = ?')
      .all(userId);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="sprachwerk-export-${req.authUser!.username}.json"`);
    res.send(
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          profile,
          studyDays,
          lessonProgress,
          practiceSessions,
          rewardEvents,
          inventory,
          achievements,
        },
        null,
        2
      )
    );
  });

  router.delete('/account', (req: AuthenticatedRequest, res: Response) => {
    const { password } = req.body || {};
    if (typeof password !== 'string' || !password) {
      res.status(400).json({ error: 'Password confirmation is required to delete your account.' });
      return;
    }

    const row = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.authUser!.id) as {
      password_hash: string;
    };
    if (!verifyPassword(password, row.password_hash)) {
      res.status(403).json({ error: 'Incorrect password.' });
      return;
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(req.authUser!.id);
    clearSessionCookie(req, res);
    res.json({ deleted: true });
  });

  return router;
}
