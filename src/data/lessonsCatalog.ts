import type { Lesson } from '../types/domain';
import { LESSON_A1_01 } from './lessons/a1_01';
import { LESSON_A1_02 } from './lessons/a1_02';
import { LESSON_A1_03 } from './lessons/a1_03';
import { LESSON_A1_04 } from './lessons/a1_04';
import { LESSON_A1_05 } from './lessons/a1_05';
import { LESSON_A1_06 } from './lessons/a1_06';
import { LESSON_A1_07 } from './lessons/a1_07';
import { LESSON_A1_08 } from './lessons/a1_08';
import { LESSON_A1_09 } from './lessons/a1_09';
import { LESSON_A1_10 } from './lessons/a1_10';
import { LESSON_A1_11 } from './lessons/a1_11';
import { LESSON_A1_12 } from './lessons/a1_12';
import { LESSON_A1_13 } from './lessons/a1_13';
import { LESSON_A1_14 } from './lessons/a1_14';
import { LESSON_A1_15 } from './lessons/a1_15';
import { LESSON_A1_16 } from './lessons/a1_16';
import { LESSON_A1_17 } from './lessons/a1_17';
import { LESSON_A1_18 } from './lessons/a1_18';
import { LESSON_A1_19 } from './lessons/a1_19';
import { LESSON_A1_20 } from './lessons/a1_20';
import { LESSON_A1_21 } from './lessons/a1_21';
import { LESSON_A1_22 } from './lessons/a1_22';
import { LESSON_A1_23 } from './lessons/a1_23';
import { LESSON_A1_24 } from './lessons/a1_24';
import { LESSON_A1_25 } from './lessons/a1_25';
import { LESSON_A1_26 } from './lessons/a1_26';
import { LESSON_A1_27 } from './lessons/a1_27';
import { LESSON_A1_28 } from './lessons/a1_28';
import { LESSON_A1_29 } from './lessons/a1_29';
import { LESSON_A1_30 } from './lessons/a1_30';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface LevelSectionMeta {
  level: CefrLevel;
  title: string;
  subtitle: string;
  lessonCount: number;
}

export const LEVEL_STRUCTURE: LevelSectionMeta[] = [
  {
    level: 'A1',
    title: 'Beginner · Grundstufe 1',
    subtitle: 'Build simple sentences, introduce yourself, ask questions and communicate in everyday situations.',
    lessonCount: 30,
  },
  {
    level: 'A2',
    title: 'Elementary · Grundstufe 2',
    subtitle: 'Describe everyday situations, discuss past events, express intentions and build more complex sentences.',
    lessonCount: 35,
  },
  {
    level: 'B1',
    title: 'Intermediate · Mittelstufe 1',
    subtitle: 'Express opinions, explain reasons, narrate past events and describe hypothetical situations.',
    lessonCount: 35,
  },
  {
    level: 'B2',
    title: 'Upper intermediate · Mittelstufe 2',
    subtitle: 'Build nuanced arguments, understand formal language and use complex grammatical structures accurately.',
    lessonCount: 40,
  },
  {
    level: 'C1',
    title: 'Advanced · Fortgeschrittene Sprachverwendung',
    subtitle: 'Use sophisticated grammar, write academic texts and communicate with precision and flexibility.',
    lessonCount: 40,
  },
];

export function formatLessonNumber(unit: number): string {
  return String(unit).padStart(2, '0');
}

type RawLessonSeed = readonly [unit: number, title_en: string, title_de: string];

const AUTHORED_A1_LESSONS: Lesson[] = [
  LESSON_A1_01,
  LESSON_A1_02,
  LESSON_A1_03,
  LESSON_A1_04,
  LESSON_A1_05,
  LESSON_A1_06,
  LESSON_A1_07,
  LESSON_A1_08,
  LESSON_A1_09,
  LESSON_A1_10,
  LESSON_A1_11,
  LESSON_A1_12,
  LESSON_A1_13,
  LESSON_A1_14,
  LESSON_A1_15,
  LESSON_A1_16,
  LESSON_A1_17,
  LESSON_A1_18,
  LESSON_A1_19,
  LESSON_A1_20,
  LESSON_A1_21,
  LESSON_A1_22,
  LESSON_A1_23,
  LESSON_A1_24,
  LESSON_A1_25,
  LESSON_A1_26,
  LESSON_A1_27,
  LESSON_A1_28,
  LESSON_A1_29,
  LESSON_A1_30,
];

const AUTHORED_LESSONS_BY_ID: Record<string, Lesson> = Object.fromEntries(
  AUTHORED_A1_LESSONS.map((lesson) => [lesson.id, lesson])
);

function buildLevelLessons(level: CefrLevel, seeds: readonly RawLessonSeed[]): Lesson[] {
  return seeds.map(([unit, title_en, title_de]) => {
    const id = `${level.toLowerCase()}-${formatLessonNumber(unit)}`;
    const authored = AUTHORED_LESSONS_BY_ID[id];
    if (authored) {
      return authored;
    }
    return {
      id,
      level,
      unit,
      title_en,
      title_de,
      topic: title_en,
      hasContent: false,
      objectives: {},
      explanation_i18n: {},
      rules: [],
      examples_de: [],
      common_mistakes: [],
    };
  });
}

const A1_LESSONS: readonly RawLessonSeed[] = [
  [1, 'The German alphabet and pronunciation', 'Alphabet und Aussprache'],
  [2, 'Personal pronouns', 'Personalpronomen'],
  [3, 'The verb sein', 'Das Verb sein'],
  [4, 'The verb haben', 'Das Verb haben'],
  [5, 'Regular verbs in the present tense', 'Regelmäßige Verben im Präsens'],
  [6, 'Irregular verbs in the present tense', 'Unregelmäßige Verben im Präsens'],
  [7, 'Verb conjugation', 'Verbkonjugation'],
  [8, 'Definite articles: der, die, das', 'Bestimmte Artikel'],
  [9, 'Indefinite articles: ein, eine', 'Unbestimmte Artikel'],
  [10, 'Noun gender', 'Genus der Nomen'],
  [11, 'Singular and plural', 'Singular und Plural'],
  [12, 'Nominative case', 'Nominativ'],
  [13, 'Accusative case', 'Akkusativ'],
  [14, 'Accusative personal pronouns', 'Personalpronomen im Akkusativ'],
  [15, 'Possessive articles', 'Possessivartikel'],
  [16, 'Negation: nicht and kein', 'Negation: nicht und kein'],
  [17, 'Yes/no questions', 'Ja-/Nein-Fragen'],
  [18, 'W-questions', 'W-Fragen'],
  [19, 'Basic sentence structure', 'Satzbau im Hauptsatz'],
  [20, 'Verb position', 'Verbposition'],
  [21, 'Modal verbs: können, müssen, wollen', 'Modalverben'],
  [22, 'Imperative', 'Imperativ'],
  [23, 'Separable verbs', 'Trennbare Verben'],
  [24, 'Basic time expressions', 'Zeitangaben'],
  [25, 'Prepositions of time', 'Temporale Präpositionen'],
  [26, 'Prepositions of place', 'Lokale Präpositionen'],
  [27, 'Conjunctions: und, aber, oder, denn', 'Konjunktionen'],
  [28, 'Connecting main clauses', 'Hauptsatzverbindungen'],
  [29, 'Basic adjective usage', 'Adjektive'],
  [30, 'Numbers, dates and telling the time', 'Zahlen, Datum und Uhrzeit'],
];

const A2_LESSONS: readonly RawLessonSeed[] = [
  [1, 'Dative case', 'Dativ'],
  [2, 'Dative articles', 'Artikel im Dativ'],
  [3, 'Dative personal pronouns', 'Personalpronomen im Dativ'],
  [4, 'Accusative vs. dative', 'Akkusativ oder Dativ'],
  [5, 'Two-way prepositions', 'Wechselpräpositionen'],
  [6, 'Local prepositions with accusative and dative', 'Lokale Präpositionen'],
  [7, 'Verbs requiring the dative', 'Verben mit Dativ'],
  [8, 'Verbs requiring accusative and dative', 'Verben mit Akkusativ und Dativ'],
  [9, 'Reflexive verbs', 'Reflexive Verben'],
  [10, 'Reflexive pronouns', 'Reflexivpronomen'],
  [11, 'Perfect tense with haben', 'Perfekt mit haben'],
  [12, 'Perfect tense with sein', 'Perfekt mit sein'],
  [13, 'Past participles', 'Partizip II'],
  [14, 'Regular and irregular past participles', 'Regelmäßige und unregelmäßige Partizipien'],
  [15, 'Präteritum of sein and haben', 'Präteritum von sein und haben'],
  [16, 'Präteritum of modal verbs', 'Präteritum der Modalverben'],
  [17, 'Modal verbs in more detail', 'Modalverben im Überblick'],
  [18, 'Future tense with werden', 'Futur I'],
  [19, 'Comparative adjectives', 'Komparativ'],
  [20, 'Superlative adjectives', 'Superlativ'],
  [21, 'Adjective endings after indefinite articles', 'Adjektivdeklination nach unbestimmten Artikeln'],
  [22, 'Adjective endings after definite articles', 'Adjektivdeklination nach bestimmten Artikeln'],
  [23, 'Adjective endings without articles', 'Adjektivdeklination ohne Artikel'],
  [24, 'Subordinate clauses with weil', 'Nebensätze mit weil'],
  [25, 'Subordinate clauses with dass', 'Nebensätze mit dass'],
  [26, 'Subordinate clauses with wenn', 'Nebensätze mit wenn'],
  [27, 'Word order in subordinate clauses', 'Wortstellung im Nebensatz'],
  [28, 'Infinitive with zu', 'Infinitiv mit zu'],
  [29, 'Connectors: deshalb, trotzdem, dann', 'Satzverbindungen'],
  [30, 'Indefinite pronouns: man, jemand, niemand', 'Indefinitpronomen'],
  [31, 'Demonstrative pronouns', 'Demonstrativpronomen'],
  [32, 'Prepositions with fixed cases', 'Präpositionen mit festem Kasus'],
  [33, 'Time conjunctions: als, wenn', 'Temporale Konjunktionen'],
  [34, 'Adverbs of frequency and manner', 'Adverbien der Häufigkeit und Art'],
  [35, 'Word order: time, manner and place', 'Temporal-, Modal- und Lokalbestimmungen'],
];

const B1_LESSONS: readonly RawLessonSeed[] = [
  [1, 'Genitive case', 'Genitiv'],
  [2, 'Genitive articles and endings', 'Genitivartikel und Endungen'],
  [3, 'Genitive prepositions', 'Präpositionen mit Genitiv'],
  [4, 'Complete adjective declension', 'Adjektivdeklination'],
  [5, 'Adjective endings after possessive articles', 'Adjektivdeklination nach Possessivartikeln'],
  [6, 'Adjective endings after demonstratives', 'Adjektivdeklination nach Demonstrativartikeln'],
  [7, 'Relative clauses in the nominative', 'Relativsätze im Nominativ'],
  [8, 'Relative clauses in the accusative', 'Relativsätze im Akkusativ'],
  [9, 'Relative clauses in the dative', 'Relativsätze im Dativ'],
  [10, 'Relative pronouns', 'Relativpronomen'],
  [11, 'Relative clauses with prepositions', 'Relativsätze mit Präpositionen'],
  [12, 'Plusquamperfekt', 'Plusquamperfekt'],
  [13, 'Präteritum of common verbs', 'Präteritum'],
  [14, 'Perfect vs. Präteritum', 'Perfekt oder Präteritum'],
  [15, 'Konjunktiv II with würde', 'Konjunktiv II mit würde'],
  [16, 'Konjunktiv II of sein and haben', 'Konjunktiv II von sein und haben'],
  [17, 'Konjunktiv II of modal verbs', 'Konjunktiv II der Modalverben'],
  [18, 'Hypothetical conditions', 'Irreale Bedingungssätze'],
  [19, 'Passive voice in the present tense', 'Passiv im Präsens'],
  [20, 'Passive voice in the past tense', 'Passiv im Präteritum'],
  [21, 'Passive with modal verbs', 'Passiv mit Modalverben'],
  [22, 'Infinitive clauses with zu', 'Infinitivsätze mit zu'],
  [23, 'Infinitive clauses with um ... zu', 'Um ... zu'],
  [24, 'Infinitive clauses with ohne ... zu', 'Ohne ... zu'],
  [25, 'Infinitive clauses with statt ... zu', 'Statt ... zu'],
  [26, 'Subordinate clauses with obwohl', 'Nebensätze mit obwohl'],
  [27, 'Subordinate clauses with während', 'Nebensätze mit während'],
  [28, 'Subordinate clauses with bevor and nachdem', 'Bevor und nachdem'],
  [29, 'Subordinate clauses with damit', 'Nebensätze mit damit'],
  [30, 'Subordinate clauses with falls', 'Nebensätze mit falls'],
  [31, 'Indirect questions', 'Indirekte Fragen'],
  [32, 'Indirect speech: introduction', 'Indirekte Rede'],
  [33, 'Verbs with prepositions', 'Verben mit Präpositionen'],
  [34, 'Pronominal adverbs: daran, darauf, worüber', 'Pronominaladverbien'],
  [35, 'Two-part conjunctions', 'Zweiteilige Konnektoren'],
];

const B2_LESSONS: readonly RawLessonSeed[] = [
  [1, 'Advanced subordinate clauses', 'Komplexe Nebensätze'],
  [2, 'Advanced relative clauses', 'Erweiterte Relativsätze'],
  [3, 'Relative clauses with wo and was', 'Relativsätze mit wo und was'],
  [4, 'Extended genitive constructions', 'Erweiterte Genitivkonstruktionen'],
  [5, 'Advanced adjective declension', 'Vertiefte Adjektivdeklination'],
  [6, 'Nominalized adjectives', 'Nominalisierte Adjektive'],
  [7, 'Nominalization of verbs', 'Nominalisierung von Verben'],
  [8, 'Nominalization of clauses', 'Nominalisierung von Sätzen'],
  [9, 'Passive voice in major tenses', 'Passiv in verschiedenen Zeitformen'],
  [10, 'Process passive (Vorgangspassiv)', 'Vorgangspassiv'],
  [11, 'State passive (Zustandspassiv)', 'Zustandspassiv'],
  [12, 'Passive alternatives with man', 'Passiversatzformen mit man'],
  [13, 'Passive alternatives with sich lassen', 'Passiversatzformen mit sich lassen'],
  [14, 'sein + zu + infinitive', 'Sein + zu + Infinitiv'],
  [15, 'Konjunktiv I', 'Konjunktiv I'],
  [16, 'Indirect speech with Konjunktiv I', 'Indirekte Rede mit Konjunktiv I'],
  [17, 'Konjunktiv II in complex situations', 'Erweiterter Konjunktiv II'],
  [18, 'Past hypothetical conditions', 'Irreale Bedingungssätze der Vergangenheit'],
  [19, 'Mixed conditional sentences', 'Gemischte Bedingungssätze'],
  [20, 'Futur II', 'Futur II'],
  [21, 'Modal verbs expressing assumptions', 'Modale Bedeutung der Modalverben'],
  [22, 'Modal verbs expressing probability', 'Vermutungen mit Modalverben'],
  [23, 'Modal particles', 'Modalpartikeln'],
  [24, 'Advanced two-part conjunctions', 'Erweiterte zweiteilige Konnektoren'],
  [25, 'Conjunctions: indem, dadurch dass', 'Indem und dadurch dass'],
  [26, 'Conjunctions: sofern, insofern, soweit', 'Erweiterte konditionale Konjunktionen'],
  [27, 'Concessive clauses', 'Konzessivsätze'],
  [28, 'Consecutive clauses', 'Konsekutivsätze'],
  [29, 'Causal and purposive clauses', 'Kausal- und Finalnebensätze'],
  [30, 'Temporal clauses and tense relationships', 'Temporalsätze und Zeitverhältnisse'],
  [31, 'Extended infinitive constructions', 'Erweiterte Infinitivkonstruktionen'],
  [32, 'Verbs with fixed prepositions and cases', 'Verben mit festen Präpositionen'],
  [33, 'Prepositional objects', 'Präpositionalobjekte'],
  [34, 'Advanced word order', 'Erweiterter Satzbau'],
  [35, 'Sentence brackets and complex verb structures', 'Satzklammer und komplexe Verbstrukturen'],
  [36, 'Participle constructions', 'Partizipialkonstruktionen'],
  [37, 'Extended participle attributes', 'Erweiterte Partizipialattribute'],
  [38, 'Adjective and adverb distinctions', 'Adjektive und Adverbien'],
  [39, 'Connector placement and logical sentence structure', 'Konnektoren und logischer Satzbau'],
  [40, 'Formal and informal sentence structures', 'Formeller und informeller Satzbau'],
];

const C1_LESSONS: readonly RawLessonSeed[] = [
  [1, 'Advanced nominalization', 'Erweiterte Nominalisierung'],
  [2, 'Nominal style vs. verbal style', 'Nominalstil und Verbalstil'],
  [3, 'Complex noun phrases', 'Komplexe Nominalgruppen'],
  [4, 'Extended noun attributes', 'Erweiterte Nominalattribute'],
  [5, 'Advanced participle constructions', 'Erweiterte Partizipialkonstruktionen'],
  [6, 'Participle I and II as attributes', 'Partizip I und II als Attribute'],
  [7, 'Reduced relative clauses', 'Verkürzte Relativsätze'],
  [8, 'Complex relative clause structures', 'Komplexe Relativsatzkonstruktionen'],
  [9, 'Advanced passive constructions', 'Erweiterte Passivkonstruktionen'],
  [10, 'Passive with modal verbs in different tenses', 'Passiv mit Modalverben in verschiedenen Zeitformen'],
  [11, 'Passive alternatives and stylistic use', 'Passiversatzformen und ihre stilistische Verwendung'],
  [12, 'Advanced Konjunktiv I', 'Erweiterter Konjunktiv I'],
  [13, 'Advanced indirect speech', 'Erweiterte indirekte Rede'],
  [14, 'Konjunktiv I vs. Konjunktiv II in reported speech', 'Konjunktiv I und II in der indirekten Rede'],
  [15, 'Advanced Konjunktiv II', 'Erweiterter Konjunktiv II'],
  [16, 'Complex hypothetical constructions', 'Komplexe irreale Konstruktionen'],
  [17, 'Conditional clauses without wenn', 'Bedingungssätze ohne wenn'],
  [18, 'Inverted conditional constructions', 'Invertierte Konditionalsätze'],
  [19, 'Complex temporal relationships', 'Komplexe Zeitverhältnisse'],
  [20, 'Advanced infinitive constructions', 'Erweiterte Infinitivkonstruktionen'],
  [21, 'Infinitive clauses with passive constructions', 'Infinitivkonstruktionen mit Passiv'],
  [22, 'Advanced prepositional constructions', 'Erweiterte Präpositionalkonstruktionen'],
  [23, 'Complex prepositional objects', 'Komplexe Präpositionalobjekte'],
  [24, 'Advanced modal particles', 'Erweiterte Modalpartikeln'],
  [25, 'Modal particles and pragmatic meaning', 'Modalpartikeln und ihre pragmatische Bedeutung'],
  [26, 'Advanced conjunctions and connectors', 'Erweiterte Konnektoren'],
  [27, 'Discourse connectors and argumentation', 'Diskurskonnektoren'],
  [28, 'Elliptical sentences', 'Elliptische Sätze'],
  [29, 'Sentence fragments and ellipsis in formal language', 'Satzellipsen'],
  [30, 'Complex sentence embedding', 'Komplexe Satzgefüge'],
  [31, 'Word order in complex sentences', 'Wortstellung in komplexen Satzgefügen'],
  [32, 'Focus and emphasis through word order', 'Fokus und Hervorhebung durch Wortstellung'],
  [33, 'Information structure and sentence positioning', 'Informationsstruktur und Satzgliedstellung'],
  [34, 'Advanced adjective and noun declension', 'Erweiterte Deklination'],
  [35, 'Appositions and parenthetical constructions', 'Appositionen und Einschübe'],
  [36, 'Advanced comparison structures', 'Erweiterte Vergleichskonstruktionen'],
  [37, 'Stylistic variation in grammatical structures', 'Stilistische Variation grammatischer Strukturen'],
  [38, 'Grammar in academic writing', 'Grammatik im wissenschaftlichen Schreiben'],
  [39, 'Grammar in formal and professional communication', 'Grammatik in formeller und beruflicher Kommunikation'],
  [40, 'Advanced grammatical accuracy and correction', 'Grammatische Präzision und Fehlerkorrektur'],
];

export const LESSONS_CATALOG: Lesson[] = [
  ...buildLevelLessons('A1', A1_LESSONS),
  ...buildLevelLessons('A2', A2_LESSONS),
  ...buildLevelLessons('B1', B1_LESSONS),
  ...buildLevelLessons('B2', B2_LESSONS),
  ...buildLevelLessons('C1', C1_LESSONS),
];
