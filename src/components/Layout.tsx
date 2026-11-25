import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Coins,
  Dumbbell,
  Flame,
  GraduationCap,
  Home,
  Info,
  LogOut,
  Moon,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  Trophy,
  User,
  WifiOff,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { apiRequest } from '../lib/api';
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_SPRING,
  useMotionPreference,
} from '../lib/motion';
import type { InterfaceLang, ScreenId } from '../types/domain';
import { BrandMark, UserAvatar, UserBadgeIcon } from './BrandMark';
import { PWAInstallButton } from './PWAInstallButton';
import {
  AnimatedNumber,
  CelebrationBurst,
  MotionModal,
  MotionPageTransition,
} from './motion/MotionPrimitives';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    screen,
    setScreen,
    lang,
    setLangLocal,
    theme,
    setThemeLocal,
    isOnline,
    pendingSyncCount,
    syncOfflineQueue,
    signOut,
    toasts,
    dismissToast,
    setUser,
    practiceSessionActive,
    levelUpCelebration,
    dismissLevelUpCelebration,
    streakBurstKey,
  } = useApp();

  const reduced = useMotionPreference();

  if (!user) return <>{children}</>;

  const desktopNav: Array<{ id: ScreenId; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: t(lang, 'navHome'), icon: <Home size={18} /> },
    { id: 'general_practice', label: t(lang, 'navGeneralPractice'), icon: <Dumbbell size={18} /> },
    { id: 'lesson_practice', label: t(lang, 'navLessonPractice'), icon: <GraduationCap size={18} /> },
    { id: 'library', label: t(lang, 'navLibrary'), icon: <BookOpen size={18} /> },
    { id: 'statistics', label: t(lang, 'navStatistics'), icon: <BarChart3 size={18} /> },
    { id: 'shop', label: t(lang, 'navShop'), icon: <ShoppingBag size={18} /> },
    { id: 'leaderboard', label: t(lang, 'navLeaderboard'), icon: <Trophy size={18} /> },
    { id: 'profile', label: t(lang, 'navProfile'), icon: <User size={18} /> },
  ];

  if (user.role === 'admin') {
    desktopNav.push({ id: 'admin', label: t(lang, 'navAdmin'), icon: <ShieldCheck size={18} /> });
  }

  // Mobile 5-item bottom bar: Home · Practice · Library · Shop · Profile
  const mobileNav: Array<{ id: ScreenId; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: t(lang, 'navHome'), icon: <Home size={20} /> },
    { id: 'general_practice', label: t(lang, 'navPractice'), icon: <Dumbbell size={20} /> },
    { id: 'library', label: t(lang, 'mobileNavLibrary'), icon: <BookOpen size={20} /> },
    { id: 'shop', label: t(lang, 'navShop'), icon: <ShoppingBag size={20} /> },
    { id: 'profile', label: t(lang, 'mobileNavProfile'), icon: <User size={20} /> },
  ];

  const handleQuickLang = async (nextLang: InterfaceLang) => {
    setLangLocal(nextLang);
    try {
      const res = await apiRequest<{ user: typeof user }>('/api/user/profile', {
        method: 'PATCH',
        body: { interfaceLang: nextLang },
      });
      setUser(res.user);
    } catch {
      // keep local if offline
    }
  };

  const handleQuickTheme = async () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeLocal(nextTheme);
    try {
      const res = await apiRequest<{ user: typeof user }>('/api/user/profile', {
        method: 'PATCH',
        body: { theme: nextTheme },
      });
      setUser(res.user);
    } catch {
      // keep local if offline
    }
  };

  const activeNavTitle =
    desktopNav.find((n) => n.id === screen)?.label || t(lang, 'navHome');

  const isUnlimitedCoins = user.role === 'admin' || Boolean(user.unlimitedCoins);

  return (
    <div className="sw-app-shell min-h-screen w-full flex flex-col lg:flex-row bg-[#F8F9FA] dark:bg-[#0A0B0E] text-neutral-900 dark:text-neutral-100 overflow-x-clip">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111318] z-30">
        {/* Top German-flag inspired hairline accent */}
        <div className="h-[3px] w-full flex">
          <div className="flex-1 bg-black dark:bg-neutral-200" />
          <div className="flex-1 bg-[#DD0000]" />
          <div className="flex-1 bg-[#FFCE00]" />
        </div>

        <div className="px-5 py-5 flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800/80">
          <BrandMark />
          <div className="min-w-0">
            <div className="font-display font-extrabold tracking-tight text-base text-black dark:text-white whitespace-nowrap">
              {t(lang, 'brandName')}
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
              {t(lang, 'brandSubtitle')}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {desktopNav.map((item) => {
            const active = screen === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setScreen(item.id)}
                whileTap={reduced ? undefined : { scale: 0.98 }}
                transition={MOTION_SPRING.snappy}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer min-h-[42px] whitespace-nowrap ${
                  active
                    ? 'text-white dark:text-black'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="desktop-nav-active-pill"
                    transition={reduced ? { duration: 0.01 } : MOTION_SPRING.snappy}
                    className="absolute inset-0 rounded-xl bg-neutral-900 dark:bg-white shadow-xs"
                  />
                )}
                <motion.span
                  animate={
                    active && !reduced ? { scale: [1, 1.12, 1] } : { scale: 1 }
                  }
                  transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.settle }}
                  className={`relative z-10 ${
                    active ? 'text-[#FFCE00] dark:text-[#DD0000]' : ''
                  }`}
                >
                  {item.icon}
                </motion.span>
                <span className="relative z-10 truncate">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <PWAInstallButton />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <UserAvatar
                displayName={user.displayName}
                avatarKey={user.equipped?.avatar?.value}
                frameKey={user.equipped?.frame?.value}
                size="sm"
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1 min-w-0">
                  <span className="truncate">{user.displayName}</span>
                  <UserBadgeIcon badgeKey={user.equipped?.badge?.value} />
                </div>
                <div className="text-[11px] font-mono-tabular text-neutral-500 dark:text-neutral-400">
                  {t(lang, 'levelShort')} {user.level.level} ·{' '}
                  <AnimatedNumber value={user.xpTotal} durationMs={450} /> XP
                </div>
              </div>
            </div>
            <motion.button
              type="button"
              onClick={signOut}
              whileTap={reduced ? undefined : { scale: 0.92 }}
              title={t(lang, 'signOut')}
              className="p-2 rounded-lg text-neutral-500 hover:text-[#DD0000] hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
              aria-label={t(lang, 'signOut')}
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0 w-full">
        {/* Top Header */}
        <header
          className={`${
            practiceSessionActive ? 'hidden lg:flex' : 'flex'
          } sticky top-0 z-20 h-14 bg-white/95 dark:bg-[#111318]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 items-center justify-between gap-2 sm:gap-4 w-full`}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <BrandMark size="sm" className="lg:hidden" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key={`${screen}-${lang}`}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE.settle }}
                className="text-sm sm:text-base font-display font-bold leading-tight text-neutral-900 dark:text-white truncate"
              >
                {activeNavTitle}
              </motion.h1>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Compact XP / Streak / Coins metric strip */}
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono-tabular text-neutral-700 dark:text-neutral-300">
              <motion.span
                key={`streak-${streakBurstKey}`}
                initial={false}
                animate={
                  streakBurstKey > 0 && !reduced
                    ? { scale: [1, 1.22, 0.96, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: MOTION_DURATION.smooth, ease: MOTION_EASE.bounce }}
                className="inline-flex items-center gap-1"
                title={t(lang, 'currentStreak')}
              >
                <Flame size={14} className="text-[#DD0000]" />
                <AnimatedNumber value={user.currentStreak} durationMs={450} />
              </motion.span>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
              <span
                className="inline-flex items-center gap-1"
                title={isUnlimitedCoins ? t(lang, 'unlimitedCoinsLabel') : t(lang, 'coinBalance')}
              >
                <Coins size={14} className="text-[#D99B00] dark:text-[#FFCE00]" />
                {isUnlimitedCoins ? (
                  '∞'
                ) : (
                  <AnimatedNumber value={user.coinsBalance} durationMs={520} />
                )}
              </span>
            </div>

            {/* Language Selector */}
            <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-50 dark:bg-neutral-900">
              {(['fr', 'en', 'de'] as const).map((code) => {
                const isSelected = lang === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleQuickLang(code)}
                    className={`relative px-2 py-1 rounded-md text-[11px] font-semibold uppercase cursor-pointer transition-colors ${
                      isSelected
                        ? 'text-white dark:text-black'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="header-lang-pill"
                        transition={reduced ? { duration: 0.01 } : MOTION_SPRING.snappy}
                        className="absolute inset-0 rounded-md bg-black dark:bg-white"
                      />
                    )}
                    <span className="relative z-10">{code}</span>
                  </button>
                );
              })}
            </div>

            {/* Theme Switch */}
            <motion.button
              type="button"
              onClick={handleQuickTheme}
              whileTap={reduced ? undefined : { scale: 0.9 }}
              transition={MOTION_SPRING.snappy}
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
              aria-label={t(lang, 'toggleTheme')}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, rotate: -45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, rotate: 45, scale: 0.8 }}
                  transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE.settle }}
                  className="inline-flex items-center justify-center"
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </header>

        {/* Offline / Pending Sync Notice Bar */}
        <AnimatePresence initial={false}>
          {(!isOnline || pendingSyncCount > 0) && (
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.standard }}
              className="overflow-hidden bg-[#FFCE00]/20 border-b border-[#FFCE00]/40"
            >
              <div className="px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-neutral-900 dark:text-[#FFCE00]">
                <div className="flex items-center gap-2 min-w-0">
                  <WifiOff size={14} className="shrink-0" />
                  <span>
                    {!isOnline
                      ? t(lang, 'offlineBanner')
                      : `${t(lang, 'pendingSyncBanner')}: ${pendingSyncCount}`}
                  </span>
                </div>
                {isOnline && pendingSyncCount > 0 && (
                  <button
                    type="button"
                    onClick={syncOfflineQueue}
                    className="inline-flex items-center gap-1 underline font-semibold cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    <span>{t(lang, 'syncNow')}</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Viewport with smooth cross-page transition */}
        <main
          className={`flex-1 max-w-7xl w-full mx-auto min-w-0 ${
            practiceSessionActive
              ? 'px-3 sm:px-6 lg:px-6 xl:px-8 py-2 sm:py-5 pb-28 lg:pb-10'
              : 'px-4 sm:px-6 lg:px-6 xl:px-8 py-5 sm:py-6 pb-24 lg:pb-10'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <MotionPageTransition key={screen} pageKey={screen}>
              {children}
            </MotionPageTransition>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation (5 items, <= 64px height; hidden during active exercise session) */}
      <AnimatePresence>
        {!practiceSessionActive && (
          <motion.nav
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.settle }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/95 dark:bg-[#111318]/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-5 items-center px-1"
          >
            {mobileNav.map((item) => {
              const active =
                screen === item.id ||
                (item.id === 'general_practice' && screen === 'lesson_practice');
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setScreen(item.id)}
                  whileTap={reduced ? undefined : { scale: 0.92 }}
                  transition={MOTION_SPRING.snappy}
                  className={`relative flex flex-col items-center justify-center h-full gap-0.5 px-0.5 min-w-0 cursor-pointer transition-colors ${
                    active
                      ? 'text-[#DD0000] dark:text-[#FFCE00]'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="mobile-nav-indicator"
                      transition={reduced ? { duration: 0.01 } : MOTION_SPRING.snappy}
                      className="absolute top-0 inset-x-4 h-[2.5px] rounded-b-full bg-[#DD0000] dark:bg-[#FFCE00]"
                    />
                  )}
                  <motion.span
                    animate={active && !reduced ? { y: -1, scale: 1.06 } : { y: 0, scale: 1 }}
                    transition={MOTION_SPRING.snappy}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="text-[10px] font-medium whitespace-nowrap truncate max-w-full leading-tight">
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Stacked Toast Notifications */}
      <div
        className="fixed bottom-20 lg:bottom-5 right-4 left-4 sm:left-auto z-50 space-y-2 sm:max-w-sm sm:w-full pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const toneIcon =
              toast.tone === 'error' ? (
                <AlertCircle size={16} className="shrink-0" />
              ) : toast.tone === 'reward' ? (
                <Sparkles size={16} className="shrink-0 text-[#FFCE00]" />
              ) : toast.tone === 'success' ? (
                <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
              ) : (
                <Info size={16} className="shrink-0 text-neutral-500 dark:text-neutral-400" />
              );

            return (
              <motion.div
                key={toast.id}
                layout={!reduced}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.96 }}
                transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.settle }}
                className={`pointer-events-auto flex items-start justify-between gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium ${
                  toast.tone === 'error'
                    ? 'bg-[#DD0000] text-white border-[#b80000]'
                    : toast.tone === 'reward'
                    ? 'bg-neutral-950 text-white border-[#FFCE00]/45'
                    : toast.tone === 'success'
                    ? 'bg-white dark:bg-[#181B22] text-neutral-900 dark:text-white border-emerald-500/40'
                    : 'bg-white dark:bg-[#181B22] text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <span className="mt-0.5">{toneIcon}</span>
                  <div className="min-w-0 flex-1">
                    {toast.title && (
                      <div
                        className={`text-xs font-display font-bold mb-0.5 ${
                          toast.tone === 'reward'
                            ? 'text-[#FFCE00]'
                            : toast.tone === 'success'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : ''
                        }`}
                      >
                        {toast.title}
                      </div>
                    )}
                    <div className="min-w-0 break-words leading-snug">{toast.text}</div>
                  </div>
                  {toast.deltaLabel && (
                    <span className="shrink-0 text-xs font-mono-tabular font-bold px-2 py-0.5 rounded-md bg-[#FFCE00]/15 text-[#FFCE00]">
                      {toast.deltaLabel}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="opacity-70 hover:opacity-100 cursor-pointer shrink-0 p-0.5"
                  aria-label={t(lang, 'dismiss')}
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Global Server-Verified Level-Up Celebration Modal */}
      <MotionModal
        open={Boolean(levelUpCelebration)}
        onClose={dismissLevelUpCelebration}
        maxWidthClass="max-w-sm"
        ariaLabel={t(lang, 'levelUpTitle')}
      >
        {levelUpCelebration && (
          <div className="relative p-6 text-center overflow-hidden">
            <div className="h-[3px] w-full flex absolute top-0 left-0 right-0">
              <div className="flex-1 bg-black dark:bg-neutral-200" />
              <div className="flex-1 bg-[#DD0000]" />
              <div className="flex-1 bg-[#FFCE00]" />
            </div>

            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFCE00] to-amber-500 text-black flex items-center justify-center shadow-lg mt-2 mb-4">
              <CelebrationBurst active={!reduced} />
              <motion.div
                initial={reduced ? undefined : { scale: 0.5, rotate: -14 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={MOTION_SPRING.celebration}
                className="flex flex-col items-center"
              >
                <Award size={26} />
                <span className="text-sm font-mono-tabular font-extrabold leading-none mt-0.5">
                  {t(lang, 'levelShort')} {levelUpCelebration.toLevel}
                </span>
              </motion.div>
            </div>

            <motion.h3
              initial={reduced ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: MOTION_DURATION.normal, ease: MOTION_EASE.settle }}
              className="text-xl font-display font-extrabold text-neutral-900 dark:text-white"
            >
              {t(lang, 'levelUpTitle')}
            </motion.h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {t(lang, 'levelUpSubtitle')}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2.5 text-left">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-3">
                <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  {t(lang, 'levelReachedLabel')}
                </div>
                <div className="text-base font-mono-tabular font-extrabold text-neutral-900 dark:text-white mt-0.5">
                  {levelUpCelebration.fromLevel} → {levelUpCelebration.toLevel}
                </div>
              </div>
              <div className="rounded-xl border border-[#FFCE00]/40 bg-[#FFCE00]/10 p-3">
                <div className="text-[11px] font-medium text-amber-700 dark:text-[#FFCE00]">
                  {t(lang, 'levelUpBonusLabel')}
                </div>
                <div className="text-base font-mono-tabular font-extrabold text-neutral-900 dark:text-white mt-0.5 inline-flex items-center gap-1">
                  <Coins size={15} className="text-[#D99B00] dark:text-[#FFCE00]" />
                  +<AnimatedNumber value={levelUpCelebration.bonusCoins} durationMs={550} />
                </div>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={dismissLevelUpCelebration}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              className="mt-5 w-full py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold cursor-pointer"
            >
              {t(lang, 'awesomeBtn')}
            </motion.button>
          </div>
        )}
      </MotionModal>
    </div>
  );
};
