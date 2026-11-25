import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  BookMarked,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Dumbbell,
  Eye,
  EyeOff,
  GraduationCap,
  Layers,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Table2,
  Target,
  Volume2,
  XCircle,
} from 'lucide-react';
import type {
  InterfaceLang,
  Lesson,
  LessonContrastItem,
  LessonExample,
  LessonMistake,
  LessonPracticeSubskill,
  LessonQuickReview,
  LessonRule,
} from '../../types/domain';
import { t } from '../../i18n/translations';
import { formatLessonNumber } from '../../data/lessonsCatalog';
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_SPRING,
  accordionVariants,
  useMotionPreference,
} from '../../lib/motion';
import {
  splitContrastPair,
  type ConceptCardItem,
  type ParsedExplanationSection,
  type VocabularyEntry,
} from '../../utils/lessonParser';
import { AnimatedProgressBar } from '../motion/MotionPrimitives';
import {
  GrammarPatternBadge,
  GrammarTransformationText,
  HighlightedGermanSentence,
} from './GrammarHighlight';

let cachedGermanVoices: SpeechSynthesisVoice[] = [];
let voicesListenerAttached = false;

function refreshVoiceCache(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedGermanVoices = voices;
  }
  return cachedGermanVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window && !voicesListenerAttached) {
  voicesListenerAttached = true;
  refreshVoiceCache();
  try {
    window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoiceCache);
  } catch {
    // Safari / older implementations may rely on onvoiceschanged
    window.speechSynthesis.onvoiceschanged = refreshVoiceCache;
  }
}

function pickGermanVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (!voices || voices.length === 0) return undefined;
  const scoreVoice = (v: SpeechSynthesisVoice): number => {
    const lang = (v.lang || '').replace('_', '-').toLowerCase();
    const name = (v.name || '').toLowerCase();
    const isDeLang = lang === 'de' || lang.startsWith('de-');
    const isDeName = /\b(german|deutsch)\b/.test(name);
    if (!isDeLang && !isDeName) return -1;

    let score = 10;
    if (lang === 'de-de') score += 30;
    else if (isDeLang) score += 15;
    if (/google\s*deutsch|natural|online|neural|wavenet|katja|hedda|conrad|amala|anna|helena|petra|markus|stefan|viktor/.test(name)) {
      score += 20;
    }
    if (!v.localService) score += 5;
    return score;
  };

  let best: SpeechSynthesisVoice | undefined;
  let bestScore = -1;
  for (const v of voices) {
    const s = scoreVoice(v);
    if (s > bestScore) {
      bestScore = s;
      best = v;
    }
  }
  return best;
}

function normalizeGermanSpeechText(text: string): string {
  return text
    .replace(/\s*→\s*/g, ', ')
    .replace(/\s*\/\s*/g, ', ')
    .replace(/\*+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function dispatchGermanUtterance(cleanText: string, voices: SpeechSynthesisVoice[]): void {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(cleanText);
  const deVoice = pickGermanVoice(voices);
  utterance.lang = deVoice?.lang ? deVoice.lang.replace('_', '-') : 'de-DE';
  if (deVoice) {
    utterance.voice = deVoice;
  }
  utterance.rate = 0.92;
  utterance.pitch = 1.0;

  if (synth.paused) {
    synth.resume();
  }
  synth.speak(utterance);
}

function speakGermanText(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const cleanText = normalizeGermanSpeechText(text);
  if (!cleanText) return;

  try {
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending) {
      synth.cancel();
    }

    const voices = refreshVoiceCache();
    if (voices.length > 0) {
      dispatchGermanUtterance(cleanText, voices);
      return;
    }

    // Voices load asynchronously on Chromium cold start; wait briefly for voiceschanged
    let spoken = false;
    const finish = () => {
      if (spoken) return;
      spoken = true;
      try {
        synth.removeEventListener?.('voiceschanged', finish);
      } catch {
        // ignore
      }
      dispatchGermanUtterance(cleanText, refreshVoiceCache());
    };

    try {
      synth.addEventListener?.('voiceschanged', finish, { once: true });
    } catch {
      // ignore
    }
    window.setTimeout(finish, 350);
  } catch {
    // Graceful no-op if speech synthesis is blocked
  }
}

export interface LessonTocItem {
  id: string;
  label: string;
  number?: string | null;
}

/* ============================================================================
   1. Lesson Header (Breadcrumb, Metadata, Hierarchy, Actions)
   ============================================================================ */
export const LessonHeader: React.FC<{
  lesson: Lesson;
  lang: InterfaceLang;
  levelTitle?: string;
  onBack: () => void;
  onFilterLevel?: (level: string) => void;
  onToggleBookmark: () => void;
  onPractice: () => void;
}> = ({
  lesson,
  lang,
  levelTitle,
  onBack,
  onFilterLevel,
  onToggleBookmark,
  onPractice,
}) => {
  const isCompleted = Boolean(lesson.progress?.first_completed_at);
  const reviewCount = lesson.progress?.review_count || 0;
  const isBookmarked = Boolean(lesson.progress?.bookmarked);
  const subtitle = lesson.objectives?.[lang] || lesson.objectives?.en || '';
  const difficultyLabel = t(lang, `cefrDifficulty_${lesson.level}`);

  return (
    <header className="space-y-4">
      {/* Breadcrumb & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer min-h-[36px] transition-colors"
          >
            <ArrowLeft size={14} className="shrink-0" />
            <span>{t(lang, 'lessonBreadcrumbHome')}</span>
          </button>
          <ChevronRight size={13} aria-hidden="true" className="text-neutral-400 shrink-0" />
          {onFilterLevel ? (
            <button
              type="button"
              onClick={() => onFilterLevel(lesson.level)}
              className="font-mono-tabular font-semibold text-neutral-700 dark:text-neutral-300 hover:text-[#DD0000] dark:hover:text-[#FFCE00] cursor-pointer"
            >
              {lesson.level}
            </button>
          ) : (
            <span className="font-mono-tabular font-semibold">{lesson.level}</span>
          )}
          <ChevronRight size={13} aria-hidden="true" className="text-neutral-400 shrink-0" />
          <span className="font-mono-tabular text-neutral-900 dark:text-neutral-100 font-semibold">
            {t(lang, 'lessonLabelPrefix')} {formatLessonNumber(lesson.unit)}
          </span>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            type="button"
            onClick={onToggleBookmark}
            whileTap={{ scale: 0.95 }}
            transition={MOTION_SPRING.snappy}
            aria-pressed={isBookmarked}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer min-h-[40px] transition-colors ${
              isBookmarked
                ? 'border-[#DD0000]/40 bg-[#DD0000]/8 text-[#DD0000] dark:text-[#FFCE00] dark:border-[#FFCE00]/40'
                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] text-neutral-700 dark:text-neutral-200 hover:border-neutral-400 dark:hover:border-neutral-600'
            }`}
          >
            <motion.span
              key={isBookmarked ? 'saved' : 'unsaved'}
              initial={{ scale: 0.75 }}
              animate={{ scale: 1 }}
              transition={MOTION_SPRING.pop}
              className="inline-flex"
            >
              {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            </motion.span>
            <span>{t(lang, 'bookmarkBtn')}</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={onPractice}
            whileTap={{ scale: 0.96 }}
            transition={MOTION_SPRING.snappy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DD0000] hover:bg-[#b80000] text-white text-xs font-semibold cursor-pointer min-h-[40px] transition-colors shadow-xs"
          >
            <Dumbbell size={14} />
            <span>{t(lang, 'practiceLessonBtn')}</span>
          </motion.button>
        </div>
      </div>

      {/* Main Educational Hero Card */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-7 space-y-4">
        {/* 1. Contextual metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-black font-mono-tabular font-bold">
            {lesson.level}
          </span>
          <span className="font-mono-tabular font-semibold text-neutral-500 dark:text-neutral-400">
            #{formatLessonNumber(lesson.unit)}
          </span>
          <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {lesson.topic}
          </span>
          {levelTitle && (
            <>
              <span aria-hidden="true" className="hidden sm:inline text-neutral-300 dark:text-neutral-700">·</span>
              <span className="hidden sm:inline text-neutral-500 dark:text-neutral-400 truncate max-w-[240px]">
                {levelTitle}
              </span>
            </>
          )}
        </div>

        {/* 2. Large readable title */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-display font-bold tracking-tight leading-tight text-neutral-900 dark:text-white text-balance">
            {lesson.title_de}
          </h2>
          {lang !== 'de' && lesson.title_en && (
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {lesson.title_en}
            </p>
          )}
        </div>

        {/* 3. Short introductory description */}
        {subtitle && (
          <p className="text-[15px] sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-200 max-w-[68ch]">
            {subtitle}
          </p>
        )}

        {/* 4. Compact information badges */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-600 dark:text-neutral-400">
          {lesson.estimated_study_minutes && (
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Clock size={14} className="text-neutral-400 shrink-0" />
              <span>
                {lesson.estimated_study_minutes} {t(lang, 'minutesUnit')}
              </span>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 font-medium">
            <GraduationCap size={14} className="text-neutral-400 shrink-0" />
            <span>{difficultyLabel}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 font-semibold ${
              isCompleted
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            <CheckCircle2 size={14} className="shrink-0" />
            <span>
              {isCompleted
                ? reviewCount > 1
                  ? `${t(lang, 'lessonCompletedBadge')} (${reviewCount}×)`
                  : t(lang, 'lessonCompletedBadge')
                : t(lang, 'lessonStatusOpen')}
            </span>
          </span>

          {lesson.tags && lesson.tags.length > 0 && (
            <span className="font-mono-tabular text-[11px] text-neutral-400 dark:text-neutral-500 ml-auto hidden sm:inline">
              {lesson.tags.join(' · ')}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

/* ============================================================================
   2. Learning Objectives Card
   ============================================================================ */
export const LearningObjectivesCard: React.FC<{
  objectives: string[];
  lang: InterfaceLang;
  introduction?: string;
}> = ({ objectives, lang, introduction }) => {
  if (objectives.length === 0 && !introduction) return null;

  return (
    <section
      id="lesson-objectives"
      className="scroll-mt-20 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/45 dark:bg-emerald-950/20 p-5 sm:p-6 space-y-4"
    >
      {introduction && (
        <p className="text-[15px] leading-[1.7] text-neutral-700 dark:text-neutral-200 max-w-[68ch]">
          {introduction}
        </p>
      )}

      {objectives.length > 0 && (
        <div className={introduction ? 'pt-3 border-t border-emerald-200/60 dark:border-emerald-900/50 space-y-3' : 'space-y-3'}>
          <h3 className="text-sm font-display font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-600/15 dark:bg-emerald-400/15 text-emerald-700 dark:text-emerald-300 shrink-0">
              <Target size={14} />
            </span>
            <span>{t(lang, 'objectivesHeading')}</span>
          </h3>

          <ul className="divide-y divide-emerald-200/50 dark:divide-emerald-900/40">
            {objectives.map((obj, idx) => (
              <li key={idx} className="py-2 first:pt-0 last:pb-0 flex items-start gap-2.5 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-600/12 dark:bg-emerald-400/15 text-emerald-700 dark:text-emerald-300 shrink-0">
                  <Check size={12} strokeWidth={2.5} />
                </span>
                <span className="min-w-0 break-words">{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

/* ============================================================================
   3. Prerequisites Card (with clickable internal lesson navigation)
   ============================================================================ */
export const PrerequisitesCard: React.FC<{
  text: string;
  linkedLessons: Lesson[];
  lang: InterfaceLang;
  onSelectLesson: (lesson: Lesson) => void;
}> = ({ text, linkedLessons, lang, onSelectLesson }) => {
  if (!text) return null;

  return (
    <section
      aria-label={t(lang, 'requiredKnowledgeHeading')}
      className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col gap-2.5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300 shrink-0">
          <BookOpen size={15} />
        </span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="text-xs font-display font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {t(lang, 'requiredKnowledgeHeading')}
          </div>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {text}
          </p>
          {linkedLessons.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {linkedLessons.map((ref) => (
                <button
                  key={ref.id}
                  type="button"
                  onClick={() => onSelectLesson(ref)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#12141A] hover:border-[#DD0000] dark:hover:border-[#FFCE00] text-xs font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer transition-colors min-h-[34px]"
                >
                  <span className="font-mono-tabular font-bold text-[#DD0000] dark:text-[#FFCE00]">
                    {ref.level}-{formatLessonNumber(ref.unit)}
                  </span>
                  <span className="truncate max-w-[200px]">{ref.title_de}</span>
                  <ArrowRight size={12} className="text-neutral-400 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
   4. Grammar Color Key Legend (slim, subtle visual decoder)
   ============================================================================ */
export const GrammarColorLegend: React.FC<{ lang: InterfaceLang }> = ({ lang }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3.5 py-2 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/35 text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-xs bg-sky-600 dark:bg-sky-400" aria-hidden="true" />
      <span>{t(lang, 'grammarKeyArticles')}</span>
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-xs bg-violet-600 dark:bg-violet-400" aria-hidden="true" />
      <span>{t(lang, 'grammarKeyEndings')}</span>
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-xs bg-amber-600 dark:bg-amber-400" aria-hidden="true" />
      <span>{t(lang, 'grammarKeyUmlaut')}</span>
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-xs bg-emerald-600 dark:bg-emerald-400" aria-hidden="true" />
      <span>{t(lang, 'grammarKeyRules')}</span>
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-xs bg-[#DD0000]" aria-hidden="true" />
      <span>{t(lang, 'grammarKeyExceptions')}</span>
    </span>
  </div>
);

/* ============================================================================
   5. Structured Concept Explanation Section & Concept Group Cards
   ============================================================================ */
const ConceptGroupCard: React.FC<{
  item: ConceptCardItem;
  index: number;
  lang: InterfaceLang;
}> = ({ item, index, lang }) => {
  const badgeText = item.groupTag || String(index + 1).padStart(2, '0');

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 space-y-3 transition-colors ${
        item.hasWarning
          ? 'border-amber-200/90 dark:border-amber-900/50 bg-amber-50/25 dark:bg-amber-950/10'
          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A]'
      }`}
    >
      {/* Card Header */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-mono-tabular text-[11px] font-bold tracking-wide">
          {badgeText}
        </span>

        {item.title && item.title.toUpperCase() !== badgeText && (
          <h4 className="text-sm sm:text-[15px] font-display font-bold text-neutral-900 dark:text-white break-words">
            <GrammarTransformationText text={item.title} mode="prose" compact />
          </h4>
        )}

        {item.patternBadge && <GrammarPatternBadge pattern={item.patternBadge} />}
      </div>

      {/* Explanation Body */}
      {item.body && (
        <p className="text-sm sm:text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300 break-words">
          <GrammarTransformationText text={item.body} mode="prose" compact />
        </p>
      )}

      {/* Sub-items (when bullet has nested sub-entries) */}
      {item.subItems && item.subItems.length > 0 && (
        <ul className="space-y-1.5 pl-3 border-l-2 border-neutral-200 dark:border-neutral-700">
          {item.subItems.map((sub, si) => (
            <li key={si} className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 break-words">
              <GrammarTransformationText text={sub} mode="prose" compact />
            </li>
          ))}
        </ul>
      )}

      {/* Dedicated Visual German Examples Strip */}
      {item.examples.length > 0 && (
        <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap gap-2">
          {item.examples.map((ex, ei) => (
            <div
              key={ei}
              className="inline-flex items-center gap-1.5 max-w-full min-w-0 px-3 py-1.5 rounded-lg border border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-900/70 break-words"
            >
              <GrammarTransformationText text={ex} compact />
              {typeof window !== 'undefined' && 'speechSynthesis' in window && (
                <button
                  type="button"
                  onClick={() => speakGermanText(ex.replace(/→/g, ', '))}
                  aria-label={`${t(lang, 'listenBtn')}: ${ex}`}
                  title={t(lang, 'listenBtn')}
                  className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer shrink-0"
                >
                  <Volume2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ConceptSectionBlock: React.FC<{
  section: ParsedExplanationSection;
  lang: InterfaceLang;
}> = ({ section, lang }) => {
  return (
    <section
      id={section.id}
      className="scroll-mt-20 pt-6 first:pt-0 space-y-4"
    >
      {/* Section Heading with Numbered Step Indicator */}
      <div className="flex items-center gap-3 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
        {section.number ? (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#DD0000]/10 dark:bg-[#FFCE00]/15 text-[#DD0000] dark:text-[#FFCE00] font-mono-tabular text-xs font-bold shrink-0">
            {section.number.padStart(2, '0')}
          </span>
        ) : (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0">
            <Layers size={14} />
          </span>
        )}
        <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900 dark:text-white tracking-tight">
          {section.title}
        </h3>
      </div>

      {/* Blocks */}
      <div className="space-y-3.5">
        {section.blocks.map((block, bIdx) => {
          if (block.kind === 'prose') {
            return (
              <p
                key={bIdx}
                className="text-[15px] sm:text-base leading-[1.72] text-neutral-700 dark:text-neutral-300 max-w-[68ch] whitespace-pre-line break-words"
              >
                <GrammarTransformationText text={block.text} mode="prose" />
              </p>
            );
          }

          if (block.kind === 'comparison') {
            return (
              <div
                key={bIdx}
                className="rounded-xl border border-sky-200/80 dark:border-sky-900/50 bg-sky-50/45 dark:bg-sky-950/20 px-4 py-3.5 space-y-1"
              >
                <div className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-sky-800 dark:text-sky-300">
                  <ArrowLeftRight size={13} />
                  <span>{block.label}</span>
                </div>
                <p className="text-sm sm:text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200 break-words">
                  <GrammarTransformationText text={block.text} mode="prose" />
                </p>
              </div>
            );
          }

          if (block.kind === 'warning') {
            return (
              <AttentionWarningPanel key={bIdx} label={t(lang, 'attentionLabel')} text={block.text} />
            );
          }

          if (block.kind === 'tip') {
            return (
              <LearningTipPanel key={bIdx} label={t(lang, 'learningTipLabel')} text={block.text} />
            );
          }

          if (block.kind === 'concept-cards') {
            return (
              <div key={bIdx} className="space-y-3">
                {block.items.map((item, ii) => (
                  <ConceptGroupCard key={ii} item={item} index={ii} lang={lang} />
                ))}
              </div>
            );
          }

          // Clean concise bullet-list
          return (
            <ul key={bIdx} className="space-y-2.5 pl-1">
              {block.items.map((item, ii) => (
                <li key={ii} className="flex items-start gap-2.5 text-[15px] leading-[1.65] text-neutral-700 dark:text-neutral-300 max-w-[68ch]">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#DD0000] dark:bg-[#FFCE00] shrink-0"
                  />
                  <span className="min-w-0 break-words">
                    <GrammarTransformationText text={item} mode="prose" />
                  </span>
                </li>
              ))}
            </ul>
          );
        })}
      </div>
    </section>
  );
};

/* ============================================================================
   6. Reusable Educational Callout Panels (Rule, Warning, Tip)
   ============================================================================ */
export const ImportantRulePanel: React.FC<{
  rule: LessonRule;
  lang: InterfaceLang;
}> = ({ rule, lang }) => {
  const title = rule.title_i18n?.[lang] || rule.title_i18n?.en || rule.title;
  const body = rule.body_i18n?.[lang] || rule.body_i18n?.en || rule.body;

  return (
    <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-white dark:bg-[#12141A] p-4 sm:p-5 space-y-2 shadow-2xs">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 shrink-0">
          <ShieldCheck size={16} />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="text-[11px] font-display font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {t(lang, 'importantRuleLabel')}
          </div>
          <h4 className="text-sm sm:text-base font-display font-bold text-neutral-900 dark:text-white leading-snug break-words">
            <GrammarTransformationText text={title} mode="prose" />
          </h4>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 pt-0.5 break-words">
            <GrammarTransformationText text={body} mode="prose" compact />
          </p>
        </div>
      </div>
    </div>
  );
};

export const AttentionWarningPanel: React.FC<{
  label: string;
  text: string;
}> = ({ label, text }) => (
  <div className="rounded-xl border border-[#DD0000]/30 dark:border-red-900/60 bg-[#DD0000]/[0.04] dark:bg-red-950/20 px-4 py-3.5 flex items-start gap-3">
    <span className="mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#DD0000]/12 text-[#DD0000] dark:text-red-400 shrink-0">
      <AlertTriangle size={15} />
    </span>
    <div className="min-w-0 flex-1 space-y-0.5">
      <div className="text-[11px] font-display font-bold uppercase tracking-wider text-[#DD0000] dark:text-red-400">
        {label}
      </div>
      <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 break-words">
        <GrammarTransformationText text={text} mode="prose" compact />
      </p>
    </div>
  </div>
);

export const LearningTipPanel: React.FC<{
  label: string;
  text: string;
}> = ({ label, text }) => (
  <div className="rounded-xl border border-amber-300/70 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/20 px-4 py-3.5 flex items-start gap-3">
    <span className="mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/15 text-amber-700 dark:text-[#FFCE00] shrink-0">
      <Lightbulb size={15} />
    </span>
    <div className="min-w-0 flex-1 space-y-0.5">
      <div className="text-[11px] font-display font-bold uppercase tracking-wider text-amber-800 dark:text-[#FFCE00]">
        {label}
      </div>
      <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 break-words">
        <GrammarTransformationText text={text} mode="prose" compact />
      </p>
    </div>
  </div>
);

/* ============================================================================
   7. Dedicated German Example Card (Copy, Audio, Highlight, Collapsible Note)
   ============================================================================ */
export const GermanExampleCard: React.FC<{
  example: LessonExample;
  index: number;
  lang: InterfaceLang;
}> = ({ example, index, lang }) => {
  const [copied, setCopied] = useState(false);
  const [showNote, setShowNote] = useState(true);
  const translation = example.translation_i18n?.[lang] || example.translation_i18n?.en;
  const explanation =
    example.explanation_i18n?.[lang] || example.explanation_i18n?.en || example.note;
  const supportsSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(example.sentence);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore if clipboard blocked
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-4 sm:p-5 space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono-tabular text-[11px] font-bold text-neutral-400 dark:text-neutral-500">
              {String(index + 1).padStart(2, '0')}
            </span>
            {example.highlight && (
              <span className="font-mono-tabular text-[11px] font-semibold text-violet-700 dark:text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-md">
                {example.highlight}
              </span>
            )}
          </div>

          <p className="text-base sm:text-[17px] font-semibold leading-relaxed text-neutral-900 dark:text-white">
            <HighlightedGermanSentence sentence={example.sentence} highlight={example.highlight} />
          </p>

          {translation && lang !== 'de' && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {translation}
            </p>
          )}
        </div>

        {/* Copy & Listen Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {supportsSpeech && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => speakGermanText(example.sentence)}
              title={t(lang, 'listenBtn')}
              aria-label={`${t(lang, 'listenBtn')}: ${example.sentence}`}
              className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 cursor-pointer transition-colors"
            >
              <Volume2 size={15} />
            </motion.button>
          )}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            title={copied ? t(lang, 'copiedBtn') : t(lang, 'copyExampleBtn')}
            aria-label={copied ? t(lang, 'copiedBtn') : `${t(lang, 'copyExampleBtn')}: ${example.sentence}`}
            className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 cursor-pointer transition-colors"
          >
            {copied ? (
              <motion.span
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={MOTION_SPRING.pop}
              >
                <Check size={15} className="text-emerald-600 dark:text-emerald-400" />
              </motion.span>
            ) : (
              <Copy size={14} />
            )}
          </motion.button>
        </div>
      </div>

      {explanation && (
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
          <button
            type="button"
            onClick={() => setShowNote((prev) => !prev)}
            aria-expanded={showNote}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
          >
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${showNote ? 'rotate-0' : '-rotate-90'}`}
            />
            <span>{showNote ? t(lang, 'hideDetailsBtn') : t(lang, 'showDetailsBtn')}</span>
          </button>
          <AnimatePresence initial={false}>
            {showNote && (
              <motion.div
                variants={accordionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="overflow-hidden"
              >
                <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300 break-words">
                  <GrammarTransformationText text={explanation} mode="prose" compact />
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   8. Comparison / Contrast Block
   ============================================================================ */
export const ComparisonContrastCard: React.FC<{
  item: LessonContrastItem;
  lang: InterfaceLang;
}> = ({ item, lang }) => {
  const title = item.title_i18n[lang] || item.title_i18n.en;
  const body = item.body_i18n[lang] || item.body_i18n.en;
  const split = item.contrast_pair ? splitContrastPair(item.contrast_pair) : null;

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-sky-500/12 text-sky-700 dark:text-sky-300 shrink-0">
          <ArrowLeftRight size={13} />
        </span>
        <h4 className="text-sm sm:text-base font-display font-bold text-neutral-900 dark:text-white">
          {title}
        </h4>
      </div>

      {split ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-3.5 py-2.5 text-sm font-medium break-words">
            <GrammarTransformationText text={split.left} compact />
          </div>
          <div className="rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-3.5 py-2.5 text-sm font-medium break-words">
            <GrammarTransformationText text={split.right} compact />
          </div>
        </div>
      ) : (
        item.contrast_pair && (
          <div className="rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-3.5 py-2 text-xs sm:text-sm font-mono-tabular text-neutral-800 dark:text-neutral-200 break-words">
            <GrammarTransformationText text={item.contrast_pair} compact />
          </div>
        )
      )}

      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 break-words">
        <GrammarTransformationText text={body} mode="prose" compact />
      </p>
    </div>
  );
};

/* ============================================================================
   9. Interactive Key Forms & Vocabulary Block
   ============================================================================ */
export const VocabularyInteractiveStrip: React.FC<{
  entries: VocabularyEntry[];
  lang: InterfaceLang;
}> = ({ entries, lang }) => {
  const [recallMode, setRecallMode] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const supportsSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;

  if (entries.length === 0) return null;

  const toggleReveal = (id: string) => {
    if (!recallMode) return;
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 p-4 sm:p-5 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BookMarked size={15} className="text-[#DD0000] dark:text-[#FFCE00] shrink-0" />
          <h4 className="text-sm font-display font-bold text-neutral-900 dark:text-white">
            {t(lang, 'vocabularyRecallLabel')}
          </h4>
        </div>

        <button
          type="button"
          onClick={() => {
            setRecallMode((v) => !v);
            setRevealedIds({});
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#12141A] text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:border-neutral-400 cursor-pointer min-h-[34px]"
        >
          {recallMode ? <Eye size={13} /> : <EyeOff size={13} />}
          <span>{recallMode ? t(lang, 'showAnswersBtn') : t(lang, 'hideAnswersBtn')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {entries.map((entry) => {
          const isHidden = recallMode && !revealedIds[entry.id];
          return (
            <div
              key={entry.id}
              onClick={() => toggleReveal(entry.id)}
              role={recallMode ? 'button' : undefined}
              tabIndex={recallMode ? 0 : undefined}
              onKeyDown={
                recallMode
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleReveal(entry.id);
                      }
                    }
                  : undefined
              }
              className={`rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-3.5 flex items-start justify-between gap-2.5 transition-colors ${
                recallMode ? 'cursor-pointer hover:border-[#DD0000]/60 dark:hover:border-[#FFCE00]/60' : ''
              }`}
            >
              <div className="min-w-0 space-y-1">
                {entry.category && (
                  <div className="text-[11px] font-mono-tabular font-semibold text-neutral-500 dark:text-neutral-400">
                    {entry.category}
                  </div>
                )}
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                  <GrammarTransformationText text={entry.primary} compact />
                </div>
                {entry.secondary && (
                  <div
                    className={`text-sm transition-all duration-200 ${
                      isHidden
                        ? 'blur-[5px] select-none opacity-60 scale-[0.98] origin-left'
                        : 'text-neutral-700 dark:text-neutral-200 opacity-100 scale-100'
                    }`}
                  >
                    <GrammarTransformationText text={entry.secondary} compact />
                  </div>
                )}
                {entry.meta && entry.meta !== entry.secondary && (
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {entry.meta}
                  </div>
                )}
              </div>

              {supportsSpeech && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakGermanText(entry.spokenGerman || entry.primary);
                  }}
                  aria-label={`${t(lang, 'listenBtn')}: ${entry.spokenGerman || entry.primary}`}
                  title={t(lang, 'listenBtn')}
                  className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer shrink-0"
                >
                  <Volume2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   10. Mistake Comparison Card
   ============================================================================ */
export const MistakeComparisonCard: React.FC<{
  mistake: LessonMistake;
  lang: InterfaceLang;
}> = ({ mistake, lang }) => {
  const explanation = mistake.explanation_i18n[lang] || mistake.explanation_i18n.en || '';
  const principle = mistake.principle_i18n?.[lang] || mistake.principle_i18n?.en;

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 dark:divide-neutral-800">
        <div className="p-3.5 sm:p-4 bg-[#DD0000]/[0.03] dark:bg-red-950/15 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-display font-bold uppercase tracking-wider text-[#DD0000] dark:text-red-400">
            <XCircle size={13} />
            <span>{t(lang, 'incorrectLabel')}</span>
          </div>
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 line-through decoration-[#DD0000]/60">
            {mistake.wrong}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 bg-emerald-500/[0.04] dark:bg-emerald-950/15 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-display font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 size={13} />
            <span>{t(lang, 'correctLabel')}</span>
          </div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
            <GrammarTransformationText text={mistake.right} compact />
          </p>
        </div>
      </div>

      {(explanation || principle) && (
        <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 space-y-1.5 text-xs sm:text-[13px]">
          {explanation && (
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{explanation}</p>
          )}
          {principle && (
            <p className="text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {t(lang, 'correctionPrincipleLabel')}:
              </span>{' '}
              {principle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   11. Final Summary & Practice Subskills Card
   ============================================================================ */
export const LessonSummaryCard: React.FC<{
  quickReview?: LessonQuickReview;
  practiceMapping?: LessonPracticeSubskill[];
  lang: InterfaceLang;
}> = ({ quickReview, practiceMapping, lang }) => {
  if (!quickReview && (!practiceMapping || practiceMapping.length === 0)) return null;

  return (
    <section id="lesson-summary" className="scroll-mt-20 space-y-4">
      <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#FFCE00]/20 text-amber-800 dark:text-[#FFCE00] shrink-0">
          <Sparkles size={15} />
        </span>
        <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900 dark:text-white">
          {t(lang, 'quickReviewHeading')}
        </h3>
      </div>

      {quickReview && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 space-y-1">
            <dt className="text-[11px] font-display font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {t(lang, 'centralRuleLabel')}
            </dt>
            <dd className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
              {quickReview.central_rule}
            </dd>
          </div>

          <div className="rounded-xl border border-sky-200/80 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/20 p-4 space-y-1">
            <dt className="text-[11px] font-display font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              {t(lang, 'keyPatternLabel')}
            </dt>
            <dd className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
              <GrammarTransformationText text={quickReview.key_pattern} compact />
            </dd>
          </div>

          <div className="rounded-xl border border-[#DD0000]/25 dark:border-red-900/50 bg-[#DD0000]/[0.04] dark:bg-red-950/20 p-4 space-y-1">
            <dt className="text-[11px] font-display font-bold uppercase tracking-wider text-[#DD0000] dark:text-red-400">
              {t(lang, 'watchOutLabel')}
            </dt>
            <dd className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
              {quickReview.mistake_warning}
            </dd>
          </div>

          <div className="rounded-xl border border-amber-300/60 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-1">
            <dt className="text-[11px] font-display font-bold uppercase tracking-wider text-amber-800 dark:text-[#FFCE00]">
              {t(lang, 'selfCheckLabel')}
            </dt>
            <dd className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
              {quickReview.self_check}
            </dd>
          </div>
        </dl>
      )}

      {practiceMapping && practiceMapping.length > 0 && (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-4 sm:p-5 space-y-2.5">
          <h4 className="text-xs font-display font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {t(lang, 'practiceMappingHeading')}
          </h4>
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            {practiceMapping.map((sub) => (
              <li
                key={sub.id}
                className="py-2 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
              >
                <span className="text-neutral-800 dark:text-neutral-200">
                  {sub.label_i18n[lang] || sub.label_i18n.en}
                </span>
                <span className="text-[11px] font-mono-tabular text-neutral-500 dark:text-neutral-400 shrink-0">
                  {sub.formats.map((f) => f.replace(/_/g, ' ')).join(' · ')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

/* ============================================================================
   12. Desktop Sticky Table of Contents Rail (>= 1024px, vertically centered)
   ============================================================================ */
export const LessonDesktopTocRail: React.FC<{
  items: LessonTocItem[];
  activeId: string;
  progressPct: number;
  lang: InterfaceLang;
  onJump: (id: string) => void;
  onPractice: () => void;
  onMarkReviewed: () => void;
}> = ({
  items,
  activeId,
  progressPct,
  lang,
  onJump,
  onPractice,
  onMarkReviewed,
}) => {
  const reducedMotion = useMotionPreference();

  return (
    <div className="hidden lg:block lg:w-52 xl:w-56 2xl:w-60 shrink-0">
      <aside className="lg:fixed lg:top-14 lg:bottom-0 lg:flex lg:items-center lg:w-52 xl:w-56 2xl:w-60 pointer-events-none z-10">
        <div className="pointer-events-auto w-full max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-4 space-y-3.5">
        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            <span>{t(lang, 'readingProgressLabel')}</span>
            <span className="font-mono-tabular font-semibold text-neutral-900 dark:text-white">
              {progressPct}%
            </span>
          </div>
          <AnimatedProgressBar
            value={progressPct}
            max={100}
            trackClassName="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
            barClassName="h-full w-full bg-[#DD0000] dark:bg-[#FFCE00] rounded-full"
          />
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 space-y-1">
          <div className="text-[11px] font-display font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-2 pb-1">
            {t(lang, 'onThisPageHeading')}
          </div>
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onJump(item.id)}
                className={`relative w-full text-left flex items-start gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  active
                    ? 'text-[#DD0000] dark:text-[#FFCE00] font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="lesson-toc-active-pill"
                    transition={reducedMotion ? { duration: 0.01 } : MOTION_SPRING.snappy}
                    className="absolute inset-0 rounded-lg bg-[#DD0000]/8 dark:bg-[#FFCE00]/12"
                  />
                )}
                {item.number ? (
                  <span className="relative z-10 font-mono-tabular text-[11px] opacity-75 shrink-0 mt-[1px]">
                    {item.number.padStart(2, '0')}
                  </span>
                ) : (
                  <Table2 size={12} className="relative z-10 shrink-0 mt-[2px] opacity-70" />
                )}
                <span className="relative z-10 leading-snug line-clamp-2">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 space-y-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onPractice}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#DD0000] hover:bg-[#b80000] text-white text-xs font-semibold cursor-pointer min-h-[38px] transition-colors"
          >
            <Dumbbell size={13} />
            <span>{t(lang, 'practiceThisLessonBtn')}</span>
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onMarkReviewed}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 text-neutral-800 dark:text-neutral-200 text-xs font-semibold cursor-pointer min-h-[38px] transition-colors"
          >
            <CheckCircle2 size={13} />
            <span>{t(lang, 'markLessonReviewedBtn')}</span>
          </motion.button>
        </div>
        </div>
      </aside>
    </div>
  );
};

/* ============================================================================
   13. Bottom Lesson Footer Navigation (Prev / Complete / Next / Library)
   ============================================================================ */
export const LessonFooterNav: React.FC<{
  lang: InterfaceLang;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  onSelectLesson: (lesson: Lesson) => void;
  onBackToLibrary: () => void;
  onMarkReviewed: () => void;
  onPractice: () => void;
}> = ({
  lang,
  prevLesson,
  nextLesson,
  onSelectLesson,
  onBackToLibrary,
  onMarkReviewed,
  onPractice,
}) => {
  useEffect(() => {
    // Ensure speech synthesis voices preload softly if supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  return (
    <footer className="space-y-4 pt-2">
      {/* Primary Lesson Completion & Practice Actions */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onMarkReviewed}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-sm font-semibold cursor-pointer min-h-[44px] hover:opacity-90 transition-opacity"
          >
            <CheckCircle2 size={16} />
            <span>{t(lang, 'markLessonReviewedBtn')}</span>
          </button>

          <button
            type="button"
            onClick={onBackToLibrary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 cursor-pointer min-h-[44px]"
          >
            <ArrowLeft size={14} />
            <span>{t(lang, 'backToLibraryBtn')}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onPractice}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DD0000] hover:bg-[#b80000] text-white text-sm font-semibold cursor-pointer min-h-[44px] transition-colors"
        >
          <Dumbbell size={16} />
          <span>{t(lang, 'practiceThisLessonBtn')}</span>
        </button>
      </div>

      {/* Previous / Next Lesson Cards */}
      {(prevLesson || nextLesson) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prevLesson ? (
            <button
              type="button"
              onClick={() => onSelectLesson(prevLesson)}
              className="text-left rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] hover:border-[#DD0000] dark:hover:border-[#FFCE00] p-4 flex items-center gap-3 cursor-pointer transition-colors min-h-[64px]"
            >
              <ArrowLeft size={16} className="text-neutral-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                  {t(lang, 'previousLessonLabel')}
                </div>
                <div className="text-sm font-display font-bold text-neutral-900 dark:text-white truncate">
                  {prevLesson.level}-{formatLessonNumber(prevLesson.unit)} · {prevLesson.title_de}
                </div>
              </div>
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextLesson && (
            <button
              type="button"
              onClick={() => onSelectLesson(nextLesson)}
              className="text-right rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] hover:border-[#DD0000] dark:hover:border-[#FFCE00] p-4 flex items-center justify-end gap-3 cursor-pointer transition-colors min-h-[64px]"
            >
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                  {t(lang, 'nextLessonLabel')}
                </div>
                <div className="text-sm font-display font-bold text-neutral-900 dark:text-white truncate">
                  {nextLesson.level}-{formatLessonNumber(nextLesson.unit)} · {nextLesson.title_de}
                </div>
              </div>
              <ArrowRight size={16} className="text-neutral-400 shrink-0" />
            </button>
          )}
        </div>
      )}
    </footer>
  );
};
