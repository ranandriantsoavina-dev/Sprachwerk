import React from 'react';
import {
  BarChart3,
  BookOpen,
  Coins,
  Dumbbell,
  Flame,
  GraduationCap,
  Home,
  LogOut,
  Moon,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sun,
  Trophy,
  User,
  WifiOff,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { apiRequest } from '../lib/api';
import type { InterfaceLang, ScreenId } from '../types/domain';
import { BrandMark, UserAvatar, UserBadgeIcon } from './BrandMark';
import { PWAInstallButton } from './PWAInstallButton';

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
  } = useApp();

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

  // Mobile 5-item bottom bar per PDF Section 2: Home · Practice · Library · Shop · Profile
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
              <button
                key={item.id}
                type="button"
                onClick={() => setScreen(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer min-h-[42px] whitespace-nowrap ${
                  active
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-black'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span className={active ? 'text-[#FFCE00] dark:text-[#DD0000]' : ''}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
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
                  {t(lang, 'levelShort')} {user.level.level} · {user.xpTotal} XP
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              title={t(lang, 'signOut')}
              className="p-2 rounded-lg text-neutral-500 hover:text-[#DD0000] hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              aria-label={t(lang, 'signOut')}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0 w-full">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-14 bg-white/95 dark:bg-[#111318]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 w-full">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="lg:hidden shrink-0">
              <BrandMark size="sm" />
            </span>
            <h1 className="text-sm sm:text-base font-display font-bold text-neutral-900 dark:text-white truncate">
              {activeNavTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Compact XP / Streak / Coins metric strip */}
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono-tabular text-neutral-700 dark:text-neutral-300">
              <span className="inline-flex items-center gap-1" title={t(lang, 'currentStreak')}>
                <Flame size={14} className="text-[#DD0000]" />
                {user.currentStreak}
              </span>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
              <span
                className="inline-flex items-center gap-1"
                title={isUnlimitedCoins ? t(lang, 'unlimitedCoinsLabel') : t(lang, 'coinBalance')}
              >
                <Coins size={14} className="text-[#D99B00] dark:text-[#FFCE00]" />
                {isUnlimitedCoins ? '∞' : user.coinsBalance}
              </span>
            </div>

            {/* Language Selector */}
            <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-50 dark:bg-neutral-900">
              {(['fr', 'en', 'de'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleQuickLang(code)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold uppercase cursor-pointer transition-colors ${
                    lang === code
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Theme Switch */}
            <button
              type="button"
              onClick={handleQuickTheme}
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label={t(lang, 'toggleTheme')}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </header>

        {/* Offline / Pending Sync Notice Bar */}
        {(!isOnline || pendingSyncCount > 0) && (
          <div className="px-4 sm:px-6 lg:px-8 py-2 bg-[#FFCE00]/20 border-b border-[#FFCE00]/40 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-neutral-900 dark:text-[#FFCE00]">
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
        )}

        {/* Main Viewport */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 lg:pb-10 max-w-7xl w-full mx-auto min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (5 items, <= 64px height) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/95 dark:bg-[#111318]/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-5 items-center px-1">
        {mobileNav.map((item) => {
          const active =
            screen === item.id ||
            (item.id === 'general_practice' && screen === 'lesson_practice');
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setScreen(item.id)}
              className={`flex flex-col items-center justify-center h-full gap-0.5 px-0.5 min-w-0 cursor-pointer ${
                active
                  ? 'text-[#DD0000] dark:text-[#FFCE00]'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium whitespace-nowrap truncate max-w-full leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Toast Stack */}
      {toasts.length > 0 && (
        <div className="fixed bottom-20 lg:bottom-5 right-4 left-4 sm:left-auto z-50 space-y-2 sm:max-w-sm sm:w-full pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium ${
                toast.tone === 'error'
                  ? 'bg-[#DD0000] text-white border-[#b80000]'
                  : toast.tone === 'reward'
                  ? 'bg-black text-[#FFCE00] border-[#FFCE00]/40'
                  : 'bg-white dark:bg-[#181B22] text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-700'
              }`}
            >
              <span className="min-w-0 break-words">{toast.text}</span>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="opacity-70 hover:opacity-100 cursor-pointer shrink-0"
                aria-label={t(lang, 'dismiss')}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
