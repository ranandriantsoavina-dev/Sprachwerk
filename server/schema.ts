// SPRACHWERK (German Grammar Academy)
// Cloudflare D1 Relational Database Schema Definition

export const SCHEMA_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended')),
    email_verified INTEGER NOT NULL DEFAULT 0,
    display_name TEXT NOT NULL,
    interface_lang TEXT NOT NULL DEFAULT 'en' CHECK (interface_lang IN ('en', 'fr', 'de')),
    theme TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    timezone TEXT NOT NULL DEFAULT 'UTC',
    leaderboard_visible INTEGER NOT NULL DEFAULT 1,
    reduced_motion INTEGER NOT NULL DEFAULT 0,
    xp_total INTEGER NOT NULL DEFAULT 0,
    weekly_xp INTEGER NOT NULL DEFAULT 0,
    weekly_period_key TEXT NOT NULL DEFAULT '',
    monthly_xp INTEGER NOT NULL DEFAULT 0,
    monthly_period_key TEXT NOT NULL DEFAULT '',
    coins_balance INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    last_study_date TEXT,
    streak_freezes_available INTEGER NOT NULL DEFAULT 0,
    last_xp_reached_at TEXT,
    practice_prefs_json TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    user_agent TEXT,
    ip_prefix TEXT,
    created_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    revoked_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS registration_codes (
    id TEXT PRIMARY KEY,
    code_hash TEXT NOT NULL UNIQUE,
    code_hint TEXT NOT NULL,
    code_value TEXT,
    label TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'revoked', 'expired')),
    created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    redeemed_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT,
    redeemed_at TEXT,
    revoked_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS reward_events (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    xp_delta INTEGER NOT NULL DEFAULT 0,
    coin_delta INTEGER NOT NULL DEFAULT 0,
    reference_id TEXT,
    idempotency_key TEXT NOT NULL UNIQUE,
    local_date TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS wallet_transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reference_id TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS shop_items (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('profile_cosmetics', 'interface_themes', 'streak_protection', 'study_customization', 'limited_seasonal')),
    name_i18n TEXT NOT NULL,
    description_i18n TEXT NOT NULL,
    price_coins INTEGER NOT NULL CHECK (price_coins >= 0),
    image_key TEXT NOT NULL,
    availability TEXT NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'seasonal', 'disabled')),
    effect_type TEXT NOT NULL,
    effect_value TEXT NOT NULL,
    is_consumable INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS user_inventory (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    equipped INTEGER NOT NULL DEFAULT 0,
    purchased_at TEXT NOT NULL,
    UNIQUE(user_id, item_id)
  )`,
  `CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    name_i18n TEXT NOT NULL,
    description_i18n TEXT NOT NULL,
    coin_reward INTEGER NOT NULL DEFAULT 0,
    metric_key TEXT NOT NULL,
    threshold INTEGER NOT NULL,
    icon_key TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS user_achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TEXT NOT NULL,
    claimed_at TEXT,
    UNIQUE(user_id, achievement_id)
  )`,
  `CREATE TABLE IF NOT EXISTS practice_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mode TEXT NOT NULL CHECK (mode IN ('general', 'lesson', 'flashcards')),
    selected_topics_json TEXT NOT NULL,
    selected_lessons_json TEXT NOT NULL,
    parameters_json TEXT NOT NULL,
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    incorrect_count INTEGER NOT NULL DEFAULT 0,
    skipped_count INTEGER NOT NULL DEFAULT 0,
    timed_out_count INTEGER NOT NULL DEFAULT 0,
    elapsed_seconds INTEGER NOT NULL DEFAULT 0,
    results_json TEXT NOT NULL,
    xp_awarded INTEGER NOT NULL DEFAULT 0,
    coins_awarded INTEGER NOT NULL DEFAULT 0,
    idempotency_key TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS study_activity_days (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    local_date TEXT NOT NULL,
    qualifying_actions INTEGER NOT NULL DEFAULT 1,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    is_frozen INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, local_date)
  )`,
  `CREATE TABLE IF NOT EXISTS lesson_progress (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    bookmarked INTEGER NOT NULL DEFAULT 0,
    first_completed_at TEXT,
    last_reviewed_at TEXT,
    review_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, lesson_id)
  )`,
  `CREATE TABLE IF NOT EXISTS flashcard_reviews (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_id TEXT NOT NULL,
    deck TEXT NOT NULL,
    rating TEXT NOT NULL CHECK (rating IN ('known', 'unknown')),
    review_count INTEGER NOT NULL DEFAULT 1,
    last_reviewed_at TEXT NOT NULL,
    UNIQUE(user_id, card_id)
  )`,
  `CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS rate_limits (
    bucket_key TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0,
    window_start_ms INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_reward_events_user_date ON reward_events(user_id, created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_practice_sessions_user ON practice_sessions(user_id, created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_users_leaderboard_xp ON users(leaderboard_visible, xp_total DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_users_leaderboard_streak ON users(leaderboard_visible, current_streak DESC)`,
];

export const SCHEMA_SQL = SCHEMA_STATEMENTS.join(';\n') + ';';
