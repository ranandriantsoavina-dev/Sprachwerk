import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Router, type Response } from 'express';
import type { D1Database } from '../db.ts';
import {
  awardRewardEvent,
  getGamificationConfig,
  getLocalDateString,
  recordQualifyingStudyActivity,
} from '../gamification.ts';
import { requireAuth, type AuthenticatedRequest } from '../security.ts';
import { LESSONS_CATALOG } from '../../src/data/lessonsCatalog.ts';
import { QUESTIONS_CATALOG } from '../../src/data/questionsCatalog.ts';

const CONTENT_DIR = path.resolve(process.cwd(), 'data', 'content');

function readDatasetFile<T>(filename: string): T[] {
  try {
    if (typeof fs !== 'undefined' && fs?.existsSync) {
      const filePath = path.join(CONTENT_DIR, filename);
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as T[]) : [];
      }
    }
  } catch {
    // Cloudflare Workers has an ephemeral/in-memory filesystem; fallback gracefully
  }
  return [];
}

export interface LessonRecord {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  unit: number;
  title_en?: string;
  title_de: string;
  topic: string;
  hasContent?: boolean;
  hasPractice?: boolean;
  objectives: Record<string, string>;
  explanation_i18n: Record<string, string>;
  rules: unknown[];
  examples_de: unknown[];
  common_mistakes: unknown[];
}

function getLessonsCatalog(): LessonRecord[] {
  const fromFile = readDatasetFile<LessonRecord>('lessons.json');
  if (fromFile.length > 0) {
    const fileMap = new Map(fromFile.map((item) => [item.id, item]));
    return LESSONS_CATALOG.map((baseItem) => {
      const override = fileMap.get(baseItem.id);
      const merged: LessonRecord = override ? { ...baseItem, ...override } : baseItem;
      return {
        ...merged,
        hasContent: merged.hasContent ?? Object.keys(merged.explanation_i18n || {}).length > 0,
      };
    });
  }
  return LESSONS_CATALOG.map((item) => ({
    ...item,
    hasContent: item.hasContent ?? Object.keys(item.explanation_i18n || {}).length > 0,
  }));
}

export interface QuestionRecord {
  id: string;
  mode?: 'lesson-practice' | 'general-practice';
  lesson_ids: string[];
  topic_tags: string[];
  learning_objective_id?: string;
  cefr_level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  difficulty: 'easy' | 'medium' | 'difficult' | 'extreme';
  type:
    | 'multiple_choice'
    | 'gap_fill'
    | 'sentence_construction'
    | 'translation'
    | 'matching'
    | 'transformation'
    | 'true_false'
    | 'error_correction';
  prompt_de: string;
  prompt_i18n?: Partial<Record<'en' | 'fr' | 'de', string>>;
  options_de?: string[];
  fragments_de?: string[];
  matching_pairs?: Array<{ left: string; right: string }>;
  accepted_answers: string[];
  solution: string;
  explanation_i18n: Record<string, string>;
  hint_i18n?: Partial<Record<'en' | 'fr' | 'de', string>>;
  case_sensitive?: boolean;
  source_language?: 'de';
}

function getQuestionsCatalog(): QuestionRecord[] {
  const fromFile = readDatasetFile<QuestionRecord>('questions.json');
  if (fromFile.length > 0) {
    const map = new Map<string, QuestionRecord>();
    for (const q of QUESTIONS_CATALOG) {
      map.set(q.id, q);
    }
    for (const q of fromFile) {
      map.set(q.id, q);
    }
    return Array.from(map.values());
  }
  return QUESTIONS_CATALOG;
}

export interface FlashcardRecord {
  id: string;
  deck: string;
  german_front: string;
  localized_meaning: Record<string, string>;
  usage_note?: Record<string, string>;
  example_de?: string;
}

export function createContentRouter(db: D1Database) {
  const router = Router();

  router.get('/content/status', (_req, res: Response) => {
    const lessons = getLessonsCatalog();
    const questions = getQuestionsCatalog();
    const flashcards = readDatasetFile<FlashcardRecord>('flashcards.json');

    res.json({
      plannedLessons: 220,
      lessonsCount: lessons.length,
      questionsCount: questions.length,
      flashcardsCount: flashcards.length,
      comingSoon: lessons.every((l) => !l.hasContent) && questions.length === 0 && flashcards.length === 0,
    });
  });

  router.get('/content/lessons', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const lessons = getLessonsCatalog();
      const level = String(req.query.level || '').toUpperCase();
      const topic = String(req.query.topic || '').toLowerCase();
      const q = String(req.query.q || '').toLowerCase().trim();

      const { results: progressRows } = await db
        .prepare('SELECT lesson_id, bookmarked, first_completed_at, review_count FROM lesson_progress WHERE user_id = ?')
        .bind(req.authUser!.id)
        .all<{
          lesson_id: string;
          bookmarked: number;
          first_completed_at: string | null;
          review_count: number;
        }>();

      const progressMap = new Map(progressRows.map((r) => [r.lesson_id, r]));

      const questions = getQuestionsCatalog();
      const practiceLessonIds = new Set<string>();
      for (const question of questions) {
        for (const lessonId of question.lesson_ids) {
          practiceLessonIds.add(lessonId);
        }
      }

      let filtered = lessons;
      if (level && level !== 'ALL') {
        filtered = filtered.filter((l) => l.level === level);
      }
      if (topic && topic !== 'all') {
        filtered = filtered.filter((l) => l.topic.toLowerCase() === topic);
      }
      if (q) {
        filtered = filtered.filter(
          (l) =>
            (l.title_en || '').toLowerCase().includes(q) ||
            l.title_de.toLowerCase().includes(q) ||
            l.topic.toLowerCase().includes(q)
        );
      }

      res.json({
        comingSoon: lessons.length === 0,
        plannedTotal: 220,
        totalAvailable: lessons.length,
        items: filtered.map((l) => ({
          ...l,
          hasPractice: practiceLessonIds.has(l.id),
          progress: progressMap.get(l.id) || {
            bookmarked: 0,
            first_completed_at: null,
            review_count: 0,
          },
        })),
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
    }
  });

  router.get('/content/lessons/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const lessons = getLessonsCatalog();
      const lesson = lessons.find((l) => l.id === req.params.id);
      if (!lesson) {
        res.status(404).json({
          comingSoon: true,
          error: 'Lesson not found.',
        });
        return;
      }

      const questions = getQuestionsCatalog().filter((q) =>
        q.lesson_ids.includes(lesson.id)
      );
      const availableTypes = Array.from(new Set(questions.map((q) => q.type)));
      const availableDifficulties = Array.from(new Set(questions.map((q) => q.difficulty)));

      const prog = await db
        .prepare('SELECT bookmarked, first_completed_at, last_reviewed_at, review_count FROM lesson_progress WHERE user_id = ? AND lesson_id = ?')
        .bind(req.authUser!.id, lesson.id)
        .first();

      res.json({
        lesson: {
          ...lesson,
          hasPractice: questions.length > 0,
        },
        availableTypes,
        availableDifficulties,
        linkedQuestionCount: questions.length,
        progress: prog || { bookmarked: 0, first_completed_at: null, last_reviewed_at: null, review_count: 0 },
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
    }
  });

  router.post('/lessons/:id/bookmark', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { bookmarked } = req.body || {};
      const flag = bookmarked ? 1 : 0;
      await db
        .prepare(
          `INSERT INTO lesson_progress (user_id, lesson_id, bookmarked) VALUES (?, ?, ?)
           ON CONFLICT(user_id, lesson_id) DO UPDATE SET bookmarked = excluded.bookmarked`
        )
        .bind(req.authUser!.id, req.params.id, flag)
        .run();
      res.json({ ok: true, bookmarked: Boolean(flag) });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
    }
  });

  router.post('/lessons/:id/complete', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const lessons = getLessonsCatalog();
    const lesson = lessons.find((l) => l.id === req.params.id);
    if (!lesson || !lesson.hasContent) {
      res.status(404).json({ error: 'Lesson content coming soon' });
      return;
    }

    const userId = req.authUser!.id;
    const cfg = await getGamificationConfig(db);
    const nowIso = new Date().toISOString();
    const localDate = getLocalDateString(req.authUser!.timezone);

    try {
      const existing = await db
        .prepare('SELECT first_completed_at, last_reviewed_at FROM lesson_progress WHERE user_id = ? AND lesson_id = ?')
        .bind(userId, lesson.id)
        .first<{ first_completed_at: string | null; last_reviewed_at: string | null }>();

      if (!existing || !existing.first_completed_at) {
        await db
          .prepare(
            `INSERT INTO lesson_progress (user_id, lesson_id, bookmarked, first_completed_at, last_reviewed_at, review_count)
             VALUES (?, ?, 0, ?, ?, 1)
             ON CONFLICT(user_id, lesson_id) DO UPDATE SET first_completed_at = COALESCE(first_completed_at, excluded.first_completed_at), last_reviewed_at = excluded.last_reviewed_at, review_count = review_count + 1`
          )
          .bind(userId, lesson.id, nowIso, nowIso)
          .run();

        const reward = await awardRewardEvent(db, {
          userId,
          actionType: 'lesson_first_complete',
          xpDelta: cfg.xpPerLessonFirst,
          coinDelta: cfg.coinsPerLessonFirst,
          referenceId: lesson.id,
          idempotencyKey: `lesson_first:${userId}:${lesson.id}`,
          localDate,
        });

        res.json({ firstCompletion: true, xpAwarded: reward.xpDelta, coinsAwarded: reward.coinDelta });
        return;
      }

      // Daily lesson review (once per calendar day per lesson)
      await db
        .prepare(
          `UPDATE lesson_progress SET last_reviewed_at = ?, review_count = review_count + 1 WHERE user_id = ? AND lesson_id = ?`
        )
        .bind(nowIso, userId, lesson.id)
        .run();

      const reward = await awardRewardEvent(db, {
        userId,
        actionType: 'lesson_review',
        xpDelta: cfg.xpPerLessonReview,
        coinDelta: 0,
        referenceId: lesson.id,
        idempotencyKey: `lesson_review:${userId}:${lesson.id}:${localDate}`,
        localDate,
      });

      res.json({ firstCompletion: false, xpAwarded: reward.xpDelta, coinsAwarded: reward.coinDelta });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to record lesson completion.' });
    }
  });

  router.post('/content/practice/query', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
    const { mode, topics = [], lessonIds = [], types = [], difficulty, count = 10, order = 'shuffled' } =
      _req.body || {};

    const questions = getQuestionsCatalog();
    if (questions.length === 0) {
      res.json({
        comingSoon: true,
        items: [],
        availabilityNote: null,
      });
      return;
    }

    let pool = questions;
    if (mode === 'lesson' && Array.isArray(lessonIds) && lessonIds.length > 0) {
      pool = pool.filter((q) => q.lesson_ids.some((id) => lessonIds.includes(id)));
    } else if (Array.isArray(topics) && topics.length > 0 && !topics.includes('mixed')) {
      pool = pool.filter((q) => q.topic_tags.some((t) => topics.includes(t)));
    }

    if (mode !== 'lesson' && difficulty) {
      pool = pool.filter((q) => q.difficulty === difficulty);
    }
    if (Array.isArray(types) && types.length > 0) {
      pool = pool.filter((q) => types.includes(q.type));
    }

    const availabilityNote =
      pool.length === 0
        ? 'No questions match the selected exercise types and difficulty for this topic/lesson.'
        : null;

    let selected = [...pool];
    if (order === 'shuffled') {
      for (let i = selected.length - 1; i > 0; i--) {
        const j = crypto.randomInt(0, i + 1);
        [selected[i], selected[j]] = [selected[j], selected[i]];
      }
    }

    selected = selected.slice(0, Math.max(1, Math.min(200, Number(count) || 10)));
    res.json({
      comingSoon: false,
      items: selected,
      availabilityNote,
    });
  });

  router.get('/content/flashcards', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
    const cards = readDatasetFile<FlashcardRecord>('flashcards.json');
    const deck = String(_req.query.deck || '');
    const filtered = deck && deck !== 'all' ? cards.filter((c) => c.deck === deck) : cards;

    res.json({
      comingSoon: cards.length === 0,
      items: filtered,
      decks: Array.from(new Set(cards.map((c) => c.deck))),
    });
  });

  router.post('/practice/submit', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const {
      mode,
      selectedTopics = [],
      selectedLessons = [],
      parameters = {},
      results = [],
      elapsedSeconds = 0,
      idempotencyKey,
    } = req.body || {};

    if (typeof idempotencyKey !== 'string' || !idempotencyKey) {
      res.status(400).json({ error: 'Session idempotencyKey is required.' });
      return;
    }

    try {
      const existing = await db
        .prepare('SELECT id, xp_awarded, coins_awarded FROM practice_sessions WHERE idempotency_key = ?')
        .bind(idempotencyKey)
        .first<{ id: string; xp_awarded: number; coins_awarded: number }>();

      if (existing) {
        res.json({
          sessionId: existing.id,
          xpAwarded: existing.xp_awarded,
          coinsAwarded: existing.coins_awarded,
          duplicateIgnored: true,
        });
        return;
      }

      const safeResults = Array.isArray(results) ? results : [];
      const totalQuestions = safeResults.length;
      const correctCount = safeResults.filter((r) => Boolean(r?.isCorrect)).length;
      const skippedCount = safeResults.filter((r) => Boolean(r?.skipped)).length;
      const timedOutCount = safeResults.filter((r) => Boolean(r?.timedOut)).length;
      const incorrectCount = Math.max(0, totalQuestions - correctCount - skippedCount - timedOutCount);
      const answeredCount = totalQuestions - skippedCount - timedOutCount;

      if (answeredCount <= 0) {
        res.status(400).json({ error: 'Cannot award rewards for an empty or unanswered session.' });
        return;
      }

      const cfg = await getGamificationConfig(db);
      let xp = correctCount * cfg.xpPerQuestionCorrect;
      let coins = 0;

      if (answeredCount >= cfg.minQuestionsForSessionReward) {
        xp += cfg.xpPerSessionComplete;
        coins += cfg.coinsPerSessionComplete;
        if (correctCount === answeredCount) {
          xp += cfg.xpPerPerfectSession;
        }
      }

      const streak = await recordQualifyingStudyActivity(db, userId, req.authUser!.timezone);
      let dailyBonusXp = 0;
      let dailyBonusCoins = 0;

      if (streak.isFirstStudyOfDay) {
        const daily = await awardRewardEvent(db, {
          userId,
          actionType: 'daily_first_study',
          xpDelta: cfg.xpPerDailyFirstStudy,
          coinDelta: cfg.coinsPerDailyFirstStudy,
          idempotencyKey: `daily:${userId}:${streak.localDate}`,
          localDate: streak.localDate,
        });
        dailyBonusXp = daily.xpDelta;
        dailyBonusCoins = daily.coinDelta;
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
          mode === 'lesson' ? 'lesson' : 'general',
          JSON.stringify(selectedTopics),
          JSON.stringify(selectedLessons),
          JSON.stringify(parameters),
          totalQuestions,
          correctCount,
          incorrectCount,
          skippedCount,
          timedOutCount,
          Math.max(0, Number(elapsedSeconds) || 0),
          JSON.stringify(safeResults),
          xp,
          coins,
          idempotencyKey,
          new Date().toISOString()
        )
        .run();

      const sessionReward = await awardRewardEvent(db, {
        userId,
        actionType: 'practice_session',
        xpDelta: xp,
        coinDelta: coins,
        referenceId: sessionId,
        idempotencyKey: `reward:${idempotencyKey}`,
        localDate: streak.localDate,
      });

      res.status(201).json({
        sessionId,
        xpAwarded: sessionReward.xpDelta,
        coinsAwarded: sessionReward.coinDelta,
        dailyBonusXp,
        dailyBonusCoins,
        streak,
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to submit session.' });
    }
  });

  return router;
}
