import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { MOTION_SPRING, useMotionPreference } from '../lib/motion';

interface PracticeModeSwitchProps {
  mode: 'general' | 'lesson';
}

export const PracticeModeSwitch: React.FC<PracticeModeSwitchProps> = ({ mode }) => {
  const { lang, setScreen } = useApp();
  const reduced = useMotionPreference();
  const isLesson = mode === 'lesson';

  const handleToggle = () => {
    setScreen(isLesson ? 'general_practice' : 'lesson_practice');
  };

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={isLesson}
      aria-label={isLesson ? t(lang, 'switchToGeneralMode') : t(lang, 'switchToLessonMode')}
      onClick={handleToggle}
      whileTap={reduced ? undefined : { scale: 0.96 }}
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
        <motion.span
          animate={{ x: isLesson ? 22 : 3 }}
          transition={reduced ? { duration: 0.01 } : MOTION_SPRING.snappy}
          className="inline-block h-4 w-4 rounded-full bg-white shadow-xs"
        />
      </span>
    </motion.button>
  );
};
