import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Dumbbell,
  Layers,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LESSONS_CATALOG, LEVEL_STRUCTURE, formatLessonNumber } from '../data/lessonsCatalog';
import { t } from '../i18n/translations';
import { apiRequest } from '../lib/api';
import type { Lesson } from '../types/domain';

export const LibraryView: React.FC = () => {
  const {
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
    const levelMeta = LEVEL_STRUCTURE.find((s) => s.level === activeLesson.level);

    // Placeholder view when lesson content is not yet populated
    if (!activeLesson.hasContent) {
      return (
        <div className="max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setActiveLesson(null)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white cursor-pointer min-h-[40px]"
            >
              <ArrowLeft size={16} />
              <span>{t(lang, 'backToLibraryBtn')}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleBookmark(activeLesson)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] text-xs font-medium cursor-pointer min-h-[40px]"
            >
              {activeLesson.progress?.bookmarked ? (
                <BookmarkCheck size={15} className="text-[#DD0000]" />
              ) : (
                <Bookmark size={15} />
              )}
              <span>{t(lang, 'bookmarkBtn')}</span>
            </button>
          </div>

          <article className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-6 sm:p-8 space-y-6">
            <header className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
              <div className="text-xs font-mono-tabular font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
                {levelMeta ? levelMeta.title : activeLesson.level} · #{formatLessonNumber(activeLesson.unit)}
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 dark:text-white">
                {activeLesson.title_de}
              </h2>
            </header>

            <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 p-6 sm:p-8 text-center space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#DD0000]/10 text-[#DD0000] dark:text-[#FFCE00] mb-1">
                <Layers size={20} />
              </div>
              <p className="text-base font-display font-semibold text-neutral-900 dark:text-white">
                Lesson content coming soon
              </p>
            </div>
          </article>
        </div>
      );
    }

    const hasLangExp = Boolean(activeLesson.explanation_i18n[lang]);
    const explanationText =
      activeLesson.explanation_i18n[lang] ||
      activeLesson.explanation_i18n.en ||
      activeLesson.explanation_i18n.de ||
      activeLesson.explanation_i18n.fr ||
      '';
    const fallbackLang = hasLangExp
      ? null
      : activeLesson.explanation_i18n.en
      ? 'English'
      : activeLesson.explanation_i18n.de
      ? 'Deutsch'
      : 'Français';

    return (
      <div className="max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveLesson(null)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>{t(lang, 'backToLibraryBtn')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleBookmark(activeLesson)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-medium cursor-pointer"
            >
              {activeLesson.progress?.bookmarked ? <BookmarkCheck size={15} className="text-[#DD0000]" /> : <Bookmark size={15} />}
              <span>{t(lang, 'bookmarkBtn')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLessonIdForPractice(activeLesson.id);
                setScreen('lesson_practice');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#DD0000] text-white text-xs font-semibold cursor-pointer"
            >
              <Dumbbell size={14} />
              <span>{t(lang, 'practiceLessonBtn')}</span>
            </button>
          </div>
        </div>

        {/* 1. Lesson Header (canonical German title preserved) */}
        <article className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-6 sm:p-8 space-y-8">
          <header className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
            <div className="text-xs font-mono-tabular text-neutral-500 mb-2">
              {activeLesson.level} · #{formatLessonNumber(activeLesson.unit)} · {activeLesson.topic}
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 dark:text-white">
              {activeLesson.title_de}
            </h2>
            {activeLesson.objectives?.[lang] && (
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
                {activeLesson.objectives[lang]}
              </p>
            )}
          </header>

          {/* 2. Explanation */}
          <section className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white">
                {t(lang, 'explanationHeading')}
              </h3>
              {fallbackLang && (
                <span className="text-xs text-neutral-500">
                  {t(lang, 'fallbackShownIn')} {fallbackLang} ({t(lang, 'defaultAuthoredNote')})
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
              {explanationText}
            </p>
          </section>

          {/* 3. Form and rules */}
          {activeLesson.rules.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white">
                {t(lang, 'formAndRulesHeading')}
              </h3>
              <div className="space-y-2">
                {activeLesson.rules.map((r, i) => (
                  <div key={i} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">{r.title}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">{r.body}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. German examples */}
          {activeLesson.examples_de.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white">
                {t(lang, 'germanExamplesHeading')}
              </h3>
              <ul className="space-y-2">
                {activeLesson.examples_de.map((ex, i) => (
                  <li key={i} className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-sm">
                    <span className="font-medium text-neutral-900 dark:text-white">{ex.sentence}</span>
                    {ex.note && <span className="block text-xs text-neutral-500 mt-1">{ex.note}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 5. Common mistakes */}
          {activeLesson.common_mistakes.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white">
                {t(lang, 'commonMistakesHeading')}
              </h3>
              <div className="space-y-2">
                {activeLesson.common_mistakes.map((m, i) => (
                  <div key={i} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-sm space-y-1">
                    <div className="text-[#DD0000]">{t(lang, 'incorrectLabel')}: {m.wrong}</div>
                    <div className="text-emerald-700 dark:text-emerald-400">{t(lang, 'correctLabel')}: {m.right}</div>
                    <div className="text-neutral-600 dark:text-neutral-400">
                      {m.explanation_i18n[lang] || m.explanation_i18n.en || ''}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6 & 7. Mark Reviewed / Practice */}
          <footer className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => markLessonComplete(activeLesson)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold cursor-pointer min-h-[44px]"
            >
              <CheckCircle2 size={16} />
              <span>{t(lang, 'markLessonReviewedBtn')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedLessonIdForPractice(activeLesson.id);
                setScreen('lesson_practice');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DD0000] text-white text-sm font-semibold cursor-pointer min-h-[44px]"
            >
              <Dumbbell size={16} />
              <span>{t(lang, 'practiceThisLessonBtn')}</span>
            </button>
          </footer>
        </article>
      </div>
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
