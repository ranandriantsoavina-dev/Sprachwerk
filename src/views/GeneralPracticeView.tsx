import React, { useState } from 'react';
import { BookMarked, ChevronRight, Layers, SlidersHorizontal } from 'lucide-react';
import { FlashcardEnginePanel, PracticeParametersPanel } from '../components/PracticeEngine';
import { PracticeModeSwitch } from '../components/PracticeModeSwitch';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';

const GENERAL_TOPICS = [
  { id: 'kasus', titleKey: 'topicKasusTitle', descKey: 'topicKasusDesc' },
  { id: 'verbs', titleKey: 'topicVerbsTitle', descKey: 'topicVerbsDesc' },
  { id: 'pronouns', titleKey: 'topicPronounsTitle', descKey: 'topicPronounsDesc' },
  { id: 'adjectives', titleKey: 'topicAdjectivesTitle', descKey: 'topicAdjectivesDesc' },
  { id: 'sentence_structure', titleKey: 'topicSentenceTitle', descKey: 'topicSentenceDesc' },
  { id: 'mixed', titleKey: 'topicMixedTitle', descKey: 'topicMixedDesc' },
];

export const GeneralPracticeView: React.FC = () => {
  const { lang } = useApp();
  const [activeTopic, setActiveTopic] = useState<string>('mixed');
  const [subView, setSubView] = useState<'select' | 'configure' | 'defaults' | 'flashcards'>('select');

  const openCategoryConfig = (topicId: string) => {
    setActiveTopic(topicId);
    setSubView('configure');
  };

  if (subView === 'configure') {
    const topicMeta = GENERAL_TOPICS.find((item) => item.id === activeTopic);
    return (
      <PracticeParametersPanel
        mode="general"
        intent="start"
        selectedTopics={[activeTopic]}
        topicTitle={topicMeta ? t(lang, topicMeta.titleKey) : undefined}
        onBack={() => setSubView('select')}
      />
    );
  }

  if (subView === 'defaults') {
    return (
      <PracticeParametersPanel
        mode="general"
        intent="defaults"
        onBack={() => setSubView('select')}
      />
    );
  }

  if (subView === 'flashcards') {
    return <FlashcardEnginePanel onBack={() => setSubView('select')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 dark:text-white min-w-0">
              {t(lang, 'generalPracticeTitle')}
            </h2>
            <PracticeModeSwitch mode="general" />
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
            {t(lang, 'generalPracticeDesc')}
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

      {/* Grammar Topics Grid (Single-Tap Direct to Configuration) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GENERAL_TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => openCategoryConfig(topic.id)}
            className="group text-left rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] hover:border-[#DD0000] dark:hover:border-[#FFCE00]/70 p-5 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-base font-display font-bold text-neutral-900 dark:text-white">
                {t(lang, topic.titleKey)}
              </span>
              <ChevronRight
                size={16}
                className="text-neutral-400 group-hover:text-[#DD0000] dark:group-hover:text-[#FFCE00] transition-colors shrink-0"
              />
            </div>
            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
              {t(lang, topic.descKey)}
            </p>
          </button>
        ))}
      </div>

      {/* Separate Vocabulary Flashcards Card per PDF Section 3 & 4 */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            <BookMarked size={14} />
            <span>{t(lang, 'vocabSeparateLabel')}</span>
          </div>
          <h3 className="text-lg font-display font-bold text-neutral-900 dark:text-white">
            {t(lang, 'vocabFlashcardsTitle')}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {t(lang, 'vocabFlashcardsDesc')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSubView('flashcards')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:opacity-90 cursor-pointer min-h-[44px] whitespace-nowrap shrink-0"
        >
          <Layers size={16} />
          <span>{t(lang, 'launchFlashcards')}</span>
        </button>
      </div>
    </div>
  );
};
