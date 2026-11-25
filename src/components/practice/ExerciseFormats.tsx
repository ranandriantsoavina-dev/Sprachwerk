import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ArrowRightLeft,
  Check,
  CheckCircle2,
  Copy,
  Keyboard,
  Layers,
  Link2,
  RotateCcw,
  Unlink2,
  X,
  XCircle,
} from 'lucide-react';
import { t } from '../../i18n/translations';
import { scrollInputIntoSafeView } from '../../hooks/useKeyboardViewport';
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_SPRING,
  SHAKE_KEYFRAMES,
  pulseTransition,
  shakeTransition,
} from '../../lib/motion';
import type { InterfaceLang, Question } from '../../types/domain';
import {
  computeWordDiff,
  extractStructuredPrompt,
  getMultiSelectOptionsFromDraft,
  isMultiSelectQuestion,
  parseGapFillPrompt,
} from '../../utils/exerciseHelpers';
import { GermanCharBar } from './GermanCharBar';

export interface EvaluatedFeedback {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  skipped: boolean;
  timedOut: boolean;
}

interface CommonExerciseProps {
  question: Question;
  displayPrompt: string;
  lang: InterfaceLang;
  draftAnswer: string;
  setDraftAnswer: React.Dispatch<React.SetStateAction<string>>;
  checkedFeedback: EvaluatedFeedback | null;
  onSubmit: () => void;
  reducedMotion?: boolean;
}

function insertCharAtSelection(
  el: HTMLInputElement | HTMLTextAreaElement | null,
  currentValue: string,
  char: string,
  applyValue: (next: string) => void
) {
  if (!el) {
    applyValue(currentValue + char);
    return;
  }
  const start = el.selectionStart ?? currentValue.length;
  const end = el.selectionEnd ?? currentValue.length;
  const next = currentValue.slice(0, start) + char + currentValue.slice(end);
  applyValue(next);
  requestAnimationFrame(() => {
    try {
      el.focus();
      el.setSelectionRange(start + char.length, start + char.length);
    } catch {
      // ignore selection failures
    }
  });
}

/* ============================================================================
   1. MULTIPLE CHOICE
   ============================================================================ */
export const MultipleChoiceExercise: React.FC<CommonExerciseProps> = ({
  question,
  displayPrompt,
  lang,
  draftAnswer,
  setDraftAnswer,
  checkedFeedback,
  reducedMotion,
}) => {
  const options = question.options_de || [];
  const multiSelect = useMemo(() => isMultiSelectQuestion(question), [question]);
  const selectedSet = useMemo(() => {
    if (multiSelect) {
      return new Set(getMultiSelectOptionsFromDraft(draftAnswer, options));
    }
    return new Set(draftAnswer ? [draftAnswer] : []);
  }, [multiSelect, draftAnswer, options]);

  const correctTokens = useMemo(() => {
    if (multiSelect) {
      return new Set(
        question.solution
          .split(/\s*[|,;]\s*/)
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }
    return new Set([question.solution]);
  }, [multiSelect, question.solution]);

  const useTwoColumns = useMemo(() => {
    const maxLen = options.reduce((m, o) => Math.max(m, o.length), 0);
    return options.length >= 2 && options.length <= 6 && maxLen <= 24;
  }, [options]);

  const parsed = useMemo(() => extractStructuredPrompt(displayPrompt), [displayPrompt]);

  const toggleOption = (opt: string) => {
    if (checkedFeedback) return;
    if (!multiSelect) {
      setDraftAnswer(opt);
      return;
    }
    const next = new Set(selectedSet);
    if (next.has(opt)) next.delete(opt);
    else next.add(opt);
    const ordered = options.filter((o) => next.has(o));
    setDraftAnswer(ordered.join(' | '));
  };

  // Keyboard shortcuts 1-6 on desktop
  useEffect(() => {
    if (checkedFeedback) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }
      const num = Number(e.key);
      if (num >= 1 && num <= options.length) {
        e.preventDefault();
        toggleOption(options[num - 1]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedFeedback, options, draftAnswer, multiSelect]);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        {parsed.context && (
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {parsed.context}
          </div>
        )}
        <p className="text-base sm:text-xl font-medium text-neutral-900 dark:text-white leading-snug sm:leading-relaxed">
          {displayPrompt}
        </p>
        {multiSelect && (
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {t(lang, 'multipleAnswersHint')}
          </p>
        )}
      </div>

      <div
        className={`grid gap-2.5 sm:gap-3 ${
          useTwoColumns ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
        }`}
        role={multiSelect ? 'group' : 'radiogroup'}
      >
        {options.map((opt, idx) => {
          const isSelected = selectedSet.has(opt);
          const isCorrectOpt = correctTokens.has(opt);
          const showResult = Boolean(checkedFeedback);

          let cardClasses =
            'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161922] text-neutral-800 dark:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-600';
          let badgeClasses =
            'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400';

          if (!showResult && isSelected) {
            cardClasses =
              'border-[#DD0000] dark:border-[#FFCE00] bg-[#DD0000]/[0.06] dark:bg-[#FFCE00]/[0.10] text-neutral-950 dark:text-white ring-1 ring-[#DD0000]/30 dark:ring-[#FFCE00]/40';
            badgeClasses =
              'border-[#DD0000] dark:border-[#FFCE00] bg-[#DD0000] dark:bg-[#FFCE00] text-white dark:text-black';
          } else if (showResult && isCorrectOpt) {
            cardClasses =
              'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100';
            badgeClasses = 'border-emerald-600 bg-emerald-600 text-white';
          } else if (showResult && isSelected && !isCorrectOpt) {
            cardClasses =
              'border-[#DD0000] bg-[#DD0000]/10 dark:bg-[#DD0000]/18 text-[#9e0000] dark:text-red-200';
            badgeClasses = 'border-[#DD0000] bg-[#DD0000] text-white';
          } else if (showResult) {
            cardClasses =
              'border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-400 dark:text-neutral-500';
          }

          const animateState =
            reducedMotion || !showResult
              ? { scale: 1, x: 0 }
              : isCorrectOpt && (isSelected || checkedFeedback?.isCorrect)
              ? { scale: [1, 1.022, 1], x: 0 }
              : isSelected && !isCorrectOpt
              ? { x: SHAKE_KEYFRAMES, scale: 1 }
              : { scale: 1, x: 0 };

          const animateTransition =
            showResult && isSelected && !isCorrectOpt
              ? shakeTransition
              : showResult && isCorrectOpt
              ? pulseTransition
              : MOTION_SPRING.snappy;

          return (
            <motion.button
              key={`${opt}-${idx}`}
              type="button"
              disabled={showResult}
              animate={animateState}
              whileHover={!showResult && !reducedMotion ? { y: -1 } : undefined}
              whileTap={!showResult && !reducedMotion ? { scale: 0.98 } : undefined}
              transition={animateTransition}
              onClick={() => toggleOption(opt)}
              aria-pressed={isSelected}
              className={`group relative w-full text-left px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl border-2 border-b-[3px] text-[15px] font-medium transition-colors cursor-pointer disabled:cursor-default min-h-[50px] flex items-center justify-between gap-3 ${cardClasses}`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-7 h-7 rounded-lg border text-xs font-mono-tabular font-bold flex items-center justify-center shrink-0 transition-colors ${badgeClasses}`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="break-words leading-snug">{opt}</span>
              </span>

              <span className="shrink-0 flex items-center">
                {showResult && isCorrectOpt && (
                  <motion.span
                    initial={reducedMotion ? false : { scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={MOTION_SPRING.pop}
                    className="inline-flex"
                  >
                    <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </motion.span>
                )}
                {showResult && isSelected && !isCorrectOpt && (
                  <motion.span
                    initial={reducedMotion ? false : { scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={MOTION_SPRING.pop}
                    className="inline-flex"
                  >
                    <XCircle size={18} className="text-[#DD0000] dark:text-red-400" />
                  </motion.span>
                )}
                {!showResult && isSelected && (
                  <motion.span
                    initial={reducedMotion ? false : { scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={MOTION_SPRING.pop}
                    className="inline-flex"
                  >
                    <Check size={16} strokeWidth={2.75} className="text-[#DD0000] dark:text-[#FFCE00]" />
                  </motion.span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   2. GAP FILL (Inline Sentence Inputs + Multi-Blank Support)
   ============================================================================ */
export const GapFillExercise: React.FC<CommonExerciseProps> = ({
  question,
  displayPrompt,
  lang,
  draftAnswer,
  setDraftAnswer,
  checkedFeedback,
  onSubmit,
  reducedMotion,
}) => {
  const parsed = useMemo(
    () => parseGapFillPrompt(displayPrompt, question.solution),
    [displayPrompt, question.solution]
  );

  const blankCount = Math.max(1, parsed.blankCount);
  const [values, setValues] = useState<string[]>(() => Array(blankCount).fill(''));
  const [focusedIdx, setFocusedIdx] = useState<number>(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Reset per question
  useEffect(() => {
    setValues(Array(blankCount).fill(''));
    setFocusedIdx(0);
    const timer = window.setTimeout(() => {
      // Focus first blank on desktop without jumping on mobile if not user-initiated
      if (window.innerWidth >= 768) {
        inputRefs.current[0]?.focus({ preventScroll: true });
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [question.id, blankCount]);

  // Sync draftAnswer whenever values change
  const updateBlank = (idx: number, nextVal: string) => {
    if (checkedFeedback) return;
    setValues((prev) => {
      const next = [...prev];
      next[idx] = nextVal;
      if (blankCount === 1) {
        setDraftAnswer(next[0] ?? '');
      } else {
        const allFilled = next.every((v) => v.trim().length > 0);
        setDraftAnswer(allFilled ? next.map((v) => v.trim()).join(parsed.separator) : '');
      }
      return next;
    });
  };

  const handleInsertGermanChar = (char: string) => {
    if (checkedFeedback) return;
    const targetIdx = Math.min(Math.max(0, focusedIdx), blankCount - 1);
    const el = inputRefs.current[targetIdx];
    const current = values[targetIdx] ?? '';
    insertCharAtSelection(el, current, char, (next) => updateBlank(targetIdx, next));
  };

  const renderInlineInput = (blankIndex: number, expectedLen = 5) => {
    const val = values[blankIndex] ?? '';
    const isActive = !checkedFeedback && focusedIdx === blankIndex;
    const charWidth = Math.min(
      22,
      Math.max(expectedLen + 2.2, val.length + 2.2, 4.0)
    );

    let stateClasses =
      'border-neutral-400 dark:border-neutral-600 bg-neutral-100/90 dark:bg-neutral-800/90 text-neutral-950 dark:text-white';

    if (checkedFeedback) {
      if (checkedFeedback.isCorrect) {
        stateClasses =
          'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold';
      } else {
        stateClasses =
          'border-[#DD0000] bg-[#DD0000]/10 dark:bg-[#DD0000]/20 text-[#b00000] dark:text-red-200 font-semibold';
      }
    } else if (isActive) {
      stateClasses =
        'border-[#DD0000] dark:border-[#FFCE00] bg-[#DD0000]/[0.06] dark:bg-[#FFCE00]/[0.12] text-neutral-950 dark:text-white ring-2 ring-[#DD0000]/20 dark:ring-[#FFCE00]/25';
    } else if (val.trim()) {
      stateClasses =
        'border-neutral-900 dark:border-neutral-300 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white font-semibold';
    }

    return (
      <input
        key={`blank-${blankIndex}`}
        ref={(el) => {
          inputRefs.current[blankIndex] = el;
        }}
        type="text"
        value={val}
        disabled={Boolean(checkedFeedback)}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint={blankIndex < blankCount - 1 ? 'next' : 'done'}
        aria-label={`${t(lang, 'gapBlankAriaLabel')} ${blankIndex + 1}`}
        style={{ width: `${charWidth}ch` }}
        onFocus={(e) => {
          setFocusedIdx(blankIndex);
          scrollInputIntoSafeView(e.currentTarget);
        }}
        onChange={(e) => updateBlank(blankIndex, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !checkedFeedback) {
            e.preventDefault();
            if (blankIndex < blankCount - 1) {
              inputRefs.current[blankIndex + 1]?.focus();
            } else if (draftAnswer.trim()) {
              onSubmit();
            }
          }
        }}
        className={`inline-block align-baseline mx-0.5 px-1.5 py-1 rounded-lg border-b-2 border border-t-transparent border-x-transparent text-center text-base sm:text-lg font-medium focus:outline-none transition-colors min-h-[36px] max-w-full ${stateClasses}`}
      />
    );
  };

  return (
    <div className="space-y-4">
      {parsed.context && (
        <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {parsed.context}
        </div>
      )}

      {parsed.blankCount > 0 ? (
        <motion.div
          animate={
            reducedMotion || !checkedFeedback
              ? { x: 0, scale: 1 }
              : checkedFeedback.isCorrect
              ? { scale: [1, 1.015, 1], x: 0 }
              : { x: SHAKE_KEYFRAMES, scale: 1 }
          }
          transition={checkedFeedback?.isCorrect ? pulseTransition : shakeTransition}
          className={`rounded-xl border px-4 py-4 sm:px-5 sm:py-5 transition-colors ${
            checkedFeedback
              ? checkedFeedback.isCorrect
                ? 'border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20'
                : 'border-[#DD0000]/50 bg-[#DD0000]/[0.04] dark:bg-[#DD0000]/10'
              : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50'
          }`}
        >
          <div className="text-[17px] sm:text-xl font-medium text-neutral-900 dark:text-white leading-[2.15] sm:leading-[2.2] break-words">
            {parsed.sentenceClusters.map((cluster, cIdx) => {
              if (!cluster.hasBlank) {
                return (
                  <React.Fragment key={`c-${cIdx}`}>
                    {cluster.tokens.map((tok, tIdx) => (
                      <span key={`t-${tIdx}`}>{tok.value}</span>
                    ))}
                  </React.Fragment>
                );
              }
              return (
                <span key={`c-${cIdx}`} className="inline-flex items-baseline whitespace-nowrap">
                  {cluster.tokens.map((tok, tIdx) =>
                    tok.type === 'blank' ? (
                      renderInlineInput(tok.blankIndex ?? 0, tok.expectedLength)
                    ) : (
                      <span key={`t-${tIdx}`}>{tok.value}</span>
                    )
                  )}
                </span>
              );
            })}
          </div>
        </motion.div>
      ) : (
        /* Graceful fallback if a prompt contains no ___ marker */
        <div className="space-y-3">
          <p className="text-base sm:text-xl font-medium text-neutral-900 dark:text-white leading-relaxed">
            {displayPrompt}
          </p>
          <div>{renderInlineInput(0, Math.max(6, question.solution.length))}</div>
        </div>
      )}

      {parsed.instruction && (
        <p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {parsed.instruction}
        </p>
      )}

      {!checkedFeedback && (
        <GermanCharBar
          onInsert={handleInsertGermanChar}
          disabled={Boolean(checkedFeedback)}
          label={t(lang, 'specialCharsLabel')}
        />
      )}
    </div>
  );
};

/* ============================================================================
   3. SENTENCE CONSTRUCTION (Interactive Word Tiles + Reordering + Type Option)
   ============================================================================ */
interface SentenceConstructionProps extends CommonExerciseProps {
  usedFragmentIndices: number[];
  setUsedFragmentIndices: React.Dispatch<React.SetStateAction<number[]>>;
}

export const SentenceConstructionExercise: React.FC<SentenceConstructionProps> = ({
  question,
  displayPrompt,
  lang,
  draftAnswer,
  setDraftAnswer,
  checkedFeedback,
  onSubmit,
  usedFragmentIndices,
  setUsedFragmentIndices,
  reducedMotion,
}) => {
  const fragments = question.fragments_de || [];
  const [typeMode, setTypeMode] = useState(false);
  const [draggedPos, setDraggedPos] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTypeMode(false);
    setDraggedPos(null);
  }, [question.id]);

  const syncFromIndices = (nextIndices: number[]) => {
    setUsedFragmentIndices(nextIndices);
    const sentence = nextIndices.map((i) => fragments[i]).join(' ').trim();
    setDraftAnswer(sentence);
  };

  const handleBankTap = (fragIdx: number) => {
    if (checkedFeedback || usedFragmentIndices.includes(fragIdx)) return;
    syncFromIndices([...usedFragmentIndices, fragIdx]);
  };

  const handleTrayRemove = (positionIdx: number) => {
    if (checkedFeedback) return;
    const next = usedFragmentIndices.filter((_, i) => i !== positionIdx);
    syncFromIndices(next);
  };

  const handleMovePosition = (fromPos: number, toPos: number) => {
    if (checkedFeedback || fromPos === toPos || toPos < 0 || toPos >= usedFragmentIndices.length) {
      return;
    }
    const next = [...usedFragmentIndices];
    const [moved] = next.splice(fromPos, 1);
    next.splice(toPos, 0, moved);
    syncFromIndices(next);
  };

  const handleReset = () => {
    if (checkedFeedback) return;
    setUsedFragmentIndices([]);
    setDraftAnswer('');
  };

  const parsed = useMemo(() => extractStructuredPrompt(displayPrompt), [displayPrompt]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {parsed.context && (
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {parsed.context}
          </div>
        )}
        <p className="text-base sm:text-xl font-medium text-neutral-900 dark:text-white leading-snug sm:leading-relaxed">
          {displayPrompt}
        </p>
      </div>

      {/* Mode & Reset Controls */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-neutral-500 dark:text-neutral-400">
          {t(lang, 'tapFragmentsHint')}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {fragments.length > 0 && !checkedFeedback && (
            <button
              type="button"
              onClick={() => {
                setTypeMode((m) => !m);
                if (!typeMode) {
                  requestAnimationFrame(() => inputRef.current?.focus());
                }
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400 font-medium cursor-pointer min-h-[34px] whitespace-nowrap"
            >
              {typeMode ? <Layers size={13} /> : <Keyboard size={13} />}
              <span>{typeMode ? t(lang, 'useTilesBtn') : t(lang, 'typeInsteadBtn')}</span>
            </button>
          )}
          {usedFragmentIndices.length > 0 && !checkedFeedback && !typeMode && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[#DD0000] dark:text-[#FFCE00] hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold cursor-pointer min-h-[34px] whitespace-nowrap"
            >
              <RotateCcw size={13} />
              <span>{t(lang, 'resetOrderBtn')}</span>
            </button>
          )}
        </div>
      </div>

      {!typeMode && fragments.length > 0 ? (
        <div className="space-y-4">
          {/* Answer Tray */}
          <motion.div
            animate={
              reducedMotion || !checkedFeedback
                ? { x: 0, scale: 1 }
                : checkedFeedback.isCorrect
                ? { scale: [1, 1.015, 1], x: 0 }
                : { x: SHAKE_KEYFRAMES, scale: 1 }
            }
            transition={checkedFeedback?.isCorrect ? pulseTransition : shakeTransition}
            className={`min-h-[76px] rounded-xl border-2 p-3 transition-colors flex flex-wrap items-center gap-2 ${
              checkedFeedback
                ? checkedFeedback.isCorrect
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30'
                  : 'border-[#DD0000] bg-[#DD0000]/5 dark:bg-[#DD0000]/15'
                : usedFragmentIndices.length > 0
                ? 'border-neutral-300 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-900/60'
                : 'border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/40 dark:bg-neutral-900/30'
            }`}
          >
            {usedFragmentIndices.length === 0 ? (
              <span className="text-sm text-neutral-400 dark:text-neutral-500 px-1 select-none">
                {t(lang, 'yourSentencePlaceholder')}
              </span>
            ) : (
              usedFragmentIndices.map((fragIdx, pos) => {
                const text = fragments[fragIdx];
                return (
                  <motion.button
                    key={`placed-${fragIdx}`}
                    layout={!reducedMotion}
                    initial={reducedMotion ? false : { scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    type="button"
                    disabled={Boolean(checkedFeedback)}
                    draggable={!checkedFeedback}
                    onDragStart={() => setDraggedPos(pos)}
                    onDragOver={(e) => {
                      if (draggedPos !== null && draggedPos !== pos) {
                        e.preventDefault();
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedPos !== null && draggedPos !== pos) {
                        handleMovePosition(draggedPos, pos);
                      }
                      setDraggedPos(null);
                    }}
                    onDragEnd={() => setDraggedPos(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        handleMovePosition(pos, pos - 1);
                      } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        handleMovePosition(pos, pos + 1);
                      }
                    }}
                    onClick={() => handleTrayRemove(pos)}
                    className={`px-3.5 py-2 rounded-xl border-2 border-b-[3px] text-[15px] font-semibold min-h-[42px] inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-default select-none shadow-xs ${
                      checkedFeedback
                        ? checkedFeedback.isCorrect
                          ? 'border-emerald-600 bg-white dark:bg-neutral-900 text-emerald-900 dark:text-emerald-200'
                          : 'border-[#DD0000] bg-white dark:bg-neutral-900 text-[#b00000] dark:text-red-200'
                        : 'border-neutral-900 dark:border-neutral-200 bg-white dark:bg-[#1B1F2A] text-neutral-950 dark:text-white hover:border-[#DD0000] dark:hover:border-[#FFCE00] active:scale-95'
                    }`}
                  >
                    <span>{text}</span>
                    {!checkedFeedback && (
                      <X size={13} className="text-neutral-400 shrink-0" aria-hidden="true" />
                    )}
                  </motion.button>
                );
              })
            )}
          </motion.div>

          {/* Word Bank */}
          <div className="flex flex-wrap gap-2 pt-1">
            {fragments.map((frag, fragIdx) => {
              const used = usedFragmentIndices.includes(fragIdx);
              return (
                <div key={`slot-${fragIdx}`} className="relative">
                  {used ? (
                    <div
                      aria-hidden="true"
                      className="px-3.5 py-2 rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900/50 text-transparent text-[15px] font-semibold min-h-[42px] select-none"
                    >
                      {frag}
                    </div>
                  ) : (
                    <motion.button
                      layout={!reducedMotion}
                      whileTap={!checkedFeedback && !reducedMotion ? { scale: 0.95 } : undefined}
                      transition={{ duration: 0.14 }}
                      type="button"
                      disabled={Boolean(checkedFeedback)}
                      onClick={() => handleBankTap(fragIdx)}
                      className="px-3.5 py-2 rounded-xl border-2 border-b-[3px] border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#161922] text-neutral-900 dark:text-white text-[15px] font-semibold hover:border-[#DD0000] dark:hover:border-[#FFCE00] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default min-h-[42px]"
                    >
                      {frag}
                    </motion.button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            ref={inputRef}
            type="text"
            value={draftAnswer}
            disabled={Boolean(checkedFeedback)}
            onFocus={(e) => scrollInputIntoSafeView(e.currentTarget)}
            onChange={(e) => setDraftAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !checkedFeedback && draftAnswer.trim()) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder={t(lang, 'answerPlaceholder')}
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-base focus:outline-none focus:border-[#DD0000] dark:focus:border-[#FFCE00]"
          />
          {!checkedFeedback && (
            <GermanCharBar
              onInsert={(ch) =>
                insertCharAtSelection(inputRef.current, draftAnswer, ch, setDraftAnswer)
              }
              label={t(lang, 'specialCharsLabel')}
            />
          )}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   4. TRANSLATION
   ============================================================================ */
export const TranslationExercise: React.FC<CommonExerciseProps> = ({
  question,
  displayPrompt,
  lang,
  draftAnswer,
  setDraftAnswer,
  checkedFeedback,
  onSubmit,
  reducedMotion,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const parsed = useMemo(() => extractStructuredPrompt(displayPrompt), [displayPrompt]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(68, textareaRef.current.scrollHeight)}px`;
    }
  }, [draftAnswer, question.id]);

  return (
    <div className="space-y-4">
      {parsed.primarySentence ? (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {parsed.instruction || t(lang, 'sourceSentenceLabel')}
            </span>
            {parsed.note && (
              <span className="text-xs font-medium text-[#DD0000] dark:text-[#FFCE00]">
                {parsed.note}
              </span>
            )}
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/70 px-4 py-3.5 sm:px-5 sm:py-4">
            <p className="text-lg sm:text-xl font-display font-semibold text-neutral-950 dark:text-white leading-relaxed">
              {parsed.primarySentence}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-base sm:text-xl font-medium text-neutral-900 dark:text-white leading-relaxed">
          {displayPrompt}
        </p>
      )}

      <div className="space-y-2.5">
        <motion.div
          animate={
            reducedMotion || !checkedFeedback
              ? { x: 0, scale: 1 }
              : checkedFeedback.isCorrect
              ? { scale: [1, 1.012, 1], x: 0 }
              : { x: SHAKE_KEYFRAMES, scale: 1 }
          }
          transition={checkedFeedback?.isCorrect ? pulseTransition : shakeTransition}
        >
          <textarea
            ref={textareaRef}
            rows={2}
            value={draftAnswer}
            disabled={Boolean(checkedFeedback)}
            autoCapitalize="sentences"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            onFocus={(e) => scrollInputIntoSafeView(e.currentTarget)}
            onChange={(e) => setDraftAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !checkedFeedback && draftAnswer.trim()) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder={t(lang, 'answerPlaceholder')}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#161922] text-neutral-950 dark:text-white text-base leading-relaxed resize-none focus:outline-none transition-colors ${
              checkedFeedback
                ? checkedFeedback.isCorrect
                  ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-[#DD0000] bg-[#DD0000]/5 dark:bg-[#DD0000]/15'
                : 'border-neutral-300 dark:border-neutral-700 focus:border-[#DD0000] dark:focus:border-[#FFCE00]'
            }`}
          />
        </motion.div>

        {!checkedFeedback && (
          <GermanCharBar
            onInsert={(ch) =>
              insertCharAtSelection(textareaRef.current, draftAnswer, ch, setDraftAnswer)
            }
            label={t(lang, 'specialCharsLabel')}
          />
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   5. MATCHING (Desktop 2-Column + Mobile Sequential Selection, Shared Logic)
   ============================================================================ */
interface MatchingExerciseProps extends CommonExerciseProps {
  shuffledRightOptions: string[];
  selectedLeftIdx: number | null;
  setSelectedLeftIdx: React.Dispatch<React.SetStateAction<number | null>>;
  matchedPairs: Record<number, string>;
  setMatchedPairs: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

const PAIR_BADGE_STYLES = [
  'bg-black text-white dark:bg-white dark:text-black',
  'bg-[#DD0000] text-white',
  'bg-[#FFCE00] text-black',
  'bg-emerald-600 text-white',
  'bg-sky-600 text-white',
  'bg-amber-700 text-white',
];

export const MatchingExercise: React.FC<MatchingExerciseProps> = ({
  question,
  displayPrompt,
  lang,
  setDraftAnswer,
  checkedFeedback,
  shuffledRightOptions,
  selectedLeftIdx,
  setSelectedLeftIdx,
  matchedPairs,
  setMatchedPairs,
  reducedMotion,
}) => {
  const pairs = question.matching_pairs || [];
  const [selectedRightVal, setSelectedRightVal] = useState<string | null>(null);
  const [justMatchedIdx, setJustMatchedIdx] = useState<number | null>(null);

  useEffect(() => {
    setSelectedRightVal(null);
    setJustMatchedIdx(null);
  }, [question.id]);

  // Keep mobile sequential flow auto-targeted on an unmatched left item
  const activeMobileLeftIdx = useMemo(() => {
    if (selectedLeftIdx !== null) return selectedLeftIdx;
    const firstUnmatched = pairs.findIndex((_, idx) => matchedPairs[idx] === undefined);
    return firstUnmatched !== -1 ? firstUnmatched : null;
  }, [selectedLeftIdx, pairs, matchedPairs]);

  const syncMatchedToDraft = (nextPairs: Record<number, string>) => {
    setMatchedPairs(nextPairs);
    if (Object.keys(nextPairs).length === pairs.length) {
      const formatted = pairs
        .map((p, idx) => `${p.left} -> ${nextPairs[idx] ?? ''}`)
        .join(' | ');
      setDraftAnswer(formatted);
    } else {
      setDraftAnswer('');
    }
  };

  const commitPair = (leftIdx: number, rightVal: string) => {
    if (checkedFeedback) return;
    // Prevent overwriting an already-matched right or left item unless explicitly unlinked
    const alreadyUsedLeft = Object.entries(matchedPairs).find(([, v]) => v === rightVal);
    if (matchedPairs[leftIdx] !== undefined || alreadyUsedLeft) return;

    const nextPairs = { ...matchedPairs, [leftIdx]: rightVal };
    syncMatchedToDraft(nextPairs);
    setSelectedLeftIdx(null);
    setSelectedRightVal(null);
    setJustMatchedIdx(leftIdx);
    window.setTimeout(() => setJustMatchedIdx(null), 350);
  };

  const unlinkLeft = (leftIdx: number) => {
    if (checkedFeedback) return;
    const nextPairs = { ...matchedPairs };
    delete nextPairs[leftIdx];
    syncMatchedToDraft(nextPairs);
    setSelectedLeftIdx(leftIdx);
    setSelectedRightVal(null);
  };

  const handleDesktopLeftTap = (idx: number) => {
    if (checkedFeedback) return;
    if (matchedPairs[idx] !== undefined) {
      // Unlink cleanly on tap so user can fix a match intentionally
      unlinkLeft(idx);
      return;
    }
    if (selectedRightVal !== null) {
      commitPair(idx, selectedRightVal);
      return;
    }
    setSelectedLeftIdx(selectedLeftIdx === idx ? null : idx);
  };

  const handleDesktopRightTap = (rightVal: string) => {
    if (checkedFeedback) return;
    const ownerEntry = Object.entries(matchedPairs).find(([, v]) => v === rightVal);
    if (ownerEntry) {
      // Already matched — prevent accidental overwrite; user can unlink via left/unlink button
      return;
    }
    if (selectedLeftIdx !== null) {
      commitPair(selectedLeftIdx, rightVal);
      return;
    }
    setSelectedRightVal(selectedRightVal === rightVal ? null : rightVal);
  };

  const handleMobileRightTap = (rightVal: string) => {
    if (checkedFeedback) return;
    const targetLeft = activeMobileLeftIdx;
    if (targetLeft === null) return;
    const ownerEntry = Object.entries(matchedPairs).find(([, v]) => v === rightVal);
    if (ownerEntry) return;
    commitPair(targetLeft, rightVal);
  };

  const handleClearAll = () => {
    if (checkedFeedback) return;
    setSelectedLeftIdx(null);
    setSelectedRightVal(null);
    syncMatchedToDraft({});
  };

  const matchedCount = Object.keys(matchedPairs).length;
  const remainingCount = pairs.length - matchedCount;

  return (
    <div className="space-y-4">
      <p className="text-base sm:text-lg font-medium text-neutral-900 dark:text-white leading-snug sm:leading-relaxed">
        {displayPrompt}
      </p>

      <div className="flex items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <span className="hidden sm:inline">{t(lang, 'matchInstruction')}</span>
        <span className="sm:hidden">{t(lang, 'matchMobileInstruction')}</span>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono-tabular font-semibold">
            {matchedCount}/{pairs.length}
          </span>
          {matchedCount > 0 && !checkedFeedback && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-semibold text-[#DD0000] dark:text-[#FFCE00] hover:underline cursor-pointer"
            >
              {t(lang, 'matchClearAllBtn')}
            </button>
          )}
        </div>
      </div>

      {/* DESKTOP / TABLET: Comfortable Two-Column Interface */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-4">
        <div className="space-y-2.5">
          {pairs.map((pair, idx) => {
            const isSelected = selectedLeftIdx === idx;
            const assignedRight = matchedPairs[idx];
            const isMatched = assignedRight !== undefined;
            const isPairCorrect = checkedFeedback ? assignedRight === pair.right : null;
            const badgeStyle = PAIR_BADGE_STYLES[idx % PAIR_BADGE_STYLES.length];
            const rightLetter = isMatched
              ? String.fromCharCode(65 + shuffledRightOptions.indexOf(assignedRight))
              : null;

            let cardStyle =
              'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161922] text-neutral-800 dark:text-neutral-100 hover:border-neutral-400';

            if (checkedFeedback) {
              cardStyle = isPairCorrect
                ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                : 'border-[#DD0000] bg-[#DD0000]/10 dark:bg-[#DD0000]/20 text-neutral-900 dark:text-red-100';
            } else if (isSelected) {
              cardStyle =
                'border-[#DD0000] dark:border-[#FFCE00] bg-[#DD0000]/[0.06] dark:bg-[#FFCE00]/[0.12] text-neutral-950 dark:text-white ring-2 ring-[#DD0000]/25 dark:ring-[#FFCE00]/30';
            } else if (isMatched) {
              cardStyle =
                'border-neutral-800 dark:border-neutral-400 bg-neutral-50 dark:bg-neutral-900 text-neutral-950 dark:text-white';
            }

            return (
              <motion.button
                key={pair.left}
                type="button"
                disabled={Boolean(checkedFeedback)}
                animate={
                  !reducedMotion && justMatchedIdx === idx
                    ? { scale: [1, 1.025, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.2 }}
                onClick={() => handleDesktopLeftTap(idx)}
                className={`w-full text-left px-3.5 py-3 rounded-xl border-2 text-sm font-medium transition-colors cursor-pointer disabled:cursor-default min-h-[54px] flex items-center justify-between gap-2.5 ${cardStyle}`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-md text-xs font-mono-tabular font-bold flex items-center justify-center shrink-0 ${
                      isMatched || isSelected
                        ? badgeStyle
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="break-words leading-snug">{pair.left}</span>
                </span>

                <span className="shrink-0 flex items-center gap-1.5">
                  {checkedFeedback ? (
                    isPairCorrect ? (
                      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono-tabular font-bold text-[#DD0000] dark:text-red-300">
                        <span className="text-emerald-700 dark:text-emerald-400">
                          ✓ {String.fromCharCode(65 + Math.max(0, shuffledRightOptions.indexOf(pair.right)))}
                        </span>
                        <XCircle size={16} className="text-[#DD0000] dark:text-red-400" />
                      </span>
                    )
                  ) : isMatched && rightLetter ? (
                    <span className="inline-flex items-center gap-1 text-xs font-mono-tabular font-bold text-neutral-700 dark:text-neutral-200">
                      <Link2 size={13} />
                      <span>{rightLetter}</span>
                      <Unlink2 size={12} className="text-neutral-400 ml-0.5" />
                    </span>
                  ) : isSelected ? (
                    <span className="text-[11px] font-semibold text-[#DD0000] dark:text-[#FFCE00]">
                      {t(lang, 'matchSelectedLabel')}
                    </span>
                  ) : null}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="space-y-2.5">
          {shuffledRightOptions.map((rightVal, rIdx) => {
            const matchedEntry = Object.entries(matchedPairs).find(([, v]) => v === rightVal);
            const matchedLeftIdx = matchedEntry ? Number(matchedEntry[0]) : null;
            const isMatched = matchedLeftIdx !== null;
            const isSelected = selectedRightVal === rightVal;
            const letter = String.fromCharCode(65 + rIdx);
            const isPairCorrect =
              checkedFeedback && isMatched
                ? pairs[matchedLeftIdx!]?.right === rightVal
                : null;

            let cardStyle =
              'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161922] text-neutral-800 dark:text-neutral-100 hover:border-neutral-400';

            if (checkedFeedback) {
              cardStyle = isPairCorrect
                ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                : 'border-[#DD0000] bg-[#DD0000]/10 dark:bg-[#DD0000]/20 text-neutral-900 dark:text-red-100';
            } else if (isSelected) {
              cardStyle =
                'border-[#DD0000] dark:border-[#FFCE00] bg-[#DD0000]/[0.06] dark:bg-[#FFCE00]/[0.12] text-neutral-950 dark:text-white ring-2 ring-[#DD0000]/25 dark:ring-[#FFCE00]/30';
            } else if (isMatched) {
              cardStyle =
                'border-neutral-800 dark:border-neutral-400 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white opacity-95 cursor-default';
            } else if (selectedLeftIdx !== null) {
              cardStyle =
                'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#161922] text-neutral-900 dark:text-white hover:border-[#DD0000] dark:hover:border-[#FFCE00]';
            }

            return (
              <motion.button
                key={rightVal}
                type="button"
                disabled={Boolean(checkedFeedback) || (isMatched && !checkedFeedback)}
                animate={
                  !reducedMotion && isMatched && justMatchedIdx === matchedLeftIdx
                    ? { scale: [1, 1.025, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.2 }}
                onClick={() => handleDesktopRightTap(rightVal)}
                className={`w-full text-left px-3.5 py-3 rounded-xl border-2 text-sm font-medium transition-colors min-h-[54px] flex items-center justify-between gap-2.5 ${
                  !checkedFeedback && !isMatched ? 'cursor-pointer' : 'cursor-default'
                } ${cardStyle}`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-md text-xs font-mono-tabular font-bold flex items-center justify-center shrink-0 ${
                      isMatched
                        ? PAIR_BADGE_STYLES[matchedLeftIdx! % PAIR_BADGE_STYLES.length]
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="break-words leading-snug">{rightVal}</span>
                </span>

                {isMatched && (
                  <span className="text-xs font-mono-tabular font-bold shrink-0">
                    #{matchedLeftIdx! + 1}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* MOBILE: Sequential Guided Selection Interface */}
      <div className="sm:hidden space-y-3">
        {/* Stepper chips */}
        <div className="flex items-center gap-1.5">
          {pairs.map((pair, idx) => {
            const isMatched = matchedPairs[idx] !== undefined;
            const isActive = activeMobileLeftIdx === idx;
            const isPairCorrect = checkedFeedback ? matchedPairs[idx] === pair.right : null;

            return (
              <button
                key={`step-${pair.left}`}
                type="button"
                disabled={Boolean(checkedFeedback)}
                onClick={() => {
                  if (isMatched) unlinkLeft(idx);
                  else setSelectedLeftIdx(idx);
                }}
                className={`flex-1 h-9 rounded-lg border text-xs font-mono-tabular font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  checkedFeedback
                    ? isPairCorrect
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'border-[#DD0000] bg-[#DD0000]/10 text-[#DD0000] dark:text-red-300'
                    : isActive
                    ? 'border-[#DD0000] dark:border-[#FFCE00] bg-[#DD0000] dark:bg-[#FFCE00] text-white dark:text-black'
                    : isMatched
                    ? 'border-neutral-800 dark:border-neutral-300 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161922] text-neutral-500'
                }`}
              >
                <span>{idx + 1}</span>
                {isMatched && !checkedFeedback && <Check size={12} />}
              </button>
            );
          })}
        </div>

        {/* Active unmatched prompt + target cards */}
        <AnimatePresence mode="wait" initial={false}>
          {!checkedFeedback && activeMobileLeftIdx !== null && pairs[activeMobileLeftIdx] && (
            <motion.div
              key={`m-active-${activeMobileLeftIdx}`}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
              transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.settle }}
              className="space-y-2.5"
            >
              <div className="rounded-xl border-2 border-[#DD0000] dark:border-[#FFCE00] bg-[#DD0000]/[0.05] dark:bg-[#FFCE00]/[0.08] px-3.5 py-3 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-[#DD0000] dark:bg-[#FFCE00] text-white dark:text-black text-xs font-mono-tabular font-bold flex items-center justify-center shrink-0">
                  {activeMobileLeftIdx + 1}
                </span>
                <span className="text-[15px] font-semibold text-neutral-950 dark:text-white leading-snug">
                  {pairs[activeMobileLeftIdx].left}
                </span>
              </div>

              <div className="space-y-2">
                {shuffledRightOptions.map((rightVal) => {
                  const isAlreadyUsed = Object.values(matchedPairs).includes(rightVal);
                  if (isAlreadyUsed) return null;
                  return (
                    <motion.button
                      key={`m-opt-${rightVal}`}
                      type="button"
                      whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
                      onClick={() => handleMobileRightTap(rightVal)}
                      className="w-full text-left px-3.5 py-3 rounded-xl border-2 border-b-[3px] border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161922] hover:border-[#DD0000] dark:hover:border-[#FFCE00] text-[15px] font-medium text-neutral-900 dark:text-white min-h-[48px] flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span className="break-words leading-snug">{rightVal}</span>
                      <ArrowRight size={15} className="text-neutral-400 shrink-0" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Matched pairs summary / review list */}
        {(matchedCount > 0 || checkedFeedback) && (
          <div className="space-y-1.5">
            {pairs.map((pair, idx) => {
              const assigned = matchedPairs[idx];
              if (!assigned && !checkedFeedback) return null;
              const isPairCorrect = checkedFeedback ? assigned === pair.right : null;
              return (
                <div
                  key={`m-pair-${pair.left}`}
                  className={`rounded-xl border px-3 py-2.5 text-xs flex items-center justify-between gap-2 ${
                    checkedFeedback
                      ? isPairCorrect
                        ? 'border-emerald-600/60 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100'
                        : 'border-[#DD0000]/60 bg-[#DD0000]/10 text-neutral-900 dark:text-red-100'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/70 text-neutral-900 dark:text-neutral-100'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="font-semibold truncate">
                      {idx + 1}. {pair.left}
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-300 truncate">
                      → {assigned || '—'}
                    </div>
                    {checkedFeedback && !isPairCorrect && (
                      <div className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        ✓ {pair.right}
                      </div>
                    )}
                  </div>
                  {!checkedFeedback ? (
                    <button
                      type="button"
                      onClick={() => unlinkLeft(idx)}
                      aria-label={t(lang, 'matchUnlinkLabel')}
                      className="p-2 rounded-lg text-neutral-500 hover:text-[#DD0000] dark:hover:text-[#FFCE00] cursor-pointer shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
                    >
                      <Unlink2 size={15} />
                    </button>
                  ) : isPairCorrect ? (
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle size={16} className="text-[#DD0000] shrink-0" />
                  )}
                </div>
              );
            })}
            {!checkedFeedback && remainingCount === 0 && (
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 text-center pt-1">
                {t(lang, 'allPairsMatchedHint')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   6. TRANSFORMATION
   ============================================================================ */
export const TransformationExercise: React.FC<CommonExerciseProps> = ({
  question,
  displayPrompt,
  lang,
  draftAnswer,
  setDraftAnswer,
  checkedFeedback,
  onSubmit,
  reducedMotion,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const parsed = useMemo(() => extractStructuredPrompt(displayPrompt), [displayPrompt]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(68, textareaRef.current.scrollHeight)}px`;
    }
  }, [draftAnswer, question.id]);

  const prefillOriginal = () => {
    if (!parsed.primarySentence || checkedFeedback) return;
    setDraftAnswer(parsed.primarySentence);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const feedbackDiff = useMemo(() => {
    if (!checkedFeedback || checkedFeedback.isCorrect) return null;
    const base = checkedFeedback.userAnswer && !checkedFeedback.skipped && !checkedFeedback.timedOut
      ? checkedFeedback.userAnswer
      : parsed.primarySentence || '';
    if (!base) return null;
    return computeWordDiff(base, checkedFeedback.correctAnswer);
  }, [checkedFeedback, parsed.primarySentence]);

  return (
    <div className="space-y-4">
      {parsed.primarySentence ? (
        <div className="space-y-3">
          {/* Clearly separated Transformation Instruction */}
          <div className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-[#DD0000] dark:text-[#FFCE00]">
            <ArrowRightLeft size={16} className="shrink-0 mt-0.5" />
            <span>{parsed.instruction || t(lang, 'transformTaskLabel')}</span>
          </div>

          {/* Original Sentence Card */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/70 px-4 py-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {t(lang, 'originalSentenceLabel')}
              </span>
              {!checkedFeedback && !draftAnswer && (
                <button
                  type="button"
                  onClick={prefillOriginal}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-[#DD0000] dark:hover:text-[#FFCE00] cursor-pointer"
                >
                  <Copy size={12} />
                  <span>{t(lang, 'prefillOriginalBtn')}</span>
                </button>
              )}
            </div>
            <p className="text-base sm:text-lg font-medium text-neutral-950 dark:text-white leading-relaxed">
              {parsed.primarySentence}
            </p>
            {parsed.targetPattern && (
              <div className="pt-2 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <ArrowRight size={14} className="text-[#DD0000] dark:text-[#FFCE00] shrink-0" />
                <span className="font-medium">{parsed.targetPattern}</span>
              </div>
            )}
          </div>

          {parsed.note && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{parsed.note}</p>
          )}
        </div>
      ) : (
        <p className="text-base sm:text-xl font-medium text-neutral-900 dark:text-white leading-relaxed">
          {displayPrompt}
        </p>
      )}

      <div className="space-y-2.5">
        <motion.div
          animate={
            reducedMotion || !checkedFeedback
              ? { x: 0, scale: 1 }
              : checkedFeedback.isCorrect
              ? { scale: [1, 1.012, 1], x: 0 }
              : { x: SHAKE_KEYFRAMES, scale: 1 }
          }
          transition={checkedFeedback?.isCorrect ? pulseTransition : shakeTransition}
        >
          <textarea
            ref={textareaRef}
            rows={2}
            value={draftAnswer}
            disabled={Boolean(checkedFeedback)}
            autoCapitalize="sentences"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            onFocus={(e) => scrollInputIntoSafeView(e.currentTarget)}
            onChange={(e) => setDraftAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !checkedFeedback && draftAnswer.trim()) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder={t(lang, 'answerPlaceholder')}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#161922] text-neutral-950 dark:text-white text-base leading-relaxed resize-none focus:outline-none transition-colors ${
              checkedFeedback
                ? checkedFeedback.isCorrect
                  ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-[#DD0000] bg-[#DD0000]/5 dark:bg-[#DD0000]/15'
                : 'border-neutral-300 dark:border-neutral-700 focus:border-[#DD0000] dark:focus:border-[#FFCE00]'
            }`}
          />
        </motion.div>

        {!checkedFeedback && (
          <GermanCharBar
            onInsert={(ch) =>
              insertCharAtSelection(textareaRef.current, draftAnswer, ch, setDraftAnswer)
            }
            label={t(lang, 'specialCharsLabel')}
          />
        )}

        {feedbackDiff && (
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-3.5 py-2.5 text-sm leading-relaxed">
            <div className="flex flex-wrap gap-x-1.5 gap-y-1">
              {feedbackDiff.targetTokens.map((tok, idx) => (
                <span
                  key={`td-${idx}`}
                  className={
                    tok.status === 'added'
                      ? 'px-1 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300'
                  }
                >
                  {tok.text}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   7. TRUE / FALSE
   ============================================================================ */
export const TrueFalseExercise: React.FC<CommonExerciseProps> = ({
  question,
  displayPrompt,
  lang,
  draftAnswer,
  setDraftAnswer,
  checkedFeedback,
  reducedMotion,
}) => {
  const options = question.options_de && question.options_de.length >= 2
    ? question.options_de.slice(0, 2)
    : ['Richtig', 'Falsch'];

  useEffect(() => {
    if (checkedFeedback) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }
      const k = e.key.toLowerCase();
      if (k === '1' || k === 'r' || k === 't' || k === 'v') {
        e.preventDefault();
        setDraftAnswer(options[0]);
      } else if (k === '2' || k === 'f') {
        e.preventDefault();
        setDraftAnswer(options[1]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [checkedFeedback, options, setDraftAnswer]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60 px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-base sm:text-xl font-medium text-neutral-950 dark:text-white leading-relaxed">
          {displayPrompt}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4" role="radiogroup">
        {options.map((opt, idx) => {
          const isTrueOption = idx === 0 || opt.toLowerCase().includes('richtig');
          const isSelected = draftAnswer === opt;
          const isCorrectOpt = question.solution === opt;
          const showResult = Boolean(checkedFeedback);

          let cardClasses =
            'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161922] text-neutral-900 dark:text-neutral-100 hover:border-neutral-400';

          if (!showResult && isSelected) {
            cardClasses = isTrueOption
              ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/25'
              : 'border-[#DD0000] dark:border-[#FFCE00] bg-[#DD0000]/[0.07] dark:bg-[#FFCE00]/[0.12] text-neutral-950 dark:text-white ring-2 ring-[#DD0000]/25 dark:ring-[#FFCE00]/25';
          } else if (showResult && isCorrectOpt) {
            cardClasses =
              'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/45 text-emerald-950 dark:text-emerald-100';
          } else if (showResult && isSelected && !isCorrectOpt) {
            cardClasses =
              'border-[#DD0000] bg-[#DD0000]/10 dark:bg-[#DD0000]/20 text-[#9e0000] dark:text-red-200';
          } else if (showResult) {
            cardClasses =
              'border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-400';
          }

          const subLabel =
            lang !== 'de'
              ? isTrueOption
                ? t(lang, 'trueSubLabel')
                : t(lang, 'falseSubLabel')
              : null;

          const animateState =
            reducedMotion || !showResult
              ? { scale: 1, x: 0 }
              : isCorrectOpt && (isSelected || checkedFeedback?.isCorrect)
              ? { scale: [1, 1.028, 1], x: 0 }
              : isSelected && !isCorrectOpt
              ? { x: SHAKE_KEYFRAMES, scale: 1 }
              : { scale: 1, x: 0 };

          return (
            <motion.button
              key={opt}
              type="button"
              disabled={showResult}
              animate={animateState}
              whileHover={!showResult && !reducedMotion ? { y: -1 } : undefined}
              whileTap={!showResult && !reducedMotion ? { scale: 0.975 } : undefined}
              transition={
                showResult && isSelected && !isCorrectOpt
                  ? shakeTransition
                  : showResult && isCorrectOpt
                  ? pulseTransition
                  : MOTION_SPRING.snappy
              }
              onClick={() => !showResult && setDraftAnswer(opt)}
              aria-pressed={isSelected}
              className={`rounded-2xl border-2 border-b-[3px] min-h-[84px] sm:min-h-[96px] p-4 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:cursor-default ${cardClasses}`}
            >
              {isTrueOption ? (
                <CheckCircle2
                  size={24}
                  className={
                    isSelected || (showResult && isCorrectOpt)
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }
                />
              ) : (
                <XCircle
                  size={24}
                  className={
                    isSelected || (showResult && isCorrectOpt)
                      ? showResult && isCorrectOpt
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-[#DD0000] dark:text-[#FFCE00]'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }
                />
              )}
              <span className="text-base sm:text-lg font-display font-bold">{opt}</span>
              {subLabel && (
                <span className="text-xs font-medium opacity-75">{subLabel}</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   8. ERROR CORRECTION (Tappable Sentence Words + Targeted Edit + Diff Feedback)
   ============================================================================ */
export const ErrorCorrectionExercise: React.FC<CommonExerciseProps> = ({
  question,
  displayPrompt,
  lang,
  draftAnswer,
  setDraftAnswer,
  checkedFeedback,
  onSubmit,
  reducedMotion,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const parsed = useMemo(() => extractStructuredPrompt(displayPrompt), [displayPrompt]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(68, textareaRef.current.scrollHeight)}px`;
    }
  }, [draftAnswer, question.id]);

  const sentenceWords = useMemo(() => {
    if (!parsed.primarySentence) return [];
    return parsed.primarySentence.split(/\s+/).filter(Boolean);
  }, [parsed.primarySentence]);

  const handleTapWord = (word: string, wordIdx: number) => {
    if (checkedFeedback || !parsed.primarySentence) return;
    const baseText = draftAnswer.trim() ? draftAnswer : parsed.primarySentence;
    if (!draftAnswer.trim()) {
      setDraftAnswer(parsed.primarySentence);
    }

    // Locate word offset so user can immediately fix that word
    let searchFrom = 0;
    for (let i = 0; i < wordIdx; i++) {
      const pos = baseText.indexOf(sentenceWords[i], searchFrom);
      if (pos !== -1) searchFrom = pos + sentenceWords[i].length;
    }
    const targetPos = baseText.indexOf(word, searchFrom);

    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      scrollInputIntoSafeView(el);
      if (targetPos !== -1) {
        try {
          el.setSelectionRange(targetPos, targetPos + word.length);
        } catch {
          // ignore
        }
      }
    });
  };

  const diffPreview = useMemo(() => {
    if (!checkedFeedback || !parsed.primarySentence) return null;
    return computeWordDiff(parsed.primarySentence, checkedFeedback.correctAnswer);
  }, [checkedFeedback, parsed.primarySentence]);

  return (
    <div className="space-y-4">
      {parsed.primarySentence ? (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {parsed.context ? `${parsed.context} · ` : ''}
              {parsed.instruction || t(lang, 'errorSentenceLabel')}
            </span>
            {!checkedFeedback && !draftAnswer && (
              <button
                type="button"
                onClick={() => {
                  setDraftAnswer(parsed.primarySentence!);
                  requestAnimationFrame(() => textareaRef.current?.focus());
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#DD0000] dark:text-[#FFCE00] hover:underline cursor-pointer"
              >
                <Copy size={12} />
                <span>{t(lang, 'prefillOriginalBtn')}</span>
              </button>
            )}
          </div>

          {/* Erroneous sentence with subtle tappable words (or clean correction diff after submit) */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/70 px-4 py-3.5">
            {checkedFeedback && diffPreview ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-x-1.5 gap-y-1 text-base sm:text-lg font-medium leading-relaxed">
                  {diffPreview.sourceTokens.map((tok, i) => (
                    <span
                      key={`src-${i}`}
                      className={
                        tok.status === 'removed'
                          ? 'line-through decoration-[#DD0000] decoration-2 text-[#DD0000] dark:text-red-400'
                          : 'text-neutral-600 dark:text-neutral-400'
                      }
                    >
                      {tok.text}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-1.5 gap-y-1 text-base sm:text-lg font-semibold leading-relaxed pt-1 border-t border-neutral-200/70 dark:border-neutral-800">
                  {diffPreview.targetTokens.map((tok, i) => (
                    <span
                      key={`tgt-${i}`}
                      className={
                        tok.status === 'added'
                          ? 'px-1 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                          : 'text-neutral-900 dark:text-white'
                      }
                    >
                      {tok.text}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-x-1 gap-y-1.5">
                  {sentenceWords.map((word, wIdx) => (
                    <button
                      key={`${word}-${wIdx}`}
                      type="button"
                      onClick={() => handleTapWord(word, wIdx)}
                      className="px-1.5 py-0.5 rounded-lg text-base sm:text-lg font-medium text-neutral-950 dark:text-white hover:bg-[#DD0000]/10 dark:hover:bg-[#FFCE00]/15 active:scale-95 transition-colors cursor-pointer"
                    >
                      {word}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {t(lang, 'tapWordToEditHint')}
                </p>
              </div>
            )}
          </div>

          {parsed.note && (
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
              {parsed.note}
            </p>
          )}
        </div>
      ) : (
        <p className="text-base sm:text-xl font-medium text-neutral-900 dark:text-white leading-relaxed">
          {displayPrompt}
        </p>
      )}

      <div className="space-y-2.5">
        <motion.div
          animate={
            reducedMotion || !checkedFeedback
              ? { x: 0, scale: 1 }
              : checkedFeedback.isCorrect
              ? { scale: [1, 1.012, 1], x: 0 }
              : { x: SHAKE_KEYFRAMES, scale: 1 }
          }
          transition={checkedFeedback?.isCorrect ? pulseTransition : shakeTransition}
        >
          <textarea
            ref={textareaRef}
            rows={2}
            value={draftAnswer}
            disabled={Boolean(checkedFeedback)}
            autoCapitalize="sentences"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            onFocus={(e) => scrollInputIntoSafeView(e.currentTarget)}
            onChange={(e) => setDraftAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !checkedFeedback && draftAnswer.trim()) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder={t(lang, 'answerPlaceholder')}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#161922] text-neutral-950 dark:text-white text-base leading-relaxed resize-none focus:outline-none transition-colors ${
              checkedFeedback
                ? checkedFeedback.isCorrect
                  ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-[#DD0000] bg-[#DD0000]/5 dark:bg-[#DD0000]/15'
                : 'border-neutral-300 dark:border-neutral-700 focus:border-[#DD0000] dark:focus:border-[#FFCE00]'
            }`}
          />
        </motion.div>

        {!checkedFeedback && (
          <GermanCharBar
            onInsert={(ch) =>
              insertCharAtSelection(textareaRef.current, draftAnswer, ch, setDraftAnswer)
            }
            label={t(lang, 'specialCharsLabel')}
          />
        )}
      </div>
    </div>
  );
};
