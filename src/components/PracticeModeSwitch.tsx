import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';

interface PracticeModeSwitchProps {
  mode: 'general' | 'lesson';
}

export const PracticeModeSwitch: React.FC<PracticeModeSwitchProps> = ({ mode }) => {
  const { lang, setScreen } = useApp();
  const isLesson = mode === 'lesson';

  const handleToggle = () => {
    setScreen(isLesson ? 'general_practice' : 'lesson_practice');
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLesson}
      aria-label={isLesson ? t(lang, 'switchToGeneralMode') : t(lang, 'switchToLessonMode')}
      onClick={handleToggle}
      className="lg:hidden inline-flex items-center gap-2 shrink-0 cursor-pointer py-1 select-none"
    >
      <span
        className={`text-[11px] font-semibold whitespace-nowrap transition-colors ${
          isLesson
            ? 'text-[#DD0000] dark:text-[#FFCE00]'
            : 'text-neutral-600 dark:text-neutral-400'
        }`}
      >
        {t(lang, 'lessonModeShort')}
      </span>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
          isLesson
            ? 'bg-[#DD0000] border-[#DD0000]'
            : 'bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-xs transition-transform ${
            isLesson ? 'translate-x-[22px]' : 'translate-x-[3px]'
          }`}
        />
      </span>
    </button>
  );
};
