import crypto from 'node:crypto';
import { Router, type Response } from 'express';
import type { D1Database } from '../db.ts';
import { getDefaultAuthConfig, getSetting, type AuthConfig } from '../db.ts';
import {
  calculateLevelFromXp,
  getGamificationConfig,
  syncAchievementsForUser,
} from '../gamification.ts';
import {
  getEnvSecret,
  getMailtrapStatus,
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from '../mail.ts';
import {
  checkRateLimit,
  clearSessionCookie,
  createSession,
  generateRandomToken,
  hashPassword,
  hashSecret,
  normalizeCode,
  requireAuth,
  setSessionCookie,
  validateEmail,
  validateUsername,
  verifyPassword,
  type AuthenticatedRequest,
} from '../security.ts';

export async function buildUserPayload(db: D1Database, userId: string) {
  const user = await db
    .prepare(
      `SELECT id, username, email, role, status, email_verified, display_name,
              interface_lang, theme, timezone, leaderboard_visible, reduced_motion,
              xp_total, weekly_xp, monthly_xp, coins_balance, current_streak, best_streak,
              last_study_date, streak_freezes_available, practice_prefs_json, created_at
       FROM users WHERE id = ?`
    )
    .bind(userId)
    .first<Record<string, unknown>>();

  if (!user) return null;

  const cfg = await getGamificationConfig(db);
  const level = calculateLevelFromXp(Number(user.xp_total || 0), cfg);

  const { results: equippedRows } = await db
    .prepare(
      `SELECT s.id, s.effect_type, s.effect_value, s.name_i18n, s.image_key
       FROM user_inventory ui
       JOIN shop_items s ON s.id = ui.item_id
       WHERE ui.user_id = ? AND ui.equipped = 1 AND ui.quantity > 0`
    )
    .bind(userId)
    .all<{
      id: string;
      effect_type: string;
      effect_value: string;
      name_i18n: string;
      image_key: string;
    }>();

  const equipped: Record<string, { itemId: string; value: string; imageKey: string }> = {};
  for (const row of equippedRows) {
    equipped[row.effect_type] = {
      itemId: row.id,
      value: row.effect_value,
      imageKey: row.image_key,
    };
  }

  const claimableCountRow = await db
    .prepare(
      `SELECT COUNT(*) AS cnt FROM user_achievements WHERE user_id = ? AND claimed_at IS NULL`
    )
    .bind(userId)
    .first<{ cnt: number }>();

  let practicePrefs: unknown = null;
  if (typeof user.practice_prefs_json === 'string' && user.practice_prefs_json) {
    try {
      practicePrefs = JSON.parse(user.practice_prefs_json);
    } catch {
      practicePrefs = null;
    }
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    emailVerified: Boolean(user.email_verified),
    displayName: user.display_name,
    interfaceLang: user.interface_lang,
    theme: user.theme,
    timezone: user.timezone,
    leaderboardVisible: Boolean(user.leaderboard_visible),
    reducedMotion: Boolean(user.reduced_motion),
    xpTotal: user.xp_total,
    weeklyXp: user.weekly_xp,
    monthlyXp: user.monthly_xp,
    coinsBalance: user.coins_balance,
    unlimitedCoins: user.role === 'admin',
    currentStreak: user.current_streak,
    bestStreak: user.best_streak,
    lastStudyDate: user.last_study_date,
    streakFreezesAvailable: user.streak_freezes_available,
    practicePrefs,
    createdAt: user.created_at,
    level,
    equipped,
    claimableAchievements: claimableCountRow?.cnt ?? 0,
  };
}

export function createAuthRouter(db: D1Database) {
  const router = Router();

  router.get('/bootstrap-status', async (_req, res: Response) => {
    try {
      const countRow = await db.prepare('SELECT COUNT(*) AS cnt FROM users').first<{ cnt: number }>();
      const authCfg = await getSetting<AuthConfig>(db, 'auth_config', getDefaultAuthConfig());
      res.json({
        needsAdminBootstrap: (countRow?.cnt ?? 0) === 0,
        adminPasscodeRequired: Boolean(getEnvSecret('ADMIN_PASSCODE')),
        emailVerificationMandatory: authCfg.requireEmailVerification,
        mailtrap: getMailtrapStatus(),
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
    }
  });

  router.post('/bootstrap-admin', async (req: AuthenticatedRequest, res: Response) => {
    const { username, email, password, confirmPassword, passcode, timezone, interfaceLang } = req.body || {};

    const expectedPasscode = getEnvSecret('ADMIN_PASSCODE');
    if (expectedPasscode) {
      if (typeof passcode !== 'string' || !passcode) {
        res.status(403).json({ error: 'Admin setup passcode is required.' });
        return;
      }
      const a = crypto.createHash('sha256').update(passcode).digest();
      const b = crypto.createHash('sha256').update(expectedPasscode).digest();
      if (!crypto.timingSafeEqual(a, b)) {
        res.status(403).json({ error: 'Invalid admin setup passcode.' });
        return;
      }
    }

    const unameCheck = validateUsername(username);
    if (!unameCheck.valid) {
      res.status(400).json({ error: unameCheck.reason });
      return;
    }
    if (!validateEmail(email)) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }
    if (typeof password !== 'string' || password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match.' });
      return;
    }

    const lang = interfaceLang === 'fr' || interfaceLang === 'de' ? interfaceLang : 'en';
    const tz = typeof timezone === 'string' && timezone.length <= 64 ? timezone : 'UTC';
    const nowIso = new Date().toISOString();
    const userId = crypto.randomUUID();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    try {
      const countRow = await db.prepare('SELECT COUNT(*) AS cnt FROM users').first<{ cnt: number }>();
      if ((countRow?.cnt ?? 0) > 0) {
        res.status(409).json({ error: 'Initial administrator account has already been claimed.' });
        return;
      }

      await db
        .prepare(
          `INSERT INTO users
           (id, username, email, password_hash, role, status, email_verified, display_name,
            interface_lang, theme, timezone, created_at, updated_at)
           VALUES (?, ?, ?, ?, 'admin', 'active', 1, ?, ?, 'light', ?, ?, ?)`
        )
        .bind(userId, cleanUsername, cleanEmail, hashPassword(password), cleanUsername, lang, tz, nowIso, nowIso)
        .run();

      await syncAchievementsForUser(db, userId);

      const session = await createSession(db, req, userId);
      setSessionCookie(req, res, session.rawToken);
      const userPayload = await buildUserPayload(db, userId);
      res.status(201).json({ user: userPayload, sessionToken: session.rawToken });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to initialize admin.' });
    }
  });

  router.post('/register', async (req: AuthenticatedRequest, res: Response) => {
    const ip = req.ip || 'unknown';
    const rl = await checkRateLimit(db, `register:${ip}`, 10, 15 * 60 * 1000);
    if (!rl.allowed) {
      res.status(429).json({ error: `Too many registration attempts. Try again in ${rl.retryAfterSec}s.` });
      return;
    }

    const { username, email, password, confirmPassword, usageCode, acceptTerms, timezone, interfaceLang } =
      req.body || {};

    const unameCheck = validateUsername(username);
    if (!unameCheck.valid) {
      res.status(400).json({ error: unameCheck.reason });
      return;
    }
    if (!validateEmail(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }
    if (typeof password !== 'string' || password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Password confirmation does not match.' });
      return;
    }
    if (!acceptTerms) {
      res.status(400).json({ error: 'You must accept the terms and privacy notice.' });
      return;
    }
    if (typeof usageCode !== 'string' || !usageCode.trim()) {
      res.status(400).json({ error: 'A valid single-use registration code is required.' });
      return;
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const codeHash = hashSecret(normalizeCode(usageCode));
    const authCfg = await getSetting<AuthConfig>(db, 'auth_config', getDefaultAuthConfig());
    const lang = interfaceLang === 'fr' || interfaceLang === 'de' ? interfaceLang : 'en';
    const tz = typeof timezone === 'string' && timezone.length <= 64 ? timezone : 'UTC';
    const now = new Date();
    const nowIso = now.toISOString();
    const userId = crypto.randomUUID();
    const rawVerifyToken = generateRandomToken(32);
    const verifyExpiresIso = new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString();

    try {
      const codeRow = await db
        .prepare('SELECT id, status, expires_at FROM registration_codes WHERE code_hash = ?')
        .bind(codeHash)
        .first<{ id: string; status: string; expires_at: string | null }>();

      if (!codeRow || codeRow.status !== 'active' || (codeRow.expires_at && codeRow.expires_at <= nowIso)) {
        if (codeRow && codeRow.status === 'active' && codeRow.expires_at && codeRow.expires_at <= nowIso) {
          await db.prepare(`UPDATE registration_codes SET status = 'expired' WHERE id = ?`).bind(codeRow.id).run();
        }
        res.status(400).json({ error: 'Invalid, expired, or already redeemed registration code.' });
        return;
      }

      const existingUser = await db
        .prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)')
        .bind(cleanUsername, cleanEmail)
        .first<{ id: string }>();

      if (existingUser) {
        res.status(409).json({ error: 'An account with this username or email already exists.' });
        return;
      }

      const initialStatus = authCfg.requireEmailVerification ? 'pending' : 'active';
      const insertUserStmt = db
        .prepare(
          `INSERT INTO users
           (id, username, email, password_hash, role, status, email_verified, display_name,
            interface_lang, theme, timezone, created_at, updated_at)
           VALUES (?, ?, ?, ?, 'learner', ?, 0, ?, ?, 'light', ?, ?, ?)`
        )
        .bind(
          userId,
          cleanUsername,
          cleanEmail,
          hashPassword(password),
          initialStatus,
          cleanUsername,
          lang,
          tz,
          nowIso,
          nowIso
        );

      const redeemCodeStmt = db
        .prepare(
          `UPDATE registration_codes
           SET status = 'redeemed', redeemed_by_user_id = ?, redeemed_at = ?
           WHERE id = ? AND status = 'active'`
        )
        .bind(userId, nowIso, codeRow.id);

      const insertTokenStmt = db
        .prepare(
          `INSERT INTO email_verification_tokens (id, user_id, token_hash, expires_at, created_at)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(crypto.randomUUID(), userId, hashSecret(rawVerifyToken), verifyExpiresIso, nowIso);

      await db.batch([insertUserStmt, redeemCodeStmt, insertTokenStmt]);
      await syncAchievementsForUser(db, userId);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Registration failed.' });
      return;
    }

    const origin = `${req.protocol}://${req.get('host')}`;
    const mailResult = await sendVerificationEmail({
      toEmail: cleanEmail,
      username: cleanUsername,
      rawToken: rawVerifyToken,
      lang,
      origin,
    });

    if (!authCfg.requireEmailVerification) {
      const session = await createSession(db, req, userId);
      setSessionCookie(req, res, session.rawToken);
      const userPayload = await buildUserPayload(db, userId);
      res.status(201).json({
        needsVerification: false,
        mailResult,
        user: userPayload,
        sessionToken: session.rawToken,
      });
      return;
    }

    res.status(201).json({
      needsVerification: true,
      mailResult,
      user: null,
    });
  });

  router.post('/verify-email', async (req: AuthenticatedRequest, res: Response) => {
    const ip = req.ip || 'unknown';
    const rl = await checkRateLimit(db, `verify:${ip}`, 15, 15 * 60 * 1000);
    if (!rl.allowed) {
      res.status(429).json({ error: `Too many verification attempts. Try again in ${rl.retryAfterSec}s.` });
      return;
    }

    const { token } = req.body || {};
    if (typeof token !== 'string' || !token.trim()) {
      res.status(400).json({ error: 'Verification token is required.' });
      return;
    }

    const tokenHash = hashSecret(token.trim());
    const nowIso = new Date().toISOString();

    const row = await db
      .prepare(
        `SELECT id, user_id, expires_at, used_at FROM email_verification_tokens WHERE token_hash = ?`
      )
      .bind(tokenHash)
      .first<{ id: string; user_id: string; expires_at: string; used_at: string | null }>();

    if (!row || row.used_at || row.expires_at <= nowIso) {
      res.status(400).json({ error: 'Verification link is invalid or has expired.' });
      return;
    }

    const updateTokenStmt = db
      .prepare('UPDATE email_verification_tokens SET used_at = ? WHERE id = ?')
      .bind(nowIso, row.id);
    const updateUserStmt = db
      .prepare(
        `UPDATE users SET email_verified = 1, status = 'active', updated_at = ? WHERE id = ? AND status != 'suspended'`
      )
      .bind(nowIso, row.user_id);

    await db.batch([updateTokenStmt, updateUserStmt]);
    await syncAchievementsForUser(db, row.user_id);

    const session = await createSession(db, req, row.user_id);
    setSessionCookie(req, res, session.rawToken);
    const userPayload = await buildUserPayload(db, row.user_id);
    res.json({ verified: true, user: userPayload, sessionToken: session.rawToken });
  });

  router.post('/resend-verification', async (req: AuthenticatedRequest, res: Response) => {
    const ip = req.ip || 'unknown';
    const rl = await checkRateLimit(db, `resend-verify:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.allowed) {
      res.status(429).json({ error: `Too many requests. Try again in ${rl.retryAfterSec}s.` });
      return;
    }

    const { email } = req.body || {};
    if (typeof email !== 'string' || !validateEmail(email)) {
      res.json({ sent: true });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await db
      .prepare('SELECT id, username, email, email_verified, interface_lang FROM users WHERE LOWER(email) = ?')
      .bind(cleanEmail)
      .first<{ id: string; username: string; email: string; email_verified: number; interface_lang: 'en' | 'fr' | 'de' }>();

    if (user && !user.email_verified) {
      const now = new Date();
      const rawToken = generateRandomToken(32);
      const expiresIso = new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString();

      await db
        .prepare(
          `INSERT INTO email_verification_tokens (id, user_id, token_hash, expires_at, created_at)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(crypto.randomUUID(), user.id, hashSecret(rawToken), expiresIso, now.toISOString())
        .run();

      const origin = `${req.protocol}://${req.get('host')}`;
      await sendVerificationEmail({
        toEmail: user.email,
        username: user.username,
        rawToken,
        lang: user.interface_lang,
        origin,
      });
    }

    res.json({ sent: true });
  });

  router.post('/login', async (req: AuthenticatedRequest, res: Response) => {
    const ip = req.ip || 'unknown';
    const { identifier, password } = req.body || {};

    if (typeof identifier !== 'string' || typeof password !== 'string' || !identifier.trim() || !password) {
      res.status(400).json({ error: 'Username or email and password are required.' });
      return;
    }

    const cleanId = identifier.trim();
    if (!cleanId.includes('@') && /\s/.test(cleanId)) {
      res.status(400).json({ error: 'Username cannot contain spaces.' });
      return;
    }

    const rl = await checkRateLimit(db, `login:${ip}:${cleanId.toLowerCase()}`, 12, 15 * 60 * 1000);
    if (!rl.allowed) {
      res.status(429).json({ error: `Too many sign-in attempts. Please wait ${rl.retryAfterSec}s.` });
      return;
    }

    const user = await db
      .prepare(
        `SELECT id, password_hash, status, email_verified FROM users
         WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)`
      )
      .bind(cleanId, cleanId)
      .first<{ id: string; password_hash: string; status: string; email_verified: number }>();

    if (!user || !verifyPassword(password, user.password_hash)) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    if (user.status === 'suspended') {
      res.status(403).json({ error: 'Account is suspended.' });
      return;
    }

    const authCfg = await getSetting<AuthConfig>(db, 'auth_config', getDefaultAuthConfig());
    if (authCfg.requireEmailVerification && (user.status === 'pending' || !user.email_verified)) {
      res.status(403).json({
        error: 'Please verify your email address before signing in.',
        code: 'EMAIL_NOT_VERIFIED',
      });
      return;
    }

    const session = await createSession(db, req, user.id);
    setSessionCookie(req, res, session.rawToken);
    const userPayload = await buildUserPayload(db, user.id);
    res.json({ user: userPayload, sessionToken: session.rawToken });
  });

  router.post('/logout', async (req: AuthenticatedRequest, res: Response) => {
    if (req.authUser) {
      await db
        .prepare('UPDATE sessions SET revoked_at = ? WHERE id = ?')
        .bind(new Date().toISOString(), req.authUser.sessionId)
        .run();
    }
    clearSessionCookie(req, res);
    res.json({ ok: true });
  });

  router.post('/forgot-password', async (req: AuthenticatedRequest, res: Response) => {
    const ip = req.ip || 'unknown';
    const rl = await checkRateLimit(db, `forgot:${ip}`, 6, 15 * 60 * 1000);
    if (!rl.allowed) {
      res.status(429).json({ error: `Too many password reset requests. Try again in ${rl.retryAfterSec}s.` });
      return;
    }

    const { email } = req.body || {};
    if (typeof email !== 'string' || !validateEmail(email)) {
      res.json({ ok: true, mailtrapConfigured: getMailtrapStatus().configured });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await db
      .prepare('SELECT id, username, email, interface_lang, status FROM users WHERE LOWER(email) = ?')
      .bind(cleanEmail)
      .first<{ id: string; username: string; email: string; interface_lang: 'en' | 'fr' | 'de'; status: string }>();

    let mailResult = null;
    if (user && user.status !== 'suspended') {
      const now = new Date();
      const rawToken = generateRandomToken(32);
      const expiresIso = new Date(now.getTime() + 1000 * 60 * 30).toISOString(); // 30 minutes

      await db
        .prepare(
          `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(crypto.randomUUID(), user.id, hashSecret(rawToken), expiresIso, now.toISOString())
        .run();

      const origin = `${req.protocol}://${req.get('host')}`;
      mailResult = await sendPasswordResetEmail({
        toEmail: user.email,
        username: user.username,
        rawToken,
        lang: user.interface_lang,
        origin,
      });
    }

    res.json({
      ok: true,
      mailtrapConfigured: getMailtrapStatus().configured,
      mailDelivered: mailResult?.delivered ?? null,
    });
  });

  router.post('/reset-password', async (req: AuthenticatedRequest, res: Response) => {
    const ip = req.ip || 'unknown';
    const rl = await checkRateLimit(db, `reset:${ip}`, 10, 15 * 60 * 1000);
    if (!rl.allowed) {
      res.status(429).json({ error: `Too many attempts. Try again in ${rl.retryAfterSec}s.` });
      return;
    }

    const { token, newPassword, confirmPassword } = req.body || {};
    if (typeof token !== 'string' || !token.trim()) {
      res.status(400).json({ error: 'Reset token is required.' });
      return;
    }
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match.' });
      return;
    }

    const tokenHash = hashSecret(token.trim());
    const nowIso = new Date().toISOString();

    const row = await db
      .prepare(
        `SELECT prt.id, prt.user_id, prt.expires_at, prt.used_at, u.email, u.username, u.interface_lang
         FROM password_reset_tokens prt
         JOIN users u ON u.id = prt.user_id
         WHERE prt.token_hash = ?`
      )
      .bind(tokenHash)
      .first<{
        id: string;
        user_id: string;
        expires_at: string;
        used_at: string | null;
        email: string;
        username: string;
        interface_lang: 'en' | 'fr' | 'de';
      }>();

    if (!row || row.used_at || row.expires_at <= nowIso) {
      res.status(400).json({ error: 'Password reset link is invalid or has expired.' });
      return;
    }

    const updateTokenStmt = db
      .prepare('UPDATE password_reset_tokens SET used_at = ? WHERE id = ?')
      .bind(nowIso, row.id);
    const updateUserStmt = db
      .prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?')
      .bind(hashPassword(newPassword), nowIso, row.user_id);
    const revokeSessionsStmt = db
      .prepare('UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL')
      .bind(nowIso, row.user_id);

    await db.batch([updateTokenStmt, updateUserStmt, revokeSessionsStmt]);

    await sendPasswordChangedEmail({
      toEmail: row.email,
      username: row.username,
      lang: row.interface_lang,
    });

    res.json({ ok: true });
  });

  router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const payload = await buildUserPayload(db, req.authUser!.id);
      res.json({ user: payload });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to fetch user profile.' });
    }
  });

  router.get('/sessions', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const nowIso = new Date().toISOString();
      const { results: rows } = await db
        .prepare(
          `SELECT id, user_agent, ip_prefix, created_at, last_seen_at, expires_at
           FROM sessions
           WHERE user_id = ? AND revoked_at IS NULL AND expires_at > ?
           ORDER BY last_seen_at DESC`
        )
        .bind(req.authUser!.id, nowIso)
        .all<Record<string, unknown>>();

      res.json({
        sessions: rows.map((r) => ({
          ...r,
          isCurrent: r.id === req.authUser!.sessionId,
        })),
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to fetch sessions.' });
    }
  });

  router.delete('/sessions/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const sessionId = req.params.id;
      const nowIso = new Date().toISOString();
      const result = await db
        .prepare('UPDATE sessions SET revoked_at = ? WHERE id = ? AND user_id = ? AND revoked_at IS NULL')
        .bind(nowIso, sessionId, req.authUser!.id)
        .run();

      if (Number(result.meta.changes || 0) === 0) {
        res.status(404).json({ error: 'Session not found.' });
        return;
      }
      if (sessionId === req.authUser!.sessionId) {
        clearSessionCookie(req, res);
      }
      res.json({ ok: true, revokedCurrent: sessionId === req.authUser!.sessionId });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to revoke session.' });
    }
  });

  router.post('/sessions/revoke-other', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const nowIso = new Date().toISOString();
      await db
        .prepare('UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND id != ? AND revoked_at IS NULL')
        .bind(nowIso, req.authUser!.id, req.authUser!.sessionId)
        .run();
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to revoke other sessions.' });
    }
  });

  return router;
}
