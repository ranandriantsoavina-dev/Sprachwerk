import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Award, Calendar, Flame, Target, TrendingUp } from 'lucide-react';
import {
  AnimatedNumber,
  AnimatedProgressBar,
  useIsMobileViewport,
} from '../components/motion/MotionPrimitives';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { apiRequest } from '../lib/api';
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_SPRING,
  createStaggerContainerVariants,
  createStaggerItemVariants,
  useMotionPreference,
} from '../lib/motion';

interface FullStats {
  summary: {
    sessionsCount: number;
    totalQuestions: number;
    totalCorrect: number;
    overallAccuracyPct: number;
    totalTimeSeconds: number;
    currentStreak: number;
    bestStreak: number;
    xpTotal: number;
    lessonsCompleted: number;
    lessonsBookmarked: number;
    flashcardsKnown: number;
    flashcardsUnknown: number;
  };
  studyDays: Array<{ local_date: string; qualifying_actions: number; xp_earned: number; is_frozen: number }>;
  topicsBreakdown: Array<{ topic: string; attempts: number; correct: number; accuracyPct: number }>;
  weakTopics: Array<{ topic: string; attempts: number; correct: number; accuracyPct: number }>;
  recentMistakes: Array<{
    sessionId: string;
    createdAt: string;
    topic: string;
    prompt: string;
    userAnswer: string;
    correctAnswer: string;
  }>;
  rewardHistory: Array<{
    id: string;
    action_type: string;
    xp_delta: number;
    coin_delta: number;
    local_date: string | null;
    created_at: string;
  }>;
}

export const StatisticsView: React.FC = () => {
  const { lang, setScreen } = useApp();
  const reducedMotion = useMotionPreference();
  const isMobile = useIsMobileViewport(768);
  const [data, setData] = useState<FullStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest<FullStats>('/api/stats')
      .then((res) => {
        if (active) setData(res);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-28 rounded-2xl bg-white dark:bg-[#12141A] border border-neutral-200 dark:border-neutral-800 animate-pulse" />
        <div className="h-56 rounded-2xl bg-white dark:bg-[#12141A] border border-neutral-200 dark:border-neutral-800 animate-pulse" />
      </div>
    );
  }

  const s = data?.summary;
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const iso = d.toISOString().slice(0, 10);
    const hit = data?.studyDays.find((sd) => sd.local_date === iso);
    return { iso, day: d.getDate(), hit };
  });

  const containerVariants = createStaggerContainerVariants(isMobile ? 0.035 : 0.055, 0.01);
  const kpiContainerVariants = createStaggerContainerVariants(0.04, 0.02);
  const itemVariants = createStaggerItemVariants(reducedMotion, isMobile ? 6 : 10);

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
          {t(lang, 'statsTitle')}
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
          {t(lang, 'statsDesc')}
        </p>
      </motion.div>

      {/* Top Metrics */}
      <motion.div variants={kpiContainerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          variants={itemVariants}
          whileHover={reducedMotion || isMobile ? undefined : { y: -2 }}
          transition={MOTION_SPRING.snappy}
          className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5"
        >
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
            <span>{t(lang, 'totalSessions')}</span>
            <TrendingUp size={15} />
          </div>
          <div className="text-2xl font-display font-bold font-mono-tabular text-neutral-900 dark:text-white">
            <AnimatedNumber value={s?.sessionsCount ?? 0} />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={reducedMotion || isMobile ? undefined : { y: -2 }}
          transition={MOTION_SPRING.snappy}
          className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5"
        >
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
            <span>{t(lang, 'questionsAttempted')}</span>
            <Target size={15} />
          </div>
          <div className="text-2xl font-display font-bold font-mono-tabular text-neutral-900 dark:text-white">
            <AnimatedNumber value={s?.totalQuestions ?? 0} />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={reducedMotion || isMobile ? undefined : { y: -2 }}
          transition={MOTION_SPRING.snappy}
          className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5"
        >
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
            <span>{t(lang, 'overallAccuracy')}</span>
            <Award size={15} />
          </div>
          <div className="text-2xl font-display font-bold font-mono-tabular text-neutral-900 dark:text-white">
            <AnimatedNumber value={s?.overallAccuracyPct ?? 0} />%
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={reducedMotion || isMobile ? undefined : { y: -2 }}
          transition={MOTION_SPRING.snappy}
          className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5"
        >
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
            <span>{t(lang, 'bestStreak')}</span>
            <Flame size={15} className="text-[#DD0000]" />
          </div>
          <div className="text-2xl font-display font-bold font-mono-tabular text-neutral-900 dark:text-white">
            <AnimatedNumber value={s?.bestStreak ?? 0} /> {t(lang, 'daysUnit')}
          </div>
        </motion.div>
      </motion.div>

      {/* 30-Day Study Heatmap */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Calendar size={16} />
            <span>{t(lang, 'studyCalendar')} ({t(lang, 'last30Days')})</span>
          </h3>
          <div className="text-xs text-neutral-500">
            {t(lang, 'lessonsReviewed')}: <span className="font-mono-tabular">{s?.lessonsCompleted ?? 0}</span> ·{' '}
            {t(lang, 'bookmarkedLabel')}: <span className="font-mono-tabular">{s?.lessonsBookmarked ?? 0}</span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-15 gap-1.5">
          {last30Days.map((d, idx) => (
            <motion.div
              key={d.iso}
              title={`${d.iso}: ${d.hit?.qualifying_actions ?? 0} ${t(lang, 'actionUnit')}`}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: MOTION_DURATION.fast,
                delay: reducedMotion ? 0 : idx * 0.01,
                ease: MOTION_EASE.settle,
              }}
              whileHover={reducedMotion || isMobile ? undefined : { y: -1 }}
              className={`h-9 rounded-lg border flex items-center justify-center text-[11px] font-mono-tabular transition-colors ${
                d.hit && d.hit.qualifying_actions > 0
                  ? 'border-[#DD0000] bg-[#DD0000]/15 text-neutral-900 dark:text-white font-semibold'
                  : d.hit?.is_frozen
                  ? 'border-[#FFCE00] bg-[#FFCE00]/15 text-neutral-900 dark:text-[#FFCE00]'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-400'
              }`}
            >
              {d.day}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weak Topics & Mistake Review */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-6">
          <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white mb-4">
            {t(lang, 'weakTopicsTitle')}
          </h3>
          {!data || data.weakTopics.length === 0 ? (
            <div className="text-sm text-neutral-500 dark:text-neutral-400 space-y-3">
              <p>{t(lang, 'noWeakTopics')}</p>
              <button
                type="button"
                onClick={() => setScreen('general_practice')}
                className="text-xs font-semibold text-[#DD0000] hover:underline cursor-pointer"
              >
                {t(lang, 'startGeneralPractice')} &rarr;
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {data.weakTopics.map((wt) => (
                <div key={wt.topic} className="py-3 space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-900 dark:text-white">{wt.topic}</span>
                    <span className="font-mono-tabular text-xs text-[#DD0000]">
                      {wt.accuracyPct}% ({wt.correct}/{wt.attempts})
                    </span>
                  </div>
                  <AnimatedProgressBar
                    value={wt.accuracyPct}
                    max={100}
                    trackClassName="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
                    barClassName="h-full w-full rounded-full bg-[#DD0000]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-6">
          <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white mb-4">
            {t(lang, 'mistakeReviewTitle')}
          </h3>
          {!data || data.recentMistakes.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t(lang, 'noMistakesLogged')}
            </p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {data.recentMistakes.map((m, idx) => (
                <div
                  key={`${m.sessionId}-${idx}`}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs space-y-1"
                >
                  <div className="font-semibold text-neutral-900 dark:text-white">{m.prompt}</div>
                  <div className="text-[#DD0000]">{t(lang, 'yourAnswerLabel')}: {m.userAnswer || '—'}</div>
                  <div className="text-emerald-700 dark:text-emerald-400">{t(lang, 'correctLabel')}: {m.correctAnswer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Reward Event Ledger */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-6"
      >
        <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white mb-4">
          {t(lang, 'rewardLedgerTitle')}
        </h3>
        {!data || data.rewardHistory.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t(lang, 'noRewardEvents')}
          </p>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {data.rewardHistory.map((ev) => (
              <div key={ev.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {ev.action_type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-neutral-500 ml-2 font-mono-tabular">
                    {new Date(ev.created_at).toLocaleString(
                      lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US'
                    )}
                  </span>
                </div>
                <div className="font-mono-tabular font-semibold text-neutral-800 dark:text-[#FFCE00]">
                  {ev.xp_delta > 0 ? `+${ev.xp_delta} XP` : ''}
                  {ev.xp_delta > 0 && ev.coin_delta > 0 ? ' · ' : ''}
                  {ev.coin_delta > 0 ? `+${ev.coin_delta} ${t(lang, 'coinBalance')}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
