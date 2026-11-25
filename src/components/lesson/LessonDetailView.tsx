import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowLeftRight,
  BookOpen,
  Layers,
  ShieldCheck,
  Table2,
} from 'lucide-react';
import type { InterfaceLang, Lesson } from '../../types/domain';
import { t } from '../../i18n/translations';
import { LEVEL_STRUCTURE } from '../../data/lessonsCatalog';
import {
  createStaggerContainerVariants,
  createStaggerItemVariants,
} from '../../lib/motion';
import {
  extractPrerequisiteLinks,
  extractVocabularyItems,
  parseLessonExplanation,
} from '../../utils/lessonParser';
import { ResponsiveDataTable } from '../ResponsiveTable';
import { GrammarTransformationText } from './GrammarHighlight';
import {
  ComparisonContrastCard,
  ConceptSectionBlock,
  GermanExampleCard,
  GrammarColorLegend,
  ImportantRulePanel,
  LearningObjectivesCard,
  LessonDesktopTocRail,
  LessonFooterNav,
  LessonHeader,
  LessonSummaryCard,
  MistakeComparisonCard,
  PrerequisitesCard,
  VocabularyInteractiveStrip,
  type LessonTocItem,
} from './LessonBlocks';

export interface LessonDetailViewProps {
  lesson: Lesson;
  allLessons: Lesson[];
  lang: InterfaceLang;
  reducedMotion?: boolean;
  onBackToLibrary: () => void;
  onFilterLevel: (level: string) => void;
  onSelectLesson: (lesson: Lesson) => void;
  onToggleBookmark: (lesson: Lesson) => void;
  onMarkReviewed: (lesson: Lesson) => void;
  onPracticeLesson: (lessonId: string) => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  lesson,
  allLessons,
  lang,
  reducedMotion = false,
  onBackToLibrary,
  onFilterLevel,
  onSelectLesson,
  onToggleBookmark,
  onMarkReviewed,
  onPracticeLesson,
}) => {
  const levelMeta = LEVEL_STRUCTURE.find((s) => s.level === lesson.level);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState('');

  // Prev / Next lesson within the curriculum order
  const { prevLesson, nextLesson } = useMemo(() => {
    const idx = allLessons.findIndex((item) => item.id === lesson.id);
    return {
      prevLesson: idx > 0 ? allLessons[idx - 1] : null,
      nextLesson: idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
    };
  }, [allLessons, lesson.id]);

  // Language resolution with explicit fallback note
  const hasLangExp = Boolean(lesson.explanation_i18n[lang]);
  const explanationText =
    lesson.explanation_i18n[lang] ||
    lesson.explanation_i18n.en ||
    lesson.explanation_i18n.de ||
    lesson.explanation_i18n.fr ||
    '';
  const fallbackLang = hasLangExp
    ? null
    : lesson.explanation_i18n.en
    ? 'English'
    : lesson.explanation_i18n.de
    ? 'Deutsch'
    : 'Français';

  const introductionText =
    lesson.introduction_i18n?.[lang] ||
    lesson.introduction_i18n?.en ||
    lesson.introduction_i18n?.de ||
    '';
  const learningObjectives =
    lesson.learning_objectives_i18n?.[lang] ||
    lesson.learning_objectives_i18n?.en ||
    lesson.learning_objectives_i18n?.de ||
    [];
  const prerequisiteNote =
    lesson.prerequisite_knowledge_i18n?.[lang] ||
    lesson.prerequisite_knowledge_i18n?.en ||
    lesson.prerequisite_knowledge_i18n?.de ||
    '';
  const quickReview =
    lesson.quick_review_i18n?.[lang] ||
    lesson.quick_review_i18n?.en ||
    lesson.quick_review_i18n?.de;

  const parsedSections = useMemo(() => parseLessonExplanation(explanationText), [explanationText]);
  const prereqLinks = useMemo(
    () => extractPrerequisiteLinks(prerequisiteNote, allLessons),
    [prerequisiteNote, allLessons]
  );
  const vocabularyEntries = useMemo(
    () => extractVocabularyItems(lesson, lang),
    [lesson, lang]
  );

  // Build dynamic Table of Contents for both desktop rail & mobile jump bar
  const tocItems = useMemo<LessonTocItem[]>(() => {
    if (!lesson.hasContent) return [];
    const list: LessonTocItem[] = [];
    if (learningObjectives.length > 0 || introductionText) {
      list.push({ id: 'lesson-objectives', label: t(lang, 'objectivesHeading') });
    }
    for (const sec of parsedSections) {
      list.push({ id: sec.id, label: sec.title, number: sec.number });
    }
    if (lesson.rules.length > 0) {
      list.push({ id: 'lesson-rules', label: t(lang, 'formAndRulesHeading') });
    }
    if (lesson.tables && lesson.tables.length > 0) {
      list.push({ id: 'lesson-tables', label: t(lang, 'tablesHeading') });
    }
    if (lesson.examples_de.length > 0) {
      list.push({ id: 'lesson-examples', label: t(lang, 'germanExamplesHeading') });
    }
    if (lesson.usage_and_contrasts && lesson.usage_and_contrasts.length > 0) {
      list.push({ id: 'lesson-contrasts', label: t(lang, 'usageContrastsHeading') });
    }
    if (lesson.common_mistakes.length > 0) {
      list.push({ id: 'lesson-mistakes', label: t(lang, 'commonMistakesHeading') });
    }
    if (quickReview || (lesson.practice_mapping && lesson.practice_mapping.length > 0)) {
      list.push({ id: 'lesson-summary', label: t(lang, 'quickReviewHeading') });
    }
    return list;
  }, [
    lesson,
    lang,
    learningObjectives.length,
    introductionText,
    parsedSections,
    quickReview,
  ]);

  // Reset scroll to top cleanly when switching lessons
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    setActiveSectionId(tocItems[0]?.id || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  // Track reading scroll progress
  useEffect(() => {
    const updateProgress = () => {
      const docEl = document.documentElement;
      const maxScroll = Math.max(docEl.scrollHeight - window.innerHeight, 1);
      const pct = Math.min(100, Math.max(0, Math.round((window.scrollY / maxScroll) * 100)));
      setScrollProgress(pct);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [lesson.id]);

  // Track currently visible section via IntersectionObserver
  useEffect(() => {
    if (tocItems.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const elements = tocItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: 0.05 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [tocItems]);

  const handleJumpToSection = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      setActiveSectionId(id);
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    },
    [reducedMotion]
  );

  // Placeholder view when lesson content is not yet populated
  if (!lesson.hasContent) {
    return (
      <div className="max-w-[800px] w-full min-w-0 mx-auto space-y-6">
        <LessonHeader
          lesson={lesson}
          lang={lang}
          levelTitle={levelMeta?.title}
          onBack={onBackToLibrary}
          onFilterLevel={onFilterLevel}
          onToggleBookmark={() => onToggleBookmark(lesson)}
          onPractice={() => onPracticeLesson(lesson.id)}
        />

        <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#12141A] p-8 sm:p-10 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#DD0000]/10 text-[#DD0000] dark:text-[#FFCE00]">
            <Layers size={22} />
          </div>
          <p className="text-base font-display font-semibold text-neutral-900 dark:text-white">
            {t(lang, 'lessonComingSoonLabel')}
          </p>
        </div>

        <LessonFooterNav
          lang={lang}
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          onSelectLesson={onSelectLesson}
          onBackToLibrary={onBackToLibrary}
          onMarkReviewed={() => onMarkReviewed(lesson)}
          onPractice={() => onPracticeLesson(lesson.id)}
        />
      </div>
    );
  }

  const lessonStaggerContainer = useMemo(
    () => createStaggerContainerVariants(0.055, 0.02),
    []
  );
  const lessonStaggerItem = useMemo(
    () => createStaggerItemVariants(reducedMotion, 10),
    [reducedMotion]
  );

  return (
    <>
      {/* Subtle fixed reading progress hairline across top edge (zero layout space, compositor-only scaleX) */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 lg:left-64 right-0 h-[3px] z-30 pointer-events-none bg-transparent"
      >
        <div
          className="h-full w-full bg-[#DD0000] dark:bg-[#FFCE00] transition-transform duration-150 ease-out origin-left"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        />
      </div>

      <div className="w-full min-w-0 flex items-start justify-center gap-5 xl:gap-6 2xl:gap-8">
        {/* Main Centered Reading Column (optimal reading width on desktop) */}
        <motion.article
          key={lesson.id}
          variants={lessonStaggerContainer}
          initial={reducedMotion ? false : 'initial'}
          animate="animate"
          className="flex-1 max-w-[800px] w-full min-w-0 space-y-6"
        >
          {/* A. Educational Lesson Header */}
          <motion.div variants={lessonStaggerItem}>
            <LessonHeader
              lesson={lesson}
              lang={lang}
              levelTitle={levelMeta?.title}
              onBack={onBackToLibrary}
              onFilterLevel={onFilterLevel}
              onToggleBookmark={() => onToggleBookmark(lesson)}
              onPractice={() => onPracticeLesson(lesson.id)}
            />
          </motion.div>

          {/* B. Learning Objectives Card */}
          <motion.div variants={lessonStaggerItem}>
            <LearningObjectivesCard
              objectives={learningObjectives}
              lang={lang}
              introduction={introductionText}
            />
          </motion.div>

          {/* C. Prerequisites Card (with clickable lesson links) */}
          <motion.div variants={lessonStaggerItem}>
            <PrerequisitesCard
              text={prerequisiteNote}
              linkedLessons={prereqLinks}
              lang={lang}
              onSelectLesson={onSelectLesson}
            />
          </motion.div>

          {/* D. Core Explanation (Structured Concepts, Concept Cards, Prose, Callouts) */}
          {parsedSections.length > 0 && (
            <motion.section
              variants={lessonStaggerItem}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-7 space-y-6 min-w-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  <BookOpen size={14} className="text-[#DD0000] dark:text-[#FFCE00]" />
                  <span>{t(lang, 'explanationHeading')}</span>
                </div>
                {fallbackLang && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {t(lang, 'fallbackShownIn')} {fallbackLang} ({t(lang, 'defaultAuthoredNote')})
                  </span>
                )}
              </div>

              <GrammarColorLegend lang={lang} />

              <div className="space-y-7 divide-y divide-neutral-100 dark:divide-neutral-800/70">
                {parsedSections.map((sec) => (
                  <ConceptSectionBlock key={sec.id} section={sec} lang={lang} />
                ))}
              </div>
            </motion.section>
          )}

          {/* E. Important Rules */}
          {lesson.rules.length > 0 && (
            <section id="lesson-rules" className="scroll-mt-20 space-y-3.5 min-w-0">
              <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 shrink-0">
                  <ShieldCheck size={15} />
                </span>
                <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900 dark:text-white">
                  {t(lang, 'formAndRulesHeading')}
                </h3>
              </div>

              <div className="space-y-3">
                {lesson.rules.map((rule, idx) => (
                  <ImportantRulePanel key={rule.id || idx} rule={rule} lang={lang} />
                ))}
              </div>
            </section>
          )}

          {/* F. Grammar Reference Tables + Interactive Key Forms */}
          {lesson.tables && lesson.tables.length > 0 && (
            <section id="lesson-tables" className="scroll-mt-20 space-y-5 min-w-0">
              <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-sky-500/12 text-sky-700 dark:text-sky-400 shrink-0">
                  <Table2 size={15} />
                </span>
                <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900 dark:text-white">
                  {t(lang, 'tablesHeading')}
                </h3>
              </div>

              {lesson.tables.map((tbl) => {
                const tblTitle = tbl.title_i18n[lang] || tbl.title_i18n.en || tbl.title_i18n.de;
                const tblCaption = tbl.caption_i18n?.[lang] || tbl.caption_i18n?.en;
                const cols = tbl.columns_i18n[lang] || tbl.columns_i18n.en || tbl.columns_i18n.de;
                return (
                  <div
                    key={tbl.id}
                    className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-4 sm:p-5 space-y-3 min-w-0"
                  >
                    <div>
                      <h4 className="text-sm sm:text-base font-display font-bold text-neutral-900 dark:text-white">
                        {tblTitle}
                      </h4>
                      {tblCaption && (
                        <p className="text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {tblCaption}
                        </p>
                      )}
                    </div>
                    <ResponsiveDataTable
                      columns={cols}
                      rows={tbl.rows}
                      getCellClassName={(cell, _ri, ci) =>
                        `px-3.5 py-2.5 text-neutral-700 dark:text-neutral-300 ${
                          typeof cell === 'string' && cell.startsWith('[')
                            ? 'font-mono-tabular text-xs'
                            : ''
                        } ${ci === 0 ? 'font-semibold text-neutral-900 dark:text-white' : ''}`.trim()
                      }
                      renderCell={(cell) => {
                        if (typeof cell !== 'string') return cell;
                        if (cell.startsWith('[')) return cell;
                        if (
                          cell.includes('→') ||
                          /^(der|die|das|den|dem|ein|eine|einen|kein|keine|keinen|zu Hause|nach Hause|von zu Hause)\b/.test(
                            cell.trim()
                          ) ||
                          /\b(der|die|das|den|dem|ein|eine|im|ins|am|ans|zum|zur|beim|vom)\s+[A-ZÄÖÜ]/.test(
                            cell
                          )
                        ) {
                          return <GrammarTransformationText text={cell} compact />;
                        }
                        return cell;
                      }}
                    />
                  </div>
                );
              })}

              <VocabularyInteractiveStrip entries={vocabularyEntries} lang={lang} />
            </section>
          )}

          {/* G. Dedicated German Examples */}
          {lesson.examples_de.length > 0 && (
            <section id="lesson-examples" className="scroll-mt-20 space-y-3.5 min-w-0">
              <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-violet-500/12 text-violet-700 dark:text-violet-300 shrink-0">
                  <Layers size={15} />
                </span>
                <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900 dark:text-white">
                  {t(lang, 'germanExamplesHeading')}
                </h3>
              </div>

              <div className="space-y-3">
                {lesson.examples_de.map((ex, idx) => (
                  <GermanExampleCard
                    key={ex.id || idx}
                    example={ex}
                    index={idx}
                    lang={lang}
                  />
                ))}
              </div>
            </section>
          )}

          {/* H. Usage, Contrasts & Comparisons */}
          {lesson.usage_and_contrasts && lesson.usage_and_contrasts.length > 0 && (
            <section id="lesson-contrasts" className="scroll-mt-20 space-y-3.5 min-w-0">
              <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-sky-500/12 text-sky-700 dark:text-sky-400 shrink-0">
                  <ArrowLeftRight size={15} />
                </span>
                <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900 dark:text-white">
                  {t(lang, 'usageContrastsHeading')}
                </h3>
              </div>

              <div className="space-y-3">
                {lesson.usage_and_contrasts.map((item) => (
                  <ComparisonContrastCard key={item.id} item={item} lang={lang} />
                ))}
              </div>
            </section>
          )}

          {/* I. Common Mistakes & Warnings */}
          {lesson.common_mistakes.length > 0 && (
            <section id="lesson-mistakes" className="scroll-mt-20 space-y-3.5 min-w-0">
              <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#DD0000]/12 text-[#DD0000] dark:text-red-400 shrink-0">
                  <AlertTriangle size={15} />
                </span>
                <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900 dark:text-white">
                  {t(lang, 'commonMistakesHeading')}
                </h3>
              </div>

              <div className="space-y-3">
                {lesson.common_mistakes.map((mistake, idx) => (
                  <MistakeComparisonCard key={mistake.id || idx} mistake={mistake} lang={lang} />
                ))}
              </div>
            </section>
          )}

          {/* J. Final Summary & Practice Subskills */}
          <LessonSummaryCard
            quickReview={quickReview}
            practiceMapping={lesson.practice_mapping}
            lang={lang}
          />

          {/* K. Bottom Lesson Navigation */}
          <LessonFooterNav
            lang={lang}
            prevLesson={prevLesson}
            nextLesson={nextLesson}
            onSelectLesson={onSelectLesson}
            onBackToLibrary={onBackToLibrary}
            onMarkReviewed={() => onMarkReviewed(lesson)}
            onPractice={() => onPracticeLesson(lesson.id)}
          />
        </motion.article>

        {/* Desktop Sticky Table of Contents Rail (visible >= 1280px; never narrows main column) */}
        <LessonDesktopTocRail
          items={tocItems}
          activeId={activeSectionId}
          progressPct={scrollProgress}
          lang={lang}
          onJump={handleJumpToSection}
          onPractice={() => onPracticeLesson(lesson.id)}
          onMarkReviewed={() => onMarkReviewed(lesson)}
        />
      </div>
    </>
  );
};
