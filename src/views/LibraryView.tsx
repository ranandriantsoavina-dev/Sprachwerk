import React, { useEffect, useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LESSONS_CATALOG, LEVEL_STRUCTURE, formatLessonNumber } from '../data/lessonsCatalog';
import { t } from '../i18n/translations';
import { apiRequest } from '../lib/api';
import type { Lesson } from '../types/domain';
import { LessonDetailView } from '../components/lesson/LessonDetailView';

export const LibraryView: React.FC = () => {
  const {
    user,
    lang,
    setScreen,
    setSelectedLessonIdForPractice,
    selectedLessonIdForDetail,
    setSelectedLessonIdForDetail,
    refreshUser,
    pushToast,
  } = useApp();

  const [lessons, setLessons] = useState<Lesson[]>(LESSONS_CATALOG);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const loadLessons = async () => {
    try {
      const res = await apiRequest<{ comingSoon: boolean; items: Lesson[] }>('/api/content/lessons');
      const items = res.items.length > 0 ? res.items : LESSONS_CATALOG;
      setLessons(items);
      if (selectedLessonIdForDetail) {
        const found = items.find((l) => l.id === selectedLessonIdForDetail);
        if (found) setActiveLesson(found);
        setSelectedLessonIdForDetail(null);
      } else if (activeLesson) {
        const synced = items.find((l) => l.id === activeLesson.id);
        if (synced) setActiveLesson(synced);
      }
    } catch {
      setLessons(LESSONS_CATALOG);
      if (selectedLessonIdForDetail) {
        const found = LESSONS_CATALOG.find((l) => l.id === selectedLessonIdForDetail);
        if (found) setActiveLesson(found);
        setSelectedLessonIdForDetail(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleBookmark = async (lesson: Lesson) => {
    const next = !(lesson.progress?.bookmarked);
    try {
      await apiRequest(`/api/lessons/${lesson.id}/bookmark`, {
        method: 'POST',
        body: { bookmarked: next },
      });
      await loadLessons();
      if (activeLesson?.id === lesson.id) {
        setActiveLesson({
          ...lesson,
          progress: {
            bookmarked: next ? 1 : 0,
            first_completed_at: lesson.progress?.first_completed_at || null,
            review_count: lesson.progress?.review_count || 0,
          },
        });
      }
    } catch {
      pushToast('Unable to update bookmark.', 'error');
    }
  };

  const markLessonComplete = async (lesson: Lesson) => {
    try {
      const res = await apiRequest<{ xpAwarded: number; coinsAwarded: number }>(
        `/api/lessons/${lesson.id}/complete`,
        { method: 'POST' }
      );
      await refreshUser();
      await loadLessons();
      if (res.xpAwarded > 0) {
        pushToast(`Lesson recorded: +${res.xpAwarded} XP, +${res.coinsAwarded} coins`, 'reward');
      }
    } catch {
      pushToast('Could not mark lesson complete.', 'error');
    }
  };

  if (activeLesson) {
    return (
      <LessonDetailView
        lesson={activeLesson}
        allLessons={lessons}
        lang={lang}
        reducedMotion={Boolean(user?.reducedMotion)}
        onBackToLibrary={() => setActiveLesson(null)}
        onFilterLevel={(lvl) => {
          setLevelFilter(lvl);
          setActiveLesson(null);
        }}
        onSelectLesson={(nextLesson) => setActiveLesson(nextLesson)}
        onToggleBookmark={toggleBookmark}
        onMarkReviewed={markLessonComplete}
        onPracticeLesson={(lessonId) => {
          setSelectedLessonIdForPractice(lessonId);
          setScreen('lesson_practice');
        }}
      />
    );
  }

  const filtered = lessons.filter((l) => {
    if (levelFilter !== 'ALL' && l.level !== levelFilter) return false;
    if (bookmarkedOnly && !l.progress?.bookmarked) return false;
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
          {t(lang, 'libraryTitle')}
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
          {t(lang, 'libraryDesc')}
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex flex-wrap gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 max-w-full">
          {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                levelFilter === lvl
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {lvl === 'ALL' ? t(lang, 'allLevels') : lvl}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setBookmarkedOnly((b) => !b)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer min-h-[40px] ${
            bookmarkedOnly
              ? 'border-[#DD0000] bg-[#DD0000]/10 text-[#DD0000] dark:text-white'
              : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300'
          }`}
        >
          <Bookmark size={14} />
          <span>{t(lang, 'bookmarkedOnly')}</span>
        </button>

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
        <div className="h-44 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] animate-pulse" />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-8 text-center space-y-3">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            No lessons match the current filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setLevelFilter('ALL');
              setBookmarkedOnly(false);
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

                {/* Lessons Grid for Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sectionLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] hover:border-[#DD0000] dark:hover:border-[#FFCE00]/70 transition-colors flex items-stretch"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveLesson(lesson)}
                        className="flex-1 text-left p-4 sm:p-5 pr-11 cursor-pointer min-w-0"
                      >
                        <div className="flex items-center gap-2 text-xs font-mono-tabular text-neutral-500 dark:text-neutral-400 mb-1.5">
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {formatLessonNumber(lesson.unit)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{lesson.level}</span>
                          <span aria-hidden="true">·</span>
                          {lesson.hasContent ? (
                            <span className="font-sans font-semibold text-emerald-700 dark:text-emerald-400">
                              {t(lang, 'lessonAvailableLabel')}
                            </span>
                          ) : (
                            <span className="font-sans font-semibold text-[#DD0000] dark:text-red-400">
                              {t(lang, 'lessonComingSoonLabel')}
                            </span>
                          )}
                        </div>
                        <div className="text-sm sm:text-base font-display font-bold text-neutral-900 dark:text-white break-words leading-snug">
                          {lesson.title_de}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(lesson);
                        }}
                        title={t(lang, 'bookmarkBtn')}
                        aria-label={t(lang, 'bookmarkBtn')}
                        className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-neutral-400 hover:text-[#DD0000] dark:hover:text-[#FFCE00] cursor-pointer"
                      >
                        {lesson.progress?.bookmarked ? (
                          <BookmarkCheck size={15} className="text-[#DD0000]" />
                        ) : (
                          <Bookmark size={15} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
