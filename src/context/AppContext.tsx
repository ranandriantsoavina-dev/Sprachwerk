import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { t } from '../i18n/translations';
import { apiRequest } from '../lib/api';
import { getPendingOfflineEvents, removeSyncedEvents } from '../lib/offlineQueue';
import { useOnlineStatus } from '../hooks/usePWAInstall';
import type {
  GamificationConfig,
  InterfaceLang,
  ScreenId,
  ThemeMode,
  UserProfile,
} from '../types/domain';

interface ToastMessage {
  id: string;
  text: string;
  tone: 'success' | 'error' | 'reward' | 'info';
}

interface AppContextValue {
  user: UserProfile | null;
  loadingAuth: boolean;
  screen: ScreenId;
  setScreen: (s: ScreenId) => void;
  lang: InterfaceLang;
  setLangLocal: (l: InterfaceLang) => void;
  theme: ThemeMode;
  setThemeLocal: (t: ThemeMode) => void;
  isOnline: boolean;
  pendingSyncCount: number;
  syncOfflineQueue: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  signOut: () => Promise<void>;
  gamificationConfig: GamificationConfig | null;
  toasts: ToastMessage[];
  pushToast: (text: string, tone?: ToastMessage['tone']) => void;
  dismissToast: (id: string) => void;
  selectedLessonIdForPractice: string | null;
  setSelectedLessonIdForPractice: (id: string | null) => void;
  selectedLessonIdForDetail: string | null;
  setSelectedLessonIdForDetail: (id: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [screen, setScreen] = useState<ScreenId>('home');
  const [lang, setLangLocal] = useState<InterfaceLang>('en');
  const [theme, setThemeLocal] = useState<ThemeMode>('light');
  const [gamificationConfig, setGamificationConfig] = useState<GamificationConfig | null>(null);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedLessonIdForPractice, setSelectedLessonIdForPractice] = useState<string | null>(null);
  const [selectedLessonIdForDetail, setSelectedLessonIdForDetail] = useState<string | null>(null);

  const isOnline = useOnlineStatus();

  const pushToast = useCallback((text: string, tone: ToastMessage['tone'] = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { id, text, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync theme/language when a user session starts
  useEffect(() => {
    if (user) {
      setLangLocal(user.interfaceLang);
      setThemeLocal(user.theme);
    }
  }, [user?.id]);

  // Apply light/dark theme (AuthView when logged out is always light), equipped theme accent, and reduced-motion classes
  useEffect(() => {
    const root = document.documentElement;
    if (user && theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    if (user?.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    const accent = user?.equipped?.theme_accent?.value;
    if (accent) {
      root.setAttribute('data-theme-accent', accent);
    } else {
      root.removeAttribute('data-theme-accent');
    }
  }, [user, theme, user?.reducedMotion, user?.equipped?.theme_accent?.value]);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiRequest<{ user: UserProfile }>('/api/auth/me');
      setUser(data.user);
      setLangLocal(data.user.interfaceLang);
      setThemeLocal(data.user.theme);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [meRes, cfgRes] = await Promise.allSettled([
          apiRequest<{ user: UserProfile }>('/api/auth/me'),
          apiRequest<{ config: GamificationConfig }>('/api/config/gamification'),
        ]);
        if (!active) return;
        if (meRes.status === 'fulfilled') {
          setUser(meRes.value.user);
          setLangLocal(meRes.value.user.interfaceLang);
          setThemeLocal(meRes.value.user.theme);
        }
        if (cfgRes.status === 'fulfilled') {
          setGamificationConfig(cfgRes.value.config);
        }
      } finally {
        if (active) setLoadingAuth(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const syncOfflineQueue = useCallback(async () => {
    const pending = await getPendingOfflineEvents();
    setPendingSyncCount(pending.length);
    if (!isOnline || !user || pending.length === 0) return;

    try {
      const res = await apiRequest<{
        syncedIds: string[];
        totalXpCredited: number;
        totalCoinsCredited: number;
      }>('/api/sync/events', {
        method: 'POST',
        body: { events: pending },
      });
      await removeSyncedEvents(res.syncedIds);
      const remaining = await getPendingOfflineEvents();
      setPendingSyncCount(remaining.length);
      if (res.syncedIds.length > 0) {
        await refreshUser();
        pushToast(
          `${t(lang, 'syncedOfflineLabel')} (${res.syncedIds.length}): +${res.totalXpCredited} XP, +${res.totalCoinsCredited} ${t(lang, 'coinBalance')}`,
          'reward'
        );
      }
    } catch {
      // Keep events queued for next attempt
    }
  }, [isOnline, user, lang, refreshUser, pushToast]);

  useEffect(() => {
    syncOfflineQueue();
  }, [isOnline, user?.id, syncOfflineQueue]);

  const signOut = useCallback(async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore network error on logout
    }
    setUser(null);
    setThemeLocal('light');
    setScreen('home');
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        loadingAuth,
        screen,
        setScreen,
        lang,
        setLangLocal,
        theme,
        setThemeLocal,
        isOnline,
        pendingSyncCount,
        syncOfflineQueue,
        refreshUser,
        setUser,
        signOut,
        gamificationConfig,
        toasts,
        pushToast,
        dismissToast,
        selectedLessonIdForPractice,
        setSelectedLessonIdForPractice,
        selectedLessonIdForDetail,
        setSelectedLessonIdForDetail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
