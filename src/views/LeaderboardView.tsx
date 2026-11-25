import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Flame, Trophy } from 'lucide-react';
import { UserAvatar, UserBadgeIcon, UserBannerBackdrop } from '../components/BrandMark';
import { AnimatedNumber, useIsMobileViewport } from '../components/motion/MotionPrimitives';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { apiRequest } from '../lib/api';
import {
  MOTION_SPRING,
  createSlideUpVariants,
  createStaggerContainerVariants,
  createStaggerItemVariants,
  useMotionPreference,
} from '../lib/motion';
import type { LeaderboardEntry } from '../types/domain';

interface LeaderboardPayload {
  view: string;
  periodLabel: string | null;
  lastUpdated: string;
  entries: LeaderboardEntry[];
  myPosition: LeaderboardEntry | null;
}

export const LeaderboardView: React.FC = () => {
  const { lang, user } = useApp();
  const reducedMotion = useMotionPreference();
  const isMobile = useIsMobileViewport(768);
  const [view, setView] = useState<'xp' | 'weekly' | 'monthly' | 'streak'>('xp');
  const [data, setData] = useState<LeaderboardPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest<LeaderboardPayload>(`/api/leaderboard?view=${view}`)
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
  }, [view]);

  const tabContentVariants = createSlideUpVariants(reducedMotion, isMobile ? 4 : 8);
  const rowsContainerVariants = createStaggerContainerVariants(isMobile ? 0.02 : 0.028, 0.01);
  const rowVariants = createStaggerItemVariants(reducedMotion, isMobile ? 4 : 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
            {t(lang, 'leaderboardTitle')}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
            {t(lang, 'leaderboardDesc')}
          </p>
        </div>
        {data?.lastUpdated && (
          <div className="text-xs text-neutral-500 font-mono-tabular">
            {t(lang, 'lastUpdated')}:{' '}
            {new Date(data.lastUpdated).toLocaleTimeString(
              lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US'
            )}
            {data.periodLabel ? ` · ${data.periodLabel}` : ''}
          </div>
        )}
      </div>

      {/* View Tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 w-fit max-w-full">
        {(
          [
            ['xp', t(lang, 'tabLifetimeXp')],
            ['weekly', t(lang, 'tabWeeklyXp')],
            ['monthly', t(lang, 'tabMonthlyXp')],
            ['streak', t(lang, 'tabDailyStreak')],
          ] as const
        ).map(([id, label]) => {
          const active = view === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                active
                  ? 'text-neutral-900 dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="leaderboard-tab-pill"
                  transition={MOTION_SPRING.snappy}
                  className="absolute inset-0 rounded-lg bg-white dark:bg-neutral-800 shadow-xs"
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>

      {/* My Position Card */}
      {data?.myPosition && (() => {
        const myBanner = data.myPosition.cosmetics?.banner || user?.equipped?.banner?.value;
        const hasMyBanner = Boolean(myBanner);
        return (
          <motion.div
            key={`my-pos-${view}`}
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            className={`relative overflow-hidden rounded-2xl border p-5 flex flex-wrap items-center justify-between gap-4 ${
              hasMyBanner
                ? 'border-neutral-800 text-white'
                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A]'
            }`}
          >
            <UserBannerBackdrop bannerKey={myBanner} compact />
            <div className="relative z-10 flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#FFCE00]/20 text-[#FFCE00] flex items-center justify-center font-mono-tabular font-bold shrink-0">
                {data.myPosition.rank ? `#${data.myPosition.rank}` : '—'}
              </div>
              <UserAvatar
                displayName={data.myPosition.displayName}
                avatarKey={data.myPosition.cosmetics?.avatar}
                frameKey={data.myPosition.cosmetics?.frame}
                size="md"
              />
              <div className="min-w-0">
                <div className={`text-xs font-semibold ${hasMyBanner ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {t(lang, 'myPosition')}
                </div>
                <div
                  className={`text-sm font-bold flex items-center gap-1.5 min-w-0 ${
                    hasMyBanner ? 'text-white' : 'text-neutral-900 dark:text-white'
                  }`}
                >
                  <span className="truncate">{data.myPosition.displayName}</span>
                  <UserBadgeIcon badgeKey={user?.equipped?.badge?.value} />
                </div>
              </div>
            </div>

            <div
              className={`relative z-10 text-sm font-mono-tabular font-semibold shrink-0 ${
                hasMyBanner ? 'text-white' : 'text-neutral-900 dark:text-white'
              }`}
            >
              {view === 'streak' ? (
                <>
                  <AnimatedNumber value={data.myPosition.currentStreak} /> {t(lang, 'daysUnit')} ({t(lang, 'bestLabel')}: {data.myPosition.bestStreak})
                </>
              ) : (
                <>
                  <AnimatedNumber value={data.myPosition.periodXp} /> XP
                </>
              )}
            </div>
          </motion.div>
        );
      })()}

      {!user?.leaderboardVisible && (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-4 text-xs text-neutral-600 dark:text-neutral-300">
          {t(lang, 'optedOutNotice')}
        </div>
      )}

      {/* Rankings Table */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] overflow-hidden">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-8 text-sm text-neutral-500"
            >
              {t(lang, 'loadingRankings')}
            </motion.div>
          ) : !data || data.entries.length === 0 ? (
            <motion.div
              key="empty"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-8 text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-2"
            >
              <Trophy size={16} className="shrink-0" />
              <span>{t(lang, 'noLeaderboardEntries')}</span>
            </motion.div>
          ) : (
            <motion.div
              key={`entries-${view}`}
              variants={rowsContainerVariants}
              initial="initial"
              animate="animate"
              className="divide-y divide-neutral-100 dark:divide-neutral-800"
            >
              {data.entries.map((entry) => {
                const rowBanner = entry.cosmetics?.banner;
                const hasBanner = Boolean(rowBanner);
                return (
                  <motion.div
                    key={entry.userId}
                    variants={rowVariants}
                    className={`relative overflow-hidden px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4 transition-colors ${
                      hasBanner
                        ? 'text-white'
                        : entry.isSelf
                        ? 'bg-[#FFCE00]/10'
                        : 'hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40'
                    }`}
                  >
                    <UserBannerBackdrop bannerKey={rowBanner} compact />
                    <div className="relative z-10 flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 text-sm font-mono-tabular font-bold shrink-0 ${
                          entry.rank === 1
                            ? 'text-[#FFCE00]'
                            : entry.rank === 2
                            ? hasBanner
                              ? 'text-neutral-200'
                              : 'text-neutral-700 dark:text-neutral-200'
                            : entry.rank === 3
                            ? hasBanner
                              ? 'text-[#FFCE00]'
                              : 'text-[#DD0000]'
                            : hasBanner
                            ? 'text-neutral-300'
                            : 'text-neutral-400'
                        }`}
                      >
                        #{entry.rank}
                      </span>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <UserAvatar
                          displayName={entry.displayName}
                          avatarKey={entry.cosmetics?.avatar}
                          frameKey={entry.cosmetics?.frame}
                          size="md"
                        />
                        <div className="min-w-0">
                          <div
                            className={`text-sm font-semibold flex items-center gap-1.5 min-w-0 ${
                              hasBanner ? 'text-white' : 'text-neutral-900 dark:text-white'
                            }`}
                          >
                            <span className="truncate">{entry.displayName}</span>
                            <UserBadgeIcon badgeKey={entry.cosmetics?.badge} />
                          </div>
                          <div
                            className={`text-[11px] font-mono-tabular ${
                              hasBanner ? 'text-neutral-300' : 'text-neutral-500'
                            }`}
                          >
                            {t(lang, 'levelShort')} {entry.level}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 text-right shrink-0">
                      {view === 'streak' ? (
                        <div
                          className={`inline-flex items-center gap-1.5 text-sm font-mono-tabular font-bold ${
                            hasBanner ? 'text-white' : 'text-neutral-900 dark:text-white'
                          }`}
                        >
                          <Flame size={14} className="text-[#DD0000]" />
                          <span>{entry.currentStreak}{t(lang, 'dayShort')}</span>
                          <span className={`text-xs font-normal ${hasBanner ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            ({t(lang, 'bestLabel').toLowerCase()} {entry.bestStreak}{t(lang, 'dayShort')})
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`text-sm font-mono-tabular font-bold ${
                            hasBanner ? 'text-white' : 'text-neutral-900 dark:text-white'
                          }`}
                        >
                          {entry.periodXp} XP
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
