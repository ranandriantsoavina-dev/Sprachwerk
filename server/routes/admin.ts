import crypto from 'node:crypto';
import { Router, type Response } from 'express';
import type { D1Database } from '../db.ts';
import {
  DEFAULT_GAMIFICATION_CONFIG,
  getDefaultAuthConfig,
  getSetting,
  setSetting,
  type AuthConfig,
  type GamificationConfig,
} from '../db.ts';
import { getMailtrapStatus } from '../mail.ts';
import {
  generateRegistrationCode,
  getCodeHint,
  hashSecret,
  normalizeCode,
  requireAdmin,
  requireAuth,
  type AuthenticatedRequest,
} from '../security.ts';

export function createAdminRouter(db: D1Database) {
  const router = Router();

  router.use(requireAuth, requireAdmin);

  router.get('/codes', async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const nowIso = new Date().toISOString();
      // Mark any naturally expired active codes
      await db
        .prepare(
          `UPDATE registration_codes SET status = 'expired' WHERE status = 'active' AND expires_at IS NOT NULL AND expires_at <= ?`
        )
        .bind(nowIso)
        .run();

      const { results: rows } = await db
        .prepare(
          `SELECT rc.id, rc.code_hint, rc.label, rc.status, rc.created_at, rc.expires_at, rc.redeemed_at, rc.revoked_at,
                  creator.username AS created_by_username,
                  redeemer.username AS redeemed_by_username
           FROM registration_codes rc
           LEFT JOIN users creator ON creator.id = rc.created_by_user_id
           LEFT JOIN users redeemer ON redeemer.id = rc.redeemed_by_user_id
           ORDER BY rc.created_at DESC
           LIMIT 200`
        )
        .all();

      res.json({ codes: rows });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
    }
  });

  router.post('/codes', async (req: AuthenticatedRequest, res: Response) => {
    const { count = 1, label = '', expiresInDays = 30 } = req.body || {};
    const qty = Math.min(20, Math.max(1, Number(count) || 1));
    const cleanLabel = typeof label === 'string' ? label.trim().slice(0, 80) : '';
    const days = expiresInDays === null || expiresInDays === 0 ? null : Math.min(365, Math.max(1, Number(expiresInDays) || 30));

    const now = new Date();
    const nowIso = now.toISOString();
    const expiresAt = days ? new Date(now.getTime() + days * 86400000).toISOString() : null;

    const generated: Array<{ id: string; code: string; codeHint: string; expiresAt: string | null }> = [];
    const statements = [];

    for (let i = 0; i < qty; i++) {
      const rawCode = generateRegistrationCode();
      const id = crypto.randomUUID();
      const hint = getCodeHint(rawCode);
      statements.push(
        db
          .prepare(
            `INSERT INTO registration_codes (id, code_hash, code_hint, label, status, created_by_user_id, created_at, expires_at)
             VALUES (?, ?, ?, ?, 'active', ?, ?, ?)`
          )
          .bind(
            id,
            hashSecret(normalizeCode(rawCode)),
            hint,
            cleanLabel || null,
            req.authUser!.id,
            nowIso,
            expiresAt
          )
      );
      generated.push({ id, code: rawCode, codeHint: hint, expiresAt });
    }

    try {
      await db.batch(statements);
      res.status(201).json({ generated });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to generate codes.' });
    }
  });

  router.post('/codes/:id/revoke', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const nowIso = new Date().toISOString();
      const result = await db
        .prepare(
          `UPDATE registration_codes SET status = 'revoked', revoked_at = ?
           WHERE id = ? AND status = 'active'`
        )
        .bind(nowIso, req.params.id)
        .run();

      if (Number(result.meta.changes || 0) === 0) {
        res.status(404).json({ error: 'Active registration code not found.' });
        return;
      }
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to revoke code.' });
    }
  });

  router.get('/settings', async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const gamification = await getSetting<GamificationConfig>(db, 'gamification_config', DEFAULT_GAMIFICATION_CONFIG);
      const auth = await getSetting<AuthConfig>(db, 'auth_config', getDefaultAuthConfig());
      const countRow = await db.prepare('SELECT COUNT(*) AS cnt FROM users').first<{ cnt: number }>();
      res.json({
        gamification,
        auth,
        mailtrap: getMailtrapStatus(),
        usersCount: countRow?.cnt ?? 0,
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to retrieve settings.' });
    }
  });

  router.patch('/settings', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { gamification, auth } = req.body || {};

      if (gamification && typeof gamification === 'object') {
        const current = await getSetting<GamificationConfig>(db, 'gamification_config', DEFAULT_GAMIFICATION_CONFIG);
        const next: GamificationConfig = {
          xpPerLessonFirst: Math.max(0, Number(gamification.xpPerLessonFirst ?? current.xpPerLessonFirst)),
          coinsPerLessonFirst: Math.max(0, Number(gamification.coinsPerLessonFirst ?? current.coinsPerLessonFirst)),
          xpPerLessonReview: Math.max(0, Number(gamification.xpPerLessonReview ?? current.xpPerLessonReview)),
          xpPerQuestionCorrect: Math.max(0, Number(gamification.xpPerQuestionCorrect ?? current.xpPerQuestionCorrect)),
          xpPerSessionComplete: Math.max(0, Number(gamification.xpPerSessionComplete ?? current.xpPerSessionComplete)),
          coinsPerSessionComplete: Math.max(0, Number(gamification.coinsPerSessionComplete ?? current.coinsPerSessionComplete)),
          minQuestionsForSessionReward: Math.max(1, Number(gamification.minQuestionsForSessionReward ?? current.minQuestionsForSessionReward)),
          xpPerFlashcardReview: Math.max(0, Number(gamification.xpPerFlashcardReview ?? current.xpPerFlashcardReview)),
          xpPerPerfectSession: Math.max(0, Number(gamification.xpPerPerfectSession ?? current.xpPerPerfectSession)),
          xpPerDailyFirstStudy: Math.max(0, Number(gamification.xpPerDailyFirstStudy ?? current.xpPerDailyFirstStudy)),
          coinsPerDailyFirstStudy: Math.max(0, Number(gamification.coinsPerDailyFirstStudy ?? current.coinsPerDailyFirstStudy)),
          levelBaseXp: Math.max(20, Number(gamification.levelBaseXp ?? current.levelBaseXp)),
          levelStepXp: Math.max(10, Number(gamification.levelStepXp ?? current.levelStepXp)),
          levelCoinBonus: Math.max(0, Number(gamification.levelCoinBonus ?? current.levelCoinBonus)),
          streakProtectionEnabled: Boolean(gamification.streakProtectionEnabled ?? current.streakProtectionEnabled),
          maxStreakFreezesHeld: Math.max(1, Math.min(5, Number(gamification.maxStreakFreezesHeld ?? current.maxStreakFreezesHeld))),
        };
        await setSetting(db, 'gamification_config', next);
      }

      if (auth && typeof auth === 'object') {
        const currentAuth = await getSetting<AuthConfig>(db, 'auth_config', getDefaultAuthConfig());
        const nextAuth: AuthConfig = {
          requireEmailVerification: Boolean(auth.requireEmailVerification ?? currentAuth.requireEmailVerification),
        };
        await setSetting(db, 'auth_config', nextAuth);
      }

      res.json({
        gamification: await getSetting<GamificationConfig>(db, 'gamification_config', DEFAULT_GAMIFICATION_CONFIG),
        auth: await getSetting<AuthConfig>(db, 'auth_config', getDefaultAuthConfig()),
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to update settings.' });
    }
  });

  router.get('/shop', async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const { results: items } = await db
        .prepare('SELECT * FROM shop_items ORDER BY sort_order ASC')
        .all<Record<string, unknown>>();

      res.json({
        items: items.map((it) => ({
          ...it,
          name_i18n: JSON.parse(String(it.name_i18n)),
          description_i18n: JSON.parse(String(it.description_i18n)),
        })),
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to load shop items.' });
    }
  });

  router.patch('/shop/:id', async (req: AuthenticatedRequest, res: Response) => {
    const { price_coins, availability } = req.body || {};
    const validAvailability = availability === 'available' || availability === 'seasonal' || availability === 'disabled';

    if (price_coins !== undefined && (Number.isNaN(Number(price_coins)) || Number(price_coins) < 0)) {
      res.status(400).json({ error: 'Price must be a non-negative number.' });
      return;
    }

    try {
      const existing = await db
        .prepare('SELECT id, price_coins, availability FROM shop_items WHERE id = ?')
        .bind(req.params.id)
        .first<{ id: string; price_coins: number; availability: string }>();

      if (!existing) {
        res.status(404).json({ error: 'Shop item not found.' });
        return;
      }

      const nextPrice = price_coins !== undefined ? Math.round(Number(price_coins)) : existing.price_coins;
      const nextAvail = validAvailability ? availability : existing.availability;

      await db
        .prepare('UPDATE shop_items SET price_coins = ?, availability = ? WHERE id = ?')
        .bind(nextPrice, nextAvail, existing.id)
        .run();

      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to update shop item.' });
    }
  });

  return router;
}
