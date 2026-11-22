import crypto from 'node:crypto';
import type { DatabaseSync } from 'node:sqlite';
import { DEFAULT_GAMIFICATION_CONFIG, getSetting, type GamificationConfig } from './db.ts';

export interface LevelProgress {
  level: number;
  xpTotal: number;
  currentLevelFloorXp: number;
  nextLevelXp: number;
  xpIntoLevel: number;
  xpNeededForLevel: number;
  progressPct: number;
}

export function getGamificationConfig(db: DatabaseSync): GamificationConfig {
  return getSetting<GamificationConfig>(db, 'gamification_config', DEFAULT_GAMIFICATION_CONFIG);
}

export function calculateLevelFromXp(xpTotal: number, cfg: GamificationConfig): LevelProgress {
  const base = Math.max(20, cfg.levelBaseXp);
  const step = Math.max(10, cfg.levelStepXp);

  let level = 1;
  let floorXp = 0;
  let neededForCurrent = base;

  while (xpTotal >= floorXp + neededForCurrent) {
    floorXp += neededForCurrent;
    level += 1;
    neededForCurrent = base + (level - 1) * step;
  }

  const xpIntoLevel = Math.max(0, xpTotal - floorXp);
  const progressPct = Math.min(100, Math.round((xpIntoLevel / neededForCurrent) * 100));

  return {
    level,
    xpTotal,
    currentLevelFloorXp: floorXp,
    nextLevelXp: floorXp + neededForCurrent,
    xpIntoLevel,
    xpNeededForLevel: neededForCurrent,
    progressPct,
  };
}

export function getCurrentPeriodKeys(now = new Date()): { weekKey: string; monthKey: string } {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const monthKey = `${year}-${month}`;

  // ISO week calculation in UTC
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const weekKey = `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;

  return { weekKey, monthKey };
}

export function getLocalDateString(timezone: string, now = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone || 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

function addDaysToDateStr(dateStr: string, deltaDays: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + deltaDays));
  return dt.toISOString().slice(0, 10);
}

function diffDays(earlier: string, later: string): number {
  const [y1, m1, d1] = earlier.split('-').map(Number);
  const [y2, m2, d2] = later.split('-').map(Number);
  const t1 = Date.UTC(y1, m1 - 1, d1);
  const t2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((t2 - t1) / 86400000);
}

export function awardRewardEvent(
  db: DatabaseSync,
  params: {
    userId: string;
    actionType: string;
    xpDelta: number;
    coinDelta: number;
    referenceId?: string;
    idempotencyKey: string;
    localDate?: string;
  }
): { credited: boolean; xpDelta: number; coinDelta: number; levelUpBonusCoins: number; newLevel: number } {
  const existing = db
    .prepare('SELECT id FROM reward_events WHERE idempotency_key = ?')
    .get(params.idempotencyKey);
  if (existing) {
    const userRow = db.prepare('SELECT xp_total FROM users WHERE id = ?').get(params.userId) as {
      xp_total: number;
    };
    const cfg = getGamificationConfig(db);
    return {
      credited: false,
      xpDelta: 0,
      coinDelta: 0,
      levelUpBonusCoins: 0,
      newLevel: calculateLevelFromXp(userRow?.xp_total || 0, cfg).level,
    };
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const cfg = getGamificationConfig(db);

  const userBefore = db
    .prepare(
      'SELECT xp_total, weekly_xp, weekly_period_key, monthly_xp, monthly_period_key, coins_balance FROM users WHERE id = ?'
    )
    .get(params.userId) as {
    xp_total: number;
    weekly_xp: number;
    weekly_period_key: string;
    monthly_xp: number;
    monthly_period_key: string;
    coins_balance: number;
  };

  if (!userBefore) {
    throw new Error('User not found for reward event.');
  }

  const levelBefore = calculateLevelFromXp(userBefore.xp_total, cfg).level;
  const newXpTotal = Math.max(0, userBefore.xp_total + Math.max(0, params.xpDelta));
  const levelAfter = calculateLevelFromXp(newXpTotal, cfg).level;

  let levelUpBonusCoins = 0;
  if (levelAfter > levelBefore && cfg.levelCoinBonus > 0) {
    levelUpBonusCoins = (levelAfter - levelBefore) * cfg.levelCoinBonus;
  }

  const totalCoinsToAdd = Math.max(0, params.coinDelta) + levelUpBonusCoins;
  const { weekKey, monthKey } = getCurrentPeriodKeys(now);
  const nextWeeklyXp =
    (userBefore.weekly_period_key === weekKey ? userBefore.weekly_xp : 0) + Math.max(0, params.xpDelta);
  const nextMonthlyXp =
    (userBefore.monthly_period_key === monthKey ? userBefore.monthly_xp : 0) + Math.max(0, params.xpDelta);

  const rewardId = crypto.randomUUID();
  db.prepare(
    `INSERT INTO reward_events (id, user_id, action_type, xp_delta, coin_delta, reference_id, idempotency_key, local_date, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    rewardId,
    params.userId,
    params.actionType,
    Math.max(0, params.xpDelta),
    totalCoinsToAdd,
    params.referenceId || null,
    params.idempotencyKey,
    params.localDate || null,
    nowIso
  );

  db.prepare(
    `UPDATE users
     SET xp_total = ?,
         weekly_xp = ?,
         weekly_period_key = ?,
         monthly_xp = ?,
         monthly_period_key = ?,
         coins_balance = coins_balance + ?,
         last_xp_reached_at = CASE WHEN ? > 0 THEN ? ELSE last_xp_reached_at END,
         updated_at = ?
     WHERE id = ?`
  ).run(
    newXpTotal,
    nextWeeklyXp,
    weekKey,
    nextMonthlyXp,
    monthKey,
    totalCoinsToAdd,
    params.xpDelta,
    nowIso,
    nowIso,
    params.userId
  );

  if (params.coinDelta > 0) {
    db.prepare(
      `INSERT INTO wallet_transactions (id, user_id, amount, reason, reference_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(crypto.randomUUID(), params.userId, params.coinDelta, params.actionType, params.referenceId || rewardId, nowIso);
  }

  if (levelUpBonusCoins > 0) {
    db.prepare(
      `INSERT INTO wallet_transactions (id, user_id, amount, reason, reference_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(crypto.randomUUID(), params.userId, levelUpBonusCoins, `level_up_${levelAfter}`, rewardId, nowIso);
  }

  if (params.localDate && params.xpDelta > 0) {
    db.prepare(
      `UPDATE study_activity_days SET xp_earned = xp_earned + ? WHERE user_id = ? AND local_date = ?`
    ).run(params.xpDelta, params.userId, params.localDate);
  }

  syncAchievementsForUser(db, params.userId);

  return {
    credited: true,
    xpDelta: Math.max(0, params.xpDelta),
    coinDelta: totalCoinsToAdd,
    levelUpBonusCoins,
    newLevel: levelAfter,
  };
}

export function recordQualifyingStudyActivity(
  db: DatabaseSync,
  userId: string,
  timezone: string,
  now = new Date()
): { localDate: string; isFirstStudyOfDay: boolean; currentStreak: number; bestStreak: number; freezeUsed: boolean } {
  const localDate = getLocalDateString(timezone, now);
  const cfg = getGamificationConfig(db);

  const existingDay = db
    .prepare('SELECT qualifying_actions FROM study_activity_days WHERE user_id = ? AND local_date = ?')
    .get(userId, localDate) as { qualifying_actions: number } | undefined;

  if (existingDay) {
    db.prepare(
      'UPDATE study_activity_days SET qualifying_actions = qualifying_actions + 1 WHERE user_id = ? AND local_date = ?'
    ).run(userId, localDate);

    const u = db.prepare('SELECT current_streak, best_streak FROM users WHERE id = ?').get(userId) as {
      current_streak: number;
      best_streak: number;
    };
    return {
      localDate,
      isFirstStudyOfDay: false,
      currentStreak: u.current_streak,
      bestStreak: u.best_streak,
      freezeUsed: false,
    };
  }

  db.prepare(
    `INSERT INTO study_activity_days (user_id, local_date, qualifying_actions, xp_earned, is_frozen)
     VALUES (?, ?, 1, 0, 0)`
  ).run(userId, localDate);

  const user = db
    .prepare(
      'SELECT current_streak, best_streak, last_study_date, streak_freezes_available FROM users WHERE id = ?'
    )
    .get(userId) as {
    current_streak: number;
    best_streak: number;
    last_study_date: string | null;
    streak_freezes_available: number;
  };

  let nextStreak = 1;
  let freezeUsed = false;
  let nextFreezes = user.streak_freezes_available;

  if (user.last_study_date) {
    const gap = diffDays(user.last_study_date, localDate);
    if (gap === 1) {
      nextStreak = user.current_streak + 1;
    } else if (gap === 2 && cfg.streakProtectionEnabled && user.streak_freezes_available > 0) {
      // Preserve streak for 1 missed day using an owned streak freeze token (never falsifies study activity)
      const missedDate = addDaysToDateStr(localDate, -1);
      db.prepare(
        `INSERT OR IGNORE INTO study_activity_days (user_id, local_date, qualifying_actions, xp_earned, is_frozen)
         VALUES (?, ?, 0, 0, 1)`
      ).run(userId, missedDate);
      db.prepare(
        `UPDATE user_inventory SET quantity = MAX(0, quantity - 1)
         WHERE user_id = ? AND item_id = 'utility_streak_freeze'`
      ).run(userId);
      nextFreezes -= 1;
      nextStreak = user.current_streak + 1;
      freezeUsed = true;
    } else if (gap <= 0) {
      nextStreak = Math.max(1, user.current_streak);
    } else {
      nextStreak = 1;
    }
  }

  const nextBest = Math.max(user.best_streak, nextStreak);
  const nowIso = now.toISOString();

  db.prepare(
    `UPDATE users
     SET current_streak = ?,
         best_streak = ?,
         last_study_date = ?,
         streak_freezes_available = ?,
         updated_at = ?
     WHERE id = ?`
  ).run(nextStreak, nextBest, localDate, nextFreezes, nowIso, userId);

  syncAchievementsForUser(db, userId);

  return {
    localDate,
    isFirstStudyOfDay: true,
    currentStreak: nextStreak,
    bestStreak: nextBest,
    freezeUsed,
  };
}

export function syncAchievementsForUser(db: DatabaseSync, userId: string): void {
  const user = db
    .prepare('SELECT status, email_verified, xp_total, best_streak FROM users WHERE id = ?')
    .get(userId) as
    | { status: string; email_verified: number; xp_total: number; best_streak: number }
    | undefined;
  if (!user) return;

  const studyDaysRow = db
    .prepare('SELECT COUNT(*) AS cnt FROM study_activity_days WHERE user_id = ? AND qualifying_actions > 0')
    .get(userId) as { cnt: number };
  const sessionsRow = db
    .prepare('SELECT COUNT(*) AS cnt FROM practice_sessions WHERE user_id = ?')
    .get(userId) as { cnt: number };
  const itemsRow = db
    .prepare('SELECT COUNT(*) AS cnt FROM user_inventory WHERE user_id = ? AND quantity > 0')
    .get(userId) as { cnt: number };

  const metrics: Record<string, number> = {
    account_active: user.status === 'active' ? 1 : 0,
    xp_total: user.xp_total,
    best_streak: user.best_streak,
    study_days: studyDaysRow.cnt,
    sessions_completed: sessionsRow.cnt,
    items_owned: itemsRow.cnt,
  };

  const allAch = db.prepare('SELECT id, metric_key, threshold FROM achievements').all() as Array<{
    id: string;
    metric_key: string;
    threshold: number;
  }>;

  const nowIso = new Date().toISOString();
  const insertUnlock = db.prepare(
    'INSERT OR IGNORE INTO user_achievements (id, user_id, achievement_id, unlocked_at) VALUES (?, ?, ?, ?)'
  );

  for (const ach of allAch) {
    const val = metrics[ach.metric_key] ?? 0;
    if (val >= ach.threshold) {
      insertUnlock.run(crypto.randomUUID(), userId, ach.id, nowIso);
    }
  }
}
