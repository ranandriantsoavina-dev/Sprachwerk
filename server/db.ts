import { SCHEMA_STATEMENTS } from './schema.ts';

export interface D1ResultMeta {
  changes?: number;
  last_row_id?: number;
  duration?: number;
  rows_read?: number;
  rows_written?: number;
}

export interface D1Response {
  success: boolean;
  meta: D1ResultMeta;
  error?: string;
}

export interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: D1ResultMeta;
  error?: string;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run<T = Record<string, unknown>>(): Promise<D1Response>;
  raw<T = unknown[]>(): Promise<T[]>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump?(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
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

export interface AuthConfig {
  requireEmailVerification: boolean;
}

export const DEFAULT_GAMIFICATION_CONFIG: GamificationConfig = {
  xpPerLessonFirst: 50,
  coinsPerLessonFirst: 20,
  xpPerLessonReview: 10,
  xpPerQuestionCorrect: 5,
  xpPerSessionComplete: 20,
  coinsPerSessionComplete: 5,
  minQuestionsForSessionReward: 5,
  xpPerFlashcardReview: 2,
  xpPerPerfectSession: 15,
  xpPerDailyFirstStudy: 10,
  coinsPerDailyFirstStudy: 5,
  levelBaseXp: 100,
  levelStepXp: 60,
  levelCoinBonus: 10,
  streakProtectionEnabled: true,
  maxStreakFreezesHeld: 2,
};

export function getDefaultAuthConfig(): AuthConfig {
  const cfEnv = (globalThis as any).__CF_ENV__;
  const token =
    (cfEnv?.MAILTRAP_API_TOKEN ? String(cfEnv.MAILTRAP_API_TOKEN).trim() : '') ||
    (typeof process !== 'undefined' && process.env?.MAILTRAP_API_TOKEN ? process.env.MAILTRAP_API_TOKEN.trim() : '');
  return {
    requireEmailVerification: Boolean(token),
  };
}

export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  requireEmailVerification: false,
};

let activeDb: D1Database | null = null;
let initPromise: Promise<void> | null = null;

export function setDatabaseInstance(db: D1Database): void {
  activeDb = db;
}

/**
 * Creates an in-memory D1-compatible adapter for local Node testing when Cloudflare env.DB is not bound.
 * This guarantees no local SQLite file is ever created or required.
 */
async function createInMemoryD1(): Promise<D1Database> {
  const { DatabaseSync } = await import('node:sqlite');
  const mem = new DatabaseSync(':memory:');
  mem.exec('PRAGMA foreign_keys = ON;');

  const adapter: D1Database = {
    prepare(query: string): D1PreparedStatement {
      let boundValues: unknown[] = [];
      const prepared: D1PreparedStatement = {
        bind(...values: unknown[]) {
          boundValues = values.map((v) => (v === undefined ? null : v));
          return prepared;
        },
        async first<T = Record<string, unknown>>(colName?: string): Promise<T | null> {
          const stmt = mem.prepare(query);
          const row = stmt.get(...(boundValues as any[])) as Record<string, unknown> | undefined;
          if (!row) return null;
          if (colName) return (row[colName] ?? null) as T;
          return row as T;
        },
        async all<T = Record<string, unknown>>(): Promise<D1Result<T>> {
          const stmt = mem.prepare(query);
          const rows = stmt.all(...(boundValues as any[])) as T[];
          return {
            results: rows,
            success: true,
            meta: {
              changes: 0,
              last_row_id: 0,
              duration: 0,
              rows_read: rows.length,
              rows_written: 0,
            },
          };
        },
        async run<T = Record<string, unknown>>(): Promise<D1Response> {
          const stmt = mem.prepare(query);
          const info = stmt.run(...(boundValues as any[]));
          return {
            success: true,
            meta: {
              changes: Number(info.changes || 0),
              last_row_id: Number(info.lastInsertRowid || 0),
              duration: 0,
              rows_read: 0,
              rows_written: Number(info.changes || 0),
            },
          };
        },
        async raw<T = unknown[]>(): Promise<T[]> {
          const stmt = mem.prepare(query);
          const rows = stmt.all(...(boundValues as any[])) as Record<string, unknown>[];
          return rows.map((r) => Object.values(r)) as T[];
        },
      };
      return prepared;
    },
    async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
      mem.exec('BEGIN IMMEDIATE');
      try {
        const results: D1Result<T>[] = [];
        for (const s of statements) {
          const res = await s.all<T>();
          results.push(res);
        }
        mem.exec('COMMIT');
        return results;
      } catch (err) {
        try {
          mem.exec('ROLLBACK');
        } catch {
          // ignore
        }
        throw err;
      }
    },
    async exec(rawQuery: string): Promise<{ count: number; duration: number }> {
      mem.exec(rawQuery);
      return { count: 1, duration: 0 };
    },
  };

  return adapter;
}

export function getDb(): D1Database {
  if (activeDb) return activeDb;

  // 1. Check global Cloudflare Workers env
  try {
    const globalAny = globalThis as any;
    if (globalAny.__CF_ENV__?.DB) {
      activeDb = globalAny.__CF_ENV__.DB;
      return activeDb!;
    }
  } catch {}

  // 2. Synchronous fallback if already initialized or will be set by middleware
  if (!activeDb) {
    throw new Error('D1Database not initialized. Ensure Cloudflare binding "DB" is configured.');
  }

  return activeDb;
}

export async function resolveDb(explicitEnv?: { DB?: D1Database }): Promise<D1Database> {
  if (activeDb) return activeDb;

  if (explicitEnv?.DB) {
    activeDb = explicitEnv.DB;
    return activeDb;
  }

  try {
    const globalAny = globalThis as any;
    if (globalAny.__CF_ENV__?.DB) {
      activeDb = globalAny.__CF_ENV__.DB;
      return activeDb!;
    }
  } catch {}

  try {
    const cf = await import('cloudflare:workers');
    if ((cf.env as any)?.DB) {
      activeDb = (cf.env as any).DB;
      return activeDb!;
    }
  } catch {}

  // Local fallback: in-memory D1 (no local SQLite file on disk)
  activeDb = await createInMemoryD1();
  return activeDb;
}

export async function ensureDbInitialized(db: D1Database): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // 1. Create tables and indexes via D1-compatible batch execution
      await db.batch(SCHEMA_STATEMENTS.map((sql) => db.prepare(sql)));

      // 2. Seed default configuration and initial shop items & achievements
      await seedDefaults(db);
    } catch (err) {
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

export async function seedDefaults(db: D1Database): Promise<void> {
  const now = new Date().toISOString();

  // Seed configurable gamification economy & auth settings
  await db
    .prepare('INSERT OR IGNORE INTO app_settings (key, value_json, updated_at) VALUES (?, ?, ?)')
    .bind('gamification_config', JSON.stringify(DEFAULT_GAMIFICATION_CONFIG), now)
    .run();

  await db
    .prepare('INSERT OR IGNORE INTO app_settings (key, value_json, updated_at) VALUES (?, ?, ?)')
    .bind('auth_config', JSON.stringify(getDefaultAuthConfig()), now)
    .run();

  // Seed Virtual Shop items across all 5 PDF categories
  const shopItems = [
    {
      id: 'avatar_owl_scholar',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Eule der Grammatik',
        fr: 'Hibou de la Grammaire',
        de: 'Eule der Grammatik',
      },
      description_i18n: {
        en: 'Minimalist scholar owl emblem crafted in ink and gold.',
        fr: 'Emblème de hibou érudit dessiné à l’encre et à l’or.',
        de: 'Minimalistisches Eulen-Emblem in Tinte und Gold.',
      },
      price_coins: 30,
      image_key: 'owl',
      availability: 'available',
      effect_type: 'avatar',
      effect_value: 'owl',
      is_consumable: 0,
      sort_order: 1,
    },
    {
      id: 'avatar_berlin_compass',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Bauhaus Compass',
        fr: 'Compas Bauhaus',
        de: 'Bauhaus-Kompass',
      },
      description_i18n: {
        en: 'Precision geometric avatar inspired by Weimar design.',
        fr: 'Avatar géométrique inspiré du design de Weimar.',
        de: 'Präziser geometrischer Avatar im Weimarer Stil.',
      },
      price_coins: 45,
      image_key: 'compass',
      availability: 'available',
      effect_type: 'avatar',
      effect_value: 'compass',
      is_consumable: 0,
      sort_order: 2,
    },
    {
      id: 'avatar_feder',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Goldene Feder',
        fr: 'Plume Dorée',
        de: 'Goldene Feder',
      },
      description_i18n: {
        en: 'Classic fountain nib avatar for dedicated writers and learners.',
        fr: 'Avatar plume classique pour les passionnés d’écriture.',
        de: 'Klassische Füllfeder-Grafik für engagierte Lernende.',
      },
      price_coins: 60,
      image_key: 'nib',
      availability: 'available',
      effect_type: 'avatar',
      effect_value: 'nib',
      is_consumable: 0,
      sort_order: 3,
    },
    {
      id: 'frame_trikolore',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Schwarz-Rot-Gold Frame',
        fr: 'Cadre Noir-Rouge-Or',
        de: 'Schwarz-Rot-Gold-Rahmen',
      },
      description_i18n: {
        en: 'Crisp three-tone architectural ring around your profile avatar.',
        fr: 'Anneau architectural tricolore autour de votre avatar.',
        de: 'Klare dreifarbige Umrandung für dein Profilbild.',
      },
      price_coins: 40,
      image_key: 'frame_triad',
      availability: 'available',
      effect_type: 'frame',
      effect_value: 'triad',
      is_consumable: 0,
      sort_order: 4,
    },
    {
      id: 'frame_gold_laurel',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Goldkranz Frame',
        fr: 'Cadre Couronne d’Or',
        de: 'Goldkranz-Rahmen',
      },
      description_i18n: {
        en: 'Refined warm gold border signaling steady study discipline.',
        fr: 'Bordure dorée élégante récompensant la régularité.',
        de: 'Eleganter Goldrahmen für beständige Lernroutine.',
      },
      price_coins: 85,
      image_key: 'frame_gold',
      availability: 'available',
      effect_type: 'frame',
      effect_value: 'gold',
      is_consumable: 0,
      sort_order: 5,
    },
    {
      id: 'badge_kasus_kenner',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Kasus-Kenner Badge',
        fr: 'Badge Maître des Cas',
        de: 'Kasus-Kenner-Abzeichen',
      },
      description_i18n: {
        en: 'Display a refined crest beside your name on your profile and leaderboard.',
        fr: 'Affichez un insigne raffiné à côté de votre nom.',
        de: 'Zeige ein Abzeichen neben deinem Namen im Profil und Ranking.',
      },
      price_coins: 55,
      image_key: 'badge_shield',
      availability: 'available',
      effect_type: 'badge',
      effect_value: 'kasus_kenner',
      is_consumable: 0,
      sort_order: 6,
    },
    {
      id: 'theme_porcelain_editorial',
      category: 'interface_themes',
      name_i18n: {
        en: 'Meissen Porcelain Accent',
        fr: 'Accent Porcelaine',
        de: 'Porzellan-Akzent',
      },
      description_i18n: {
        en: 'Subtle warm studio surface accent for calm long-form study.',
        fr: 'Accent studio doux pour des sessions d’étude apaisées.',
        de: 'Ruhiger Studio-Akzent für konzentrierte Lerneinheiten.',
      },
      price_coins: 70,
      image_key: 'theme_porcelain',
      availability: 'available',
      effect_type: 'theme_accent',
      effect_value: 'porcelain',
      is_consumable: 0,
      sort_order: 7,
    },
    {
      id: 'theme_imperial_gold',
      category: 'interface_themes',
      name_i18n: {
        en: 'Amber Archive Accent',
        fr: 'Accent Archive Ambre',
        de: 'Bernstein-Archiv-Akzent',
      },
      description_i18n: {
        en: 'Highlighted gold progress indicators and card accents on your dashboard.',
        fr: 'Indicateurs dorés et accents soignés sur votre tableau de bord.',
        de: 'Goldene Fortschrittsbalken und Akzente für dein Dashboard.',
      },
      price_coins: 90,
      image_key: 'theme_gold',
      availability: 'available',
      effect_type: 'theme_accent',
      effect_value: 'gold_archive',
      is_consumable: 0,
      sort_order: 8,
    },
    {
      id: 'celebration_crimson_ribbon',
      category: 'study_customization',
      name_i18n: {
        en: 'Crimson Ribbon Finish',
        fr: 'Final Ruban Carmin',
        de: 'Karminrotes Finale',
      },
      description_i18n: {
        en: 'Custom session-completion celebration banner in Sprachwerk crimson and gold.',
        fr: 'Bannière de célébration personnalisée en rouge et or Sprachwerk.',
        de: 'Individuelle Abschluss-Animation in Sprachwerk-Rot und Gold.',
      },
      price_coins: 50,
      image_key: 'celebration_ribbon',
      availability: 'available',
      effect_type: 'celebration',
      effect_value: 'crimson_ribbon',
      is_consumable: 0,
      sort_order: 9,
    },
    {
      id: 'utility_streak_freeze',
      category: 'streak_protection',
      name_i18n: {
        en: 'Streak Freeze Token',
        fr: 'Bouclier de Série',
        de: 'Serien-Schutz',
      },
      description_i18n: {
        en: 'One-use protection that preserves your streak across 1 missed calendar day. Max 2 held; does not falsify study calendar activity.',
        fr: 'Protection à usage unique préservant votre série sur 1 jour manqué (max 2 en réserve).',
        de: 'Einmaliger Schutz für 1 verpassten Kalendertag (max. 2 im Inventar; fälscht keine Lernaktivität).',
      },
      price_coins: 35,
      image_key: 'streak_freeze',
      availability: 'available',
      effect_type: 'streak_freeze',
      effect_value: '1_day',
      is_consumable: 1,
      sort_order: 10,
    },
    {
      id: 'seasonal_winter_lantern',
      category: 'limited_seasonal',
      name_i18n: {
        en: 'Wintermarkt Crest',
        fr: 'Blason Marché d’Hiver',
        de: 'Wintermarkt-Wappen',
      },
      description_i18n: {
        en: 'Limited seasonal golden lantern badge. Remains permanently in your inventory once unlocked.',
        fr: 'Badge saisonnier limité. Reste acquis de façon permanente.',
        de: 'Limitiertes Saison-Abzeichen. Bleibt dauerhaft in deinem Inventar.',
      },
      price_coins: 75,
      image_key: 'seasonal_lantern',
      availability: 'seasonal',
      effect_type: 'badge',
      effect_value: 'winter_lantern',
      is_consumable: 0,
      sort_order: 11,
    },
    {
      id: 'avatar_crown_laurel',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Dichterkrone Avatar',
        fr: 'Avatar Couronne des Poètes',
        de: 'Dichterkrone-Avatar',
      },
      description_i18n: {
        en: 'Architectural laurel crown emblem honoring classical German literature.',
        fr: 'Emblème de couronne en laurier inspiré de la littérature classique.',
        de: 'Architektonisches Lorbeerkronen-Emblem klassischer Sprachkunst.',
      },
      price_coins: 75,
      image_key: 'crown',
      availability: 'available',
      effect_type: 'avatar',
      effect_value: 'crown',
      is_consumable: 0,
      sort_order: 12,
    },
    {
      id: 'badge_wortmeister',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Wortmeister Crest',
        fr: 'Insigne Maître des Mots',
        de: 'Wortmeister-Abzeichen',
      },
      description_i18n: {
        en: 'Editorial folio crest shown next to your name across profiles and rankings.',
        fr: 'Insigne de lexique affiché à côté de votre nom.',
        de: 'Redaktionelles Buch-Wappen neben deinem Namen.',
      },
      price_coins: 70,
      image_key: 'badge_book',
      availability: 'available',
      effect_type: 'badge',
      effect_value: 'wortmeister',
      is_consumable: 0,
      sort_order: 13,
    },
    {
      id: 'banner_brandenburg_arch',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Brandenburg Horizon Banner',
        fr: 'Bannière Horizon Brandebourg',
        de: 'Brandenburg-Horizont-Banner',
      },
      description_i18n: {
        en: 'Slate-and-crimson architectural backdrop for your profile and leaderboard card.',
        fr: 'Arrière-plan architectural ardoise et carmin pour votre profil et classement.',
        de: 'Schiefer- und karmesinrotes Banner für dein Profil und die Rangliste.',
      },
      price_coins: 65,
      image_key: 'banner_brandenburg',
      availability: 'available',
      effect_type: 'banner',
      effect_value: 'brandenburg_horizon',
      is_consumable: 0,
      sort_order: 14,
    },
    {
      id: 'banner_berlin_bauhaus',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Bauhaus Triad Banner',
        fr: 'Bannière Triade Bauhaus',
        de: 'Bauhaus-Trias-Banner',
      },
      description_i18n: {
        en: 'Geometric black, red, and gold composition rendered behind your profile and rankings.',
        fr: 'Composition géométrique noir, rouge et or sur votre profil et classement.',
        de: 'Geometrisches Schwarz-Rot-Gold-Banner für Profil und Rangliste.',
      },
      price_coins: 80,
      image_key: 'banner_bauhaus',
      availability: 'available',
      effect_type: 'banner',
      effect_value: 'bauhaus_grid',
      is_consumable: 0,
      sort_order: 15,
    },
    {
      id: 'banner_rhine_amber',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Rhine Amber Banner',
        fr: 'Bannière Ambre du Rhin',
        de: 'Rhein-Bernstein-Banner',
      },
      description_i18n: {
        en: 'Warm golden-hour gradient backdrop with refined studio linework.',
        fr: 'Dégradé ambre chaleureux avec lignes architecturales.',
        de: 'Warmer Bernstein-Farbverlauf mit feiner Linienstruktur.',
      },
      price_coins: 95,
      image_key: 'banner_rhine',
      availability: 'available',
      effect_type: 'banner',
      effect_value: 'rhine_amber',
      is_consumable: 0,
      sort_order: 16,
    },
    {
      id: 'badge_anim_imperial_star',
      category: 'limited_seasonal',
      name_i18n: {
        en: 'Animated Imperial Star Crest',
        fr: 'Blason Étoile Impériale Animé',
        de: 'Animierter Reichsstern-Orden',
      },
      description_i18n: {
        en: 'Premium animated golden crest that gleams gently beside your username.',
        fr: 'Blason doré animé haut de gamme scintillant à côté de votre nom.',
        de: 'Hochwertiger animierter Goldorden neben deinem Benutzernamen.',
      },
      price_coins: 260,
      image_key: 'badge_anim_star',
      availability: 'seasonal',
      effect_type: 'badge',
      effect_value: 'anim_imperial_star',
      is_consumable: 0,
      sort_order: 17,
    },
    {
      id: 'frame_anim_crown_pulse',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Animated Gold Aura Frame',
        fr: 'Cadre Aura Dorée Animé',
        de: 'Animierter Gold-Aura-Rahmen',
      },
      description_i18n: {
        en: 'Premium breathing gold halo framing your avatar across every view.',
        fr: 'Halo doré pulsant doucement autour de votre avatar.',
        de: 'Pulsierender goldener Lichtrahmen um deinen Avatar.',
      },
      price_coins: 280,
      image_key: 'frame_anim_gold',
      availability: 'available',
      effect_type: 'frame',
      effect_value: 'anim_gold_pulse',
      is_consumable: 0,
      sort_order: 18,
    },
    {
      id: 'avatar_anim_phoenix',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Animated Crimson Phoenix Avatar',
        fr: 'Avatar Phénix Carmin Animé',
        de: 'Animierter Karmesin-Phönix-Avatar',
      },
      description_i18n: {
        en: 'High-tier animated crimson and gold flame emblem for dedicated masters.',
        fr: 'Emblème animé prestige flamme carmin et or.',
        de: 'Hochwertiges animiertes Karmesin-Gold-Emblem für Spitzenlernende.',
      },
      price_coins: 300,
      image_key: 'anim_phoenix',
      availability: 'available',
      effect_type: 'avatar',
      effect_value: 'anim_phoenix',
      is_consumable: 0,
      sort_order: 19,
    },
    {
      id: 'frame_anim_aurora',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Animated Triad Aurora Frame',
        fr: 'Cadre Aurore Tricolore Animé',
        de: 'Animierter Trikolore-Aurora-Rahmen',
      },
      description_i18n: {
        en: 'Smoothly rotating Black-Red-Gold prismatic border ring around your avatar.',
        fr: 'Anneau prismatique Noir-Rouge-Or à rotation fluide autour de votre avatar.',
        de: 'Sanft rotierender Schwarz-Rot-Gold-Rahmen um deinen Avatar.',
      },
      price_coins: 350,
      image_key: 'frame_anim_aurora',
      availability: 'available',
      effect_type: 'frame',
      effect_value: 'anim_aurora',
      is_consumable: 0,
      sort_order: 20,
    },
    {
      id: 'banner_anim_schwarz_rot_gold',
      category: 'profile_cosmetics',
      name_i18n: {
        en: 'Animated Schwarz-Rot-Gold Wave Banner',
        fr: 'Bannière Vague Noir-Rouge-Or Animée',
        de: 'Animiertes Schwarz-Rot-Gold-Wellenbanner',
      },
      description_i18n: {
        en: 'Flagship animated crimson-and-gold shimmer banner for your profile and leaderboard rows.',
        fr: 'Bannière prestige animée à reflets carmin et or sur votre profil et le classement.',
        de: 'Exklusives animiertes Karmesin-Gold-Banner für Profil und Rangliste.',
      },
      price_coins: 450,
      image_key: 'banner_anim_wave',
      availability: 'available',
      effect_type: 'banner',
      effect_value: 'anim_imperial_wave',
      is_consumable: 0,
      sort_order: 21,
    },
  ];

  const shopStatements = shopItems.map((item) =>
    db
      .prepare(
        `INSERT OR IGNORE INTO shop_items
         (id, category, name_i18n, description_i18n, price_coins, image_key, availability, effect_type, effect_value, is_consumable, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        item.id,
        item.category,
        JSON.stringify(item.name_i18n),
        JSON.stringify(item.description_i18n),
        item.price_coins,
        item.image_key,
        item.availability,
        item.effect_type,
        item.effect_value,
        item.is_consumable,
        item.sort_order
      )
  );
  await db.batch(shopStatements);

  // Seed Achievements
  const achievements = [
    {
      id: 'ach_first_step',
      code: 'FIRST_STEP',
      category: 'onboarding',
      name_i18n: { en: 'Erster Schritt', fr: 'Premier Pas', de: 'Erster Schritt' },
      description_i18n: {
        en: 'Create and activate your Sprachwerk academy account.',
        fr: 'Créez et activez votre compte Sprachwerk.',
        de: 'Erstelle und aktiviere dein Sprachwerk-Konto.',
      },
      coin_reward: 15,
      metric_key: 'account_active',
      threshold: 1,
      icon_key: 'flag',
      sort_order: 1,
    },
    {
      id: 'ach_first_study_day',
      code: 'FIRST_STUDY_DAY',
      category: 'streak',
      name_i18n: { en: 'Tagesbeginn', fr: 'Première Journée', de: 'Tagesbeginn' },
      description_i18n: {
        en: 'Record your first qualifying study day.',
        fr: 'Enregistrez votre premier jour d’étude qualifiant.',
        de: 'Schließe deinen ersten qualifizierenden Lerntag ab.',
      },
      coin_reward: 10,
      metric_key: 'study_days',
      threshold: 1,
      icon_key: 'flame',
      sort_order: 2,
    },
    {
      id: 'ach_streak_3',
      code: 'STREAK_3',
      category: 'streak',
      name_i18n: { en: 'Drei Tage Aktiv', fr: 'Série de 3 Jours', de: '3-Tage-Serie' },
      description_i18n: {
        en: 'Reach a 3-day consecutive study streak.',
        fr: 'Atteignez une série de 3 jours consécutifs.',
        de: 'Erreiche eine Lernserie von 3 Tagen in Folge.',
      },
      coin_reward: 20,
      metric_key: 'best_streak',
      threshold: 3,
      icon_key: 'flame',
      sort_order: 3,
    },
    {
      id: 'ach_streak_7',
      code: 'STREAK_7',
      category: 'streak',
      name_i18n: { en: 'Wochen-Disziplin', fr: 'Semaine Complète', de: 'Wochen-Disziplin' },
      description_i18n: {
        en: 'Maintain a 7-day consecutive study streak.',
        fr: 'Maintenez une série de 7 jours consécutifs.',
        de: 'Halte eine Lernserie von 7 Tagen in Folge.',
      },
      coin_reward: 40,
      metric_key: 'best_streak',
      threshold: 7,
      icon_key: 'award',
      sort_order: 4,
    },
    {
      id: 'ach_xp_100',
      code: 'XP_100',
      category: 'xp',
      name_i18n: { en: 'Centurion (100 XP)', fr: 'Centurion (100 XP)', de: '100-XP-Meilenstein' },
      description_i18n: {
        en: 'Earn 100 lifetime XP through lessons or practice.',
        fr: 'Cumulez 100 XP via les leçons ou la pratique.',
        de: 'Sammle insgesamt 100 XP durch Lektionen oder Übungen.',
      },
      coin_reward: 15,
      metric_key: 'xp_total',
      threshold: 100,
      icon_key: 'zap',
      sort_order: 5,
    },
    {
      id: 'ach_xp_500',
      code: 'XP_500',
      category: 'xp',
      name_i18n: { en: 'Grammatik-Kenner (500 XP)', fr: 'Érudit (500 XP)', de: 'Grammatik-Kenner (500 XP)' },
      description_i18n: {
        en: 'Earn 500 lifetime XP.',
        fr: 'Cumulez 500 XP au total.',
        de: 'Erreiche 500 Gesamt-XP.',
      },
      coin_reward: 35,
      metric_key: 'xp_total',
      threshold: 500,
      icon_key: 'trophy',
      sort_order: 6,
    },
    {
      id: 'ach_first_session',
      code: 'FIRST_SESSION',
      category: 'practice',
      name_i18n: { en: 'Übungsstart', fr: 'Première Session', de: 'Übungsstart' },
      description_i18n: {
        en: 'Complete your first full practice session.',
        fr: 'Terminez votre première session d’exercice.',
        de: 'Schließe deine erste vollständige Übungseinheit ab.',
      },
      coin_reward: 20,
      metric_key: 'sessions_completed',
      threshold: 1,
      icon_key: 'check',
      sort_order: 7,
    },
    {
      id: 'ach_first_purchase',
      code: 'FIRST_PURCHASE',
      category: 'shop',
      name_i18n: { en: 'Sammler', fr: 'Collectionneur', de: 'Sammler' },
      description_i18n: {
        en: 'Unlock your first cosmetic or utility item in the Shop.',
        fr: 'Débloquez votre premier article dans la boutique.',
        de: 'Schalte deinen ersten Artikel im Shop frei.',
      },
      coin_reward: 10,
      metric_key: 'items_owned',
      threshold: 1,
      icon_key: 'shopping_bag',
      sort_order: 8,
    },
  ];

  const achStatements = achievements.map((a) =>
    db
      .prepare(
        `INSERT OR IGNORE INTO achievements
         (id, code, category, name_i18n, description_i18n, coin_reward, metric_key, threshold, icon_key, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        a.id,
        a.code,
        a.category,
        JSON.stringify(a.name_i18n),
        JSON.stringify(a.description_i18n),
        a.coin_reward,
        a.metric_key,
        a.threshold,
        a.icon_key,
        a.sort_order
      )
  );
  await db.batch(achStatements);
}

export async function getSetting<T>(db: D1Database, key: string, fallback: T): Promise<T> {
  try {
    const row = await db
      .prepare('SELECT value_json FROM app_settings WHERE key = ?')
      .bind(key)
      .first<{ value_json: string }>();
    if (!row) return fallback;
    return JSON.parse(row.value_json) as T;
  } catch {
    return fallback;
  }
}

export async function setSetting<T>(db: D1Database, key: string, value: T): Promise<void> {
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO app_settings (key, value_json, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`
    )
    .bind(key, JSON.stringify(value), now)
    .run();
}
