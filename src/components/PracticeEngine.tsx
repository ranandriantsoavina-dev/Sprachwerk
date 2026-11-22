import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Play,
  RotateCcw,
  Save,
  SlidersHorizontal,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { apiRequest } from '../lib/api';
import { enqueueOfflineEvent } from '../lib/offlineQueue';
import type {
  DifficultyLevel,
  ExerciseType,
  Flashcard,
  PracticeParameters,
  Question,
  UserProfile,
} from '../types/domain';

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

interface PracticeResultRow {
  questionId: string;
  topic: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
  skipped: boolean;
  timedOut: boolean;
}

export const PracticeParametersPanel: React.FC<{
  mode: 'general' | 'lesson';
  intent?: 'start' | 'defaults';
  selectedTopics?: string[];
  topicTitle?: string;
  selectedLessons?: string[];
  lessonTitle?: string;
  lessonHasContent?: boolean;
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
  availableTypes,
  availableDifficulties,
  onBack,
}) => {
  const { user, lang, isOnline, pushToast, refreshUser, setUser, syncOfflineQueue, setScreen } = useApp();

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
  const [checkedFeedback, setCheckedFeedback] = useState<PracticeResultRow | null>(null);
  const [results, setResults] = useState<PracticeResultRow[]>([]);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [rewardSummary, setRewardSummary] = useState<{
    xpAwarded: number;
    coinsAwarded: number;
    queuedOffline?: boolean;
  } | null>(null);

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

      setQuestions(res.items);
      setCurrentIdx(0);
      setDraftAnswer('');
      setCheckedFeedback(null);
      setResults([]);
      setSessionElapsed(0);
      setSecondsLeft(params.timerSeconds);
      setRewardSummary(null);
      setStage('active');
    } catch (err) {
      if (mode === 'lesson' && lessonHasContent === false) {
        setStage('coming_soon');
        return;
      }
      pushToast(err instanceof Error ? err.message : 'Unable to load practice session.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIdx];

  const handleSubmitAnswer = (timedOut = false, skipped = false) => {
    if (!currentQuestion) return;
    const normalizedUser = draftAnswer.trim().toLowerCase();
    const accepted = currentQuestion.accepted_answers.map((a) => a.trim().toLowerCase());
    const isCorrect = !timedOut && !skipped && accepted.includes(normalizedUser);
    const explanation =
      currentQuestion.explanation_i18n[lang] ||
      currentQuestion.explanation_i18n.en ||
      currentQuestion.explanation_i18n.de ||
      '';

    const row: PracticeResultRow = {
      questionId: currentQuestion.id,
      topic: currentQuestion.topic_tags[0] || 'General',
      prompt: currentQuestion.prompt_de,
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
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
      setSecondsLeft(params.timerSeconds);
      return;
    }

    // Session complete -> submit to backend or queue offline
    setStage('summary');
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
      const res = await apiRequest<{ xpAwarded: number; coinsAwarded: number }>('/api/practice/submit', {
        method: 'POST',
        body: payload,
      });
      setRewardSummary({ xpAwarded: res.xpAwarded, coinsAwarded: res.coinsAwarded });
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
            mode === 'lesson' ? 'mb-6' : 'mb-3'
          }`}
        >
          {mode === 'lesson' ? 'Lesson content coming soon' : t(lang, 'comingSoonDatasetTitle')}
        </h2>
        {mode !== 'lesson' && (
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 mb-6">
            {t(lang, 'comingSoonDatasetBody')}
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
    return (
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-mono-tabular">
            {currentIdx + 1} / {questions.length} · {currentQuestion.cefr_level} · {currentQuestion.type.replace('_', ' ')}
          </span>
          {params.timerSeconds > 0 && (
            <span className="inline-flex items-center gap-1.5 font-mono-tabular font-semibold text-[#DD0000] dark:text-[#FFCE00]">
              <Clock size={14} />
              {secondsLeft}s
            </span>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-6 sm:p-8">
          <p className="text-lg sm:text-xl font-medium text-neutral-900 dark:text-white leading-relaxed mb-6">
            {currentQuestion.prompt_de}
          </p>

          {currentQuestion.options_de && currentQuestion.options_de.length > 0 ? (
            <div className="grid grid-cols-1 gap-2.5 mb-6">
              {currentQuestion.options_de.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  disabled={Boolean(checkedFeedback)}
                  onClick={() => setDraftAnswer(opt)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer min-h-[44px] ${
                    draftAnswer === opt
                      ? 'border-[#DD0000] bg-[#DD0000]/5 text-neutral-900 dark:text-white'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={draftAnswer}
              disabled={Boolean(checkedFeedback)}
              onChange={(e) => setDraftAnswer(e.target.value)}
              placeholder={t(lang, 'answerPlaceholder')}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm mb-6 focus:outline-none focus:border-[#DD0000]"
            />
          )}

          {checkedFeedback ? (
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/70 p-4 mb-5">
              <div className="flex items-center gap-2 text-sm font-semibold mb-1.5">
                {checkedFeedback.isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 size={16} /> {t(lang, 'correctLabel')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[#DD0000]">
                    <XCircle size={16} /> {t(lang, 'solutionLabel')}: {checkedFeedback.correctAnswer}
                  </span>
                )}
              </div>
              {checkedFeedback.explanation && (
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{checkedFeedback.explanation}</p>
              )}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            {!checkedFeedback ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmitAnswer(false, true)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer min-h-[44px]"
                >
                  {t(lang, 'skipBtn')}
                </button>
                <button
                  type="button"
                  disabled={!draftAnswer.trim()}
                  onClick={() => handleSubmitAnswer(false, false)}
                  className="px-6 py-2.5 rounded-lg bg-[#DD0000] text-white text-sm font-semibold hover:bg-[#b80000] disabled:opacity-40 transition-colors cursor-pointer min-h-[44px]"
                >
                  {t(lang, 'submitAnswerBtn')}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => advanceOrFinish(results)}
                className="ml-auto px-6 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-semibold cursor-pointer min-h-[44px]"
              >
                {currentIdx + 1 < questions.length ? t(lang, 'nextQuestionBtn') : t(lang, 'viewResultsBtn')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'summary') {
    const correctCount = results.filter((r) => r.isCorrect).length;
    const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
    const mistakes = results.filter((r) => !r.isCorrect);
    const hasCrimsonRibbon = user?.equipped?.celebration?.value === 'crimson_ribbon';

    return (
      <div className="max-w-3xl space-y-6">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-6 sm:p-8 overflow-hidden">
          {hasCrimsonRibbon && (
            <div className="-mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 px-6 py-3.5 bg-gradient-to-r from-black via-[#DD0000] to-black text-white border-b-2 border-[#FFCE00] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles size={17} className="text-[#FFCE00] shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-display font-bold tracking-wide text-[#FFCE00]">
                    {t(lang, 'crimsonRibbonBannerTitle')}
                  </div>
                  <div className="text-xs text-neutral-100 truncate">
                    {t(lang, 'crimsonRibbonBannerDesc')}
                  </div>
                </div>
              </div>
              <span className="font-mono-tabular text-xs font-bold text-[#FFCE00] shrink-0">
                {accuracy}%
              </span>
            </div>
          )}

          <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white mb-2">
            {t(lang, 'sessionCompleteTitle')}
          </h2>
          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300 mb-6">
            <span className="font-mono-tabular">{t(lang, 'accuracyWord')}: {accuracy}% ({correctCount}/{results.length})</span>
            <span className="font-mono-tabular">{t(lang, 'elapsedWord')}: {sessionElapsed}s</span>
          </div>

          {rewardSummary && (
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#FFCE00]/10 p-4 mb-6 text-sm font-medium text-neutral-900 dark:text-white">
              {rewardSummary.queuedOffline
                ? t(lang, 'queuedOfflineMsg')
                : `${t(lang, 'validatedRewardsPrefix')}: +${rewardSummary.xpAwarded} XP · +${rewardSummary.coinsAwarded} ${t(lang, 'coinBalance')}`}
            </div>
          )}

          {mistakes.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{t(lang, 'reviewMistakesTitle')}</h3>
              {mistakes.map((m, i) => (
                <div
                  key={`${m.questionId}-${i}`}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 text-sm space-y-1"
                >
                  <div className="font-medium text-neutral-900 dark:text-white">{m.prompt}</div>
                  <div className="text-[#DD0000]">{t(lang, 'yourAnswerLabel')}: {m.userAnswer || '—'}</div>
                  <div className="text-emerald-700 dark:text-emerald-400">{t(lang, 'solutionLabel')}: {m.correctAnswer}</div>
                  {m.explanation && <div className="text-neutral-500 dark:text-neutral-400">{m.explanation}</div>}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStage('configure')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#DD0000] text-white text-sm font-semibold cursor-pointer min-h-[44px]"
            >
              <RotateCcw size={15} />
              <span>{t(lang, 'newSessionBtn')}</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer min-h-[44px]"
            >
              {t(lang, 'dashboardBtn')}
            </button>
          </div>
        </div>
      </div>
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
              <button
                key={et.id}
                type="button"
                onClick={() => toggleType(et.id)}
                className={`px-3 py-2.5 rounded-lg border text-xs font-medium text-left transition-colors cursor-pointer min-h-[44px] ${
                  active
                    ? 'border-[#DD0000] bg-[#DD0000]/8 text-[#DD0000] dark:text-white dark:bg-[#DD0000]/20'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                }`}
              >
                {et.labels[lang]}
              </button>
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
              max={50}
              value={customCount}
              onChange={(e) => {
                setCustomCount(e.target.value);
                const n = Number(e.target.value);
                if (n >= 1 && n <= 50) {
                  setParams((p) => ({ ...p, questionCount: n }));
                }
              }}
              placeholder={t(lang, 'customPlaceholder')}
              className="w-20 px-2.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-xs font-mono-tabular text-neutral-900 dark:text-white min-h-[40px]"
            />
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
            {t(lang, 'questionOrderLabel')}
          </div>
          <div className="inline-flex flex-wrap gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 max-w-full">
            {(['shuffled', 'sequential'] as const).map((ord) => (
              <button
                key={ord}
                type="button"
                onClick={() => setParams((p) => ({ ...p, order: ord }))}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                  params.order === ord
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {ord === 'shuffled' ? t(lang, 'orderShuffled') : t(lang, 'orderSequential')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
            {t(lang, 'feedbackTimingLabel')}
          </div>
          <div className="inline-flex flex-wrap gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 max-w-full">
            {(['instant', 'end'] as const).map((ft) => (
              <button
                key={ft}
                type="button"
                onClick={() => setParams((p) => ({ ...p, feedbackTiming: ft }))}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                  params.feedbackTiming === ft
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {ft === 'instant' ? t(lang, 'feedbackInstant') : t(lang, 'feedbackEnd')}
              </button>
            ))}
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
      pushToast('Flashcard rating saved offline for sync.', 'info');
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
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-6 sm:p-8 max-w-xl space-y-4 overflow-hidden">
        {hasCrimsonRibbon && (
          <div className="-mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-4 px-6 py-3 bg-gradient-to-r from-black via-[#DD0000] to-black text-white border-b-2 border-[#FFCE00] flex items-center gap-2.5">
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
          <div>{t(lang, 'reviewedLabel')}: {cards.length}</div>
          <div>{t(lang, 'knewItLabel')}: {knownIds.length}</div>
          <div>{t(lang, 'revisitLabel')}: {unknownIds.length}</div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 rounded-lg bg-[#DD0000] text-white text-sm font-semibold cursor-pointer min-h-[44px]"
        >
          {t(lang, 'doneBtn')}
        </button>
      </div>
    );
  }

  const card = cards[idx];
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-6 sm:p-8 max-w-xl space-y-6">
      <div className="flex items-center justify-between text-xs font-mono-tabular text-neutral-500">
        <span>{card.deck}</span>
        <span>
          {idx + 1} / {cards.length}
        </span>
      </div>

      <div className="py-8 text-center">
        <div className="text-3xl font-display font-bold text-neutral-900 dark:text-white mb-4">
          {card.german_front}
        </div>
        {revealed && (
          <div className="space-y-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="text-lg font-medium text-[#DD0000] dark:text-[#FFCE00]">
              {card.localized_meaning[lang] || card.localized_meaning.en || card.localized_meaning.de}
            </div>
            {card.example_de && (
              <div className="text-sm text-neutral-600 dark:text-neutral-300">{card.example_de}</div>
            )}
          </div>
        )}
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold cursor-pointer min-h-[44px]"
        >
          {t(lang, 'revealMeaningBtn')}
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => rateCard('unknown')}
            className="py-3 rounded-xl border border-[#DD0000] text-[#DD0000] text-sm font-semibold cursor-pointer min-h-[44px]"
          >
            {t(lang, 'didNotKnowBtn')}
          </button>
          <button
            type="button"
            onClick={() => rateCard('known')}
            className="py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold cursor-pointer min-h-[44px]"
          >
            {t(lang, 'knewItBtn')}
          </button>
        </div>
      )}
    </div>
  );
};
