import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Coins,
  Dumbbell,
  Flame,
  GraduationCap,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import { UserAvatar, UserBadgeIcon, UserBannerBackdrop } from '../components/BrandMark';
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
import type { LeaderboardEntry } from '../types/domain';

interface StatsPreview {
  summary: {
    sessionsCount: number;
    totalQuestions: number;
    overallAccuracyPct: number;
    lessonsCompleted: number;
  };
  studyDays: Array<{ local_date: string; qualifying_actions: number; xp_earned: number; is_frozen: number }>;
  sessions: Array<{
    id: string;
    mode: string;
    totalQuestions: number;
    correctCount: number;
    xpAwarded: number;
    createdAt: string;
  }>;
}

export const HomeView: React.FC = () => {
  const { user, lang, setScreen } = useApp();
  const reducedMotion = useMotionPreference();
  const isMobile = useIsMobileViewport(768);
  const [stats, setStats] = useState<StatsPreview | null>(null);
  const [nearbyRank, setNearbyRank] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      apiRequest<StatsPreview>('/api/stats'),
      apiRequest<{ nearby: LeaderboardEntry[] }>('/api/leaderboard?view=xp'),
    ]).then(([sRes, lRes]) => {
      if (!active) return;
      if (sRes.status === 'fulfilled') setStats(sRes.value);
      if (lRes.status === 'fulfilled') setNearbyRank(lRes.value.nearby || []);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!user) return null;

  // Build last 14 local calendar days for compact study calendar strip
  const calendarDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const iso = d.toISOString().slice(0, 10);
    const match = stats?.studyDays.find((sd) => sd.local_date === iso);
    return {
      iso,
      dayNum: d.getDate(),
      weekday: d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US', {
        weekday: 'short',
      }),
      active: Boolean(match && match.qualifying_actions > 0),
      frozen: Boolean(match && match.is_frozen),
    };
  });

  const goldThemeAccent = user.equipped?.theme_accent?.value === 'gold_archive';
  const porcelainThemeAccent = user.equipped?.theme_accent?.value === 'porcelain';
  const equippedBanner = user.equipped?.banner?.value;
  const hasHeroBanner = Boolean(equippedBanner);
  const isUnlimitedCoins = user.role === 'admin' || Boolean(user.unlimitedCoins);

  const pageContainerVariants = createStaggerContainerVariants(isMobile ? 0.04 : 0.06, 0.01);
  const kpiContainerVariants = createStaggerContainerVariants(0.045, 0.03);
  const sectionVariants = createStaggerItemVariants(reducedMotion, isMobile ? 6 : 12);

  return (
    <motion.div
      variants={pageContainerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6 min-w-0"
    >
      {/* Hero Greeting & Primary CTA */}
      <motion.section
        variants={sectionVariants}
        className={`sw-accent-card relative rounded-2xl border p-5 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6 min-w-0 overflow-hidden ${
          hasHeroBanner
            ? 'border-neutral-800 text-white'
            : porcelainThemeAccent
            ? 'border-[#E6DEC8] dark:border-neutral-800 bg-[#FFFDF8] dark:bg-[#171512]'
            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A]'
        }`}
      >
        <UserBannerBackdrop bannerKey={equippedBanner} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-3.5 min-w-0 shrink-0">
            <UserAvatar
              displayName={user.displayName}
              avatarKey={user.equipped?.avatar?.value}
              frameKey={user.equipped?.frame?.value}
              size="lg"
            />
            <div
              className={`sm:hidden flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-medium min-w-0 ${
                hasHeroBanner ? 'text-neutral-300' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <span>{t(lang, 'levelLabel')} {user.level.level}</span>
              <UserBadgeIcon badgeKey={user.equipped?.badge?.value} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div
              className={`hidden sm:flex flex-wrap items-center gap-2 text-xs font-medium ${
                hasHeroBanner ? 'text-neutral-300' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <span>{t(lang, 'levelLabel')} {user.level.level}</span>
              <UserBadgeIcon badgeKey={user.equipped?.badge?.value} />
            </div>
            <h2
              className={`text-xl sm:text-3xl font-display font-bold mt-0.5 leading-snug break-words [overflow-wrap:anywhere] ${
                hasHeroBanner ? 'text-white' : 'text-neutral-900 dark:text-white'
              }`}
            >
              {t(lang, 'welcomeBack')}, {user.displayName}
            </h2>
            <p
              className={`text-sm mt-1.5 leading-relaxed ${
                hasHeroBanner ? 'text-neutral-200' : 'text-neutral-600 dark:text-neutral-300'
              }`}
            >
              {t(lang, 'homeOpenLessonsDesc')}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
          <motion.button
            type="button"
            whileHover={reducedMotion || isMobile ? undefined : { y: -1 }}
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            transition={MOTION_SPRING.snappy}
            onClick={() => setScreen('general_practice')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#DD0000] hover:bg-[#b80000] text-white text-sm font-semibold transition-colors cursor-pointer min-h-[44px] whitespace-nowrap"
          >
            <Dumbbell size={17} />
            <span>{t(lang, 'startGeneralPractice')}</span>
          </motion.button>
          <motion.button
            type="button"
            whileHover={reducedMotion || isMobile ? undefined : { y: -1 }}
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            transition={MOTION_SPRING.snappy}
            onClick={() => setScreen('lesson_practice')}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer min-h-[44px] whitespace-nowrap ${
              hasHeroBanner
                ? 'border-white/35 bg-black/35 text-white hover:border-white'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white hover:border-black dark:hover:border-white'
            }`}
          >
            <GraduationCap size={17} />
            <span>{t(lang, 'startLessonPractice')}</span>
          </motion.button>
        </div>
      </motion.section>

      {/* Core Metric Strip: Streak, XP & Level, Coins, Accuracy */}
      <motion.section
        variants={kpiContainerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div
          variants={sectionVariants}
          whileHover={reducedMotion || isMobile ? undefined : { y: -2 }}
          transition={MOTION_SPRING.snappy}
          className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5"
        >
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            <span>{t(lang, 'currentStreak')}</span>
            <Flame size={16} className="text-[#DD0000]" />
          </div>
          <div className="text-2xl font-display font-bold font-mono-tabular text-neutral-900 dark:text-white">
            <AnimatedNumber value={user.currentStreak} /> {t(lang, 'daysUnit')}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono-tabular">
            {t(lang, 'bestStreak')}: {user.bestStreak} {t(lang, 'daysUnit')}
          </div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          whileHover={reducedMotion || isMobile ? undefined : { y: -2 }}
          transition={MOTION_SPRING.snappy}
          className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5"
        >
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            <span>{t(lang, 'lifetimeXp')}</span>
            <span className="font-mono-tabular font-semibold text-neutral-900 dark:text-[#FFCE00]">
              {t(lang, 'levelShort')} {user.level.level}
            </span>
          </div>
          <div className="text-2xl font-display font-bold font-mono-tabular text-neutral-900 dark:text-white">
            <AnimatedNumber value={user.xpTotal} /> XP
          </div>
          <div className="mt-2.5">
            <AnimatedProgressBar
              value={user.level.progressPct}
              max={100}
              glowOnIncrease
              trackClassName="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
              barClassName={`h-full w-full rounded-full ${goldThemeAccent ? 'bg-[#FFCE00]' : 'bg-[#DD0000]'}`}
            />
          </div>
          <div className="text-[11px] font-mono-tabular text-neutral-500 dark:text-neutral-400 mt-1">
            {user.level.xpIntoLevel}/{user.level.xpNeededForLevel} XP {t(lang, 'nextLevelProgress')}
          </div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          whileHover={reducedMotion || isMobile ? undefined : { y: -2 }}
          transition={MOTION_SPRING.snappy}
          className="sw-accent-card rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5"
        >
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            <span>{t(lang, 'coinBalance')}</span>
            <Coins size={16} className="text-[#D99B00] dark:text-[#FFCE00]" />
          </div>
          <div className="text-2xl font-display font-bold font-mono-tabular text-neutral-900 dark:text-white flex items-baseline gap-2">
            <span>{isUnlimitedCoins ? '∞' : <AnimatedNumber value={user.coinsBalance} />}</span>
            {isUnlimitedCoins && (
              <span className="text-xs font-sans font-semibold text-[#D99B00] dark:text-[#FFCE00]">
                {t(lang, 'unlimitedCoinsLabel')}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setScreen('shop')}
            className="text-xs font-medium text-[#DD0000] dark:text-[#FFCE00] hover:underline mt-1 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{t(lang, 'navShop')}</span>
            <ArrowRight size={12} />
          </button>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          whileHover={reducedMotion || isMobile ? undefined : { y: -2 }}
          transition={MOTION_SPRING.snappy}
          className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5"
        >
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            <span>{t(lang, 'overallAccuracy')}</span>
            <Award size={16} className="text-neutral-700 dark:text-neutral-300" />
          </div>
          <div className="text-2xl font-display font-bold font-mono-tabular text-neutral-900 dark:text-white">
            <AnimatedNumber value={stats?.summary.overallAccuracyPct ?? 0} />%
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono-tabular">
            {stats?.summary.sessionsCount ?? 0} {t(lang, 'totalSessions')} · {stats?.summary.totalQuestions ?? 0} {t(lang, 'questionsShort')}
          </div>
        </motion.div>
      </motion.section>

      {/* 14-Day Study Activity Calendar + Quick Library Access */}
      <motion.section variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-6 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white">
              {t(lang, 'studyCalendar')}
            </h3>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono-tabular">
              {t(lang, 'last14Days')}
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((day, idx) => (
              <motion.div
                key={day.iso}
                title={day.iso}
                initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: MOTION_DURATION.fast,
                  delay: reducedMotion ? 0 : idx * 0.015,
                  ease: MOTION_EASE.settle,
                }}
                whileHover={reducedMotion || isMobile ? undefined : { y: -2 }}
                className={`p-1.5 sm:p-2 rounded-xl border text-center transition-colors ${
                  day.active
                    ? 'border-[#DD0000] bg-[#DD0000]/10 text-neutral-900 dark:text-white'
                    : day.frozen
                    ? 'border-[#FFCE00] bg-[#FFCE00]/15 text-neutral-900 dark:text-[#FFCE00]'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400'
                }`}
              >
                <div className="text-[10px] uppercase truncate">{day.weekday}</div>
                <div className="text-sm font-mono-tabular font-semibold mt-0.5">{day.dayNum}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {user.claimableAchievements > 0
                ? `${user.claimableAchievements} ${t(lang, 'claimableAchievementsHint')}`
                : t(lang, 'streakActionHint')}
            </div>
            <button
              type="button"
              onClick={() => setScreen('library')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white hover:text-[#DD0000] cursor-pointer"
            >
              <BookOpen size={14} />
              <span>{t(lang, 'browseLibrary')}</span>
            </button>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="lg:col-span-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-6 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between mb-4 gap-2">
              <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2 min-w-0">
                <Trophy size={16} className="text-[#D99B00] dark:text-[#FFCE00] shrink-0" />
                <span className="truncate">{t(lang, 'leaderboardPreview')}</span>
              </h3>
              <button
                type="button"
                onClick={() => setScreen('leaderboard')}
                className="text-xs font-semibold text-[#DD0000] dark:text-[#FFCE00] hover:underline cursor-pointer shrink-0"
              >
                {t(lang, 'viewLeaderboard')}
              </button>
            </div>

            {!user.leaderboardVisible ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t(lang, 'optedOutNotice')}
              </p>
            ) : nearbyRank.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t(lang, 'leaderboardEmptyHint')}
              </p>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {nearbyRank.map((entry) => {
                  const rowBanner = entry.cosmetics?.banner;
                  const hasBanner = Boolean(rowBanner);
                  return (
                    <div
                      key={entry.userId}
                      className={`relative overflow-hidden py-2.5 px-2.5 -mx-2.5 rounded-lg flex items-center justify-between gap-2 text-sm ${
                        hasBanner
                          ? 'text-white font-semibold my-0.5'
                          : entry.isSelf
                          ? 'font-semibold text-neutral-900 dark:text-white'
                          : 'text-neutral-600 dark:text-neutral-300'
                      }`}
                    >
                      <UserBannerBackdrop bannerKey={rowBanner} compact />
                      <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-6 text-xs font-mono-tabular shrink-0 ${
                            hasBanner ? 'text-neutral-300' : 'text-neutral-400'
                          }`}
                        >
                          #{entry.rank}
                        </span>
                        <UserAvatar
                          displayName={entry.displayName}
                          avatarKey={entry.cosmetics?.avatar}
                          frameKey={entry.cosmetics?.frame}
                          size="sm"
                        />
                        <span className="truncate">{entry.displayName}</span>
                        <UserBadgeIcon badgeKey={entry.cosmetics?.badge} />
                      </div>
                      <span className="relative z-10 font-mono-tabular text-xs shrink-0">{entry.xpTotal} XP</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {user.role === 'admin' && (
            <button
              type="button"
              onClick={() => setScreen('admin')}
              className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-[#DD0000] cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5 min-w-0">
                <ShieldCheck size={14} className="shrink-0" />
                <span className="truncate">{t(lang, 'manageCodesLink')}</span>
              </span>
              <ArrowRight size={14} className="shrink-0" />
            </button>
          )}
        </div>
      </motion.section>

    </motion.div>
  );
};
