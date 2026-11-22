import crypto from 'node:crypto';
import { Router, type Response } from 'express';
import type { DatabaseSync } from 'node:sqlite';
import { DEFAULT_AUTH_CONFIG, getSetting, type AuthConfig } from '../db.ts';
import {
  calculateLevelFromXp,
  getGamificationConfig,
  syncAchievementsForUser,
} from '../gamification.ts';
import {
  getMailtrapStatus,
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from '../mail.ts';
import {
  checkRateLimit,
  clearSessionCookie,
  createSession,
  hashPassword,
  hashSecret,
  normalizeCode,
  requireAuth,
  setSessionCookie,
  validateEmail,
  validateUsername,
  verifyPassword,
  generateRandomToken,
  type AuthenticatedRequest,
} from '../security.ts';

function buildUserPayload(db: DatabaseSync, userId: string) {
  const user = db
    .prepare(
      `SELECT id, username, email, role, status, email_verified, display_name,
              interface_lang, theme, timezone, leaderboard_visible, reduced_motion,
              xp_total, weekly_xp, monthly_xp, coins_balance, current_streak, best_streak,
              last_study_date, streak_freezes_available, practice_prefs_json, created_at
       FROM users WHERE id = ?`
    )
    .get(userId) as Record<string, unknown> | undefined;

  if (!user) return null;

  const cfg = getGamificationConfig(db);
  const level = calculateLevelFromXp(Number(user.xp_total || 0), cfg);

  const equippedRows = db
    .prepare(
      `SELECT s.id, s.effect_type, s.effect_value, s.name_i18n, s.image_key
       FROM user_inventory ui
       JOIN shop_items s ON s.id = ui.item_id
       WHERE ui.user_id = ? AND ui.equipped = 1 AND ui.quantity > 0`
    )
    .all(userId) as Array<{
    id: string;
    effect_type: string;
    effect_value: string;
    name_i18n: string;
    image_key: string;
  }>;

  const equipped: Record<string, { itemId: string; value: string; imageKey: string }> = {};
  for (const row of equippedRows) {
    equipped[row.effect_type] = {
      itemId: row.id,
      value: row.effect_value,
      imageKey: row.image_key,
    };
  }

  const claimableCountRow = db
    .prepare(
      `SELECT COUNT(*) AS cnt FROM user_achievements WHERE user_id = ? AND claimed_at IS NULL`
    )
    .get(userId) as { cnt: number };

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
    claimableAchievements: claimableCountRow.cnt,
  };
}

export function createAuthRouter(db: DatabaseSync) {
  const router = Router();

  router.get('/bootstrap-status', (_req, res: Response) => {
    const countRow = db.prepare('SELECT COUNT(*) AS cnt FROM users').get() as { cnt: number };
    const authCfg = getSetting<AuthConfig>(db, 'auth_config', DEFAULT_AUTH_CONFIG);
    res.json({
      needsAdminBootstrap: countRow.cnt === 0,
      adminPasscodeRequired: Boolean(process.env.ADMIN_PASSCODE?.trim()),
      emailVerificationMandatory: authCfg.requireEmailVerification,
      mailtrap: getMailtrapStatus(),
    });
  });

  router.post('/bootstrap-admin', (req: AuthenticatedRequest, res: Response) => {
    const { username, email, password, confirmPassword, passcode, timezone, interfaceLang } = req.body || {};

    const expectedPasscode = process.env.ADMIN_PASSCODE?.trim();
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
      db.exec('BEGIN IMMEDIATE');
      const countRow = db.prepare('SELECT COUNT(*) AS cnt FROM users').get() as { cnt: number };
      if (countRow.cnt > 0) {
        db.exec('ROLLBACK');
        res.status(409).json({ error: 'Initial administrator account has already been claimed.' });
        return;
      }

      db.prepare(
        `INSERT INTO users
         (id, username, email, password_hash, role, status, email_verified, display_name,
          interface_lang, theme, timezone, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'admin', 'active', 1, ?, ?, 'light', ?, ?, ?)`
      ).run(userId, cleanUsername, cleanEmail, hashPassword(password), cleanUsername, lang, tz, nowIso, nowIso);

      syncAchievementsForUser(db, userId);
      db.exec('COMMIT');
    } catch (err) {
      try {
        db.exec('ROLLBACK');
      } catch {
        // ignore
      }
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to initialize admin.' });
      return;
    }

    const session = createSession(db, req, userId);
    setSessionCookie(req, res, session.rawToken);
    res.status(201).json({ user: buildUserPayload(db, userId), sessionToken: session.rawToken });
  });

  router.post('/register', async (req: AuthenticatedRequest, res: Response) => {
    const ip = req.ip || 'unknown';
    const rl = checkRateLimit(db, `register:${ip}`, 10, 15 * 60 * 1000);
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
    const authCfg = getSetting<AuthConfig>(db, 'auth_config', DEFAULT_AUTH_CONFIG);
    const lang = interfaceLang === 'fr' || interfaceLang === 'de' ? interfaceLang : 'en';
    const tz = typeof timezone === 'string' && timezone.length <= 64 ? timezone : 'UTC';
    const now = new Date();
    const nowIso = now.toISOString();
    const userId = crypto.randomUUID();
    const rawVerifyToken = generateRandomToken(32);
    const verifyExpiresIso = new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString();

    try {
      db.exec('BEGIN IMMEDIATE');

      const codeRow = db
        .prepare('SELECT id, status, expires_at FROM registration_codes WHERE code_hash = ?')
        .get(codeHash) as { id: string; status: string; expires_at: string | null } | undefined;

      if (!codeRow || codeRow.status !== 'active' || (codeRow.expires_at && codeRow.expires_at <= nowIso)) {
        if (codeRow && codeRow.status === 'active' && codeRow.expires_at && codeRow.expires_at <= nowIso) {
          db.prepare(`UPDATE registration_codes SET status = 'expired' WHERE id = ?`).run(codeRow.id);
        }
        db.exec('COMMIT');
        res.status(400).json({ error: 'Invalid, expired, or already redeemed registration code.' });
        return;
      }

      const existingUser = db
        .prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)')
        .get(cleanUsername, cleanEmail);
      if (existingUser) {
        db.exec('ROLLBACK');
        res.status(409).json({ error: 'An account with this username or email already exists.' });
        return;
      }

      const initialStatus = authCfg.requireEmailVerification ? 'pending' : 'active';
      db.prepare(
        `INSERT INTO users
         (id, username, email, password_hash, role, status, email_verified, display_name,
          interface_lang, theme, timezone, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'learner', ?, 0, ?, ?, 'light', ?, ?, ?)`
      ).run(
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

      // Atomically redeem the single-use registration code
      const redeemResult = db
        .prepare(
          `UPDATE registration_codes
           SET status = 'redeemed', redeemed_by_user_id = ?, redeemed_at = ?
           WHERE id = ? AND status = 'active'`
        )
        .run(userId, nowIso, codeRow.id);

      if (redeemResult.changes !== 1) {
        db.exec('ROLLBACK');
        res.status(409).json({ error: 'Registration code could not be redeemed.' });
        return;
      }

      db.prepare(
        `INSERT INTO email_verification_tokens (id, user_id, token_hash, expires_at, created_at)
         VALUES (?, ?, ?, ?, ?)`
      ).run(crypto.randomUUID(), userId, hashSecret(rawVerifyToken), verifyExpiresIso, nowIso);

      syncAchievementsForUser(db, userId);
      db.exec('COMMIT');
    } catch (err) {
      try {
        db.exec('ROLLBACK');
      } catch {
        // ignore
      }
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
      const session = createSession(db, req, userId);
      setSessionCookie(req, res, session.rawToken);
      res.status(201).json({
        needsVerification: false,
        mailResult,
        user: buildUserPayload(db, userId),
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

  router.post('/verify-email', (req: AuthenticatedRequest, res: Response) => {
    const ip = req.ip || 'unknown';
    const rl = checkRateLimit(db, `verify:${ip}`, 15, 15 * 60 * 1000);
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

    const row = db
      .prepare(
        `SELECT id, user_id, expires_at, used_at FROM email_verification_tokens WHERE token_hash = ?`
      )
      .get(tokenHash) as
      | { id: string; user_id: string; expires_at: string; used_at: string | null }
      | undefined;

    if (!row || row.used_at || row.expires_at <= nowIso) {
      res.status(400).json({ error: 'Verification link is invalid or has expired.' });
      return;
    }

    db.exec('BEGIN IMMEDIATE');
    db.prepare('UPDATE email_verification_tokens SET used_at = ? WHERE id = ?').run(nowIso, row.id);
    db.prepare(
      `UPDATE users SET email_verified = 1, status = 'active', updated_at = ? WHERE id = ? AND status != 'suspended'`
    ).run(nowIso, row.user_id);
    syncAchievementsForUser(db, row.user_id);
    db.exec('COMMIT');

    const session = createSession(db, req, row.user_id);
    setSessionCookie(req, res, session.rawToken);
    res.json({ verified: true, user: buildUserPayload(db, row.user_id), sessionToken: session.rawToken });
  });

  router.post('/resend-verification', async (req: AuthenticatedRequest, res: Response) => {
    const ip = req.ip || 'unknown';
    const rl = checkRateLimit(db, `resend-verify:${ip}`, 5, 15 * 60 * 1000);
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
    const user = db
      .prepare('SELECT id, username, email, email_verified, interface_lang FROM users WHERE LOWER(email) = ?')
      .get(cleanEmail) as
      | { id: string; username: string; email: string; email_verified: number; interface_lang: 'en' | 'fr' | 'de' }
      | undefined;

    if (user && !user.email_verified) {
      const now = new Date();
      const rawToken = generateRandomToken(32);
      const expiresIso = new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString();
      db.prepare(
        `INSERT INTO email_verification_tokens (id, user_id, token_hash, expires_at, created_at)
         VALUES (?, ?, ?, ?, ?)`
      ).run(crypto.randomUUID(), user.id, hashSecret(rawToken), expiresIso, now.toISOString());

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

  router.post('/login', (req: AuthenticatedRequest, res: Response) => {
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

    const rl = checkRateLimit(db, `login:${ip}:${cleanId.toLowerCase()}`, 12, 15 * 60 * 1000);
    if (!rl.allowed) {
      res.status(429).json({ error: `Too many sign-in attempts. Please wait ${rl.retryAfterSec}s.` });
      return;
    }

    const user = db
      .prepare(
        `SELECT id, password_hash, status, email_verified FROM users
         WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)`
      )
      .get(cleanId, cleanId) as
      | { id: string; password_hash: string; status: string; email_verified: number }
      | undefined;

    if (!user || !verifyPassword(password, user.password_hash)) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    if (user.status === 'suspended') {
      res.status(403).json({ error: 'Account is suspended.' });
      return;
    }

    const authCfg = getSetting<AuthConfig>(db, 'auth_config', DEFAULT_AUTH_CONFIG);
    if (authCfg.requireEmailVerification && (user.status === 'pending' || !user.email_verified)) {
      res.status(403).json({
        error: 'Please verify your email address before signing in.',
        code: 'EMAIL_NOT_VERIFIED',
      });
      return;
    }

    const session = createSession(db, req, user.id);
    setSessionCookie(req, res, session.rawToken);
    res.json({ user: buildUserPayload(db, user.id), sessionToken: session.rawToken });
  });

  router.post('/logout', (req: AuthenticatedRequest, res: Response) => {
    if (req.authUser) {
      db.prepare('UPDATE sessions SET revoked_at = ? WHERE id = ?').run(
        new Date().toISOString(),
        req.authUser.sessionId
      );
    }
    clearSessionCookie(req, res);
    res.json({ ok: true });
  });

  router.post('/forgot-password', async (req: AuthenticatedRequest, res: Response) => {
    const ip = req.ip || 'unknown';
    const rl = checkRateLimit(db, `forgot:${ip}`, 6, 15 * 60 * 1000);
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
    const user = db
      .prepare('SELECT id, username, email, interface_lang, status FROM users WHERE LOWER(email) = ?')
      .get(cleanEmail) as
      | { id: string; username: string; email: string; interface_lang: 'en' | 'fr' | 'de'; status: string }
      | undefined;

    let mailResult = null;
    if (user && user.status !== 'suspended') {
      const now = new Date();
      const rawToken = generateRandomToken(32);
      const expiresIso = new Date(now.getTime() + 1000 * 60 * 30).toISOString(); // 30 minutes
      db.prepare(
        `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at)
         VALUES (?, ?, ?, ?, ?)`
      ).run(crypto.randomUUID(), user.id, hashSecret(rawToken), expiresIso, now.toISOString());

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
    const rl = checkRateLimit(db, `reset:${ip}`, 10, 15 * 60 * 1000);
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

    const row = db
      .prepare(
        `SELECT prt.id, prt.user_id, prt.expires_at, prt.used_at, u.email, u.username, u.interface_lang
         FROM password_reset_tokens prt
         JOIN users u ON u.id = prt.user_id
         WHERE prt.token_hash = ?`
      )
      .get(tokenHash) as
      | {
          id: string;
          user_id: string;
          expires_at: string;
          used_at: string | null;
          email: string;
          username: string;
          interface_lang: 'en' | 'fr' | 'de';
        }
      | undefined;

    if (!row || row.used_at || row.expires_at <= nowIso) {
      res.status(400).json({ error: 'Password reset link is invalid or has expired.' });
      return;
    }

    db.exec('BEGIN IMMEDIATE');
    db.prepare('UPDATE password_reset_tokens SET used_at = ? WHERE id = ?').run(nowIso, row.id);
    db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(
      hashPassword(newPassword),
      nowIso,
      row.user_id
    );
    db.prepare('UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL').run(
      nowIso,
      row.user_id
    );
    db.exec('COMMIT');

    await sendPasswordChangedEmail({
      toEmail: row.email,
      username: row.username,
      lang: row.interface_lang,
    });

    res.json({ ok: true });
  });

  router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const payload = buildUserPayload(db, req.authUser!.id);
    res.json({ user: payload });
  });

  router.get('/sessions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const nowIso = new Date().toISOString();
    const rows = db
      .prepare(
        `SELECT id, user_agent, ip_prefix, created_at, last_seen_at, expires_at
         FROM sessions
         WHERE user_id = ? AND revoked_at IS NULL AND expires_at > ?
         ORDER BY last_seen_at DESC`
      )
      .all(req.authUser!.id, nowIso) as Array<Record<string, unknown>>;

    res.json({
      sessions: rows.map((r) => ({
        ...r,
        isCurrent: r.id === req.authUser!.sessionId,
      })),
    });
  });

  router.delete('/sessions/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const sessionId = req.params.id;
    const nowIso = new Date().toISOString();
    const result = db
      .prepare('UPDATE sessions SET revoked_at = ? WHERE id = ? AND user_id = ? AND revoked_at IS NULL')
      .run(nowIso, sessionId, req.authUser!.id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Session not found.' });
      return;
    }
    if (sessionId === req.authUser!.sessionId) {
      clearSessionCookie(req, res);
    }
    res.json({ ok: true, revokedCurrent: sessionId === req.authUser!.sessionId });
  });

  router.post('/sessions/revoke-other', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const nowIso = new Date().toISOString();
    db.prepare(
      'UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND id != ? AND revoked_at IS NULL'
    ).run(nowIso, req.authUser!.id, req.authUser!.sessionId);
    res.json({ ok: true });
  });

  return router;
}

export { buildUserPayload };
