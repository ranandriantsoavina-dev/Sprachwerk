import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import type { DatabaseSync } from 'node:sqlite';

const SESSION_COOKIE_NAME = 'sw_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

// Process-scoped fallback secret if SESSION_SECRET env var is unset
const EPHEMERAL_SECRET = crypto.randomBytes(32).toString('hex');

export function getSessionSecret(): string {
  return process.env.SESSION_SECRET || EPHEMERAL_SECRET;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, expectedHex] = parts;
  if (!salt || !expectedHex) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

export function hashSecret(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export function generateRandomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

export function generateRegistrationCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = (len: number) => {
    const bytes = crypto.randomBytes(len);
    let out = '';
    for (let i = 0; i < len; i++) {
      out += alphabet[bytes[i] % alphabet.length];
    }
    return out;
  };
  return `SW-${segment(4)}-${segment(4)}-${segment(4)}`;
}

export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export function getCodeHint(rawCode: string): string {
  const norm = normalizeCode(rawCode);
  if (norm.length <= 6) return '••••';
  return `${norm.slice(0, 3)}••••${norm.slice(-4)}`;
}

export function validateUsername(username: string): { valid: boolean; reason?: string } {
  if (!username || typeof username !== 'string') {
    return { valid: false, reason: 'Username is required.' };
  }
  if (/\s/.test(username)) {
    return { valid: false, reason: 'Username must not contain spaces.' };
  }
  if (!/^[A-Za-z0-9_-]{3,24}$/.test(username)) {
    return {
      valid: false,
      reason: 'Username must be 3–24 characters using letters, numbers, underscores, or hyphens only.',
    };
  }
  return { valid: true };
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) {
      try {
        result[key] = decodeURIComponent(val);
      } catch {
        result[key] = val;
      }
    }
  }
  return result;
}

function isSecureContext(req: Request): boolean {
  if (req.secure) return true;
  const proto = req.headers['x-forwarded-proto'];
  if (typeof proto === 'string' && proto.split(',')[0].trim() === 'https') {
    return true;
  }
  const origin = req.headers.origin;
  if (typeof origin === 'string' && origin.startsWith('https://')) {
    return true;
  }
  const referer = req.headers.referer;
  if (typeof referer === 'string' && referer.startsWith('https://')) {
    return true;
  }
  return false;
}

export function setSessionCookie(req: Request, res: Response, rawToken: string): void {
  const maxAgeSec = Math.floor(SESSION_TTL_MS / 1000);
  const secure = isSecureContext(req);
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(rawToken)}`,
    'Path=/',
    `Max-Age=${maxAgeSec}`,
    'HttpOnly',
    secure ? 'SameSite=None' : 'SameSite=Lax',
  ];
  if (secure) {
    parts.push('Secure', 'Partitioned');
  }
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function clearSessionCookie(req: Request, res: Response): void {
  const secure = isSecureContext(req);
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'Max-Age=0',
    'HttpOnly',
    secure ? 'SameSite=None' : 'SameSite=Lax',
  ];
  if (secure) {
    parts.push('Secure', 'Partitioned');
  }
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function createSession(
  db: DatabaseSync,
  req: Request,
  userId: string
): { sessionId: string; rawToken: string; expiresAt: string } {
  const sessionId = crypto.randomUUID();
  const rawToken = generateRandomToken(32);
  const tokenHash = hashSecret(rawToken);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS).toISOString();
  const userAgent = String(req.headers['user-agent'] || '').slice(0, 200);
  const rawIp = req.ip || req.socket.remoteAddress || '';
  const ipPrefix = rawIp.split('.').slice(0, 3).join('.');

  db.prepare(
    `INSERT INTO sessions (id, user_id, token_hash, user_agent, ip_prefix, created_at, last_seen_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(sessionId, userId, tokenHash, userAgent, ipPrefix, now.toISOString(), now.toISOString(), expiresAt);

  return { sessionId, rawToken, expiresAt };
}

export interface AuthenticatedRequest extends Request {
  authUser?: {
    id: string;
    username: string;
    email: string;
    role: 'learner' | 'admin';
    status: 'pending' | 'active' | 'suspended';
    email_verified: number;
    display_name: string;
    interface_lang: 'en' | 'fr' | 'de';
    theme: 'light' | 'dark';
    timezone: string;
    leaderboard_visible: number;
    reduced_motion: number;
    xp_total: number;
    coins_balance: number;
    current_streak: number;
    best_streak: number;
    last_study_date: string | null;
    streak_freezes_available: number;
    sessionId: string;
  };
}

export function extractSessionTokens(req: Request): string[] {
  const tokens: string[] = [];
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) tokens.push(bearer);
  }
  const cookies = parseCookies(req.headers.cookie);
  if (cookies[SESSION_COOKIE_NAME] && !tokens.includes(cookies[SESSION_COOKIE_NAME])) {
    tokens.push(cookies[SESSION_COOKIE_NAME]);
  }
  return tokens;
}

export function extractSessionToken(req: Request): string | null {
  return extractSessionTokens(req)[0] ?? null;
}

export function attachAuth(db: DatabaseSync) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const candidates = extractSessionTokens(req);
    if (candidates.length === 0) return next();

    const nowIso = new Date().toISOString();
    const stmt = db.prepare(
      `SELECT s.id AS sessionId, s.expires_at, s.revoked_at,
              u.id, u.username, u.email, u.role, u.status, u.email_verified,
              u.display_name, u.interface_lang, u.theme, u.timezone,
              u.leaderboard_visible, u.reduced_motion, u.xp_total, u.coins_balance,
              u.current_streak, u.best_streak, u.last_study_date, u.streak_freezes_available
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > ?`
    );

    for (const rawToken of candidates) {
      const tokenHash = hashSecret(rawToken);
      const row = stmt.get(tokenHash, nowIso) as AuthenticatedRequest['authUser'] | undefined;
      if (row && row.status !== 'suspended') {
        req.authUser = row;
        db.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?').run(nowIso, row.sessionId);
        break;
      }
    }
    next();
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.authUser) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.authUser || req.authUser.role !== 'admin') {
    res.status(403).json({ error: 'Administrator permission required.' });
    return;
  }
  next();
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  const method = req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return next();
  }
  // Require custom AJAX header on all mutating API requests
  const xRequestedWith = req.headers['x-requested-with'];
  if (xRequestedWith !== 'XMLHttpRequest') {
    res.status(403).json({ error: 'Missing required request verification header.' });
    return;
  }
  // Validate Origin against Host / X-Forwarded-Host when Origin is present
  const origin = req.headers.origin;
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const expectedHost = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
      if (expectedHost && originHost !== expectedHost) {
        res.status(403).json({ error: 'Cross-origin request rejected.' });
        return;
      }
    } catch {
      res.status(403).json({ error: 'Invalid request origin.' });
      return;
    }
  }
  next();
}

export function checkRateLimit(
  db: DatabaseSync,
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const nowMs = Date.now();
  const row = db
    .prepare('SELECT count, window_start_ms FROM rate_limits WHERE bucket_key = ?')
    .get(key) as { count: number; window_start_ms: number } | undefined;

  if (!row || nowMs - row.window_start_ms >= windowMs) {
    db.prepare(
      `INSERT INTO rate_limits (bucket_key, count, window_start_ms) VALUES (?, 1, ?)
       ON CONFLICT(bucket_key) DO UPDATE SET count = 1, window_start_ms = excluded.window_start_ms`
    ).run(key, nowMs);
    return { allowed: true, retryAfterSec: 0 };
  }

  if (row.count >= limit) {
    const retryAfterSec = Math.ceil((row.window_start_ms + windowMs - nowMs) / 1000);
    return { allowed: false, retryAfterSec };
  }

  db.prepare('UPDATE rate_limits SET count = count + 1 WHERE bucket_key = ?').run(key);
  return { allowed: true, retryAfterSec: 0 };
}
