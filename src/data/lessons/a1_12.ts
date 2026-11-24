import type { Lesson } from '../../types/domain';

export const LESSON_A1_12: Lesson = {
  id: 'a1-12',
  level: 'A1',
  unit: 12,
  title_en: 'Nominative case',
  title_de: 'Nominativ',
  topic: 'Nominative case',
  hasContent: true,
  tags: ['nominativ', 'kasus', 'subjekt', 'praedikatsnomen'],
  estimated_study_minutes: 12,
  prerequisite_knowledge_i18n: {
    en: 'Builds on personal pronouns (Lesson A1-02), sein (Lesson A1-03), and articles (Lessons A1-08 and A1-09).',
    fr: 'S’appuie sur les pronoms personnels (A1-02), sein (A1-03) et les articles (A1-08 et A1-09).',
    de: 'Baut auf Personalpronomen (A1-02), sein (A1-03) und Artikeln (A1-08, A1-09) auf.',
  },
  objectives: {
    en: 'Identify the nominative subject in any A1 sentence regardless of word order, use nominative predicate nouns after sein/werden/heißen, and select the right nominative articles and pronouns.',
    fr: 'Repérer le sujet au nominatif quelle que soit l’ordre des mots, employer le nominatif après sein/werden/heißen et choisir les articles et pronoms corrects.',
    de: 'Das Subjekt im Nominativ unabhängig von der Wortstellung erkennen, den Nominativ nach sein/werden/heißen nutzen und Artikel sowie Pronomen korrekt wählen.',
  },
  learning_objectives_i18n: {
    en: [
      'Use the question test "Wer oder was?" (Who or what?) to locate the nominative noun or pronoun in a clause.',
      'Apply all nominative forms: definite (der, die, das, die), indefinite (ein, eine, ein, —), and negative (kein, keine, kein, keine).',
      'Use the nominative both for the subject AND for nouns following sein, werden, and heißen.',
    ],
    fr: [
      'Utiliser la question-test « Wer oder was ? » (Qui est-ce qui / Qu’est-ce qui ?) pour repérer le nominatif dans la phrase.',
      'Maîtriser tous les déterminants au nominatif : définis (der, die, das, die), indéfinis (ein, eine, ein, —) et négatifs (kein, keine, kein, keine).',
      'Employer le nominatif pour le sujet ET pour l’attribut du sujet après sein, werden et heißen.',
    ],
    de: [
      'Mit der Kontrollfrage „Wer oder was?“ das Subjekt im Nominativ sicher bestimmen.',
      'Alle Artikelformen im Nominativ anwenden: bestimmt (der, die, das, die), unbestimmt (ein, eine, ein, —) und negativ (kein, keine, kein, keine).',
      'Den Nominativ sowohl für das Subjekt als auch nach den Verben sein, werden und heißen verwenden.',
    ],
  },
  introduction_i18n: {
    en: 'German uses four grammatical cases (Kasus) to show what role each noun plays in a sentence. The nominative (Nominativ) is the starting point: it is the base dictionary form of every noun, the case of the sentence subject, and the case used after verbs of identity such as sein, werden, and heißen.',
    fr: 'L’allemand utilise quatre cas (Kasus) pour indiquer la fonction des noms dans la phrase. Le nominatif (Nominativ) est le cas de base : c’est la forme du dictionnaire, le cas du sujet de la phrase et celui utilisé après les verbes d’état ou d’identité comme sein, werden et heißen.',
    de: 'Das Deutsche nutzt vier Fälle (Kasus), um die Rolle jedes Nomens im Satz zu zeigen. Der Nominativ ist die Grundform (Wörterbuchform): Er markiert das Subjekt des Satzes und steht außerdem nach Verben wie sein, werden und heißen.',
  },
  explanation_i18n: {
    en: [
      '1. What does the Nominativ mark?',
      '• The subject of the sentence—the person or thing performing or experiencing the verb. Test question: "Wer?" (for people) or "Was?" (for things). Example: "Der Zug kommt pünktlich." → Wer oder was kommt? → Der Zug (Nominativ).',
      '• Predicate nouns (Gleichsetzungsnominativ) after sein, werden, and heißen: "Mein Bruder ist ein guter Koch." / "Das wird ein schöner Tag." Both sides of "to be" stay in the nominative!',
      '',
      '2. Position does NOT equal case',
      'In English, the subject almost always comes first. In German, an adverb or even an object can stand in Position 1, pushing the subject after the verb: "Morgen kauft der Mann ein Auto." Who is buying? der Mann → still Nominativ!',
      '',
      '3. Complete Nominativ forms at A1',
      'Masc.: der / ein / kein | Fem.: die / eine / keine | Neut.: das / ein / kein | Pl.: die / — / keine.',
    ].join('\n'),
    fr: [
      '1. Quelles sont les fonctions du Nominativ ?',
      '• Le sujet de la phrase — celui ou ce qui fait l’action ou est dans un état. Question-test : « Wer ? » (personnes) ou « Was ? » (choses). Exemple : « Der Zug kommt pünktlich. » → Qui arrive ? Der Zug (Nominativ).',
      '• L’attribut du sujet après sein, werden et heißen : « Mein Bruder ist ein guter Koch. » / « Das wird ein schöner Tag. » On utilise le nominatif des deux côtés du verbe !',
      '',
      '2. La position ne suffit pas pour trouver le cas',
      'En allemand, un adverbe ou un complément peut être placé en début de phrase, ce qui rejette le sujet après le verbe : « Morgen kauft der Mann ein Auto. » Qui achète ? der Mann → il reste au nominatif !',
      '',
      '3. Tableau complet au niveau A1',
      'Masc. : der / ein / kein | Fém. : die / eine / keine | Neutre : das / ein / kein | Pluriel : die / — / keine.',
    ].join('\n'),
    de: [
      '1. Wofür steht der Nominativ?',
      '• Für das Subjekt des Satzes (Frage: „Wer oder was?“). Beispiel: „Der Zug kommt pünktlich.“ → Wer oder was kommt? → Der Zug (Nominativ).',
      '• Nach den Verben sein, werden und heißen (Gleichsetzungsnominativ): „Mein Bruder ist ein guter Koch.“ / „Das wird ein schöner Tag.“',
      '',
      '2. Satzanfang ≠ automatisch Subjekt',
      'Im Deutschen kann eine Zeitangabe oder ein Objekt auf Position 1 stehen. Dann steht das Subjekt nach dem Verb – bleibt aber trotzdem im Nominativ: „Morgen kauft der Mann ein Auto.“',
      '',
      '3. Alle Nominativ-Artikel im Überblick',
      'Mask.: der / ein / kein | Fem.: die / eine / keine | Neutr.: das / ein / kein | Plural: die / — / keine.',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-nom-wer-was',
      title: 'Kontrollfrage: Wer oder was?',
      body: 'Das Subjekt antwortet auf „Wer oder was?“ und bestimmt die Verbendung.',
      title_i18n: {
        en: 'Find the nominative with "Wer oder was?" and verb agreement',
        fr: 'Identifier le nominatif avec « Wer oder was ? » et l’accord du verbe',
        de: 'Den Nominativ mit „Wer oder was?“ und der Verbendung erkennen',
      },
      body_i18n: {
        en: 'Ask "Wer oder was + verb?" to identify the nominative subject, even when it stands after the verb ("Heute besucht uns der Lehrer.").',
        fr: 'Posez la question « Wer oder was + verbe ? » pour repérer le sujet, même s’il se trouve après le verbe (« Heute besucht uns der Lehrer. »).',
        de: 'Frage „Wer oder was + Verb?“, um das Subjekt zu finden – auch wenn es hinter dem Verb steht („Heute besucht uns der Lehrer.“).',
      },
    },
    {
      id: 'rule-nom-after-sein',
      title: 'Nominativ nach sein, werden und heißen',
      body: 'Nach sein, werden und heißen steht kein Akkusativ, sondern der Nominativ: Das ist mein Vater (nicht *meinen Vater).',
      title_i18n: {
        en: 'Use the nominative—never the accusative—after sein, werden, and heißen',
        fr: 'Toujours le nominatif (jamais l’accusatif) après sein, werden et heißen',
        de: 'Nach sein, werden und heißen steht immer der Nominativ',
      },
      body_i18n: {
        en: 'Say "Das ist ein Stuhl" or "Er ist der Lehrer"—never *einen Stuhl or *den Lehrer after sein!',
        fr: 'Dites « Das ist ein Stuhl » ou « Er ist der Lehrer », et jamais *einen Stuhl après sein !',
        de: 'Nach sein steht der Nominativ („Das ist ein Tisch“), niemals der Akkusativ (*einen Tisch)!',
      },
    },
  ],
  tables: [
    {
      id: 'table-nominativ-articles',
      title_i18n: {
        en: 'Articles and Pronouns in the Nominative Case',
        fr: 'Articles et pronoms au nominatif',
        de: 'Artikel und Pronomen im Nominativ',
      },
      columns_i18n: {
        en: ['Gender / Number', 'Definite', 'Indefinite', 'Negative', 'Personal Pronoun'],
        fr: ['Genre / Nombre', 'Défini', 'Indéfini', 'Négatif', 'Pronom personnel'],
        de: ['Genus / Numerus', 'Bestimmt', 'Unbestimmt', 'Negativ', 'Personalpronomen'],
      },
      rows: [
        ['Masculine', 'der', 'ein', 'kein', 'er'],
        ['Feminine', 'die', 'eine', 'keine', 'sie'],
        ['Neuter', 'das', 'ein', 'kein', 'es'],
        ['Plural', 'die', '—', 'keine', 'sie'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Der Lehrer erklärt die Regel.',
      highlight: 'Der Lehrer',
      note: 'Subject in Nominative (Wer erklärt?)',
      translation_i18n: {
        en: 'The teacher explains the rule.',
        fr: 'Le professeur explique la règle.',
        de: 'Der Lehrer erklärt die Regel.',
      },
      explanation_i18n: {
        en: 'Der Lehrer is the subject performing the action (Nominative).',
        fr: 'Der Lehrer est le sujet qui fait l’action (Nominativ).',
        de: 'Der Lehrer ist das Subjekt im Nominativ (Wer erklärt?).',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Das ist ein neuer Computer.',
      highlight: 'Das / ein neuer Computer',
      note: 'Both Das and ein Computer are Nominative with sein',
      translation_i18n: {
        en: 'That is a new computer.',
        fr: 'C’est un nouvel ordinateur.',
        de: 'Das ist ein neuer Computer.',
      },
      explanation_i18n: {
        en: 'After ist, masculine Computer stays in the nominative (ein, not einen).',
        fr: 'Après ist, le nom masculin Computer reste au nominatif (ein et non einen).',
        de: 'Nach ist bleibt auch das maskuline Nomen im Nominativ (ein, nicht einen).',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Am Abend liest mein Vater gern ein Buch.',
      highlight: 'mein Vater',
      note: 'Subject in Position 3 stays Nominative',
      translation_i18n: {
        en: 'In the evening my father likes to read a book.',
        fr: 'Le soir, mon père aime lire un livre.',
        de: 'Am Abend liest mein Vater gern ein Buch.',
      },
      explanation_i18n: {
        en: 'Even though Am Abend starts the sentence, mein Vater is still the nominative subject.',
        fr: 'Bien que Am Abend ouvre la phrase, mein Vater reste le sujet au nominatif.',
        de: 'Obwohl Am Abend am Satzanfang steht, ist mein Vater das Subjekt im Nominativ.',
      },
    },
    {
      id: 'ex-4',
      sentence: 'Wer sitzt dort? – Das ist kein Gast, das ist unser Chef.',
      highlight: 'Wer / kein Gast / unser Chef',
      note: 'Question word wer and predicate nouns after ist',
      translation_i18n: {
        en: 'Who is sitting there? – That is not a guest; that is our boss.',
        fr: 'Qui est assis là-bas ? – Ce n’est pas un client, c’est notre patron.',
        de: 'Wer sitzt dort? – Das ist kein Gast, das ist unser Chef.',
      },
      explanation_i18n: {
        en: 'Uses wer (nominative "who") and kein Gast / unser Chef after ist.',
        fr: 'Utilise wer (« qui » au nominatif) et kein Gast / unser Chef après ist.',
        de: 'Zeigt wer (Nominativ) sowie kein Gast und unser Chef nach ist.',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-sein-vs-haben-case',
      contrast_pair: 'Das ist ein Hund (Nom.)  vs.  Ich habe einen Hund (Akk.)',
      title_i18n: {
        en: 'Crucial A1 contrast: sein (Nominativ) vs. haben (Akkusativ)',
        fr: 'Contraste clé A1 : sein (Nominativ) vs haben (Akkusativ)',
        de: 'Wichtiger Kontrast: sein (Nominativ) vs. haben (Akkusativ)',
      },
      body_i18n: {
        en: 'Because der Hund is masculine, you can see the case clearly: after ist it stays ein Hund (Nominativ), whereas after habe it becomes einen Hund (Akkusativ).',
        fr: 'Comme Hund est masculin, la différence est visible : après ist il reste au nominatif (ein Hund), mais après habe il passe à l’accusatif (einen Hund).',
        de: 'Bei maskulinen Nomen sieht man den Unterschied deutlich: Nach ist bleibt es ein Hund (Nominativ), nach habe steht einen Hund (Akkusativ).',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Das ist einen Stuhl.',
      right: 'Das ist ein Stuhl.',
      explanation_i18n: {
        en: 'The verb sein always takes the nominative, never the accusative.',
        fr: 'Le verbe sein se construit toujours avec le nominatif, jamais l’accusatif.',
        de: 'Nach dem Verb sein steht immer der Nominativ, nie der Akkusativ.',
      },
      principle_i18n: {
        en: 'Keep masculine nouns in ein / der after sein, werden, and heißen.',
        fr: 'Gardez ein / der au masculin après sein, werden et heißen.',
        de: 'Nach sein, werden und heißen bleibt der maskuline Artikel ein / der.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Morgen kommt den Zug um neun Uhr.',
      right: 'Morgen kommt der Zug um neun Uhr.',
      explanation_i18n: {
        en: 'der Zug is the subject of kommt even though it stands after the verb—so it must stay nominative (der Zug).',
        fr: 'der Zug est le sujet de kommt même après le verbe : il reste donc au nominatif (der Zug).',
        de: 'der Zug ist auch hinter dem Verb das Subjekt und bleibt daher im Nominativ (der Zug).',
      },
      principle_i18n: {
        en: 'Identify the subject by asking "Wer oder was?", not by word position.',
        fr: 'Identifiez le sujet par le sens (« Wer oder was ? »), pas par sa place.',
        de: 'Bestimme das Subjekt über die Frage „Wer oder was?“, nicht über die Wortposition.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'The nominative marks the subject (Wer oder was?) and predicate nouns after sein, werden, and heißen.',
      key_pattern: 'Masculine: der/ein/kein | Feminine: die/eine/keine | Neuter: das/ein/kein | Plural: die/—/keine.',
      mistake_warning: 'Never use den/einen after sein (*Das ist einen Tisch) or when the subject stands in Position 3 after a time word.',
      self_check: 'Why is it "ein" in "Das ist ein Apfel" even though Apfel stands after the verb?',
    },
    fr: {
      central_rule: 'Le nominatif marque le sujet (Wer oder was ?) ainsi que l’attribut après sein, werden et heißen.',
      key_pattern: 'Masculin : der/ein/kein | Féminin : die/eine/keine | Neutre : das/ein/kein | Pluriel : die/—/keine.',
      mistake_warning: 'N’utilisez jamais den/einen après sein (*Das ist einen Tisch) ni pour un sujet placé après le verbe.',
      self_check: 'Pourquoi écrit-on « ein » dans « Das ist ein Apfel » alors que Apfel est après le verbe ?',
    },
    de: {
      central_rule: 'Der Nominativ markiert das Subjekt (Wer oder was?) sowie Nomen nach sein, werden und heißen.',
      key_pattern: 'Mask.: der/ein/kein | Fem.: die/eine/keine | Neutr.: das/ein/kein | Plural: die/—/keine.',
      mistake_warning: 'Verwende nach sein niemals den/einen und achte auf Subjekte hinter dem Verb.',
      self_check: 'Warum heißt es „Das ist ein Apfel“ und nicht „einen Apfel“?',
    },
  },
  practice_mapping: [
    {
      id: 'a1-12-identify-subject',
      label_i18n: {
        en: 'Identifying the nominative subject regardless of position (Wer oder was?)',
        fr: 'Repérage du sujet au nominatif quelle que soit sa position',
        de: 'Subjekt im Nominativ unabhängig von der Satzposition bestimmen',
      },
      formats: ['multiple_choice', 'true_false', 'gap_fill'],
    },
    {
      id: 'a1-12-predicate-nominative',
      label_i18n: {
        en: 'Using nominative articles after sein, werden, and heißen',
        fr: 'Emploi du nominatif après sein, werden et heißen',
        de: 'Nominativ nach sein, werden und heißen richtig verwenden',
      },
      formats: ['gap_fill', 'error_correction', 'multiple_choice'],
    },
  ],
};
