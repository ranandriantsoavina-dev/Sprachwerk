export type InterfaceLang = 'en' | 'fr' | 'de';
export type ThemeMode = 'light' | 'dark';
export type UserRole = 'learner' | 'admin';

export type ScreenId =
  | 'home'
  | 'general_practice'
  | 'lesson_practice'
  | 'library'
  | 'statistics'
  | 'shop'
  | 'leaderboard'
  | 'profile'
  | 'admin';

export type ExerciseType =
  | 'multiple_choice'
  | 'gap_fill'
  | 'sentence_construction'
  | 'translation'
  | 'matching'
  | 'transformation'
  | 'true_false'
  | 'error_correction';

export type DifficultyLevel = 'easy' | 'medium' | 'difficult' | 'extreme';

export interface PracticeParameters {
  exerciseTypes: ExerciseType[];
  difficulty: DifficultyLevel;
  timerSeconds: number; // 0 = Off, or 10, 15, 20, 30, 45, 60
  questionCount: number;
  order: 'sequential' | 'shuffled';
  feedbackTiming: 'instant' | 'end';
}

export interface LevelProgress {
  level: number;
  xpTotal: number;
  currentLevelFloorXp: number;
  nextLevelXp: number;
  xpIntoLevel: number;
  xpNeededForLevel: number;
  progressPct: number;
}

export interface EquippedItemRef {
  itemId: string;
  value: string;
  imageKey: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: 'pending' | 'active' | 'suspended';
  emailVerified: boolean;
  displayName: string;
  interfaceLang: InterfaceLang;
  theme: ThemeMode;
  timezone: string;
  leaderboardVisible: boolean;
  reducedMotion: boolean;
  xpTotal: number;
  weeklyXp: number;
  monthlyXp: number;
  coinsBalance: number;
  unlimitedCoins?: boolean;
  currentStreak: number;
  bestStreak: number;
  lastStudyDate: string | null;
  streakFreezesAvailable: number;
  practicePrefs: PracticeParameters | null;
  createdAt: string;
  level: LevelProgress;
  equipped: Record<string, EquippedItemRef>;
  claimableAchievements: number;
}

export interface GamificationConfig {
  xpPerLessonFirst: number;
  coinsPerLessonFirst: number;
  xpPerLessonReview: number;
  xpPerQuestionCorrect: number;
  xpPerSessionComplete: number;
  coinsPerSessionComplete: number;
  minQuestionsForSessionReward: number;
  xpPerFlashcardReview: number;
  xpPerPerfectSession: number;
  xpPerDailyFirstStudy: number;
  coinsPerDailyFirstStudy: number;
  levelBaseXp: number;
  levelStepXp: number;
  levelCoinBonus: number;
  streakProtectionEnabled: boolean;
  maxStreakFreezesHeld: number;
}

export interface ShopItem {
  id: string;
  category:
    | 'profile_cosmetics'
    | 'interface_themes'
    | 'streak_protection'
    | 'study_customization'
    | 'limited_seasonal';
  name_i18n: Record<InterfaceLang, string>;
  description_i18n: Record<InterfaceLang, string>;
  priceCoins: number;
  imageKey: string;
  availability: 'available' | 'seasonal' | 'disabled';
  effectType: string;
  effectValue: string;
  isConsumable: boolean;
  ownedQuantity: number;
  equipped: boolean;
  purchasedAt: string | null;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  reason: string;
  reference_id: string | null;
  created_at: string;
}

export interface AchievementItem {
  id: string;
  code: string;
  category: string;
  name_i18n: Record<InterfaceLang, string>;
  description_i18n: Record<InterfaceLang, string>;
  coinReward: number;
  metricKey: string;
  threshold: number;
  iconKey: string;
  unlocked: boolean;
  unlockedAt: string | null;
  claimed: boolean;
  claimedAt: string | null;
}

export interface LeaderboardEntry {
  rank: number | null;
  userId: string;
  displayName: string;
  isSelf: boolean;
  optedOut?: boolean;
  level: number;
  xpTotal: number;
  periodXp: number;
  currentStreak: number;
  bestStreak: number;
  cosmetics: Record<string, string>;
}

export interface LessonRule {
  id?: string;
  title: string;
  body: string;
  title_i18n?: Partial<Record<InterfaceLang, string>>;
  body_i18n?: Partial<Record<InterfaceLang, string>>;
}

export interface LessonTable {
  id: string;
  title_i18n: Record<InterfaceLang, string>;
  caption_i18n?: Record<InterfaceLang, string>;
  columns_i18n: Record<InterfaceLang, string[]>;
  rows: string[][];
}

export interface LessonExample {
  id?: string;
  sentence: string;
  highlight?: string;
  note?: string;
  explanation_i18n?: Record<InterfaceLang, string>;
  translation_i18n?: Record<InterfaceLang, string>;
}

export interface LessonContrastItem {
  id: string;
  title_i18n: Record<InterfaceLang, string>;
  contrast_pair?: string;
  body_i18n: Record<InterfaceLang, string>;
}

export interface LessonMistake {
  id?: string;
  wrong: string;
  right: string;
  explanation_i18n: Record<string, string>;
  principle_i18n?: Record<InterfaceLang, string>;
}

export interface LessonQuickReview {
  central_rule: string;
  key_pattern: string;
  mistake_warning: string;
  self_check: string;
}

export interface LessonPracticeSubskill {
  id: string;
  label_i18n: Record<InterfaceLang, string>;
  formats: ExerciseType[];
}

export interface Lesson {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  unit: number;
  title_en?: string;
  title_de: string;
  topic: string;
  hasContent?: boolean;
  tags?: string[];
  estimated_study_minutes?: number;
  prerequisite_knowledge_i18n?: Record<InterfaceLang, string>;
  objectives: Record<string, string>;
  learning_objectives_i18n?: Record<InterfaceLang, string[]>;
  introduction_i18n?: Record<InterfaceLang, string>;
  explanation_i18n: Record<string, string>;
  rules: LessonRule[];
  tables?: LessonTable[];
  examples_de: LessonExample[];
  usage_and_contrasts?: LessonContrastItem[];
  common_mistakes: LessonMistake[];
  quick_review_i18n?: Record<InterfaceLang, LessonQuickReview>;
  practice_mapping?: LessonPracticeSubskill[];
  progress?: {
    bookmarked: number;
    first_completed_at: string | null;
    review_count: number;
  };
}

export interface QuestionMatchingPair {
  left: string;
  right: string;
}

export interface Question {
  id: string;
  mode?: 'lesson-practice' | 'general-practice';
  lesson_ids: string[];
  topic_tags: string[];
  learning_objective_id?: string;
  cefr_level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  difficulty: DifficultyLevel;
  type: ExerciseType;
  prompt_de: string;
  prompt_i18n?: Partial<Record<InterfaceLang, string>>;
  options_de?: string[];
  fragments_de?: string[];
  matching_pairs?: QuestionMatchingPair[];
  accepted_answers: string[];
  solution: string;
  explanation_i18n: Record<string, string>;
  hint_i18n?: Partial<Record<InterfaceLang, string>>;
  case_sensitive?: boolean;
  source_language?: 'de';
}

export interface Flashcard {
  id: string;
  deck: string;
  german_front: string;
  localized_meaning: Record<string, string>;
  usage_note?: Record<string, string>;
  example_de?: string;
}

export interface RegistrationCodeAudit {
  id: string;
  code_hint: string;
  full_code?: string | null;
  label: string | null;
  status: 'active' | 'redeemed' | 'revoked' | 'expired';
  created_at: string;
  expires_at: string | null;
  redeemed_at: string | null;
  revoked_at: string | null;
  created_by_username: string | null;
  redeemed_by_username: string | null;
}
