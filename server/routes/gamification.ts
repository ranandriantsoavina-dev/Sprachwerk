import crypto from 'node:crypto';
import { Router, type Response } from 'express';
import type { D1Database } from '../db.ts';
import {
  awardRewardEvent,
  calculateLevelFromXp,
  getCurrentPeriodKeys,
  getGamificationConfig,
  recordQualifyingStudyActivity,
  syncAchievementsForUser,
} from '../gamification.ts';
import { requireAuth, type AuthenticatedRequest } from '../security.ts';

export function createGamificationRouter(db: D1Database) {
  const router = Router();

  router.get('/config/gamification', async (_req, res: Response) => {
    try {
      const cfg = await getGamificationConfig(db);
      res.json({ config: cfg });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
    }
  });

  router.get('/shop', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.authUser!.id;
      const cfg = await getGamificationConfig(db);

      const [itemsRes, invRes, transRes] = await Promise.all([
        db
          .prepare('SELECT * FROM shop_items WHERE availability != ? ORDER BY sort_order ASC')
          .bind('disabled')
          .all<{
            id: string;
            category: string;
            name_i18n: string;
            description_i18n: string;
            price_coins: number;
            image_key: string;
            availability: string;
            effect_type: string;
            effect_value: string;
            is_consumable: number;
          }>(),
        db
          .prepare('SELECT item_id, quantity, equipped, purchased_at FROM user_inventory WHERE user_id = ?')
          .bind(userId)
          .all<{
            item_id: string;
            quantity: number;
            equipped: number;
            purchased_at: string;
          }>(),
        db
          .prepare(
            'SELECT id, amount, reason, reference_id, created_at FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
          )
          .bind(userId)
          .all(),
      ]);

      const items = itemsRes.results;
      const invRows = invRes.results;
      const transactions = transRes.results;

      const invMap = new Map(invRows.map((r) => [r.item_id, r]));

      res.json({
        coinsBalance: req.authUser!.coins_balance,
        unlimitedCoins: req.authUser!.role === 'admin',
        streakProtectionEnabled: cfg.streakProtectionEnabled,
        maxStreakFreezesHeld: cfg.maxStreakFreezesHeld,
        streakFreezesAvailable: req.authUser!.streak_freezes_available,
        items: items
          .filter((it) => cfg.streakProtectionEnabled || it.effect_type !== 'streak_freeze')
          .map((it) => {
            const inv = invMap.get(it.id);
            return {
              id: it.id,
              category: it.category,
              name_i18n: JSON.parse(it.name_i18n),
              description_i18n: JSON.parse(it.description_i18n),
              priceCoins: it.price_coins,
              imageKey: it.image_key,
              availability: it.availability,
              effectType: it.effect_type,
              effectValue: it.effect_value,
              isConsumable: Boolean(it.is_consumable),
              ownedQuantity: inv?.quantity ?? 0,
              equipped: Boolean(inv?.equipped),
              purchasedAt: inv?.purchased_at ?? null,
            };
          }),
        transactions,
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to fetch shop inventory.' });
    }
  });

  router.post('/shop/purchase', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const { itemId } = req.body || {};
    if (typeof itemId !== 'string' || !itemId) {
      res.status(400).json({ error: 'Item ID is required.' });
      return;
    }

    try {
      const cfg = await getGamificationConfig(db);
      const nowIso = new Date().toISOString();

      const item = await db
        .prepare('SELECT * FROM shop_items WHERE id = ? AND availability != ?')
        .bind(itemId, 'disabled')
        .first<{
          id: string;
          price_coins: number;
          effect_type: string;
          is_consumable: number;
        }>();

      if (!item) {
        res.status(404).json({ error: 'Shop item is unavailable.' });
        return;
      }

      if (item.effect_type === 'streak_freeze' && !cfg.streakProtectionEnabled) {
        res.status(400).json({ error: 'Streak protection is currently disabled.' });
        return;
      }

      const userRow = await db
        .prepare('SELECT role, coins_balance, streak_freezes_available FROM users WHERE id = ?')
        .bind(userId)
        .first<{ role: 'learner' | 'admin'; coins_balance: number; streak_freezes_available: number }>();

      if (!userRow) {
        res.status(404).json({ error: 'User account not found.' });
        return;
      }

      const isAdmin = userRow.role === 'admin';

      if (!isAdmin && userRow.coins_balance < item.price_coins) {
        res.status(400).json({ error: 'Insufficient coins balance.' });
        return;
      }

      const existingInv = await db
        .prepare('SELECT id, quantity FROM user_inventory WHERE user_id = ? AND item_id = ?')
        .bind(userId, item.id)
        .first<{ id: string; quantity: number }>();

      if (!item.is_consumable && existingInv && existingInv.quantity > 0) {
        res.status(409).json({ error: 'You already own this permanent item.' });
        return;
      }

      if (item.effect_type === 'streak_freeze' && userRow.streak_freezes_available >= cfg.maxStreakFreezesHeld) {
        res.status(400).json({
          error: `Maximum of ${cfg.maxStreakFreezesHeld} streak freeze tokens can be held at once.`,
        });
        return;
      }

      const statements = [];

      // Atomic coin deduction for learners; admins bypass deduction with unlimited balance
      if (!isAdmin) {
        statements.push(
          db
            .prepare(
              'UPDATE users SET coins_balance = coins_balance - ?, updated_at = ? WHERE id = ? AND coins_balance >= ?'
            )
            .bind(item.price_coins, nowIso, userId, item.price_coins)
        );
      } else {
        statements.push(
          db.prepare('UPDATE users SET updated_at = ? WHERE id = ?').bind(nowIso, userId)
        );
      }

      if (item.effect_type === 'streak_freeze') {
        statements.push(
          db
            .prepare('UPDATE users SET streak_freezes_available = streak_freezes_available + 1 WHERE id = ?')
            .bind(userId)
        );
      }

      if (existingInv) {
        statements.push(
          db
            .prepare('UPDATE user_inventory SET quantity = quantity + 1, purchased_at = ? WHERE id = ?')
            .bind(nowIso, existingInv.id)
        );
      } else {
        statements.push(
          db
            .prepare(
              'INSERT INTO user_inventory (id, user_id, item_id, quantity, equipped, purchased_at) VALUES (?, ?, ?, 1, 0, ?)'
            )
            .bind(crypto.randomUUID(), userId, item.id, nowIso)
        );
      }

      statements.push(
        db
          .prepare(
            'INSERT INTO wallet_transactions (id, user_id, amount, reason, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?)'
          )
          .bind(
            crypto.randomUUID(),
            userId,
            isAdmin ? 0 : -item.price_coins,
            isAdmin ? 'admin_unlimited_unlock' : 'shop_purchase',
            item.id,
            nowIso
          )
      );

      await db.batch(statements);
      await syncAchievementsForUser(db, userId);

      const updatedUser = await db
        .prepare('SELECT coins_balance, streak_freezes_available FROM users WHERE id = ?')
        .bind(userId)
        .first<{ coins_balance: number; streak_freezes_available: number }>();

      res.json({
        purchased: true,
        coinsBalance: updatedUser?.coins_balance ?? 0,
        unlimitedCoins: isAdmin,
        streakFreezesAvailable: updatedUser?.streak_freezes_available ?? 0,
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Purchase failed.' });
    }
  });

  router.post('/inventory/equip', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const { itemId, equip } = req.body || {};
    if (typeof itemId !== 'string' || !itemId) {
      res.status(400).json({ error: 'Item ID is required.' });
      return;
    }

    try {
      const row = await db
        .prepare(
          `SELECT ui.id, s.effect_type, s.is_consumable
           FROM user_inventory ui
           JOIN shop_items s ON s.id = ui.item_id
           WHERE ui.user_id = ? AND ui.item_id = ? AND ui.quantity > 0`
        )
        .bind(userId, itemId)
        .first<{ id: string; effect_type: string; is_consumable: number }>();

      if (!row) {
        res.status(404).json({ error: 'Item is not in your inventory.' });
        return;
      }
      if (row.is_consumable) {
        res.status(400).json({ error: 'Consumable utility items cannot be equipped.' });
        return;
      }

      const statements = [];
      if (Boolean(equip)) {
        // Unequip other items of the same effect_type slot
        statements.push(
          db
            .prepare(
              `UPDATE user_inventory SET equipped = 0
               WHERE user_id = ? AND item_id IN (SELECT id FROM shop_items WHERE effect_type = ?)`
            )
            .bind(userId, row.effect_type),
          db.prepare('UPDATE user_inventory SET equipped = 1 WHERE id = ?').bind(row.id)
        );
      } else {
        statements.push(
          db.prepare('UPDATE user_inventory SET equipped = 0 WHERE id = ?').bind(row.id)
        );
      }

      await db.batch(statements);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to update equipment.' });
    }
  });

  router.get('/achievements', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.authUser!.id;
      await syncAchievementsForUser(db, userId);

      const { results: rows } = await db
        .prepare(
          `SELECT a.id, a.code, a.category, a.name_i18n, a.description_i18n, a.coin_reward,
                  a.metric_key, a.threshold, a.icon_key,
                  ua.unlocked_at, ua.claimed_at
           FROM achievements a
           LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ?
           ORDER BY a.sort_order ASC`
        )
        .bind(userId)
        .all<Record<string, unknown>>();

      res.json({
        achievements: rows.map((r) => ({
          id: r.id,
          code: r.code,
          category: r.category,
          name_i18n: JSON.parse(String(r.name_i18n)),
          description_i18n: JSON.parse(String(r.description_i18n)),
          coinReward: r.coin_reward,
          metricKey: r.metric_key,
          threshold: r.threshold,
          iconKey: r.icon_key,
          unlocked: Boolean(r.unlocked_at),
          unlockedAt: r.unlocked_at || null,
          claimed: Boolean(r.claimed_at),
          claimedAt: r.claimed_at || null,
        })),
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to load achievements.' });
    }
  });

  router.post('/achievements/:id/claim', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const achievementId = req.params.id;
    const nowIso = new Date().toISOString();

    try {
      const unlock = await db
        .prepare(
          `SELECT ua.id, ua.claimed_at, a.coin_reward, a.code
           FROM user_achievements ua
           JOIN achievements a ON a.id = ua.achievement_id
           WHERE ua.user_id = ? AND ua.achievement_id = ?`
        )
        .bind(userId, achievementId)
        .first<{ id: string; claimed_at: string | null; coin_reward: number; code: string }>();

      if (!unlock) {
        res.status(400).json({ error: 'Achievement is not unlocked yet.' });
        return;
      }
      if (unlock.claimed_at) {
        res.status(409).json({ error: 'Achievement reward already claimed.' });
        return;
      }

      await db.prepare('UPDATE user_achievements SET claimed_at = ? WHERE id = ?').bind(nowIso, unlock.id).run();

      const reward = await awardRewardEvent(db, {
        userId,
        actionType: 'achievement_claim',
        xpDelta: 0,
        coinDelta: unlock.coin_reward,
        referenceId: achievementId,
        idempotencyKey: `ach_claim:${userId}:${achievementId}`,
      });

      res.json({ claimed: true, coinDelta: reward.coinDelta });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Claim failed.' });
    }
  });

  router.get('/leaderboard', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const view = String(req.query.view || 'xp');
      const userId = req.authUser!.id;
      const cfg = await getGamificationConfig(db);
      const { weekKey, monthKey } = getCurrentPeriodKeys();

      const [cosmeticsRes, usersRes] = await Promise.all([
        db
          .prepare(
            `SELECT ui.user_id, s.effect_type, s.effect_value, s.image_key
             FROM user_inventory ui
             JOIN shop_items s ON s.id = ui.item_id
             WHERE ui.equipped = 1 AND ui.quantity > 0`
          )
          .all<{ user_id: string; effect_type: string; effect_value: string; image_key: string }>(),
        db
          .prepare(
            `SELECT id, display_name, leaderboard_visible, xp_total, weekly_xp, weekly_period_key,
                    monthly_xp, monthly_period_key, current_streak, best_streak, last_xp_reached_at, created_at
             FROM users WHERE status = 'active'`
          )
          .all<{
            id: string;
            display_name: string;
            leaderboard_visible: number;
            xp_total: number;
            weekly_xp: number;
            weekly_period_key: string;
            monthly_xp: number;
            monthly_period_key: string;
            current_streak: number;
            best_streak: number;
            last_xp_reached_at: string | null;
            created_at: string;
          }>(),
      ]);

      const cosmeticRows = cosmeticsRes.results;
      const cosMap = new Map<string, Record<string, string>>();
      for (const c of cosmeticRows) {
        if (!cosMap.has(c.user_id)) cosMap.set(c.user_id, {});
        cosMap.get(c.user_id)![c.effect_type] = c.effect_value;
      }

      const users = usersRes.results;

      const metricFor = (u: (typeof users)[number]) => {
        if (view === 'weekly') return u.weekly_period_key === weekKey ? u.weekly_xp : 0;
        if (view === 'monthly') return u.monthly_period_key === monthKey ? u.monthly_xp : 0;
        if (view === 'streak') return u.current_streak;
        return u.xp_total;
      };

      const visibleUsers = users
        .filter((u) => u.leaderboard_visible === 1)
        .sort((a, b) => {
          const diff = metricFor(b) - metricFor(a);
          if (diff !== 0) return diff;
          if (view === 'streak') {
            const bestDiff = b.best_streak - a.best_streak;
            if (bestDiff !== 0) return bestDiff;
          }
          // Stable tie-breaker: earlier time reaching the total
          const ta = a.last_xp_reached_at || a.created_at;
          const tb = b.last_xp_reached_at || b.created_at;
          return ta.localeCompare(tb);
        });

      const toPublicEntry = (u: (typeof users)[number], rank: number | null) => ({
        rank,
        userId: u.id,
        displayName: u.display_name,
        isSelf: u.id === userId,
        level: calculateLevelFromXp(u.xp_total, cfg).level,
        xpTotal: u.xp_total,
        periodXp: metricFor(u),
        currentStreak: u.current_streak,
        bestStreak: u.best_streak,
        cosmetics: cosMap.get(u.id) || {},
      });

      const entries = visibleUsers.slice(0, 50).map((u, idx) => toPublicEntry(u, idx + 1));

      const selfIndex = visibleUsers.findIndex((u) => u.id === userId);
      const selfRow = users.find((u) => u.id === userId);
      let myPosition = null;
      let nearby: ReturnType<typeof toPublicEntry>[] = [];

      if (selfIndex !== -1) {
        myPosition = toPublicEntry(visibleUsers[selfIndex], selfIndex + 1);
        const start = Math.max(0, selfIndex - 2);
        const end = Math.min(visibleUsers.length, selfIndex + 3);
        nearby = visibleUsers.slice(start, end).map((u, idx) => toPublicEntry(u, start + idx + 1));
      } else if (selfRow) {
        myPosition = {
          ...toPublicEntry(selfRow, null),
          optedOut: true,
        };
      }

      res.json({
        view,
        periodLabel: view === 'weekly' ? weekKey : view === 'monthly' ? monthKey : null,
        lastUpdated: new Date().toISOString(),
        entries,
        myPosition,
        nearby,
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to generate leaderboard.' });
    }
  });

  router.get('/stats', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.authUser!.id;
      const cfg = await getGamificationConfig(db);

      const [sessionsRes, studyDaysRes, rewardHistRes, progressRes, flashcardsRes] = await Promise.all([
        db
          .prepare(
            `SELECT id, mode, selected_topics_json, selected_lessons_json, parameters_json,
                    total_questions, correct_count, incorrect_count, skipped_count, timed_out_count,
                    elapsed_seconds, results_json, xp_awarded, coins_awarded, created_at
             FROM practice_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 100`
          )
          .bind(userId)
          .all<Record<string, unknown>>(),
        db
          .prepare(
            `SELECT local_date, qualifying_actions, xp_earned, is_frozen
             FROM study_activity_days WHERE user_id = ? ORDER BY local_date DESC LIMIT 120`
          )
          .bind(userId)
          .all(),
        db
          .prepare(
            `SELECT id, action_type, xp_delta, coin_delta, reference_id, local_date, created_at
             FROM reward_events WHERE user_id = ? ORDER BY created_at DESC LIMIT 40`
          )
          .bind(userId)
          .all(),
        db
          .prepare(
            'SELECT lesson_id, bookmarked, first_completed_at, last_reviewed_at, review_count FROM lesson_progress WHERE user_id = ?'
          )
          .bind(userId)
          .all(),
        db
          .prepare('SELECT rating, COUNT(*) AS cnt FROM flashcard_reviews WHERE user_id = ? GROUP BY rating')
          .bind(userId)
          .all<{ rating: string; cnt: number }>(),
      ]);

      const sessions = sessionsRes.results;
      const studyDays = studyDaysRes.results;
      const rewardHistory = rewardHistRes.results;
      const lessonProgress = progressRes.results;
      const flashcardStats = flashcardsRes.results;

      let totalQuestions = 0;
      let totalCorrect = 0;
      let totalTimeSec = 0;
      const topicAccuracy: Record<string, { attempts: number; correct: number }> = {};
      const recentMistakes: Array<Record<string, unknown>> = [];

      for (const s of sessions) {
        totalQuestions += Number(s.total_questions || 0);
        totalCorrect += Number(s.correct_count || 0);
        totalTimeSec += Number(s.elapsed_seconds || 0);
        try {
          const results = JSON.parse(String(s.results_json || '[]')) as Array<{
            topic?: string;
            isCorrect?: boolean;
            questionId?: string;
            prompt?: string;
            userAnswer?: string;
            correctAnswer?: string;
          }>;
          for (const r of results) {
            const t = r.topic || 'General';
            if (!topicAccuracy[t]) topicAccuracy[t] = { attempts: 0, correct: 0 };
            topicAccuracy[t].attempts += 1;
            if (r.isCorrect) topicAccuracy[t].correct += 1;
            else if (recentMistakes.length < 25) {
              recentMistakes.push({
                sessionId: s.id,
                createdAt: s.created_at,
                topic: t,
                questionId: r.questionId,
                prompt: r.prompt,
                userAnswer: r.userAnswer,
                correctAnswer: r.correctAnswer,
              });
            }
          }
        } catch {
          // ignore malformed json
        }
      }

      const topicsBreakdown = Object.entries(topicAccuracy).map(([topic, stat]) => ({
        topic,
        attempts: stat.attempts,
        correct: stat.correct,
        accuracyPct: stat.attempts > 0 ? Math.round((stat.correct / stat.attempts) * 100) : 0,
      }));

      const weakTopics = topicsBreakdown
        .filter((t) => t.attempts >= 1 && t.accuracyPct < 75)
        .sort((a, b) => a.accuracyPct - b.accuracyPct);

      res.json({
        summary: {
          sessionsCount: sessions.length,
          totalQuestions,
          totalCorrect,
          overallAccuracyPct: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
          totalTimeSeconds: totalTimeSec,
          currentStreak: req.authUser!.current_streak,
          bestStreak: req.authUser!.best_streak,
          xpTotal: req.authUser!.xp_total,
          level: calculateLevelFromXp(req.authUser!.xp_total, cfg),
          lessonsCompleted: lessonProgress.filter((l) => Boolean((l as { first_completed_at: unknown }).first_completed_at)).length,
          lessonsBookmarked: lessonProgress.filter((l) => Boolean((l as { bookmarked: unknown }).bookmarked)).length,
          flashcardsKnown: flashcardStats.find((f) => f.rating === 'known')?.cnt || 0,
          flashcardsUnknown: flashcardStats.find((f) => f.rating === 'unknown')?.cnt || 0,
        },
        studyDays,
        topicsBreakdown,
        weakTopics,
        recentMistakes,
        sessions: sessions.slice(0, 20).map((s) => ({
          id: s.id,
          mode: s.mode,
          totalQuestions: s.total_questions,
          correctCount: s.correct_count,
          elapsedSeconds: s.elapsed_seconds,
          xpAwarded: s.xp_awarded,
          coinsAwarded: s.coins_awarded,
          createdAt: s.created_at,
        })),
        rewardHistory,
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to retrieve stats.' });
    }
  });

  // Safe, idempotent offline queue synchronization endpoint
  router.post('/sync/events', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const { events } = req.body || {};
    if (!Array.isArray(events)) {
      res.status(400).json({ error: 'Events array is required.' });
      return;
    }

    try {
      const cfg = await getGamificationConfig(db);
      const syncedIds: string[] = [];
      let totalXpCredited = 0;
      let totalCoinsCredited = 0;

      for (const ev of events.slice(0, 50)) {
        if (!ev || typeof ev.idempotencyKey !== 'string') continue;
        const key = ev.idempotencyKey;

        if (ev.type === 'practice_session' && ev.payload) {
          const existingSession = await db
            .prepare('SELECT id FROM practice_sessions WHERE idempotency_key = ?')
            .bind(key)
            .first<{ id: string }>();

          if (existingSession) {
            syncedIds.push(key);
            continue;
          }

          const p = ev.payload;
          const totalQ = Math.max(0, Number(p.totalQuestions) || 0);
          const correctQ = Math.min(totalQ, Math.max(0, Number(p.correctCount) || 0));
          const answeredQ = Math.max(0, totalQ - Number(p.skippedCount || 0) - Number(p.timedOutCount || 0));

          let xp = correctQ * cfg.xpPerQuestionCorrect;
          let coins = 0;

          if (answeredQ >= cfg.minQuestionsForSessionReward) {
            xp += cfg.xpPerSessionComplete;
            coins += cfg.coinsPerSessionComplete;
            if (correctQ === answeredQ) {
              xp += cfg.xpPerPerfectSession;
            }
          }

          let localDate = undefined;
          if (answeredQ > 0) {
            const streak = await recordQualifyingStudyActivity(db, userId, req.authUser!.timezone);
            localDate = streak.localDate;
            if (streak.isFirstStudyOfDay) {
              const daily = await awardRewardEvent(db, {
                userId,
                actionType: 'daily_first_study',
                xpDelta: cfg.xpPerDailyFirstStudy,
                coinDelta: cfg.coinsPerDailyFirstStudy,
                idempotencyKey: `daily:${userId}:${localDate}`,
                localDate,
              });
              totalXpCredited += daily.xpDelta;
              totalCoinsCredited += daily.coinDelta;
            }
          }

          const sessionId = crypto.randomUUID();
          await db
            .prepare(
              `INSERT INTO practice_sessions
               (id, user_id, mode, selected_topics_json, selected_lessons_json, parameters_json,
                total_questions, correct_count, incorrect_count, skipped_count, timed_out_count,
                elapsed_seconds, results_json, xp_awarded, coins_awarded, idempotency_key, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
            .bind(
              sessionId,
              userId,
              p.mode === 'lesson' ? 'lesson' : 'general',
              JSON.stringify(p.selectedTopics || []),
              JSON.stringify(p.selectedLessons || []),
              JSON.stringify(p.parameters || {}),
              totalQ,
              correctQ,
              Number(p.incorrectCount || 0),
              Number(p.skippedCount || 0),
              Number(p.timedOutCount || 0),
              Number(p.elapsedSeconds || 0),
              JSON.stringify(p.results || []),
              xp,
              coins,
              key,
              new Date().toISOString()
            )
            .run();

          if (xp > 0 || coins > 0) {
            const r = await awardRewardEvent(db, {
              userId,
              actionType: 'practice_session',
              xpDelta: xp,
              coinDelta: coins,
              referenceId: sessionId,
              idempotencyKey: `reward:${key}`,
              localDate,
            });
            totalXpCredited += r.xpDelta;
            totalCoinsCredited += r.coinDelta;
          }
          syncedIds.push(key);
        } else if (ev.type === 'flashcard_rating' && ev.payload) {
          const { cardId, deck, rating } = ev.payload;
          if (typeof cardId === 'string' && (rating === 'known' || rating === 'unknown')) {
            const nowIso = new Date().toISOString();
            await db
              .prepare(
                `INSERT INTO flashcard_reviews (id, user_id, card_id, deck, rating, review_count, last_reviewed_at)
                 VALUES (?, ?, ?, ?, ?, 1, ?)
                 ON CONFLICT(user_id, card_id) DO UPDATE SET rating = excluded.rating, review_count = review_count + 1, last_reviewed_at = excluded.last_reviewed_at`
              )
              .bind(crypto.randomUUID(), userId, cardId, String(deck || 'General'), rating, nowIso)
              .run();

            const streak = await recordQualifyingStudyActivity(db, userId, req.authUser!.timezone);
            const r = await awardRewardEvent(db, {
              userId,
              actionType: 'flashcard_review',
              xpDelta: cfg.xpPerFlashcardReview,
              coinDelta: 0,
              referenceId: cardId,
              idempotencyKey: `fc:${key}`,
              localDate: streak.localDate,
            });
            totalXpCredited += r.xpDelta;
            totalCoinsCredited += r.coinDelta;
            syncedIds.push(key);
          }
        }
      }

      res.json({ syncedIds, totalXpCredited, totalCoinsCredited });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Sync failed.' });
    }
  });

  return router;
}
