import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { PracticeParametersPanel } from '../components/PracticeEngine';
import { PracticeModeSwitch } from '../components/PracticeModeSwitch';
import { useIsMobileViewport } from '../components/motion/MotionPrimitives';
import { useApp } from '../context/AppContext';
import { LESSONS_CATALOG, LEVEL_STRUCTURE, formatLessonNumber } from '../data/lessonsCatalog';
import { QUESTIONS_CATALOG } from '../data/questionsCatalog';
import { t } from '../i18n/translations';
import { apiRequest } from '../lib/api';
import {
  MOTION_SPRING,
  createSlideUpVariants,
  createStaggerContainerVariants,
  createStaggerItemVariants,
  useMotionPreference,
} from '../lib/motion';
import type { Lesson } from '../types/domain';

const LOCAL_PRACTICE_LESSON_IDS = new Set(
  QUESTIONS_CATALOG.flatMap((q) => q.lesson_ids)
);

function hasLessonPractice(lesson?: Lesson): boolean {
  if (!lesson) return false;
  return lesson.hasPractice ?? LOCAL_PRACTICE_LESSON_IDS.has(lesson.id);
}

export const LessonPracticeView: React.FC = () => {
  const { lang, selectedLessonIdForPractice, setSelectedLessonIdForPractice } = useApp();
  const reducedMotion = useMotionPreference();
  const isMobile = useIsMobileViewport(768);

  const [lessons, setLessons] = useState<Lesson[]>(LESSONS_CATALOG);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    selectedLessonIdForPractice ? [selectedLessonIdForPractice] : []
  );
  const [subView, setSubView] = useState<'select' | 'configure' | 'defaults'>(() =>
    selectedLessonIdForPractice ? 'configure' : 'select'
  );

  useEffect(() => {
    let active = true;
    apiRequest<{ comingSoon: boolean; items: Lesson[] }>('/api/content/lessons')
      .then((res) => {
        if (!active) return;
        const items = res.items.length > 0 ? res.items : LESSONS_CATALOG;
        setLessons(items);
      })
      .catch(() => {
        if (active) setLessons(LESSONS_CATALOG);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (selectedLessonIdForPractice) {
      setSelectedIds([selectedLessonIdForPractice]);
      setSubView('configure');
      setSelectedLessonIdForPractice(null);
    }
  }, [selectedLessonIdForPractice, setSelectedLessonIdForPractice]);

  const filtered = lessons.filter((l) => {
    if (levelFilter !== 'ALL' && l.level !== levelFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const num = formatLessonNumber(l.unit);
      return (
        (l.title_en || '').toLowerCase().includes(q) ||
        l.title_de.toLowerCase().includes(q) ||
        l.topic.toLowerCase().includes(q) ||
        num.includes(q)
      );
    }
    return true;
  });

  const visibleLevels = LEVEL_STRUCTURE.filter(
    (section) => levelFilter === 'ALL' || section.level === levelFilter
  );

  const openLessonConfig = (id: string) => {
    setSelectedIds([id]);
    setSubView('configure');
  };

  const viewVariants = createSlideUpVariants(reducedMotion, isMobile ? 6 : 10);
  const gridVariants = createStaggerContainerVariants(isMobile ? 0.02 : 0.028, 0.01);
  const cardVariants = createStaggerItemVariants(reducedMotion, isMobile ? 4 : 8);

  const selectedLesson = lessons.find((l) => l.id === selectedIds[0]);
  const lessonTitle = selectedLesson
    ? `${selectedLesson.level} · #${formatLessonNumber(selectedLesson.unit)} · ${selectedLesson.title_de}`
    : undefined;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {subView === 'configure' ? (
        <motion.div
          key="lp-configure"
          variants={viewVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <PracticeParametersPanel
            mode="lesson"
            intent="start"
            selectedLessons={selectedIds}
            lessonTitle={lessonTitle}
            lessonHasContent={Boolean(selectedLesson?.hasContent)}
            lessonHasPractice={hasLessonPractice(selectedLesson)}
            onBack={() => setSubView('select')}
          />
        </motion.div>
      ) : subView === 'defaults' ? (
        <motion.div
          key="lp-defaults"
          variants={viewVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <PracticeParametersPanel
            mode="lesson"
            intent="defaults"
            onBack={() => setSubView('select')}
          />
        </motion.div>
      ) : (
        <motion.div
          key="lp-select"
          variants={viewVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 dark:text-white min-w-0">
                  {t(lang, 'lessonPracticeTitle')}
                </h2>
                <PracticeModeSwitch mode="lesson" />
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                {t(lang, 'lessonPracticeDesc')}
              </p>
            </div>

            <motion.button
              type="button"
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              transition={MOTION_SPRING.snappy}
              onClick={() => setSubView('defaults')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#12141A] hover:border-neutral-900 dark:hover:border-white text-neutral-900 dark:text-white text-sm font-semibold transition-colors cursor-pointer min-h-[44px] whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal size={16} />
              <span>{t(lang, 'configureDefaultsBtn')}</span>
            </motion.button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex flex-wrap gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 max-w-full">
              {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
                const active = levelFilter === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevelFilter(lvl)}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      active
                        ? 'text-neutral-900 dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="lesson-practice-level-pill"
                        transition={MOTION_SPRING.snappy}
                        className="absolute inset-0 rounded-lg bg-white dark:bg-neutral-800 shadow-xs"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">
                      {lvl === 'ALL' ? t(lang, 'allLevels') : lvl}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3.5 top-3 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t(lang, 'searchPlaceholder')}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-[#DD0000]"
              />
            </div>
          </div>

          {loading && lessons.length === 0 ? (
            <div className="h-40 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] animate-pulse" />
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-8 text-center space-y-3">
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                No lessons match the current filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLevelFilter('ALL');
                  setSearch('');
                }}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-white cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {visibleLevels.map((section) => {
                const sectionLessons = filtered.filter((l) => l.level === section.level);
                if (sectionLessons.length === 0) return null;

                return (
                  <section key={section.level} className="space-y-3">
                    {/* Level Section Header */}
                    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-black dark:bg-white text-white dark:text-black text-xs font-mono-tabular font-bold">
                            {section.level}
                          </span>
                          <h3 className="text-base sm:text-lg font-display font-bold text-neutral-900 dark:text-white">
                            {section.title}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1.5">
                          {section.subtitle}
                        </p>
                      </div>
                      <div className="text-xs font-mono-tabular font-semibold text-[#DD0000] dark:text-[#FFCE00] whitespace-nowrap shrink-0">
                        {sectionLessons.length === section.lessonCount
                          ? `${section.lessonCount} lessons`
                          : `${sectionLessons.length} / ${section.lessonCount} lessons`}
                      </div>
                    </div>

                    {/* Lessons List Grid for Level */}
                    <motion.div
                      variants={gridVariants}
                      initial="initial"
                      animate="animate"
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      {sectionLessons.map((lesson) => (
                        <motion.button
                          key={lesson.id}
                          type="button"
                          variants={cardVariants}
                          whileHover={reducedMotion || isMobile ? undefined : { y: -1 }}
                          whileTap={reducedMotion ? undefined : { scale: 0.985 }}
                          transition={MOTION_SPRING.snappy}
                          onClick={() => openLessonConfig(lesson.id)}
                          className="group text-left rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] hover:border-[#DD0000] dark:hover:border-[#FFCE00]/70 p-4 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 text-xs font-mono-tabular text-neutral-500 dark:text-neutral-400">
                              <span className="font-bold text-neutral-800 dark:text-neutral-200">
                                {formatLessonNumber(lesson.unit)}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{lesson.level}</span>
                              <span aria-hidden="true">·</span>
                              {hasLessonPractice(lesson) ? (
                                <span className="font-sans font-semibold text-emerald-700 dark:text-emerald-400">
                                  {t(lang, 'lessonAvailableLabel')}
                                </span>
                              ) : (
                                <span className="font-sans font-semibold text-[#DD0000] dark:text-red-400">
                                  {t(lang, 'lessonComingSoonLabel')}
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5 break-words">
                              {lesson.title_de}
                            </div>
                          </div>
                          <ChevronRight
                            size={16}
                            className="text-neutral-400 group-hover:text-[#DD0000] dark:group-hover:text-[#FFCE00] group-hover:translate-x-0.5 shrink-0 transition-all"
                          />
                        </motion.button>
                      ))}
                    </motion.div>
                  </section>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
