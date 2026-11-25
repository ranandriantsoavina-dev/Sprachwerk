import React, { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { registerSW } from 'virtual:pwa-register';
import { Layout } from './components/Layout';
import { AppProvider, useApp } from './context/AppContext';
import { AdminView } from './views/AdminView';
import { AuthView } from './views/AuthView';
import { GeneralPracticeView } from './views/GeneralPracticeView';
import { HomeView } from './views/HomeView';
import { LeaderboardView } from './views/LeaderboardView';
import { LessonPracticeView } from './views/LessonPracticeView';
import { LibraryView } from './views/LibraryView';
import { ProfileSettingsView } from './views/ProfileSettingsView';
import { ShopView } from './views/ShopView';
import { StatisticsView } from './views/StatisticsView';

function AppRouter() {
  const { user, loadingAuth, screen } = useApp();

  const renderBody = () => {
    if (loadingAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-[#0A0B0E]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-2 flex gap-0.5">
              <span className="flex-1 bg-black dark:bg-white rounded-xs" />
              <span className="flex-1 bg-[#DD0000] rounded-xs" />
              <span className="flex-1 bg-[#FFCE00] rounded-xs" />
            </div>
            <span className="text-xs font-mono-tabular text-neutral-500">SPRACHWERK</span>
          </div>
        </div>
      );
    }

    if (!user) {
      return <AuthView />;
    }

    const renderScreen = () => {
      switch (screen) {
        case 'home':
          return <HomeView />;
        case 'general_practice':
          return <GeneralPracticeView />;
        case 'lesson_practice':
          return <LessonPracticeView />;
        case 'library':
          return <LibraryView />;
        case 'statistics':
          return <StatisticsView />;
        case 'shop':
          return <ShopView />;
        case 'leaderboard':
          return <LeaderboardView />;
        case 'profile':
          return <ProfileSettingsView />;
        case 'admin':
          return user.role === 'admin' ? <AdminView /> : <HomeView />;
        default:
          return <HomeView />;
      }
    };

    return <Layout>{renderScreen()}</Layout>;
  };

  return (
    <MotionConfig reducedMotion={user?.reducedMotion ? 'always' : 'user'}>
      {renderBody()}
    </MotionConfig>
  );
}

export default function App() {
  useEffect(() => {
    registerSW({ immediate: true });
  }, []);

  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
