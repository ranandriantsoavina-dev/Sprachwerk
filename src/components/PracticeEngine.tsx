import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Lightbulb,
  Play,
  Save,
  SlidersHorizontal,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QUESTIONS_CATALOG } from '../data/questionsCatalog';
import { useKeyboardViewport } from '../hooks/useKeyboardViewport';
import { t } from '../i18n/translations';
import { apiRequest } from '../lib/api';
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_SPRING,
  createSlideDirectionVariants,
  useMotionPreference,
} from '../lib/motion';
import { enqueueOfflineEvent } from '../lib/offlineQueue';
import type {
  DifficultyLevel,
  ExerciseType,
  Flashcard,
  PracticeParameters,
  PracticeResultRow,
  PracticeRewardSummary,
  Question,
  UserProfile,
} from '../types/domain';
import {
  getShuffledMatchingRights,
  isMultiSelectQuestion,
  normalizeAnswer,
} from '../utils/exerciseHelpers';
import {
  AnimatedNumber,
  AnimatedProgressBar,
  CelebrationBurst,
  RewardFloatingBadge,
} from './motion/MotionPrimitives';
import {
  ErrorCorrectionExercise,
  GapFillExercise,
  MatchingExercise,
  MultipleChoiceExercise,
  SentenceConstructionExercise,
  TransformationExercise,
  TranslationExercise,
  TrueFalseExercise,
} from './practice/ExerciseFormats';
import { SessionResultsView } from './practice/SessionResultsView';

export const DEFAULT_PRACTICE_PARAMS: PracticeParameters = {
  exerciseTypes: ['multiple_choice', 'gap_fill'],
  difficulty: 'easy',
  timerSeconds: 0,
  questionCount: 10,
  order: 'shuffled',
  feedbackTiming: 'instant',
};

const ALL_EXERCISE_TYPES: Array<{ id: ExerciseType; labels: Record<'en' | 'fr' | 'de', string> }> = [
  { id: 'multiple_choice', labels: { en: 'Multiple choice', fr: 'Choix multiple', de: 'Multiple Choice' } },
  { id: 'gap_fill', labels: { en: 'Gap fill', fr: 'Texte à trous', de: 'Lückentext' } },
  { id: 'sentence_construction', labels: { en: 'Sentence construction', fr: 'Construction de phrase', de: 'Satzbau' } },
  { id: 'translation', labels: { en: 'Translation', fr: 'Traduction', de: 'Übersetzung' } },
  { id: 'matching', labels: { en: 'Matching', fr: 'Association', de: 'Zuordnung' } },
  { id: 'transformation', labels: { en: 'Transformation', fr: 'Transformation', de: 'Umformung' } },
  { id: 'true_false', labels: { en: 'True / False', fr: 'Vrai / Faux', de: 'Richtig / Falsch' } },
  { id: 'error_correction', labels: { en: 'Error correction', fr: 'Correction d’erreur', de: 'Fehlerkorrektur' } },
];

const DIFFICULTIES: Array<{
  id: DifficultyLevel;
  range: string;
  labels: Record<'en' | 'fr' | 'de', string>;
  desc: Record<'en' | 'fr' | 'de', string>;
}> = [
  {
    id: 'easy',
    range: 'A1',
    labels: { en: 'Easy', fr: 'Facile', de: 'Leicht' },
    desc: {
      en: 'Short direct sentences, basic articles, present tense and everyday vocabulary.',
      fr: 'Phrases courtes, articles de base, présent et vocabulaire courant.',
      de: 'Kurze Sätze, Grundartikel, Präsens und Alltagswortschatz.',
    },
  },
  {
    id: 'medium',
    range: 'A2–B1',
    labels: { en: 'Medium', fr: 'Moyen', de: 'Mittel' },
    desc: {
      en: 'Longer everyday contexts, cases, Perfekt, subordinate clauses and Konjunktiv II.',
      fr: 'Contextes quotidiens, cas, Perfekt, subordonnées et Konjunktiv II.',
      de: 'Alltagskontexte, Kasus, Perfekt, Nebensätze und Konjunktiv II.',
    },
  },
  {
    id: 'difficult',
    range: 'B2',
    labels: { en: 'Difficult', fr: 'Difficile', de: 'Schwer' },
    desc: {
      en: 'Genuine B2 structures: Konjunktiv I, indirect speech, passive variations and nominalization.',
      fr: 'Structures B2 : Konjunktiv I, discours indirect, passif et nominalisation.',
      de: 'Echte B2-Strukturen: Konjunktiv I, indirekte Rede, Passiv und Nominalisierung.',
    },
  },
  {
    id: 'extreme',
    range: 'C1–C2',
    labels: { en: 'Extreme', fr: 'Extrême', de: 'Extrem' },
    desc: {
      en: 'Dense embedded clauses, advanced participles, formal register and subtle word order.',
      fr: 'Propositions enchâssées denses, participes avancés et registre académique.',
      de: 'Komplexe Schachtelsätze, erweiterte Partizipien und gehobenes Register.',
    },
  },
];

const TIMER_OPTIONS = [0, 10, 15, 20, 30, 45, 60];
const COUNT_PRESETS = [5, 10, 15, 20, 30];

export const PracticeParametersPanel: React.FC<{
  mode: 'general' | 'lesson';
  intent?: 'start' | 'defaults';
  selectedTopics?: string[];
  topicTitle?: string;
  selectedLessons?: string[];
  lessonTitle?: string;
  lessonHasContent?: boolean;
  lessonHasPractice?: boolean;
  availableTypes?: ExerciseType[];
  availableDifficulties?: DifficultyLevel[];
  onBack?: () => void;
}> = ({
  mode,
  intent = 'start',
  selectedTopics = [],
  topicTitle,
  selectedLessons = [],
  lessonTitle,
  lessonHasContent,
  lessonHasPractice,
  availableTypes,
  availableDifficulties,
  onBack,
}) => {
  const {
    user,
    lang,
    isOnline,
    pushToast,
    refreshUser,
    setUser,
    syncOfflineQueue,
    setScreen,
    setPracticeSessionActive,
  } = useApp();

  const { isKeyboardOpen, keyboardOffset } = useKeyboardViewport();

  const [params, setParams] = useState<PracticeParameters>(() => {
    if (user?.practicePrefs) return user.practicePrefs;
    return DEFAULT_PRACTICE_PARAMS;
  });
  const [customCount, setCustomCount] = useState(() => {
    const initialCount = user?.practicePrefs?.questionCount ?? DEFAULT_PRACTICE_PARAMS.questionCount;
    return COUNT_PRESETS.includes(initialCount) ? '' : String(initialCount);
  });
  const [stage, setStage] = useState<'configure' | 'coming_soon' | 'active' | 'summary'>('configure');
  const [loading, setLoading] = useState(false);

  // Active exercise session state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [draftAnswer, setDraftAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [usedFragmentIndices, setUsedFragmentIndices] = useState<number[]>([]);
  const [selectedLeftIdx, setSelectedLeftIdx] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<number, string>>({});
  const [checkedFeedback, setCheckedFeedback] = useState<PracticeResultRow | null>(null);
  const [results, setResults] = useState<PracticeResultRow[]>([]);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [isRetrySession, setIsRetrySession] = useState(false);
  const [rewardSummary, setRewardSummary] = useState<PracticeRewardSummary | null>(null);

  const reducedMotion = useMotionPreference();
  const questionSlideVariants = useMemo(
    () => createSlideDirectionVariants(reducedMotion, 20),
    [reducedMotion]
  );

  // Inform AppContext when inside active exercise stage so mobile hides bottom tab bar
  useEffect(() => {
    setPracticeSessionActive(stage === 'active');
    return () => setPracticeSessionActive(false);
  }, [stage, setPracticeSessionActive]);

  const allowedTypes = useMemo(() => {
    if (availableTypes && availableTypes.length > 0) {
      return ALL_EXERCISE_TYPES.filter((et) => availableTypes.includes(et.id));
    }
    return ALL_EXERCISE_TYPES;
  }, [availableTypes]);

  const allowedDifficulties = useMemo(() => {
    if (availableDifficulties && availableDifficulties.length > 0) {
      return DIFFICULTIES.filter((d) => availableDifficulties.includes(d.id));
    }
    return DIFFICULTIES;
  }, [availableDifficulties]);

  // Question countdown timer when enabled
  useEffect(() => {
    if (stage !== 'active') return;
    const totalTimer = setInterval(() => setSessionElapsed((s) => s + 1), 1000);
    return () => clearInterval(totalTimer);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'active' || params.timerSeconds <= 0 || checkedFeedback) return;
    if (secondsLeft <= 0) {
      handleSubmitAnswer(true);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, params.timerSeconds, secondsLeft, checkedFeedback, currentIdx]);

  const toggleType = (id: ExerciseType) => {
    setParams((prev) => {
      const exists = prev.exerciseTypes.includes(id);
      if (exists && prev.exerciseTypes.length === 1) return prev;
      return {
        ...prev,
        exerciseTypes: exists
          ? prev.exerciseTypes.filter((x) => x !== id)
          : [...prev.exerciseTypes, id],
      };
    });
  };

  const handleSaveDefaults = async () => {
    if (!isOnline) {
      pushToast(t(lang, 'defaultsOfflineError'), 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequest<{ user: UserProfile }>('/api/user/profile', {
        method: 'PATCH',
        body: { practicePrefs: params },
      });
      setUser(res.user);
      pushToast(t(lang, 'defaultsSavedToast'), 'success');
      onBack?.();
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Unable to save default preferences.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{
        comingSoon: boolean;
        items: Question[];
        availabilityNote: string | null;
      }>('/api/content/practice/query', {
        method: 'POST',
        body: {
          mode,
          topics: selectedTopics,
          lessonIds: selectedLessons,
          types: params.exerciseTypes,
          difficulty: mode === 'lesson' ? undefined : params.difficulty,
          count: params.questionCount,
          order: params.order,
        },
      });

      if (res.comingSoon || res.items.length === 0) {
        setStage('coming_soon');
        return;
      }

      setIsRetrySession(false);
      setQuestions(res.items);
      setCurrentIdx(0);
      setDraftAnswer('');
      setShowHint(false);
      setUsedFragmentIndices([]);
      setSelectedLeftIdx(null);
      setMatchedPairs({});
      setCheckedFeedback(null);
      setResults([]);
      setSessionElapsed(0);
      setSecondsLeft(params.timerSeconds);
      setRewardSummary(null);
      setStage('active');
    } catch (err) {
      if (!isOnline) {
        let pool = QUESTIONS_CATALOG;
        if (mode === 'lesson' && selectedLessons.length > 0) {
          pool = pool.filter((q) => q.lesson_ids.some((id) => selectedLessons.includes(id)));
        } else if (selectedTopics.length > 0 && !selectedTopics.includes('mixed')) {
          pool = pool.filter((q) => q.topic_tags.some((tg) => selectedTopics.includes(tg)));
        }
        if (mode !== 'lesson' && params.difficulty) {
          pool = pool.filter((q) => q.difficulty === params.difficulty);
        }
        if (params.exerciseTypes.length > 0) {
          pool = pool.filter((q) => params.exerciseTypes.includes(q.type));
        }
        if (pool.length > 0) {
          const picked =
            params.order === 'shuffled'
              ? [...pool].sort(() => Math.random() - 0.5)
              : [...pool];
          setIsRetrySession(false);
          setQuestions(picked.slice(0, Math.max(1, Math.min(200, params.questionCount))));
          setCurrentIdx(0);
          setDraftAnswer('');
          setShowHint(false);
          setUsedFragmentIndices([]);
          setSelectedLeftIdx(null);
          setMatchedPairs({});
          setCheckedFeedback(null);
          setResults([]);
          setSessionElapsed(0);
          setSecondsLeft(params.timerSeconds);
          setRewardSummary(null);
          setStage('active');
          return;
        }
      }
      if (mode === 'lesson' && (lessonHasPractice === false || lessonHasContent === false)) {
        setStage('coming_soon');
        return;
      }
      pushToast(err instanceof Error ? err.message : 'Unable to load practice session.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIdx];

  const shuffledRightOptions = useMemo(
    () => getShuffledMatchingRights(currentQuestion),
    [currentQuestion]
  );

  const handleSubmitAnswer = (timedOut = false, skipped = false) => {
    if (!currentQuestion) return;

    let isCorrect = false;
    if (!timedOut && !skipped) {
      const normalizedUser = normalizeAnswer(draftAnswer, currentQuestion.case_sensitive);
      const accepted = currentQuestion.accepted_answers.map((a) =>
        normalizeAnswer(a, currentQuestion.case_sensitive)
      );

      if (isMultiSelectQuestion(currentQuestion)) {
        const userSet = new Set(
          normalizedUser.split(/\s*[|,;]\s*/).map((s) => s.trim()).filter(Boolean)
        );
        isCorrect = accepted.some((acc) => {
          const accSet = new Set(
            acc.split(/\s*[|,;]\s*/).map((s) => s.trim()).filter(Boolean)
          );
          return accSet.size === userSet.size && [...accSet].every((v) => userSet.has(v));
        });
      } else {
        isCorrect = accepted.includes(normalizedUser);
      }
    }

    const explanation =
      currentQuestion.explanation_i18n[lang] ||
      currentQuestion.explanation_i18n.en ||
      currentQuestion.explanation_i18n.de ||
      '';
    const displayPrompt = currentQuestion.prompt_i18n?.[lang] || currentQuestion.prompt_de;

    const row: PracticeResultRow = {
      questionId: currentQuestion.id,
      topic: currentQuestion.topic_tags[0] || 'General',
      prompt: displayPrompt,
      userAnswer: timedOut ? '(timed out)' : skipped ? '(skipped)' : draftAnswer.trim(),
      correctAnswer: currentQuestion.solution,
      explanation,
      isCorrect,
      skipped,
      timedOut,
    };

    const nextResults = [...results, row];
    setResults(nextResults);

    if (params.feedbackTiming === 'instant') {
      setCheckedFeedback(row);
    } else {
      advanceOrFinish(nextResults);
    }
  };

  const advanceOrFinish = async (finalResults: PracticeResultRow[]) => {
    setCheckedFeedback(null);
    setDraftAnswer('');
    setShowHint(false);
    setUsedFragmentIndices([]);
    setSelectedLeftIdx(null);
    setMatchedPairs({});
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
      setSecondsLeft(params.timerSeconds);
      return;
    }

    // Session complete
    setStage('summary');

    // Local mistake-drill passes never submit duplicate sessions or duplicate XP/coins
    if (isRetrySession) {
      setRewardSummary({ xpAwarded: 0, coinsAwarded: 0 });
      return;
    }

    const idempotencyKey = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const payload = {
      mode,
      selectedTopics,
      selectedLessons,
      parameters: params,
      results: finalResults,
      elapsedSeconds: sessionElapsed,
      idempotencyKey,
    };

    if (!isOnline) {
      await enqueueOfflineEvent({
        idempotencyKey,
        type: 'practice_session',
        payload,
        queuedAt: new Date().toISOString(),
      });
      await syncOfflineQueue();
      setRewardSummary({ xpAwarded: 0, coinsAwarded: 0, queuedOffline: true });
      return;
    }

    try {
      const res = await apiRequest<{
        xpAwarded: number;
        coinsAwarded: number;
        dailyBonusXp?: number;
        dailyBonusCoins?: number;
      }>('/api/practice/submit', {
        method: 'POST',
        body: payload,
      });
      setRewardSummary({
        xpAwarded: res.xpAwarded,
        coinsAwarded: res.coinsAwarded,
        dailyBonusXp: res.dailyBonusXp,
        dailyBonusCoins: res.dailyBonusCoins,
      });
      await refreshUser();
    } catch {
      await enqueueOfflineEvent({
        idempotencyKey,
        type: 'practice_session',
        payload,
        queuedAt: new Date().toISOString(),
      });
      await syncOfflineQueue();
      setRewardSummary({ xpAwarded: 0, coinsAwarded: 0, queuedOffline: true });
    }
  };

  const handleRetryMistakes = (questionIds?: string[]) => {
    const targetIds = new Set(
      questionIds && questionIds.length > 0
        ? questionIds
        : results.filter((r) => !r.isCorrect).map((r) => r.questionId)
    );
    const retryPool = questions.filter((q) => targetIds.has(q.id));
    if (retryPool.length === 0) return;

    setIsRetrySession(true);
    setQuestions(retryPool);
    setCurrentIdx(0);
    setDraftAnswer('');
    setShowHint(false);
    setUsedFragmentIndices([]);
    setSelectedLeftIdx(null);
    setMatchedPairs({});
    setCheckedFeedback(null);
    setResults([]);
    setSessionElapsed(0);
    setSecondsLeft(params.timerSeconds);
    setRewardSummary(null);
    setStage('active');
  };

  // Allow pressing Enter to continue after feedback is revealed
  useEffect(() => {
    if (stage !== 'active' || !checkedFeedback) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        advanceOrFinish(results);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, checkedFeedback, results, currentIdx]);

  if (stage === 'coming_soon') {
    return (
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-6 sm:p-8 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#DD0000] dark:text-[#FFCE00] mb-3">
          <Layers size={15} />
          <span>{t(lang, 'comingSoonBadge')}</span>
        </div>
        {mode === 'lesson' && lessonTitle && (
          <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            {lessonTitle}
          </div>
        )}
        <h2
          className={`text-2xl font-display font-bold text-neutral-900 dark:text-white ${
            mode === 'lesson' && !lessonHasContent ? 'mb-6' : 'mb-3'
          }`}
        >
          {mode === 'lesson'
            ? lessonHasContent
              ? t(lang, 'lessonPracticeQuestionsComingSoon')
              : 'Lesson content coming soon'
            : t(lang, 'comingSoonDatasetTitle')}
        </h2>
        {(mode !== 'lesson' || lessonHasContent) && (
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 mb-6">
            {mode === 'lesson' && lessonHasContent
              ? t(lang, 'lessonPracticeQuestionsComingSoonBody')
              : t(lang, 'comingSoonDatasetBody')}
          </p>
        )}

        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-4 mb-6">
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
            {t(lang, 'practiceParameters')}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-800 dark:text-neutral-200">
            {mode !== 'lesson' && (
              <>
                <span>{params.difficulty.toUpperCase()}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span className="tabular-nums">{params.questionCount} {t(lang, 'questionsWord')}</span>
            <span aria-hidden="true">·</span>
            <span>{params.timerSeconds === 0 ? t(lang, 'timerOff') : `${params.timerSeconds}s`}</span>
            <span aria-hidden="true">·</span>
            <span>{params.exerciseTypes.length} {t(lang, 'formatsWord')}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStage('configure')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-white transition-colors cursor-pointer min-h-[44px]"
          >
            <SlidersHorizontal size={16} />
            <span>{t(lang, 'editParametersBtn')}</span>
          </button>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer min-h-[44px]"
            >
              <ArrowLeft size={16} />
              <span>{mode === 'lesson' ? t(lang, 'backBtn') : t(lang, 'chooseAnotherTopicBtn')}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (stage === 'active' && currentQuestion) {
    const displayPrompt = currentQuestion.prompt_i18n?.[lang] || currentQuestion.prompt_de;
    const hintText =
      currentQuestion.hint_i18n?.[lang] ||
      currentQuestion.hint_i18n?.en ||
      currentQuestion.hint_i18n?.de;

    const formatMeta = ALL_EXERCISE_TYPES.find((et) => et.id === currentQuestion.type);
    const formatLabel = formatMeta?.labels[lang] || currentQuestion.type.replace('_', ' ');
    const progressPct = Math.round(
      ((currentIdx + (checkedFeedback ? 1 : 0)) / Math.max(1, questions.length)) * 100
    );
    const canSubmit = draftAnswer.trim().length > 0;

    const handleTriggerSubmit = () => {
      if (!checkedFeedback && canSubmit) {
        handleSubmitAnswer(false, false);
      }
    };

    return (
      <div
        className="max-w-3xl mx-auto flex flex-col pb-24 lg:pb-0"
        style={
          isKeyboardOpen
            ? { paddingBottom: `${keyboardOffset + 96}px` }
            : undefined
        }
      >
        {/* Compact Session Header (Sticky on mobile <= 50px; clean inline on desktop) */}
        <div className="sticky top-0 lg:static z-20 -mx-3 px-3 py-2 sm:mx-0 sm:px-0 sm:py-1 bg-[#F8F9FA]/95 dark:bg-[#0A0B0E]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border-b border-neutral-200/70 dark:border-neutral-800/70 lg:border-b-0 mb-3 sm:mb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setIsRetrySession(false);
                setStage('configure');
              }}
              aria-label={t(lang, 'exitSessionBtn')}
              title={t(lang, 'exitSessionBtn')}
              className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white flex items-center justify-center cursor-pointer shrink-0"
            >
              <X size={16} />
            </button>

            <div className="flex-1 min-w-0 space-y-1">
              <AnimatedProgressBar
                value={currentIdx + (checkedFeedback ? 1 : 0)}
                max={Math.max(1, questions.length)}
                trackClassName="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden"
                barClassName="h-full w-full bg-[#DD0000] dark:bg-[#FFCE00] rounded-full"
                glowOnIncrease
                ariaLabel={`${currentIdx + 1} / ${questions.length}`}
              />
              <div className="flex items-center justify-between gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                <span className="truncate">
                  <span className="font-mono-tabular font-semibold text-neutral-800 dark:text-neutral-200">
                    {currentIdx + 1}/{questions.length}
                  </span>
                  <span aria-hidden="true"> · </span>
                  <span className="font-mono-tabular">{currentQuestion.cefr_level}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{formatLabel}</span>
                </span>

                <div className="flex items-center gap-2.5 shrink-0">
                  {hintText && (
                    <button
                      type="button"
                      onClick={() => setShowHint((h) => !h)}
                      className={`inline-flex items-center gap-1 font-semibold cursor-pointer ${
                        showHint
                          ? 'text-[#DD0000] dark:text-[#FFCE00]'
                          : 'text-neutral-600 dark:text-neutral-300 hover:text-[#DD0000] dark:hover:text-[#FFCE00]'
                      }`}
                    >
                      <Lightbulb size={13} />
                      <span>{showHint ? t(lang, 'hideHintBtn') : t(lang, 'hintBtn')}</span>
                    </button>
                  )}
                  {params.timerSeconds > 0 && (
                    <motion.span
                      animate={
                        secondsLeft <= 5 && !reducedMotion
                          ? { scale: [1, 1.08, 1] }
                          : { scale: 1 }
                      }
                      transition={
                        secondsLeft <= 5 && !reducedMotion
                          ? { duration: 0.7, repeat: Infinity }
                          : undefined
                      }
                      className={`inline-flex items-center gap-1 font-mono-tabular font-bold ${
                        secondsLeft <= 5
                          ? 'text-[#DD0000]'
                          : 'text-neutral-800 dark:text-[#FFCE00]'
                      }`}
                    >
                      <Clock size={13} />
                      {secondsLeft}s
                    </motion.span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Exercise Card */}
        <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-4 sm:p-7 lg:p-8 shadow-xs">
          <AnimatePresence initial={false}>
            {showHint && hintText && (
              <motion.div
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.settle }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-[#FFCE00]/45 bg-[#FFCE00]/10 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 flex items-start gap-2">
                  <Lightbulb size={15} className="text-[#b88600] dark:text-[#FFCE00] shrink-0 mt-0.5" />
                  <span>{hintText}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false} custom={1}>
            <motion.div
              key={currentQuestion.id}
              custom={1}
              variants={questionSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {currentQuestion.type === 'multiple_choice' && (
                <MultipleChoiceExercise
                  question={currentQuestion}
                  displayPrompt={displayPrompt}
                  lang={lang}
                  draftAnswer={draftAnswer}
                  setDraftAnswer={setDraftAnswer}
                  checkedFeedback={checkedFeedback}
                  onSubmit={handleTriggerSubmit}
                  reducedMotion={reducedMotion}
                />
              )}

              {currentQuestion.type === 'gap_fill' && (
                <GapFillExercise
                  question={currentQuestion}
                  displayPrompt={displayPrompt}
                  lang={lang}
                  draftAnswer={draftAnswer}
                  setDraftAnswer={setDraftAnswer}
                  checkedFeedback={checkedFeedback}
                  onSubmit={handleTriggerSubmit}
                  reducedMotion={reducedMotion}
                />
              )}

              {currentQuestion.type === 'sentence_construction' && (
                <SentenceConstructionExercise
                  question={currentQuestion}
                  displayPrompt={displayPrompt}
                  lang={lang}
                  draftAnswer={draftAnswer}
                  setDraftAnswer={setDraftAnswer}
                  checkedFeedback={checkedFeedback}
                  onSubmit={handleTriggerSubmit}
                  usedFragmentIndices={usedFragmentIndices}
                  setUsedFragmentIndices={setUsedFragmentIndices}
                  reducedMotion={reducedMotion}
                />
              )}

              {currentQuestion.type === 'translation' && (
                <TranslationExercise
                  question={currentQuestion}
                  displayPrompt={displayPrompt}
                  lang={lang}
                  draftAnswer={draftAnswer}
                  setDraftAnswer={setDraftAnswer}
                  checkedFeedback={checkedFeedback}
                  onSubmit={handleTriggerSubmit}
                  reducedMotion={reducedMotion}
                />
              )}

              {currentQuestion.type === 'matching' && (
                <MatchingExercise
                  question={currentQuestion}
                  displayPrompt={displayPrompt}
                  lang={lang}
                  draftAnswer={draftAnswer}
                  setDraftAnswer={setDraftAnswer}
                  checkedFeedback={checkedFeedback}
                  onSubmit={handleTriggerSubmit}
                  shuffledRightOptions={shuffledRightOptions}
                  selectedLeftIdx={selectedLeftIdx}
                  setSelectedLeftIdx={setSelectedLeftIdx}
                  matchedPairs={matchedPairs}
                  setMatchedPairs={setMatchedPairs}
                  reducedMotion={reducedMotion}
                />
              )}

              {currentQuestion.type === 'transformation' && (
                <TransformationExercise
                  question={currentQuestion}
                  displayPrompt={displayPrompt}
                  lang={lang}
                  draftAnswer={draftAnswer}
                  setDraftAnswer={setDraftAnswer}
                  checkedFeedback={checkedFeedback}
                  onSubmit={handleTriggerSubmit}
                  reducedMotion={reducedMotion}
                />
              )}

              {currentQuestion.type === 'true_false' && (
                <TrueFalseExercise
                  question={currentQuestion}
                  displayPrompt={displayPrompt}
                  lang={lang}
                  draftAnswer={draftAnswer}
                  setDraftAnswer={setDraftAnswer}
                  checkedFeedback={checkedFeedback}
                  onSubmit={handleTriggerSubmit}
                  reducedMotion={reducedMotion}
                />
              )}

              {currentQuestion.type === 'error_correction' && (
                <ErrorCorrectionExercise
                  question={currentQuestion}
                  displayPrompt={displayPrompt}
                  lang={lang}
                  draftAnswer={draftAnswer}
                  setDraftAnswer={setDraftAnswer}
                  checkedFeedback={checkedFeedback}
                  onSubmit={handleTriggerSubmit}
                  reducedMotion={reducedMotion}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Desktop Integrated Feedback + Action Bar */}
          <div className="relative hidden lg:block mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="absolute -top-3 right-2 z-10 pointer-events-none">
              <RewardFloatingBadge
                show={Boolean(checkedFeedback?.isCorrect && !isRetrySession)}
                label={`✓ ${t(lang, 'correctLabel')}`}
                tone="success"
              />
            </div>
            <AnimatePresence initial={false}>
              {checkedFeedback && (
                <motion.div
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.settle }}
                  className={`rounded-xl border p-4 ${
                    checkedFeedback.isCorrect
                      ? 'border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/35'
                      : 'border-[#DD0000]/40 bg-[#DD0000]/[0.06] dark:bg-[#DD0000]/15'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-bold mb-1">
                    {checkedFeedback.isCorrect ? (
                      <motion.span
                        initial={reducedMotion ? false : { scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={MOTION_SPRING.pop}
                        className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400"
                      >
                        <CheckCircle2 size={17} /> {t(lang, 'correctLabel')}
                      </motion.span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[#DD0000] dark:text-red-300">
                        <XCircle size={17} /> {t(lang, 'solutionLabel')}:{' '}
                        <span className="text-neutral-900 dark:text-white">
                          {checkedFeedback.correctAnswer}
                        </span>
                      </span>
                    )}
                  </div>
                  {checkedFeedback.explanation && (
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {checkedFeedback.explanation}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between gap-3">
              {!checkedFeedback ? (
                <>
                  <motion.button
                    type="button"
                    whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                    onClick={() => handleSubmitAnswer(false, true)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-colors cursor-pointer min-h-[44px]"
                  >
                    {t(lang, 'skipBtn')}
                  </motion.button>
                  <motion.button
                    type="button"
                    disabled={!canSubmit}
                    whileTap={canSubmit && !reducedMotion ? { scale: 0.97 } : undefined}
                    onClick={handleTriggerSubmit}
                    className="px-6 py-2.5 rounded-xl bg-[#DD0000] text-white text-sm font-semibold hover:bg-[#b80000] disabled:opacity-40 transition-colors cursor-pointer min-h-[44px]"
                  >
                    {t(lang, 'checkAnswerBtn')}
                  </motion.button>
                </>
              ) : (
                <motion.button
                  type="button"
                  whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                  onClick={() => advanceOrFinish(results)}
                  className={`ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer min-h-[44px] transition-colors ${
                    checkedFeedback.isCorrect
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90'
                  }`}
                >
                  <span>
                    {currentIdx + 1 < questions.length
                      ? t(lang, 'continueBtn')
                      : t(lang, 'viewResultsBtn')}
                  </span>
                  <ArrowRight size={16} />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE / TABLET PERSISTENT BOTTOM ACTION BAR + FEEDBACK SHEET (Keyboard-aware & Safe-area compliant) */}
        <div
          className={`lg:hidden fixed left-0 right-0 z-40 border-t backdrop-blur-md transition-[background-color,border-color] ${
            checkedFeedback
              ? checkedFeedback.isCorrect
                ? 'border-emerald-500/40 bg-emerald-50/98 dark:bg-[#0D1E17]/98'
                : 'border-[#DD0000]/40 bg-red-50/98 dark:bg-[#1E1012]/98'
              : 'border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#111318]/95'
          }`}
          style={{
            bottom: `${keyboardOffset}px`,
            paddingBottom: isKeyboardOpen
              ? '0.5rem'
              : 'max(0.625rem, env(safe-area-inset-bottom))',
          }}
        >
          <div className="max-w-3xl mx-auto px-3.5 pt-2.5 space-y-2.5">
            {checkedFeedback ? (
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-2.5"
              >
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  <div className="flex items-start gap-2 text-sm font-bold">
                    {checkedFeedback.isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 size={17} className="shrink-0" />
                        <span>{t(lang, 'correctLabel')}</span>
                      </span>
                    ) : (
                      <div className="flex items-start gap-1.5 text-[#DD0000] dark:text-red-300">
                        <XCircle size={17} className="shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          {t(lang, 'solutionLabel')}:{' '}
                          <span className="text-neutral-950 dark:text-white">
                            {checkedFeedback.correctAnswer}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                  {checkedFeedback.explanation && (
                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-snug">
                      {checkedFeedback.explanation}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => advanceOrFinish(results)}
                  className={`w-full min-h-[46px] rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-transform ${
                    checkedFeedback.isCorrect
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#DD0000] text-white'
                  }`}
                >
                  <span>
                    {currentIdx + 1 < questions.length
                      ? t(lang, 'continueBtn')
                      : t(lang, 'viewResultsBtn')}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSubmitAnswer(false, true)}
                  className="px-3.5 min-h-[44px] rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white cursor-pointer shrink-0 whitespace-nowrap"
                >
                  {t(lang, 'skipBtn')}
                </button>
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={handleTriggerSubmit}
                  className="flex-1 min-h-[44px] px-5 rounded-xl bg-[#DD0000] hover:bg-[#b80000] disabled:opacity-40 text-white text-sm font-bold transition-colors cursor-pointer active:scale-[0.99]"
                >
                  {t(lang, 'checkAnswerBtn')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'summary') {
    const contextSubtitle =
      mode === 'general'
        ? topicTitle || selectedTopics.join(', ') || t(lang, 'topicMixedTitle')
        : lessonTitle || `${selectedLessons.length} ${t(lang, 'lessonsSelectedCount')}`;

    return (
      <SessionResultsView
        results={results}
        questions={questions}
        sessionElapsed={sessionElapsed}
        rewardSummary={rewardSummary}
        isRetryPass={isRetrySession}
        mode={mode}
        contextSubtitle={contextSubtitle}
        user={user}
        lang={lang}
        reducedMotion={reducedMotion}
        onRetryMistakes={handleRetryMistakes}
        onNewSession={() => {
          setIsRetrySession(false);
          setStage('configure');
        }}
        onDashboard={() => setScreen('home')}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="min-w-0">
          <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-white">
            {intent === 'defaults'
              ? t(lang, 'defaultConfigurationTitle')
              : t(lang, 'practiceParameters')}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
            {intent === 'defaults'
              ? t(lang, 'defaultsConfigSubtitle')
              : mode === 'general'
              ? `${t(lang, 'categoryPrefix')}: ${topicTitle || selectedTopics.join(', ') || t(lang, 'topicMixedTitle')}`
              : lessonTitle || `${selectedLessons.length} ${t(lang, 'lessonsSelectedCount')}`}
          </p>
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft size={16} />
            <span>{t(lang, 'backBtn')}</span>
          </button>
        )}
      </div>

      {/* Exercise Types Multi-Select */}
      <div>
        <div className="text-sm font-semibold text-neutral-900 dark:text-white mb-2.5">
          {t(lang, 'exerciseTypes')}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {allowedTypes.map((et) => {
            const active = params.exerciseTypes.includes(et.id);
            return (
              <motion.button
                key={et.id}
                type="button"
                whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                transition={MOTION_SPRING.snappy}
                onClick={() => toggleType(et.id)}
                className={`px-3 py-2.5 rounded-lg border text-xs font-medium text-left transition-colors cursor-pointer min-h-[44px] ${
                  active
                    ? 'border-[#DD0000] bg-[#DD0000]/8 text-[#DD0000] dark:text-white dark:bg-[#DD0000]/20'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                }`}
              >
                {et.labels[lang]}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Linguistic Difficulty (General Practice only — lesson level is fixed per lesson) */}
      {mode !== 'lesson' && (
        <div>
          <div className="text-sm font-semibold text-neutral-900 dark:text-white mb-2.5">
            {t(lang, 'difficultyLabel')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {allowedDifficulties.map((d) => {
              const active = params.difficulty === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setParams((p) => ({ ...p, difficulty: d.id }))}
                  className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    active
                      ? 'border-black dark:border-[#FFCE00] bg-neutral-900 dark:bg-[#FFCE00]/15 text-white'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{d.labels[lang]}</span>
                    <span className={`text-xs font-mono-tabular ${active ? 'text-[#FFCE00]' : 'text-neutral-500'}`}>
                      {d.range}
                    </span>
                  </div>
                  <p className={`text-xs leading-snug ${active ? 'text-neutral-300' : 'text-neutral-500 dark:text-neutral-400'}`}>
                    {d.desc[lang]}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Timer, Count, Order, Feedback Timing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
            {t(lang, 'timerLabel')}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TIMER_OPTIONS.map((sec) => {
              const active = params.timerSeconds === sec;
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setParams((p) => ({ ...p, timerSeconds: sec }))}
                  className={`px-3 py-2 rounded-lg border text-xs font-mono-tabular font-medium cursor-pointer min-h-[40px] ${
                    active
                      ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {sec === 0 ? t(lang, 'timerOff') : `${sec}s`}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
            {t(lang, 'questionCountLabel')}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {COUNT_PRESETS.map((cnt) => {
              const active = params.questionCount === cnt && !customCount;
              return (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => {
                    setCustomCount('');
                    setParams((p) => ({ ...p, questionCount: cnt }));
                  }}
                  className={`px-3 py-2 rounded-lg border text-xs font-mono-tabular font-medium cursor-pointer min-h-[40px] ${
                    active
                      ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {cnt}
                </button>
              );
            })}
            <input
              type="number"
              min={1}
              max={160}
              value={customCount}
              onChange={(e) => {
                const raw = e.target.value;
                setCustomCount(raw);
                const parsed = Number(raw);
                if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 160) {
                  setParams((p) => ({ ...p, questionCount: Math.floor(parsed) }));
                }
              }}
              placeholder={t(lang, 'customPlaceholder')}
              className="w-20 px-2.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono-tabular text-neutral-900 dark:text-white min-h-[40px]"
            />
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
            {t(lang, 'questionOrderLabel')}
          </div>
          <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-50 dark:bg-neutral-900">
            {(['shuffled', 'sequential'] as const).map((ord) => {
              const active = params.order === ord;
              return (
                <button
                  key={ord}
                  type="button"
                  onClick={() => setParams((p) => ({ ...p, order: ord }))}
                  className={`relative px-3.5 py-2 rounded-md text-xs font-medium cursor-pointer min-h-[38px] transition-colors ${
                    active ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="params-order-pill"
                      transition={MOTION_SPRING.snappy}
                      className="absolute inset-0 rounded-md bg-white dark:bg-neutral-800 shadow-xs"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">
                    {ord === 'shuffled' ? t(lang, 'orderShuffled') : t(lang, 'orderSequential')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
            {t(lang, 'feedbackTimingLabel')}
          </div>
          <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-50 dark:bg-neutral-900">
            {(['instant', 'end'] as const).map((fb) => {
              const active = params.feedbackTiming === fb;
              return (
                <button
                  key={fb}
                  type="button"
                  onClick={() => setParams((p) => ({ ...p, feedbackTiming: fb }))}
                  className={`relative px-3.5 py-2 rounded-md text-xs font-medium cursor-pointer min-h-[38px] transition-colors ${
                    active ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="params-feedback-pill"
                      transition={MOTION_SPRING.snappy}
                      className="absolute inset-0 rounded-md bg-white dark:bg-neutral-800 shadow-xs"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">
                    {fb === 'instant' ? t(lang, 'feedbackInstant') : t(lang, 'feedbackEnd')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        {intent === 'defaults' ? (
          <button
            type="button"
            disabled={loading}
            onClick={handleSaveDefaults}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer min-h-[44px]"
          >
            <Save size={16} />
            <span>{loading ? t(lang, 'savingText') : t(lang, 'saveAsDefaultBtn')}</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#DD0000] hover:bg-[#b80000] text-white text-sm font-semibold transition-colors cursor-pointer min-h-[44px]"
          >
            <Play size={16} />
            <span>{loading ? t(lang, 'loadingText') : t(lang, 'startSessionBtn')}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const FlashcardEnginePanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, lang, isOnline, syncOfflineQueue, refreshUser, pushToast } = useApp();
  const reducedMotion = useMotionPreference();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [comingSoon, setComingSoon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [knownIds, setKnownIds] = useState<string[]>([]);
  const [unknownIds, setUnknownIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiRequest<{ comingSoon: boolean; items: Flashcard[] }>(
          '/api/content/flashcards'
        );
        if (!active) return;
        setComingSoon(res.comingSoon || res.items.length === 0);
        setCards(res.items);
      } catch {
        if (active) setComingSoon(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const rateCard = async (rating: 'known' | 'unknown') => {
    const card = cards[idx];
    if (!card) return;
    if (rating === 'known') setKnownIds((p) => [...p, card.id]);
    else setUnknownIds((p) => [...p, card.id]);

    const key = `fc_${card.id}_${new Date().toISOString().slice(0, 10)}_${idx}`;
    await enqueueOfflineEvent({
      idempotencyKey: key,
      type: 'flashcard_rating',
      payload: { cardId: card.id, deck: card.deck, rating },
      queuedAt: new Date().toISOString(),
    });
    if (isOnline) {
      await syncOfflineQueue();
      await refreshUser();
    } else {
      pushToast(t(lang, 'queuedOfflineMsg'), 'info');
    }

    setRevealed(false);
    setIdx((i) => i + 1);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-8">
        <div className="h-5 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-4" />
        <div className="h-24 w-full bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse" />
      </div>
    );
  }

  if (comingSoon) {
    return (
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-6 sm:p-8 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#DD0000] dark:text-[#FFCE00] mb-3">
          <Layers size={15} />
          <span>{t(lang, 'comingSoonBadge')}</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white mb-3">
          {t(lang, 'flashcardsComingSoonTitle')}
        </h2>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 mb-6">
          {t(lang, 'comingSoonDatasetBody')}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium cursor-pointer min-h-[44px]"
        >
          <ArrowLeft size={16} />
          <span>{t(lang, 'backToGeneralPracticeBtn')}</span>
        </button>
      </div>
    );
  }

  if (idx >= cards.length) {
    const hasCrimsonRibbon = user?.equipped?.celebration?.value === 'crimson_ribbon';
    return (
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: MOTION_DURATION.normal, ease: MOTION_EASE.settle }}
        className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-6 sm:p-8 max-w-xl space-y-4 overflow-hidden"
      >
        <CelebrationBurst active={!reducedMotion && knownIds.length > 0} />
        {hasCrimsonRibbon && (
          <div className="relative overflow-hidden -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-4 px-6 py-3 bg-gradient-to-r from-black via-[#DD0000] to-black text-white border-b-2 border-[#FFCE00] flex items-center gap-2.5">
            {!reducedMotion && (
              <span
                aria-hidden="true"
                className="sw-shimmer-once absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
              />
            )}
            <Sparkles size={16} className="text-[#FFCE00] shrink-0" />
            <span className="text-xs font-display font-bold text-[#FFCE00]">
              {t(lang, 'crimsonRibbonBannerTitle')}
            </span>
          </div>
        )}
        <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-white">
          {t(lang, 'flashcardSummaryTitle')}
        </h2>
        <div className="text-sm text-neutral-600 dark:text-neutral-300 space-y-1 font-mono-tabular">
          <div>
            {t(lang, 'reviewedLabel')}: <AnimatedNumber value={cards.length} />
          </div>
          <div>
            {t(lang, 'knewItLabel')}: <AnimatedNumber value={knownIds.length} />
          </div>
          <div>
            {t(lang, 'revisitLabel')}: <AnimatedNumber value={unknownIds.length} />
          </div>
        </div>
        <motion.button
          type="button"
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
          onClick={onBack}
          className="px-4 py-2.5 rounded-lg bg-[#DD0000] text-white text-sm font-semibold cursor-pointer min-h-[44px]"
        >
          {t(lang, 'doneBtn')}
        </motion.button>
      </motion.div>
    );
  }

  const card = cards[idx];
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-6 sm:p-8 max-w-xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono-tabular text-neutral-500">
          <span>{card.deck}</span>
          <span>
            {idx + 1} / {cards.length}
          </span>
        </div>
        <AnimatedProgressBar
          value={idx + (revealed ? 0.5 : 0)}
          max={Math.max(1, cards.length)}
          trackClassName="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
          barClassName="h-full w-full rounded-full bg-[#DD0000] dark:bg-[#FFCE00]"
          glowOnIncrease
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={card.id}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.settle }}
          className="py-8 text-center"
        >
          <div className="text-3xl font-display font-bold text-neutral-900 dark:text-white mb-4">
            {card.german_front}
          </div>
          <AnimatePresence initial={false}>
            {revealed && (
              <motion.div
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.settle }}
                className="space-y-2 pt-4 border-t border-neutral-200 dark:border-neutral-800"
              >
                <div className="text-lg font-medium text-[#DD0000] dark:text-[#FFCE00]">
                  {card.localized_meaning[lang] || card.localized_meaning.en || card.localized_meaning.de}
                </div>
                {card.example_de && (
                  <div className="text-sm text-neutral-600 dark:text-neutral-300">{card.example_de}</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {!revealed ? (
        <motion.button
          type="button"
          whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          onClick={() => setRevealed(true)}
          className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold cursor-pointer min-h-[44px]"
        >
          {t(lang, 'revealMeaningBtn')}
        </motion.button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            onClick={() => rateCard('unknown')}
            className="py-3 rounded-xl border border-[#DD0000] text-[#DD0000] text-sm font-semibold cursor-pointer min-h-[44px]"
          >
            {t(lang, 'didNotKnowBtn')}
          </motion.button>
          <motion.button
            type="button"
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            onClick={() => rateCard('known')}
            className="py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold cursor-pointer min-h-[44px]"
          >
            {t(lang, 'knewItBtn')}
          </motion.button>
        </div>
      )}
    </div>
  );
};
