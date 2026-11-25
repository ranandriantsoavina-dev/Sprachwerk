import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowRightLeft,
  Award,
  BookOpen,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Clock,
  Coins,
  Flame,
  Home,
  Languages,
  Layers,
  Lightbulb,
  ListChecks,
  PenLine,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  TextCursorInput,
  TrendingUp,
  Trophy,
  WifiOff,
  XCircle,
  Zap,
} from 'lucide-react';
import { t } from '../../i18n/translations';
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_SPRING,
  accordionVariants,
  createStaggerContainerVariants,
  createStaggerItemVariants,
} from '../../lib/motion';
import type {
  ExerciseType,
  InterfaceLang,
  PracticeResultRow,
  PracticeRewardSummary,
  Question,
  UserProfile,
} from '../../types/domain';
import {
  computeWordDiff,
  extractStructuredPrompt,
  parseGapFillPrompt,
} from '../../utils/exerciseHelpers';
import { AnimatedProgressBar, CelebrationBurst } from '../motion/MotionPrimitives';

interface SessionResultsViewProps {
  results: PracticeResultRow[];
  questions: Question[];
  sessionElapsed: number;
  rewardSummary: PracticeRewardSummary | null;
  isRetryPass: boolean;
  mode: 'general' | 'lesson';
  contextSubtitle?: string;
  user: UserProfile | null;
  lang: InterfaceLang;
  reducedMotion: boolean;
  onRetryMistakes: (questionIds?: string[]) => void;
  onNewSession: () => void;
  onDashboard: () => void;
}

function formatDuration(totalSeconds: number): string {
  const sec = Math.max(0, Math.round(totalSeconds));
  if (sec < 60) return `${sec}s`;
  const mins = Math.floor(sec / 60);
  const rem = sec % 60;
  return `${mins}m ${String(rem).padStart(2, '0')}s`;
}

function useCountUp(target: number, disabled: boolean, durationMs = 550): number {
  const [value, setValue] = useState(disabled ? target : 0);

  useEffect(() => {
    if (disabled || target <= 0) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, disabled, durationMs]);

  return value;
}

const EXERCISE_TYPE_ICON: Record<ExerciseType, React.ReactNode> = {
  multiple_choice: <ListChecks size={14} />,
  gap_fill: <TextCursorInput size={14} />,
  sentence_construction: <Layers size={14} />,
  translation: <Languages size={14} />,
  matching: <ArrowLeftRight size={14} />,
  transformation: <ArrowRightLeft size={14} />,
  true_false: <CheckSquare size={14} />,
  error_correction: <PenLine size={14} />,
};

function getExerciseTypeLabel(lang: InterfaceLang, type: ExerciseType | undefined): string {
  if (!type) return '';
  return t(lang, `exType_${type}`);
}

function getTopicLabel(lang: InterfaceLang, slug: string): string {
  const key = `tag_${slug.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
  const translated = t(lang, key);
  if (translated !== key) return translated;
  return slug
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Dual-segment animated circular accuracy ring (green correct arc + subtle red incorrect arc)
 */
const AccuracyCircularGauge: React.FC<{
  accuracy: number;
  correctCount: number;
  totalCount: number;
  reducedMotion: boolean;
}> = ({ accuracy, correctCount, totalCount, reducedMotion }) => {
  const size = 128;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const hasBoth = accuracy > 0 && accuracy < 100;
  const gapPx = hasBoth ? strokeWidth + 4 : 0;
  const correctStart = gapPx / 2;
  const correctLen = Math.max(2, (accuracy / 100) * circumference - gapPx);
  const incorrectPct = Math.max(0, 100 - accuracy);
  const incorrectStart = (accuracy / 100) * circumference + gapPx / 2;
  const incorrectLen = Math.max(2, (incorrectPct / 100) * circumference - gapPx);

  const animatedPct = useCountUp(accuracy, reducedMotion, 620);

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0 select-none"
      style={{ width: size, height: size }}
      aria-label={`${accuracy}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-neutral-200 dark:stroke-neutral-800"
        />

        {/* Incorrect segment (red, follows after correct segment) */}
        {incorrectPct > 0 && totalCount > 0 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="stroke-[#DD0000]/80 dark:stroke-[#DD0000]"
            strokeDasharray={`${incorrectLen} ${circumference}`}
            strokeDashoffset={-incorrectStart}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.12 }}
          />
        )}

        {/* Correct segment (green) */}
        {accuracy > 0 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="stroke-emerald-600 dark:stroke-emerald-500"
            strokeDasharray={`${correctLen} ${circumference}`}
            initial={
              reducedMotion
                ? { strokeDashoffset: -correctStart }
                : { strokeDashoffset: correctLen }
            }
            animate={{ strokeDashoffset: -correctStart }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl sm:text-[28px] font-display font-bold font-mono-tabular leading-none text-neutral-950 dark:text-white">
          {animatedPct}%
        </span>
        <span className="text-xs font-mono-tabular font-semibold text-neutral-500 dark:text-neutral-400 mt-1">
          {correctCount}/{totalCount}
        </span>
      </div>
    </div>
  );
};

/**
 * Format-aware question prompt renderer inside Mistake / Review cards.
 * Preserves complete original prompt text, punctuation, blanks, and context while differentiating the 8 formats visually.
 */
const FormatAwareQuestionView: React.FC<{
  row: PracticeResultRow;
  question: Question | undefined;
  lang: InterfaceLang;
}> = ({ row, question, lang }) => {
  const type = question?.type;

  // Gap Fill: render blanks inline inside the original prompt
  if (type === 'gap_fill') {
    const parsed = parseGapFillPrompt(row.prompt, row.correctAnswer);
    if (parsed.blankCount > 0) {
      return (
        <div className="space-y-1.5">
          {parsed.context && (
            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {parsed.context}
            </div>
          )}
          <div className="text-[15px] sm:text-base font-medium text-neutral-900 dark:text-white leading-relaxed break-words">
            {parsed.sentenceClusters.map((cluster, cIdx) => {
              if (!cluster.hasBlank) {
                return (
                  <React.Fragment key={`rc-${cIdx}`}>
                    {cluster.tokens.map((tok, tIdx) => (
                      <span key={`rt-${tIdx}`}>{tok.value}</span>
                    ))}
                  </React.Fragment>
                );
              }
              return (
                <span key={`rc-${cIdx}`} className="inline-flex items-baseline whitespace-nowrap">
                  {cluster.tokens.map((tok, tIdx) =>
                    tok.type === 'blank' ? (
                      <span
                        key={`rb-${tIdx}`}
                        className="inline-flex items-center justify-center mx-0.5 px-2 py-0.5 rounded-md border border-dashed border-neutral-400 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800/80 font-mono-tabular text-xs font-semibold text-neutral-500 dark:text-neutral-400"
                      >
                        ___
                      </span>
                    ) : (
                      <span key={`rt-${tIdx}`}>{tok.value}</span>
                    )
                  )}
                </span>
              );
            })}
          </div>
          {parsed.instruction && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              ({parsed.instruction})
            </div>
          )}
        </div>
      );
    }
  }

  // Multiple Choice: show original question + compact choice list
  if (type === 'multiple_choice' && question?.options_de && question.options_de.length > 0) {
    return (
      <div className="space-y-2.5">
        <p className="text-[15px] sm:text-base font-medium text-neutral-900 dark:text-white leading-relaxed break-words">
          {row.prompt}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {question.options_de.map((opt, idx) => {
            const isCorrectOpt = opt === row.correctAnswer;
            const isUserOpt = !row.skipped && !row.timedOut && opt === row.userAnswer;
            return (
              <div
                key={`${opt}-${idx}`}
                className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                  isCorrectOpt
                    ? 'border-emerald-600/40 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold'
                    : isUserOpt
                    ? 'border-[#DD0000]/40 bg-[#DD0000]/8 text-[#9e0000] dark:text-red-200 font-medium'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400'
                }`}
              >
                <span className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono-tabular font-bold shrink-0">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span className="break-words">{opt}</span>
                </span>
                {isCorrectOpt && <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />}
                {isUserOpt && !isCorrectOpt && <XCircle size={13} className="text-[#DD0000] shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Matching: show original prompt + pair-by-pair comparison if matching_pairs exists
  if (type === 'matching' && question?.matching_pairs && question.matching_pairs.length > 0) {
    const userPairMap = new Map<string, string>();
    if (row.userAnswer && !row.skipped && !row.timedOut) {
      for (const seg of row.userAnswer.split(' | ')) {
        const [left, right] = seg.split(' -> ');
        if (left && right !== undefined) {
          userPairMap.set(left.trim(), right.trim());
        }
      }
    }

    return (
      <div className="space-y-2.5">
        <p className="text-[15px] sm:text-base font-medium text-neutral-900 dark:text-white leading-relaxed break-words">
          {row.prompt}
        </p>
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/40">
          {question.matching_pairs.map((pair, idx) => {
            const userRight = userPairMap.get(pair.left);
            const matchedOk = userRight === pair.right;
            return (
              <div
                key={`${pair.left}-${idx}`}
                className="px-3 py-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3"
              >
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {idx + 1}. {pair.left}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {userRight && !matchedOk && (
                    <span className="text-[#DD0000] dark:text-red-300 line-through">
                      {userRight}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 size={12} className="shrink-0" />
                    <span>{pair.right}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Translation, Transformation, Error Correction: separate context/instruction and quoted sentence cleanly
  if (type === 'translation' || type === 'transformation' || type === 'error_correction') {
    const structured = extractStructuredPrompt(row.prompt);
    if (structured.primarySentence) {
      const diff =
        type === 'error_correction'
          ? computeWordDiff(structured.primarySentence, row.correctAnswer)
          : null;

      return (
        <div className="space-y-2">
          {(structured.context || structured.instruction) && (
            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {structured.context ? `${structured.context} · ` : ''}
              {structured.instruction}
            </div>
          )}
          <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 px-3.5 py-2.5 text-[15px] sm:text-base font-medium text-neutral-900 dark:text-white leading-relaxed break-words">
            {diff ? (
              <span className="flex flex-wrap gap-x-1.5 gap-y-0.5">
                {diff.sourceTokens.map((tok, i) => (
                  <span
                    key={`ed-${i}`}
                    className={
                      tok.status === 'removed'
                        ? 'underline decoration-[#DD0000] decoration-wavy underline-offset-4 text-[#b00000] dark:text-red-300'
                        : undefined
                    }
                  >
                    {tok.text}
                  </span>
                ))}
              </span>
            ) : (
              <>
                <span>„{structured.primarySentence}“</span>
                {structured.targetPattern && (
                  <span className="inline-flex items-center gap-1.5 ml-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <ArrowRight size={13} className="shrink-0" />
                    <span>{structured.targetPattern}</span>
                  </span>
                )}
              </>
            )}
          </div>
          {structured.note && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              ({structured.note})
            </div>
          )}
        </div>
      );
    }
  }

  // Sentence Construction & True/False & fallback: show complete original prompt cleanly
  return (
    <div className="space-y-2">
      <p className="text-[15px] sm:text-base font-medium text-neutral-900 dark:text-white leading-relaxed break-words">
        {row.prompt}
      </p>
      {type === 'true_false' && (
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span>
            {(question?.options_de && question.options_de[0]) || 'Richtig'} ({t(lang, 'trueSubLabel')})
          </span>
          <span aria-hidden="true">/</span>
          <span>
            {(question?.options_de && question.options_de[1]) || 'Falsch'} ({t(lang, 'falseSubLabel')})
          </span>
        </div>
      )}
    </div>
  );
};

export const SessionResultsView: React.FC<SessionResultsViewProps> = ({
  results,
  questions,
  sessionElapsed,
  rewardSummary,
  isRetryPass,
  mode,
  contextSubtitle,
  user,
  lang,
  reducedMotion,
  onRetryMistakes,
  onNewSession,
  onDashboard,
}) => {
  const totalCount = results.length;
  const correctCount = useMemo(() => results.filter((r) => r.isCorrect).length, [results]);
  const incorrectCount = Math.max(0, totalCount - correctCount);
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const questionMap = useMemo(() => {
    const map = new Map<string, Question>();
    for (const q of questions) {
      map.set(q.id, q);
    }
    return map;
  }, [questions]);

  const indexedResults = useMemo(
    () =>
      results.map((row, idx) => ({
        row,
        exerciseNumber: idx + 1,
        question: questionMap.get(row.questionId),
      })),
    [results, questionMap]
  );

  const mistakes = useMemo(
    () => indexedResults.filter((item) => !item.row.isCorrect),
    [indexedResults]
  );
  const correctItems = useMemo(
    () => indexedResults.filter((item) => item.row.isCorrect),
    [indexedResults]
  );

  const [reviewFilter, setReviewFilter] = useState<'mistakes' | 'correct'>(() =>
    mistakes.length > 0 ? 'mistakes' : 'correct'
  );
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setReviewFilter(mistakes.length > 0 ? 'mistakes' : 'correct');
    setExpandedMap({});
  }, [results, mistakes.length]);

  const visibleItems = reviewFilter === 'mistakes' ? mistakes : correctItems;

  // Dynamic achievement tier (strictly based on real accuracy & retry state)
  const heroTier = useMemo(() => {
    if (isRetryPass) {
      return {
        heading: t(lang, 'resultsRetryHeading'),
        subtitle: t(lang, 'resultsRetrySubtitle'),
        icon: <RotateCcw size={24} />,
        iconBg: 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      };
    }
    if (accuracy >= 90) {
      return {
        heading: t(lang, 'resultsHeadingExcellent'),
        subtitle: t(lang, 'resultsSubtitleExcellent'),
        icon: <Trophy size={24} />,
        iconBg:
          'bg-[#FFCE00]/18 text-[#9a7200] dark:text-[#FFCE00] border-[#FFCE00]/45',
      };
    }
    if (accuracy >= 70) {
      return {
        heading: t(lang, 'resultsHeadingGreat'),
        subtitle: t(lang, 'resultsSubtitleGreat'),
        icon: <Award size={24} />,
        iconBg:
          'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      };
    }
    if (accuracy >= 40) {
      return {
        heading: t(lang, 'resultsHeadingKeepGoing'),
        subtitle: t(lang, 'resultsSubtitleKeepGoing'),
        icon: <TrendingUp size={24} />,
        iconBg:
          'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      };
    }
    return {
      heading: t(lang, 'resultsHeadingCompleted'),
      subtitle: t(lang, 'resultsSubtitleCompleted'),
      icon: <BookOpen size={24} />,
      iconBg:
        'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700',
    };
  }, [accuracy, isRetryPass, lang]);

  // Animated rewards (strictly server-provided values)
  const xpEarned = rewardSummary?.xpAwarded ?? 0;
  const coinsEarned = rewardSummary?.coinsAwarded ?? 0;
  const dailyBonusXp = rewardSummary?.dailyBonusXp ?? 0;
  const dailyBonusCoins = rewardSummary?.dailyBonusCoins ?? 0;
  const animatedXp = useCountUp(xpEarned, reducedMotion, 560);
  const animatedCoins = useCountUp(coinsEarned, reducedMotion, 560);

  // Real session learning insights derived strictly from assessed topics & exercise formats
  const learningInsights = useMemo(() => {
    const topicBuckets = new Map<string, { attempts: number; correct: number }>();
    const formatBuckets = new Map<ExerciseType, { attempts: number; correct: number; mistakes: number }>();

    for (const item of indexedResults) {
      const q = item.question;
      // Pick the most specific tag when multiple sub-tags exist, falling back to row.topic
      const specificTag =
        q && q.topic_tags.length > 1
          ? q.topic_tags[1]
          : q?.topic_tags[0] || item.row.topic;

      if (specificTag) {
        const cur = topicBuckets.get(specificTag) || { attempts: 0, correct: 0 };
        cur.attempts += 1;
        if (item.row.isCorrect) cur.correct += 1;
        topicBuckets.set(specificTag, cur);
      }

      if (q?.type) {
        const fmt = formatBuckets.get(q.type) || { attempts: 0, correct: 0, mistakes: 0 };
        fmt.attempts += 1;
        if (item.row.isCorrect) fmt.correct += 1;
        else fmt.mistakes += 1;
        formatBuckets.set(q.type, fmt);
      }
    }

    const topics = Array.from(topicBuckets.entries())
      .map(([slug, stat]) => ({
        slug,
        label: getTopicLabel(lang, slug),
        attempts: stat.attempts,
        correct: stat.correct,
        accuracyPct: Math.round((stat.correct / stat.attempts) * 100),
      }))
      .sort((a, b) => a.accuracyPct - b.accuracyPct || b.attempts - a.attempts);

    const formats = Array.from(formatBuckets.entries())
      .map(([type, stat]) => ({
        type,
        label: getExerciseTypeLabel(lang, type),
        attempts: stat.attempts,
        correct: stat.correct,
        mistakes: stat.mistakes,
        accuracyPct: Math.round((stat.correct / stat.attempts) * 100),
      }))
      .sort((a, b) => a.accuracyPct - b.accuracyPct || b.mistakes - a.mistakes);

    return {
      topics,
      formats,
      showTopicInsights: topics.length >= 2 || (topics.length === 1 && mistakes.length > 0),
      showFormatInsights: formats.length >= 2,
    };
  }, [indexedResults, lang, mistakes.length]);

  const toggleExpanded = (key: string) => {
    setExpandedMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const anyExpandable = visibleItems.some((it) => Boolean(it.row.explanation));
  const allExpanded =
    anyExpandable &&
    visibleItems
      .filter((it) => Boolean(it.row.explanation))
      .every((it) => expandedMap[`${it.row.questionId}-${it.exerciseNumber}`]);

  const toggleAllExplanations = () => {
    const nextState = !allExpanded;
    const nextMap: Record<string, boolean> = { ...expandedMap };
    for (const it of visibleItems) {
      if (it.row.explanation) {
        nextMap[`${it.row.questionId}-${it.exerciseNumber}`] = nextState;
      }
    }
    setExpandedMap(nextMap);
  };

  const hasCrimsonRibbon = user?.equipped?.celebration?.value === 'crimson_ribbon';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-4">
      {/* =====================================================================
          TIER 1: COMPLETION HERO + ACCURACY GAUGE + REWARDS CARD
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Main Completion & Accuracy Card */}
        <motion.section
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION_DURATION.normal, ease: MOTION_EASE.settle }}
          className="relative lg:col-span-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-7 flex flex-col justify-between overflow-hidden"
        >
          {hasCrimsonRibbon && (
            <div className="relative overflow-hidden -mx-5 -mt-5 sm:-mx-7 sm:-mt-7 mb-5 px-5 sm:px-7 py-3 bg-gradient-to-r from-black via-[#DD0000] to-black text-white border-b-2 border-[#FFCE00] flex items-center justify-between gap-3">
              {!reducedMotion && (
                <span
                  aria-hidden="true"
                  className="sw-shimmer-once absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                />
              )}
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles size={16} className="text-[#FFCE00] shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-display font-bold tracking-wide text-[#FFCE00]">
                    {t(lang, 'crimsonRibbonBannerTitle')}
                  </div>
                  <div className="text-[11px] text-neutral-100 truncate">
                    {t(lang, 'crimsonRibbonBannerDesc')}
                  </div>
                </div>
              </div>
              <span className="font-mono-tabular text-xs font-bold text-[#FFCE00] shrink-0">
                {accuracy}%
              </span>
            </div>
          )}

          {/* Achievement Header + Circular Gauge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
              <motion.div
                initial={reducedMotion ? false : { scale: 0.8, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={MOTION_SPRING.celebration}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center shrink-0 ${heroTier.iconBg}`}
              >
                <CelebrationBurst active={!reducedMotion && !isRetryPass && accuracy >= 90} />
                {heroTier.icon}
              </motion.div>
              <div className="min-w-0 space-y-1">
                <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center gap-1.5">
                  <span>
                    {mode === 'lesson' ? t(lang, 'modeLessonPractice') : t(lang, 'modeGeneralPractice')}
                  </span>
                  {contextSubtitle && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="truncate max-w-[240px] sm:max-w-xs">{contextSubtitle}</span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-950 dark:text-white tracking-tight text-balance">
                  {heroTier.heading}
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-lg">
                  {heroTier.subtitle}
                </p>
              </div>
            </div>

            <div className="flex justify-center sm:justify-end shrink-0 pt-1 sm:pt-0">
              <AccuracyCircularGauge
                accuracy={accuracy}
                correctCount={correctCount}
                totalCount={totalCount}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>

          {/* 4 Session Statistics Cards (2x2 mobile, 4 horizontal on sm+/desktop) */}
          <motion.div
            variants={createStaggerContainerVariants(0.05, 0.08)}
            initial={reducedMotion ? false : 'initial'}
            animate="animate"
            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800/90"
          >
            <motion.div
              variants={createStaggerItemVariants(reducedMotion, 8)}
              className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#161922] p-3.5"
            >
              <div className="flex items-center justify-between gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="truncate">{t(lang, 'statAccuracyLabel')}</span>
                <Target size={15} className="text-sky-600 dark:text-sky-400 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-display font-bold font-mono-tabular text-neutral-950 dark:text-white mt-1.5">
                {accuracy}%
              </div>
            </motion.div>

            <motion.div
              variants={createStaggerItemVariants(reducedMotion, 8)}
              className="rounded-xl border border-emerald-600/25 bg-emerald-50/50 dark:bg-emerald-950/25 p-3.5"
            >
              <div className="flex items-center justify-between gap-1 text-xs text-emerald-800 dark:text-emerald-300">
                <span className="truncate">{t(lang, 'statCorrectLabel')}</span>
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-display font-bold font-mono-tabular text-emerald-900 dark:text-emerald-200 mt-1.5">
                {correctCount}
              </div>
            </motion.div>

            <motion.div
              variants={createStaggerItemVariants(reducedMotion, 8)}
              className="rounded-xl border border-[#DD0000]/25 bg-[#DD0000]/[0.04] dark:bg-[#DD0000]/12 p-3.5"
            >
              <div className="flex items-center justify-between gap-1 text-xs text-[#9e0000] dark:text-red-300">
                <span className="truncate">{t(lang, 'statIncorrectLabel')}</span>
                <XCircle size={15} className="text-[#DD0000] dark:text-red-400 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-display font-bold font-mono-tabular text-[#9e0000] dark:text-red-200 mt-1.5">
                {incorrectCount}
              </div>
            </motion.div>

            <motion.div
              variants={createStaggerItemVariants(reducedMotion, 8)}
              className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#161922] p-3.5"
            >
              <div className="flex items-center justify-between gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="truncate">{t(lang, 'statTimeLabel')}</span>
                <Clock size={15} className="text-sky-600 dark:text-sky-400 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-display font-bold font-mono-tabular text-neutral-950 dark:text-white mt-1.5">
                {formatDuration(sessionElapsed)}
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Rewards & Level Progression Card */}
        <motion.section
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 rounded-2xl border border-[#FFCE00]/55 dark:border-[#FFCE00]/30 bg-gradient-to-br from-[#FFFDF5] via-white to-[#FFF7D6]/40 dark:from-[#19160E] dark:via-[#12141A] dark:to-[#12141A] p-5 sm:p-6 flex flex-col justify-between gap-5"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-[#9a7200] dark:text-[#FFCE00]">
                {t(lang, 'yourRewardsTitle')}
              </span>
              {user && user.currentStreak > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-mono-tabular font-semibold text-neutral-700 dark:text-neutral-300">
                  <Flame size={14} className="text-[#DD0000]" />
                  {user.currentStreak} {t(lang, 'daysUnit')}
                </span>
              )}
            </div>

            {isRetryPass ? (
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#161922] p-3.5 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed flex items-start gap-2.5">
                <RotateCcw size={15} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <span>{t(lang, 'retryNoExtraRewardsNote')}</span>
              </div>
            ) : rewardSummary?.queuedOffline ? (
              <div className="rounded-xl border border-[#FFCE00]/50 bg-[#FFCE00]/15 p-3.5 text-xs font-medium text-neutral-900 dark:text-[#FFCE00] leading-relaxed flex items-start gap-2.5">
                <WifiOff size={15} className="shrink-0 mt-0.5" />
                <span>{t(lang, 'queuedOfflineMsg')}</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {/* XP Earned */}
                <div className="rounded-xl border border-[#FFCE00]/35 bg-white/90 dark:bg-[#161922] px-4 py-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#FFCE00]/20 text-[#9a7200] dark:text-[#FFCE00] flex items-center justify-center shrink-0">
                      <Zap size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate">
                        {t(lang, 'xpEarnedLabel')}
                      </div>
                      <div className="text-xl font-display font-bold font-mono-tabular text-neutral-950 dark:text-white">
                        +{animatedXp} XP
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coins Earned */}
                <div className="rounded-xl border border-[#FFCE00]/35 bg-white/90 dark:bg-[#161922] px-4 py-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#FFCE00]/20 text-[#9a7200] dark:text-[#FFCE00] flex items-center justify-center shrink-0">
                      <Coins size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate">
                        {t(lang, 'coinsEarnedLabel')}
                      </div>
                      <div className="text-xl font-display font-bold font-mono-tabular text-neutral-950 dark:text-white">
                        +{animatedCoins} {t(lang, 'coinBalance')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(dailyBonusXp > 0 || dailyBonusCoins > 0) && (
              <div className="text-xs font-medium text-[#9a7200] dark:text-[#FFCE00] flex items-center justify-between gap-2 px-1">
                <span>{t(lang, 'dailyFirstStudyBonus')}</span>
                <span className="font-mono-tabular font-semibold">
                  {dailyBonusXp > 0 ? `+${dailyBonusXp} XP` : ''}
                  {dailyBonusXp > 0 && dailyBonusCoins > 0 ? ' · ' : ''}
                  {dailyBonusCoins > 0 ? `+${dailyBonusCoins} ${t(lang, 'coinBalance')}` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Existing User Level Progression */}
          {user && (
            <div className="pt-4 border-t border-neutral-200/70 dark:border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-display font-bold text-neutral-900 dark:text-white">
                  {t(lang, 'levelLabel')} {user.level.level}
                </span>
                <span className="font-mono-tabular text-neutral-500 dark:text-neutral-400">
                  {user.level.xpIntoLevel}/{user.level.xpNeededForLevel} XP
                </span>
              </div>
              <AnimatedProgressBar
                value={Math.max(3, user.level.progressPct)}
                max={100}
                trackClassName="h-2 w-full rounded-full bg-neutral-200/80 dark:bg-neutral-800 overflow-hidden"
                barClassName="h-full w-full rounded-full bg-[#FFCE00]"
                glowOnIncrease
              />
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono-tabular">
                {user.xpTotal} XP · {t(lang, 'nextLevelProgress')}
              </div>
            </div>
          )}
        </motion.section>
      </div>

      {/* =====================================================================
          TIER 2: INTERACTIVE MISTAKE REVIEW SECTION
          ===================================================================== */}
      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-7 space-y-5">
        {/* Section Header + Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="space-y-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-neutral-950 dark:text-white">
              {mistakes.length > 0
                ? t(lang, 'learnFromMistakesTitle')
                : t(lang, 'noMistakesPerfectTitle')}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              {mistakes.length > 0
                ? t(lang, 'learnFromMistakesSubtitle')
                : t(lang, 'noMistakesPerfectDesc')}
            </p>
            {mistakes.length > 0 && (
              <p className="text-xs font-mono-tabular font-semibold text-[#DD0000] dark:text-red-300 pt-0.5">
                {mistakes.length}{' '}
                {mistakes.length === 1
                  ? t(lang, 'mistakesToReviewSingle')
                  : t(lang, 'mistakesToReviewPlural')}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {anyExpandable && (
              <button
                type="button"
                onClick={toggleAllExplanations}
                className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-2.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer min-h-[38px] whitespace-nowrap"
              >
                {allExpanded ? t(lang, 'collapseAllExplanationsBtn') : t(lang, 'expandAllExplanationsBtn')}
              </button>
            )}

            {/* Segmented filter tabs to keep mistakes & correct answers cleanly separated */}
            {mistakes.length > 0 && correctItems.length > 0 && (
              <div
                className="inline-flex rounded-xl border border-neutral-200 dark:border-neutral-800 p-1 bg-neutral-100/80 dark:bg-neutral-900"
                role="tablist"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={reviewFilter === 'mistakes'}
                  onClick={() => setReviewFilter('mistakes')}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer min-h-[34px] whitespace-nowrap ${
                    reviewFilter === 'mistakes'
                      ? 'text-[#DD0000] dark:text-red-300'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {reviewFilter === 'mistakes' && (
                    <motion.span
                      layoutId="results-filter-tab"
                      transition={reducedMotion ? { duration: 0.01 } : MOTION_SPRING.snappy}
                      className="absolute inset-0 rounded-lg bg-white dark:bg-[#1B1F2A] shadow-xs"
                    />
                  )}
                  <span className="relative z-10">
                    {t(lang, 'filterMistakesTab')} ({mistakes.length})
                  </span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={reviewFilter === 'correct'}
                  onClick={() => setReviewFilter('correct')}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer min-h-[34px] whitespace-nowrap ${
                    reviewFilter === 'correct'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {reviewFilter === 'correct' && (
                    <motion.span
                      layoutId="results-filter-tab"
                      transition={reducedMotion ? { duration: 0.01 } : MOTION_SPRING.snappy}
                      className="absolute inset-0 rounded-lg bg-white dark:bg-[#1B1F2A] shadow-xs"
                    />
                  )}
                  <span className="relative z-10">
                    {t(lang, 'filterCorrectTab')} ({correctItems.length})
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Review Cards List */}
        <div className="space-y-4">
          {visibleItems.map(({ row, exerciseNumber, question }) => {
            const cardKey = `${row.questionId}-${exerciseNumber}`;
            const isExpanded = Boolean(expandedMap[cardKey]);
            const exType = question?.type;
            const statusText = row.isCorrect
              ? t(lang, 'correctLabel')
              : row.skipped
              ? t(lang, 'skippedTag')
              : row.timedOut
              ? t(lang, 'timedOutTag')
              : t(lang, 'incorrectLabel');

            const userAnswerDisplay = row.skipped
              ? t(lang, 'skippedTag')
              : row.timedOut
              ? t(lang, 'timedOutTag')
              : row.userAnswer || '—';

            return (
              <article
                key={cardKey}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161922] hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors overflow-hidden"
              >
                {/* 1. Question Header */}
                <div className="px-4 sm:px-5 py-3 bg-neutral-50/70 dark:bg-neutral-900/50 border-b border-neutral-200/80 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="font-mono-tabular font-bold text-neutral-900 dark:text-white">
                      {t(lang, 'exerciseNumberPrefix')} #{exerciseNumber}
                    </span>
                    {exType && (
                      <>
                        <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
                          ·
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                          <span className="text-neutral-500 dark:text-neutral-400">
                            {EXERCISE_TYPE_ICON[exType]}
                          </span>
                          <span>{getExerciseTypeLabel(lang, exType)}</span>
                        </span>
                      </>
                    )}
                    {question?.cefr_level && (
                      <>
                        <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
                          ·
                        </span>
                        <span className="font-mono-tabular text-neutral-500 dark:text-neutral-400">
                          {question.cefr_level}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        row.isCorrect
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-[#DD0000] dark:text-red-300'
                      }`}
                    >
                      {row.isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      <span>{statusText}</span>
                    </span>

                    {!row.isCorrect && question && (
                      <button
                        type="button"
                        onClick={() => onRetryMistakes([row.questionId])}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:border-[#DD0000] hover:text-[#DD0000] dark:hover:border-[#FFCE00] dark:hover:text-[#FFCE00] transition-colors cursor-pointer min-h-[36px]"
                      >
                        <RotateCcw size={12} />
                        <span>{t(lang, 'retryQuestionBtn')}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Original Question + 3/4. Answer Comparison */}
                <div className="p-4 sm:p-5 space-y-4">
                  <FormatAwareQuestionView row={row} question={question} lang={lang} />

                  {/* Your Answer vs Correct Answer */}
                  {row.isCorrect ? (
                    <div className="rounded-xl border border-emerald-600/30 bg-emerald-50/70 dark:bg-emerald-950/30 px-4 py-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 size={14} className="shrink-0" />
                        <span>{t(lang, 'correctAnswerWasLabel')}</span>
                      </div>
                      {exType === 'sentence_construction' ? (
                        <div className="flex flex-wrap gap-1.5">
                          {row.correctAnswer.split(/\s+/).filter(Boolean).map((w, wi) => (
                            <span
                              key={`sc-ok-${wi}`}
                              className="px-2 py-1 rounded-lg border border-emerald-600/30 bg-white/80 dark:bg-emerald-950/60 text-xs sm:text-sm font-semibold text-emerald-950 dark:text-emerald-100"
                            >
                              {w}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm sm:text-[15px] font-semibold text-emerald-950 dark:text-emerald-100 break-words">
                          {row.correctAnswer}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-xl border border-[#DD0000]/30 bg-[#DD0000]/[0.05] dark:bg-[#DD0000]/12 px-4 py-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#b00000] dark:text-red-300">
                          <XCircle size={14} className="shrink-0" />
                          <span>{t(lang, 'yourAnswerLabel')}</span>
                        </div>
                        {exType === 'sentence_construction' && !row.skipped && !row.timedOut && row.userAnswer ? (
                          <div className="flex flex-wrap gap-1.5">
                            {row.userAnswer.split(/\s+/).filter(Boolean).map((w, wi) => (
                              <span
                                key={`sc-u-${wi}`}
                                className="px-2 py-1 rounded-lg border border-[#DD0000]/25 bg-white/80 dark:bg-neutral-900/70 text-xs sm:text-sm font-medium text-neutral-900 dark:text-red-100"
                              >
                                {w}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm sm:text-[15px] font-medium text-neutral-900 dark:text-red-100 break-words">
                            {userAnswerDisplay}
                          </div>
                        )}
                      </div>

                      <div className="rounded-xl border border-emerald-600/35 bg-emerald-50/80 dark:bg-emerald-950/30 px-4 py-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 size={14} className="shrink-0" />
                          <span>{t(lang, 'correctAnswerWasLabel')}</span>
                        </div>
                        {exType === 'sentence_construction' ? (
                          <div className="flex flex-wrap gap-1.5">
                            {row.correctAnswer.split(/\s+/).filter(Boolean).map((w, wi) => (
                              <span
                                key={`sc-c-${wi}`}
                                className="px-2 py-1 rounded-lg border border-emerald-600/30 bg-white/85 dark:bg-emerald-950/60 text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100"
                              >
                                {w}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm sm:text-[15px] font-bold text-emerald-950 dark:text-emerald-100 break-words">
                            {row.correctAnswer}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Expandable Educational Explanation */}
                {row.explanation && (
                  <div className="border-t border-neutral-100 dark:border-neutral-800 px-4 sm:px-5 py-2.5 bg-neutral-50/40 dark:bg-neutral-900/25">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(cardKey)}
                      aria-expanded={isExpanded}
                      className="w-full flex items-center justify-between gap-3 py-1.5 text-left cursor-pointer group min-h-[40px]"
                    >
                      <span className="flex items-center gap-2 min-w-0 flex-1">
                        <Lightbulb
                          size={15}
                          className="text-sky-600 dark:text-sky-400 shrink-0"
                        />
                        {isExpanded ? (
                          <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">
                            {t(lang, 'hideExplanationBtn')}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-semibold text-sky-700 dark:text-sky-300 shrink-0 group-hover:underline">
                              {t(lang, 'readExplanationBtn')}
                            </span>
                            <span className="hidden sm:inline text-xs text-neutral-500 dark:text-neutral-400 truncate">
                              — {row.explanation}
                            </span>
                          </span>
                        )}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-neutral-400 shrink-0 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          variants={accordionVariants}
                          initial={reducedMotion ? false : 'initial'}
                          animate="animate"
                          exit="exit"
                          className="overflow-hidden"
                        >
                          <div className="pb-2 pt-1 pl-6 text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed break-words">
                            {row.explanation}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          TIER 3: LEARNING INSIGHTS SECTION (Strictly Data-Driven)
          ===================================================================== */}
      {(learningInsights.showTopicInsights || learningInsights.showFormatInsights) && (
        <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-7 space-y-5">
          <div>
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              {t(lang, 'learningInsightsTitle')}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              {t(lang, 'learningInsightsSubtitle')}
            </p>
          </div>

          <div
            className={`grid gap-6 ${
              learningInsights.showTopicInsights && learningInsights.showFormatInsights
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1'
            }`}
          >
            {learningInsights.showTopicInsights && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {t(lang, 'insightByTopicHeading')}
                </h4>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {learningInsights.topics.map((topic) => {
                    const statusLabel =
                      topic.accuracyPct >= 85
                        ? t(lang, 'insightStrongPerformance')
                        : topic.accuracyPct >= 65
                        ? t(lang, 'insightGoodPerformance')
                        : t(lang, 'insightNeedsPractice');

                    const statusTone =
                      topic.accuracyPct >= 85
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : topic.accuracyPct >= 65
                        ? 'text-sky-700 dark:text-sky-400'
                        : 'text-[#DD0000] dark:text-red-300';

                    return (
                      <div
                        key={topic.slug}
                        className="py-2.5 flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-neutral-900 dark:text-white truncate">
                            {topic.label}
                          </div>
                          <div className={`text-xs font-medium ${statusTone}`}>
                            {statusLabel}
                          </div>
                        </div>
                        <div className="text-right shrink-0 font-mono-tabular">
                          <div className="text-sm font-bold text-neutral-900 dark:text-white">
                            {topic.accuracyPct}%
                          </div>
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            {topic.correct}/{topic.attempts}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {learningInsights.showFormatInsights && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {t(lang, 'insightByFormatHeading')}
                </h4>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {learningInsights.formats.map((fmt) => (
                    <div
                      key={fmt.type}
                      className="py-2.5 flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center shrink-0">
                          {EXERCISE_TYPE_ICON[fmt.type]}
                        </span>
                        <div className="min-w-0">
                          <div className="font-medium text-neutral-900 dark:text-white truncate">
                            {fmt.label}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono-tabular">
                            {fmt.mistakes > 0
                              ? `${fmt.mistakes} ${t(lang, 'mistakesCountShort')}`
                              : t(lang, 'insightStrongPerformance')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 font-mono-tabular">
                        <div
                          className={`text-sm font-bold ${
                            fmt.mistakes === 0
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : fmt.accuracyPct < 60
                              ? 'text-[#DD0000] dark:text-red-300'
                              : 'text-neutral-900 dark:text-white'
                          }`}
                        >
                          {fmt.accuracyPct}%
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {fmt.correct}/{fmt.attempts}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =====================================================================
          TIER 4: FINAL SESSION ACTION SECTION
          ===================================================================== */}
      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {mistakes.length > 0 ? (
            <>
              <button
                type="button"
                onClick={() => onRetryMistakes()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#DD0000] hover:bg-[#b80000] active:scale-[0.99] text-white text-sm font-bold transition-all cursor-pointer min-h-[48px] w-full sm:w-auto whitespace-nowrap"
              >
                <RotateCcw size={16} />
                <span>{t(lang, 'practiceMistakesAgainBtn')}</span>
              </button>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  onClick={onNewSession}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 dark:bg-white hover:opacity-90 active:scale-[0.99] text-white dark:text-black text-sm font-semibold transition-all cursor-pointer min-h-[48px] whitespace-nowrap"
                >
                  <Play size={15} />
                  <span>{t(lang, 'startAnotherSessionBtn')}</span>
                </button>
                <button
                  type="button"
                  onClick={onDashboard}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white text-neutral-800 dark:text-neutral-200 text-sm font-medium transition-colors cursor-pointer min-h-[48px] whitespace-nowrap"
                >
                  <Home size={15} />
                  <span>{t(lang, 'backToDashboardBtn')}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onNewSession}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#DD0000] hover:bg-[#b80000] active:scale-[0.99] text-white text-sm font-bold transition-all cursor-pointer min-h-[48px] w-full sm:w-auto whitespace-nowrap"
              >
                <Play size={16} />
                <span>{t(lang, 'startAnotherSessionBtn')}</span>
              </button>
              <button
                type="button"
                onClick={onDashboard}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white text-neutral-800 dark:text-neutral-200 text-sm font-medium transition-colors cursor-pointer min-h-[48px] w-full sm:w-auto whitespace-nowrap"
              >
                <ArrowLeft size={15} />
                <span>{t(lang, 'backToDashboardBtn')}</span>
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
