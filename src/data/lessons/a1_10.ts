import type { Lesson } from '../../types/domain';

export const LESSON_A1_10: Lesson = {
  id: 'a1-10',
  level: 'A1',
  unit: 10,
  title_en: 'Noun gender',
  title_de: 'Genus der Nomen',
  topic: 'Noun gender',
  hasContent: true,
  tags: ['genus', 'der-die-das', 'nomen', 'komposita', 'endungen'],
  estimated_study_minutes: 15,
  prerequisite_knowledge_i18n: {
    en: 'Connects directly to definite articles (Lesson A1-08) and indefinite articles (Lesson A1-09).',
    fr: 'En lien direct avec les articles définis (leçon A1-08) et indéfinis (leçon A1-09).',
    de: 'Knüpft direkt an bestimmte (Lektion A1-08) und unbestimmte Artikel (Lektion A1-09) an.',
  },
  objectives: {
    en: 'Distinguish reliable suffix rules from general gender tendencies, determine the gender of compound nouns, and use smart memorization cues for A1 vocabulary.',
    fr: 'Distinguer les suffixes fiables des tendances générales de genre, déterminer le genre des noms composés et mémoriser efficacement le genre des noms A1.',
    de: 'Sichere Endungsregeln von allgemeinen Tendenzen unterscheiden, das Genus von Komposita bestimmen und Lernhilfen für den A1-Wortschatz nutzen.',
  },
  learning_objectives_i18n: {
    en: [
      'Apply 100%-reliable suffix rules (such as -ung, -heit, -keit, -schaft, -tion, -tät → die; -chen, -lein → das; -ling → der).',
      'Use strong meaning and ending tendencies (days/months/seasons → der; most -e nouns → die; infinitive nouns → das) while recognizing exceptions.',
      'Determine the gender of any German compound noun (Kompositum) by looking strictly at its final component.',
    ],
    fr: [
      'Appliquer les suffixes fiables à 100 % (-ung, -heit, -keit, -schaft, -tion, -tät → die ; -chen, -lein → das ; -ling → der).',
      'Utiliser les grandes tendances de sens et de finale (jours/mois/saisons → der ; majorité des noms en -e → die ; infinitifs substantivés → das) en connaissant leurs exceptions.',
      'Déterminer le genre d’un nom composé (Kompositum) en regardant uniquement son dernier élément.',
    ],
    de: [
      'Eindeutige Suffixregeln anwenden (-ung, -heit, -keit, -schaft, -tion, -tät → die; -chen, -lein → das; -ling → der).',
      'Wichtige Bedeutungsgruppen und Tendenzen nutzen (Tage/Monate/Jahreszeiten → der; viele Nomen auf -e → die; substantivierte Infinitive → das) und Ausnahmen beachten.',
      'Das Genus zusammengesetzter Nomen (Komposita) anhand des letzten Wortteils bestimmen.',
    ],
  },
  introduction_i18n: {
    en: 'Every German noun has a grammatical gender—masculine (der), feminine (die), or neuter (das). While grammatical gender is not based on physical properties (der Löffel = spoon, die Gabel = fork, das Messer = knife), German does offer clear suffix rules, helpful tendencies, and an ironclad rule for compound words.',
    fr: 'Chaque nom allemand possède un genre grammatical : masculin (der), féminin (die) ou neutre (das). Même si ce genre ne dépend pas de la logique concrète (der Löffel = cuillère, die Gabel = fourchette, das Messer = couteau), des règles de suffixes très fiables, des tendances utiles et la règle des mots composés vous évitent d’apprendre au hasard.',
    de: 'Jedes deutsche Nomen hat ein grammatisches Geschlecht (Genus): Maskulinum (der), Femininum (die) oder Neutrum (das). Auch wenn das Genus oft nicht logisch erklärbar ist (der Löffel, die Gabel, das Messer), helfen feste Endungsregeln, klare Tendenzen und die Grundregel für Komposita enorm weiter.',
  },
  explanation_i18n: {
    en: [
      '1. Reliable rules vs. tendencies',
      'Always separate strict rules from helpful tendencies:',
      '• Strict masculine endings/groups: -ling (der Frühling), days/months/seasons (der Montag, der Mai, der Winter). Male persons and professions ending in -er (der Lehrer) are masculine, and many -er instruments are masculine too (der Drucker).',
      '• Strict feminine endings: -ung (die Zeitung), -heit (die Gesundheit), -keit (die Möglichkeit), -schaft (die Freundschaft), -tion (die Station), -tät (die Universität), -in for female people (die Ärztin).',
      '• Strong feminine tendency: nouns ending in -e (die Lampe, die Straße, die Tasche)—about 90% are feminine, though notable exceptions exist (der Name, der Junge, der Käse, das Auge, das Ende).',
      '• Strict neuter endings/groups: -chen and -lein (das Mädchen, das Brötchen, das Fräulein—ALWAYS neuter, even for people!), and infinitives used as nouns (das Essen, das Lernen, das Schwimmen). Nouns ending in -um (das Museum, das Zentrum) are also neuter.',
      '',
      '2. Compound nouns (Komposita)',
      'German loves combining two or more nouns into one word. The rule is 100% consistent: the LAST word decides the gender and plural of the entire compound:',
      '• der Tisch + die Lampe → die Tischlampe',
      '• die Schule + der Bus → der Schulbus',
      '• das Haus + die Tür → die Haustür; die Tür + das Schloss → das Türschloss',
    ].join('\n'),
    fr: [
      '1. Règles strictes et tendances générales',
      'Il est essentiel de distinguer les règles sans exception des simples tendances :',
      '• Masculin (der) : jours, mois, saisons (der Montag, der Mai, der Winter), suffixes -ling (der Frühling), noms de personnes ou métiers masculins (der Lehrer) et de nombreux appareils en -er (der Drucker).',
      '• Féminin fiable à 100 % (die) : suffixes -ung (die Zeitung), -heit (die Gesundheit), -keit (die Möglichkeit), -schaft (die Freundschaft), -tion (die Station), -tät (die Universität) et féminins en -in (die Ärztin).',
      '• Forte tendance féminine : la grande majorité des noms terminés par -e sont féminins (die Lampe, die Straße), mais attention aux exceptions (der Name, der Junge, der Käse, das Auge, das Ende).',
      '• Neutre fiable (das) : diminutifs en -chen et -lein (das Mädchen, das Brötchen — TOUJOURS neutres), infinitifs substantivés (das Essen, das Lernen) et noms en -um (das Museum, das Zentrum).',
      '',
      '2. La règle des noms composés (Komposita)',
      'En allemand, lorsqu’on assemble plusieurs mots, c’est TOUJOURS le dernier élément qui détermine le genre (et le pluriel) du mot entier :',
      '• der Tisch + die Lampe → die Tischlampe',
      '• die Schule + der Bus → der Schulbus',
      '• das Haus + die Tür → die Haustür',
    ].join('\n'),
    de: [
      '1. Feste Regeln vs. Tendenzen',
      'Unterscheide zwischen sicheren Regeln und typischen Tendenzen:',
      '• Maskulinum (der): Wochentage, Monate, Jahreszeiten (der Montag, der Mai, der Winter), Nomen auf -ling (der Frühling) sowie männliche Personen/Berufe und viele Geräte auf -er (der Lehrer, der Drucker).',
      '• Femininum sicher (die): Nomen auf -ung (die Zeitung), -heit (die Gesundheit), -keit (die Möglichkeit), -schaft (die Freundschaft), -tion (die Station), -tät (die Universität) sowie weibliche Personen auf -in (die Ärztin).',
      '• Starke Tendenz Femininum: Viele Nomen auf -e sind feminin (die Lampe, die Straße), aber es gibt Ausnahmen (der Name, der Junge, der Käse, das Auge, das Ende).',
      '• Neutrum sicher (das): Verkleinerungen auf -chen und -lein (das Mädchen, das Brötchen – immer neutral!), substantivierte Infinitive (das Essen, das Lernen) und Nomen auf -um (das Museum, das Zentrum).',
      '',
      '2. Zusammengesetzte Nomen (Komposita)',
      'Bei Komposita bestimmt immer das letzte Nomen (das Grundwort) das Geschlecht und die Pluralform des ganzen Wortes:',
      '• der Tisch + die Lampe → die Tischlampe',
      '• die Schule + der Bus → der Schulbus',
      '• das Haus + die Tür → die Haustür',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-suffixes',
      title: 'Sichere Endungen: -ung/-heit/-keit/-tion/-tät → die | -chen/-lein/-um → das',
      body: 'Bestimmte Suffixe legen das Genus eindeutig fest (die Zeitung, die Universität; das Brötchen, das Museum).',
      title_i18n: {
        en: 'Suffixes that guarantee gender',
        fr: 'Suffixes garantissant le genre',
        de: 'Eindeutige Genus-Endungen',
      },
      body_i18n: {
        en: 'Always feminine: -ung, -heit, -keit, -schaft, -tion, -tät, -in. Always neuter: -chen, -lein, -um. Always masculine: -ling (and days/months/seasons).',
        fr: 'Toujours féminin : -ung, -heit, -keit, -schaft, -tion, -tät, -in. Toujours neutre : -chen, -lein, -um. Toujours masculin : -ling (et jours/mois/saisons).',
        de: 'Immer feminin: -ung, -heit, -keit, -schaft, -tion, -tät, -in. Immer neutral: -chen, -lein, -um. Immer maskulin: -ling sowie Tage, Monate, Jahreszeiten.',
      },
    },
    {
      id: 'rule-compounds',
      title: 'Komposita: Das letzte Wort bestimmt den Artikel',
      body: 'Bei zusammengesetzten Nomen zählt immer nur der Artikel des letzten Bestandteils.',
      title_i18n: {
        en: 'Compound nouns take the gender of their last element',
        fr: 'Un nom composé prend le genre de son dernier élément',
        de: 'Bei Komposita entscheidet das letzte Wort',
      },
      body_i18n: {
        en: 'Ignore the gender of the first part(s) of a compound noun: only the final noun determines der, die, or das (das Wörter + das Buch → das Wörterbuch; die Kinder + das Zimmer → das Kinderzimmer).',
        fr: 'Ne regardez pas le genre du premier mot : seul le dernier nom fixe l’article (die Kinder + das Zimmer → das Kinderzimmer).',
        de: 'Der erste Wortteil spielt für den Artikel keine Rolle; nur das letzte Nomen bestimmt der, die oder das (die Kinder + das Zimmer → das Kinderzimmer).',
      },
    },
  ],
  tables: [
    {
      id: 'table-gender-cues',
      title_i18n: {
        en: 'Gender Rules and High-Frequency Tendencies',
        fr: 'Règles de genre et tendances principales',
        de: 'Genusregeln und häufige Tendenzen',
      },
      columns_i18n: {
        en: ['Gender', 'Reliable Endings / Groups', 'Examples', 'Reliability'],
        fr: ['Genre', 'Terminaisons / catégories', 'Exemples', 'Fiabilité'],
        de: ['Genus', 'Endungen / Gruppen', 'Beispiele', 'Verlässlichkeit'],
      },
      rows: [
        ['der (m.)', 'Days, months, seasons; -ling', 'der Montag, der Juli, der Herbst, der Frühling', 'Rule'],
        ['der (m.)', 'Male persons; -er agents/tools', 'der Lehrer, der Vater, der Drucker', 'Strong tendency'],
        ['die (f.)', '-ung, -heit, -keit, -schaft, -tion, -tät, -in', 'die Wohnung, die Gesundheit, die Station, die Ärztin', 'Rule'],
        ['die (f.)', 'Nouns ending in -e', 'die Lampe, die Straße, die Tasche (exc. der Name, das Auge)', 'Tendency (~90%)'],
        ['das (n.)', '-chen, -lein; -um; infinitives as nouns', 'das Mädchen, das Brötchen, das Museum, das Essen', 'Rule'],
        ['das (n.)', 'Letters, colors, languages', 'das A, das Blau, das Deutsch', 'Rule'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Die Zeitung liegt heute neben dem Brötchen.',
      highlight: 'Die Zeitung / Brötchen',
      note: '-ung → die; -chen → das (here dat. dem)',
      translation_i18n: {
        en: 'The newspaper is lying next to the bread roll today.',
        fr: 'Le journal est posé à côté du petit pain aujourd’hui.',
        de: 'Die Zeitung liegt heute neben dem Brötchen.',
      },
      explanation_i18n: {
        en: 'Zeitung ends in -ung (always feminine die); Brötchen ends in -chen (always neuter das, shown here after neben in dative dem).',
        fr: 'Zeitung finit par -ung (toujours die) et Brötchen par -chen (toujours das, ici au datif dem après neben).',
        de: 'Zeitung endet auf -ung (immer feminin); Brötchen endet auf -chen (immer neutral, hier nach neben im Dativ).',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Der Sommer beginnt bald und die Gesundheit ist mir wichtig.',
      highlight: 'Der Sommer / die Gesundheit',
      note: 'Season → der; -heit → die',
      translation_i18n: {
        en: 'Summer is starting soon and health is important to me.',
        fr: 'L’été commence bientôt et la santé est importante pour moi.',
        de: 'Der Sommer beginnt bald und die Gesundheit ist mir wichtig.',
      },
      explanation_i18n: {
        en: 'Seasons take der (der Sommer), and nouns ending in -heit take die (die Gesundheit).',
        fr: 'Les saisons sont masculines (der Sommer) et les noms en -heit féminins (die Gesundheit).',
        de: 'Jahreszeiten sind maskulin (der Sommer), Nomen auf -heit feminin (die Gesundheit).',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Die Haustür ist neu, aber das Wohnzimmer ist noch leer.',
      highlight: 'Die Haustür / das Wohnzimmer',
      note: 'Compounds follow the last noun: die Tür, das Zimmer',
      translation_i18n: {
        en: 'The front door is new, but the living room is still empty.',
        fr: 'La porte d’entrée est neuve, mais le salon est encore vide.',
        de: 'Die Haustür ist neu, aber das Wohnzimmer ist noch leer.',
      },
      explanation_i18n: {
        en: 'das Haus + die Tür → die Haustür; wohnen + das Zimmer → das Wohnzimmer.',
        fr: 'das Haus + die Tür → die Haustür ; wohnen + das Zimmer → das Wohnzimmer.',
        de: 'das Haus + die Tür → die Haustür; wohnen + das Zimmer → das Wohnzimmer.',
      },
    },
    {
      id: 'ex-4',
      sentence: 'Das Lernen macht Spaß, besonders am Freitag.',
      highlight: 'Das Lernen / Freitag',
      note: 'Nominalized infinitive (das); weekday (der)',
      translation_i18n: {
        en: 'Learning is fun, especially on Friday.',
        fr: 'Apprendre est agréable, surtout le vendredi.',
        de: 'Das Lernen macht Spaß, besonders am Freitag.',
      },
      explanation_i18n: {
        en: 'Any infinitive turned into a noun is neuter (das Lernen), and weekdays are masculine (der Freitag → am Freitag).',
        fr: 'Tout infinitif substantivé est neutre (das Lernen) et les jours sont masculins (der Freitag → am Freitag).',
        de: 'Substantivierte Infinitive sind neutral (das Lernen), Wochentage maskulin (der Freitag → am Freitag).',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-e-exceptions',
      contrast_pair: 'die Lampe  vs.  der Name / der Käse / das Ende',
      title_i18n: {
        en: 'Why "-e = die" is a tendency, not an absolute rule',
        fr: 'Pourquoi « -e = die » est une tendance et non une règle absolue',
        de: 'Ausnahmen bei der Tendenz „-e → die“',
      },
      body_i18n: {
        en: 'Most nouns ending in -e are feminine (die Schule, die Tasche, die Frage), so "-e" is a great clue. Still, keep common exceptions in mind: der Name, der Käse, der Junge, der Kollege, das Auge, das Ende, das Interesse.',
        fr: 'La majorité des noms en -e sont féminins, ce qui en fait un bon repère. Retenez toutefois quelques exceptions fréquentes : der Name, der Käse, der Junge, der Kollege, das Auge, das Ende.',
        de: 'Die meisten Nomen auf -e sind feminin, aber wichtige Ausnahmen wie der Name, der Käse, der Junge, das Auge oder das Ende musst du extra lernen.',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Die Mädchen spielt im Garten.',
      right: 'Das Mädchen spielt im Garten.',
      explanation_i18n: {
        en: 'Even though Mädchen refers to a girl, the diminutive suffix -chen makes the noun grammatically neuter (das Mädchen).',
        fr: 'Bien que Mädchen désigne une fille, le suffixe diminutif -chen rend toujours le nom neutre (das Mädchen).',
        de: 'Wegen der Verkleinerungsendung -chen ist das Mädchen immer neutral (das), nicht feminin.',
      },
      principle_i18n: {
        en: 'Every noun ending in -chen or -lein takes das.',
        fr: 'Tout nom terminé par -chen ou -lein prend das.',
        de: 'Alle Nomen auf -chen und -lein haben den Artikel das.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Der Tischlampe ist kaputt.',
      right: 'Die Tischlampe ist kaputt.',
      explanation_i18n: {
        en: 'Tischlampe ends in die Lampe; the first element (der Tisch) does not determine the gender.',
        fr: 'Tischlampe se termine par die Lampe ; le premier élément (der Tisch) ne fixe pas le genre.',
        de: 'Bei Tischlampe entscheidet das letzte Wort (die Lampe), nicht der Tisch.',
      },
      principle_i18n: {
        en: 'Look at the final component of a compound noun to find its article.',
        fr: 'Regardez toujours le dernier composant d’un mot composé.',
        de: 'Bestimme das Genus von Komposita immer über das letzte Wort.',
      },
    },
    {
      id: 'cm-3',
      wrong: 'Das Universität liegt im Zentrum.',
      right: 'Die Universität liegt im Zentrum.',
      explanation_i18n: {
        en: 'Nouns ending in -tät are always feminine (die Universität).',
        fr: 'Les noms en -tät sont toujours féminins (die Universität).',
        de: 'Nomen mit der Endung -tät sind immer feminin (die Universität).',
      },
      principle_i18n: {
        en: 'Remember the feminine suffix group: -ung, -heit, -keit, -schaft, -tion, -tät.',
        fr: 'Retenez les suffixes féminins : -ung, -heit, -keit, -schaft, -tion, -tät.',
        de: 'Merke dir die femininen Suffixe: -ung, -heit, -keit, -schaft, -tion, -tät.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'Noun gender (der/die/das) is grammatical; use strict suffix rules (-ung/-heit/-tion → die; -chen/-lein/-um → das) and compound-final rules.',
      key_pattern: 'Compound gender = gender of last noun (der Tisch + die Lampe → die Tischlampe).',
      mistake_warning: 'Remember das Mädchen (-chen is always neuter) and don’t treat "-e = die" as exception-free (der Name, das Ende).',
      self_check: 'What are the articles for Zeitung, Brötchen, Sommer, and Schulbus (die Schule + der Bus)?',
    },
    fr: {
      central_rule: 'Le genre grammatical suit des suffixes fiables (-ung/-heit/-tion → die ; -chen/-lein/-um → das) et la règle du dernier élément dans les mots composés.',
      key_pattern: 'Genre d’un composé = genre du dernier nom (der Tisch + die Lampe → die Tischlampe).',
      mistake_warning: 'N’oubliez pas das Mädchen (-chen est toujours neutre) ni les exceptions en -e (der Name, das Ende).',
      self_check: 'Quel article faut-il devant Zeitung, Brötchen, Sommer et Schulbus (die Schule + der Bus) ?',
    },
    de: {
      central_rule: 'Das Genus folgt teils festen Endungsregeln (-ung/-heit/-tion → die; -chen/-lein/-um → das) und bei Komposita immer dem letzten Wort.',
      key_pattern: 'Artikel des Kompositums = Artikel des Grundworts (der Tisch + die Lampe → die Tischlampe).',
      mistake_warning: 'Vergiss nicht das Mädchen (-chen ist immer neutral) und die Ausnahmen auf -e (der Name, das Ende).',
      self_check: 'Welchen Artikel haben Zeitung, Brötchen, Sommer und Schulbus (die Schule + der Bus)?',
    },
  },
  practice_mapping: [
    {
      id: 'a1-10-suffix-rules',
      label_i18n: {
        en: 'Identifying noun gender from reliable suffixes (-ung, -heit, -keit, -tion, -tät, -chen, -lein, -um)',
        fr: 'Identification du genre grâce aux suffixes fiables',
        de: 'Genus anhand eindeutiger Suffixe erkennen',
      },
      formats: ['multiple_choice', 'matching', 'true_false'],
    },
    {
      id: 'a1-10-compound-gender',
      label_i18n: {
        en: 'Determining the gender of compound nouns from the final noun',
        fr: 'Détermination du genre des noms composés à partir du dernier élément',
        de: 'Genus von Komposita über das Grundwort bestimmen',
      },
      formats: ['multiple_choice', 'gap_fill', 'error_correction'],
    },
  ],
};
