import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronRight, Layers, Search, SlidersHorizontal } from 'lucide-react';
import { PracticeParametersPanel } from '../components/PracticeEngine';
import { PracticeModeSwitch } from '../components/PracticeModeSwitch';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { apiRequest } from '../lib/api';
import type { Lesson } from '../types/domain';

export const LessonPracticeView: React.FC = () => {
  const { lang, selectedLessonIdForPractice, setSelectedLessonIdForPractice, setScreen, setSelectedLessonIdForDetail } =
    useApp();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [comingSoon, setComingSoon] = useState(false);
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
    if (selectedLessonIdForPractice) {
      setSelectedIds([selectedLessonIdForPractice]);
      setSubView('configure');
      setSelectedLessonIdForPractice(null);
    }
  }, [selectedLessonIdForPractice, setSelectedLessonIdForPractice]);

  useEffect(() => {
    let active = true;
    apiRequest<{ comingSoon: boolean; items: Lesson[] }>('/api/content/lessons')
      .then((res) => {
        if (!active) return;
        setComingSoon(res.comingSoon || res.items.length === 0);
        setLessons(res.items);
      })
      .catch(() => {
        if (active) setComingSoon(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (subView === 'configure') {
    return (
      <PracticeParametersPanel
        mode="lesson"
        intent="start"
        selectedLessons={selectedIds}
        onBack={() => setSubView('select')}
      />
    );
  }

  if (subView === 'defaults') {
    return (
      <PracticeParametersPanel
        mode="lesson"
        intent="defaults"
        onBack={() => setSubView('select')}
      />
    );
  }

  const filtered = lessons.filter((l) => {
    if (levelFilter !== 'ALL' && l.level !== levelFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return l.title_de.toLowerCase().includes(q) || l.topic.toLowerCase().includes(q);
    }
    return true;
  });

  const openLessonConfig = (id: string) => {
    setSelectedIds([id]);
    setSubView('configure');
  };

  return (
    <div className="space-y-6">
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

        <button
          type="button"
          onClick={() => setSubView('defaults')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#12141A] hover:border-neutral-900 dark:hover:border-white text-neutral-900 dark:text-white text-sm font-semibold transition-colors cursor-pointer min-h-[44px] whitespace-nowrap shrink-0"
        >
          <SlidersHorizontal size={16} />
          <span>{t(lang, 'configureDefaultsBtn')}</span>
        </button>
      </div>

      {/* Filters */}
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

      {loading ? (
        <div className="h-40 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] animate-pulse" />
      ) : comingSoon ? (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-6 sm:p-8 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#DD0000] dark:text-[#FFCE00] mb-3">
            <Layers size={15} />
            <span>{t(lang, 'comingSoonBadge')}</span>
          </div>
          <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-white mb-2">
            {t(lang, 'comingSoonDatasetTitle')}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {t(lang, 'comingSoonDatasetBody')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((lesson) => (
            <div
              key={lesson.id}
              className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] hover:border-[#DD0000] dark:hover:border-[#FFCE00]/70 p-4 flex items-center justify-between gap-3 transition-colors"
            >
              <button
                type="button"
                onClick={() => openLessonConfig(lesson.id)}
                className="flex-1 text-left cursor-pointer min-w-0"
              >
                <div className="text-xs font-mono-tabular text-neutral-500">
                  {lesson.level} · {t(lang, 'unitLabel')} {lesson.unit} · {lesson.topic}
                </div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5 break-words">
                  {lesson.title_de}
                </div>
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLessonIdForDetail(lesson.id);
                    setScreen('library');
                  }}
                  title={t(lang, 'viewLessonExplanation')}
                  aria-label={t(lang, 'viewLessonExplanation')}
                  className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <BookOpen size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => openLessonConfig(lesson.id)}
                  aria-label={t(lang, 'practiceThisLessonBtn')}
                  className="p-1.5 rounded-lg text-neutral-400 group-hover:text-[#DD0000] dark:group-hover:text-[#FFCE00] cursor-pointer min-h-[40px] flex items-center justify-center transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
