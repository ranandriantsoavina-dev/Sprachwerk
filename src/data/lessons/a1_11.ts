import type { Lesson } from '../../types/domain';

export const LESSON_A1_11: Lesson = {
  id: 'a1-11',
  level: 'A1',
  unit: 11,
  title_en: 'Singular and plural',
  title_de: 'Singular und Plural',
  topic: 'Singular and plural',
  hasContent: true,
  tags: ['singular', 'plural', 'nomen', 'umlaut'],
  estimated_study_minutes: 14,
  prerequisite_knowledge_i18n: {
    en: 'Helpful to know definite/indefinite articles (Lessons A1-08 and A1-09).',
    fr: 'Utile de connaître les articles définis et indéfinis (leçons A1-08 et A1-09).',
    de: 'Hilfreich sind die bestimmten und unbestimmten Artikel (Lektionen A1-08 und A1-09).',
  },
  objectives: {
    en: 'Recognize and apply the five main German plural patterns, match plural nouns with die and plural verb forms, and remember key plural patterns like -in → -innen.',
    fr: 'Reconnaître et appliquer les cinq principaux schémas du pluriel allemand, accorder le nom pluriel avec die et le verbe, et former le pluriel en -innen.',
    de: 'Die fünf wichtigsten deutschen Pluraltypen erkennen, Nomen im Plural mit die und der passenden Verbform verwenden sowie Sonderregeln wie -in → -innen anwenden.',
  },
  learning_objectives_i18n: {
    en: [
      'Identify the five German plural endings: no ending (— / ¨), -e (¨-e), -er (¨-er), -(e)n, and -s.',
      'Apply strong tendencies such as feminine nouns in -e/-ung/-heit/-tät taking -(e)n, and -in taking -innen.',
      'Pair every plural noun with the definite article die (nominative/accusative) and no indefinite article.',
    ],
    fr: [
      'Identifier les cinq formations du pluriel allemand : sans terminaison (— / ¨), -e (¨-e), -er (¨-er), -(e)n et -s.',
      'Appliquer les tendances principales, notamment -(e)n pour les noms féminins en -e/-ung/-heit/-tät et -innen pour les noms en -in.',
      'Associer tout nom au pluriel à l’article défini die et au verbe conjugué au pluriel.',
    ],
    de: [
      'Die fünf Pluralendungen des Deutschen unterscheiden: keine Endung (— / ¨), -e (¨-e), -er (¨-er), -(e)n und -s.',
      'Typische Muster nutzen (feminine Nomen auf -e/-ung/-heit/-tät → -(e)n; -in → -innen; Fremdwörter/Kurzwörter → -s).',
      'Jedes Plural-Nomen im Nominativ mit die (ohne unbestimmten Artikel) und der Plural-Verbform verbinden.',
    ],
  },
  introduction_i18n: {
    en: 'Unlike English or French, where almost every noun simply adds -s in the plural, German uses five different plural endings—sometimes combined with an Umlaut (ä, ö, ü) on the stem vowel. Learning each noun together with its plural form and knowing the core tendencies will make your German sound accurate right away.',
    fr: 'Contrairement au français ou à l’anglais qui ajoutent presque toujours -s, l’allemand forme le pluriel avec cinq terminaisons différentes, parfois accompagnées d’un Umlaut (ä, ö, ü) sur le radical. Apprendre chaque nom avec son pluriel tout en repérant les grandes tendances vous permet d’éviter les erreurs automatiques.',
    de: 'Anders als im Englischen oder Französischen bildet das Deutsche den Plural nicht einfach mit -s, sondern mit fünf verschiedenen Endungen – oft kombiniert mit einem Umlaut (ä, ö, ü). Wenn du bei jedem Nomen die Pluralform direkt mitlernst und die wichtigsten Muster kennst, bildest du den Plural sicher.',
  },
  explanation_i18n: {
    en: [
      '1. Five main plural endings in German',
      '• Group 1 (— / ¨): No ending added; some words add an Umlaut. Common in masculine/neuter nouns ending in -er, -el, -en, -chen, -lein (der Lehrer → die Lehrer, der Apfel → die Äpfel, das Zimmer → die Zimmer).',
      '• Group 2 (-e / ¨-e): Very common for masculine and neuter one-syllable nouns (der Tisch → die Tische, der Stuhl → die Stühle, das Jahr → die Jahre).',
      '• Group 3 (-er / ¨-er): Mostly neuter (and some masculine) one-syllable nouns; if the stem has a, o, u, au, it takes an Umlaut (das Kind → die Kinder, das Buch → die Bücher, der Mann → die Männer).',
      '• Group 4 (-(e)n): Most feminine nouns—almost never takes an Umlaut! (die Frau → die Frauen, die Lampe → die Lampen, die Zeitung → die Zeitungen). Female professions in -in double the n: die Ärztin → die Ärztinnen.',
      '• Group 5 (-s): Loanwords, abbreviations, and nouns ending in a full vowel other than -e (das Auto → die Autos, das Café → die Cafés, das Hobby → die Hobbys, das Kino → die Kinos).',
      '',
      '2. Important plural grammar notes',
      '• All plural nouns take die as the definite article in nominative/accusative.',
      '• Some nouns only exist in the singular (das Obst, die Milch, das Geld) or almost always in the plural (die Eltern, die Leute).',
      '• Note on English/French loanwords ending in -y: German does NOT change -y to -ies! Write die Hobbys, die Partys, die Babys.',
    ].join('\n'),
    fr: [
      '1. Les cinq grands modèles de pluriel',
      '• Groupe 1 (— / ¨) : aucune terminaison (parfois un Umlaut). Très fréquent pour les noms masculins et neutres en -er, -el, -en, -chen, -lein (der Lehrer → die Lehrer, der Apfel → die Äpfel, das Zimmer → die Zimmer).',
      '• Groupe 2 (-e / ¨-e) : très fréquent pour les noms courts masculins et neutres (der Tisch → die Tische, der Stuhl → die Stühle, das Jahr → die Jahre).',
      '• Groupe 3 (-er / ¨-er) : surtout pour les noms neutres courts (et quelques masculins) ; prend l’Umlaut sur a, o, u, au (das Kind → die Kinder, das Buch → die Bücher, der Mann → die Männer).',
      '• Groupe 4 (-(e)n) : majorité des noms féminins — presque jamais d’Umlaut ! (die Frau → die Frauen, die Lampe → die Lampen, die Zeitung → die Zeitungen). Les noms en -in doublent le n : die Ärztin → die Ärztinnen.',
      '• Groupe 5 (-s) : emprunts, sigles et noms terminés par une voyelle pleine autre que -e (das Auto → die Autos, das Café → die Cafés, das Hobby → die Hobbys).',
      '',
      '2. Remarques utiles au niveau A1',
      '• Au nominatif et à l’accusatif, tout pluriel porte l’article die.',
      '• Attention aux mots en -y : en allemand, on écrit die Hobbys, die Partys, die Babys (jamais *-ies !).',
      '• Certains noms n’ont pas de pluriel courant (das Obst, die Milch, das Geld) ou s’emploient surtout au pluriel (die Eltern, die Leute).',
    ].join('\n'),
    de: [
      '1. Die fünf wichtigsten Pluraltypen',
      '• Typ 1 (— / ¨): Keine Endung, teils mit Umlaut. Typisch für Maskulina und Neutra auf -er, -el, -en, -chen, -lein (der Lehrer → die Lehrer, der Apfel → die Äpfel, das Zimmer → die Zimmer).',
      '• Typ 2 (-e / ¨-e): Sehr häufig bei einsilbigen Maskulina und Neutra (der Tisch → die Tische, der Stuhl → die Stühle, das Jahr → die Jahre).',
      '• Typ 3 (-er / ¨-er): Meist kurze Neutra und einige Maskulina; a, o, u, au werden umgelautet (das Kind → die Kinder, das Buch → die Bücher, der Mann → die Männer).',
      '• Typ 4 (-(e)n): Die meisten Feminina – fast immer ohne Umlaut! (die Frau → die Frauen, die Lampe → die Lampen, die Zeitung → die Zeitungen). Bei -in verdoppelt sich das n: die Ärztin → die Ärztinnen.',
      '• Typ 5 (-s): Fremdwörter, Abkürzungen und Wörter auf Vollvokal (das Auto → die Autos, das Café → die Cafés, das Hobby → die Hobbys).',
      '',
      '2. Wichtige Hinweise',
      '• Der bestimmte Artikel im Plural lautet immer die.',
      '• Bei englischen Lehnwörtern auf -y hängt man im Deutschen einfach -s an: die Hobbys, die Partys, die Babys.',
      '• Manche Wörter haben keinen Plural (das Obst, die Milch, das Geld) oder stehen nur im Plural (die Eltern, die Leute).',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-plural-feminine-n',
      title: 'Feminine Nomen enden im Plural meist auf -(e)n (ohne Umlaut)',
      body: 'die Lampe → die Lampen, die Frau → die Frauen, die Zeitung → die Zeitungen; -in → -innen.',
      title_i18n: {
        en: 'Feminine nouns strongly prefer -(e)n (and -in → -innen)',
        fr: 'Les noms féminins prennent très souvent -(e)n (et -in → -innen)',
        de: 'Feminine Nomen bilden den Plural meist mit -(e)n (-in → -innen)',
      },
      body_i18n: {
        en: 'Most feminine nouns add -n or -en without any Umlaut. Nouns ending in -in double the n before adding -en: die Freundin → die Freundinnen.',
        fr: 'La plupart des noms féminins ajoutent -n ou -en sans Umlaut. Ceux en -in doublent le n : die Freundin → die Freundinnen.',
        de: 'Die meisten femininen Nomen nehmen -n/-en ohne Umlaut. Nomen auf -in enden im Plural auf -innen (die Freundin → die Freundinnen).',
      },
    },
    {
      id: 'rule-plural-er-el-en',
      title: 'Nomen auf -er, -el, -en, -chen, -lein haben keine Pluralendung',
      body: 'der Lehrer → die Lehrer, das Mädchen → die Mädchen, der Apfel → die Äpfel.',
      title_i18n: {
        en: 'Masculine & neuter nouns in -er, -el, -en, -chen, -lein add no ending',
        fr: 'Les noms (m./n.) en -er, -el, -en, -chen, -lein n’ajoutent pas de terminaison',
        de: 'Maskulina/Neutra auf -er, -el, -en, -chen, -lein bleiben ohne Endung',
      },
      body_i18n: {
        en: 'Only the article changes to die (plus an Umlaut in some masculine words like Apfel → Äpfel, Bruder → Brüder, Vogel → Vögel).',
        fr: 'Seul l’article change en die (avec parfois un Umlaut sur les masculins comme Apfel → Äpfel, Bruder → Brüder).',
        de: 'Nur der Artikel wird zu die (bei manchen Maskulina zusätzlich mit Umlaut: der Apfel → die Äpfel, der Bruder → die Brüder).',
      },
    },
  ],
  tables: [
    {
      id: 'table-five-plurals',
      title_i18n: {
        en: 'The Five Plural Patterns in German',
        fr: 'Les cinq schémas du pluriel allemand',
        de: 'Die fünf Pluralformen im Überblick',
      },
      columns_i18n: {
        en: ['Plural Type', 'Singular', 'Plural', 'Typical Pattern'],
        fr: ['Type de pluriel', 'Singulier', 'Pluriel', 'Tendance'],
        de: ['Pluraltyp', 'Singular', 'Plural', 'Typisch für'],
      },
      rows: [
        ['— / ¨ (no ending)', 'das Zimmer / der Apfel', 'die Zimmer / die Äpfel', 'm./n. ending in -er, -el, -en, -chen'],
        ['-e / ¨-e', 'der Tisch / der Stuhl', 'die Tische / die Stühle', 'Many short m./n. nouns'],
        ['-er / ¨-er', 'das Kind / das Buch', 'die Kinder / die Bücher', 'Many short neuter nouns'],
        ['-(e)n / -innen', 'die Tasche / die Studentin', 'die Taschen / die Studentinnen', 'Most feminine nouns'],
        ['-s', 'das Auto / das Hobby', 'die Autos / die Hobbys', 'Loanwords & vowel endings'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Auf dem Tisch liegen zwei Bücher, drei Äpfel und vier Stifte.',
      highlight: 'Bücher / Äpfel / Stifte',
      note: 'Three different plural types in one sentence',
      translation_i18n: {
        en: 'On the table lie two books, three apples, and four pens.',
        fr: 'Sur la table se trouvent deux livres, trois pommes et quatre stylos.',
        de: 'Auf dem Tisch liegen zwei Bücher, drei Äpfel und vier Stifte.',
      },
      explanation_i18n: {
        en: 'das Buch → Bücher (¨-er), der Apfel → Äpfel (¨), der Stift → Stifte (-e).',
        fr: 'das Buch → Bücher (¨-er), der Apfel → Äpfel (¨), der Stift → Stifte (-e).',
        de: 'Zeigt die drei Pluraltypen: Bücher (¨-er), Äpfel (¨) und Stifte (-e).',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Die Studentinnen lernen neue Wörter.',
      highlight: 'Studentinnen / Wörter',
      note: '-in → -innen; das Wort → die Wörter (here: individual vocabulary words)',
      translation_i18n: {
        en: 'The female students are learning new words.',
        fr: 'Les étudiantes apprennent de nouveaux mots.',
        de: 'Die Studentinnen lernen neue Wörter.',
      },
      explanation_i18n: {
        en: 'die Studentin doubles the n to Studentinnen; das Wort becomes die Wörter when referring to individual words.',
        fr: 'die Studentin double le n (Studentinnen) ; das Wort donne die Wörter (mots isolés).',
        de: 'Studentin bildet Studentinnen; das Wort hat den Plural Wörter (einzelne Vokabeln).',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Meine Hobbys sind Fotos machen und Musik hören.',
      highlight: 'Hobbys / Fotos',
      note: '-s plural on loanwords/vowel endings',
      translation_i18n: {
        en: 'My hobbies are taking photos and listening to music.',
        fr: 'Mes passe-temps sont prendre des photos et écouter de la musique.',
        de: 'Meine Hobbys sind Fotos machen und Musik hören.',
      },
      explanation_i18n: {
        en: 'Both das Hobby (die Hobbys) and das Foto (die Fotos) take -s without changing -y to -ies.',
        fr: 'das Hobby (die Hobbys) et das Foto (die Fotos) prennent simplement -s.',
        de: 'Bei Hobby und Foto hängt man einfach -s an (Hobbys, Fotos).',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-no-universal-s',
      contrast_pair: 'das Auto → die Autos  vs.  das Buch → die Bücher',
      title_i18n: {
        en: 'Do not default to -s for regular German nouns',
        fr: 'Ne pas ajouter -s par défaut aux noms allemands',
        de: 'Nicht automatisch ein -s anhängen',
      },
      body_i18n: {
        en: 'In English and French, -s is the default plural. In German, -s is actually the rarest group—used mainly for loanwords and words ending in a, i, o, u, y.',
        fr: 'En français et en anglais, -s est la règle générale. En allemand, le pluriel en -s est minoritaire (emprunts, sigles, finales en a, i, o, u, y).',
        de: 'Der s-Plural gilt im Deutschen vor allem für Fremdwörter und Wörter auf a, i, o, u, y – bei Kernwörtern ist er selten.',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Ich habe zwei Kinds.',
      right: 'Ich habe zwei Kinder.',
      explanation_i18n: {
        en: 'das Kind forms its plural with -er (die Kinder), never -s.',
        fr: 'das Kind forme son pluriel en -er (die Kinder) et jamais en -s.',
        de: 'Der Plural von das Kind lautet die Kinder (nicht *Kinds).',
      },
      principle_i18n: {
        en: 'Learn each noun’s plural ending instead of adding -s.',
        fr: 'Apprenez la terminaison plurielle de chaque nom au lieu d’ajouter -s.',
        de: 'Lerne den Plural jedes Nomens direkt mit, statt pauschal -s anzuhängen.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Was sind deine Hobbies?',
      right: 'Was sind deine Hobbys?',
      explanation_i18n: {
        en: 'German keeps the y and simply adds -s (Hobbys, Partys, Babys).',
        fr: 'En allemand, le y reste intact devant le -s (Hobbys, Partys, Babys).',
        de: 'Im Deutschen bleibt das y erhalten: Hobbys (nicht *Hobbies).',
      },
      principle_i18n: {
        en: 'For nouns ending in -y, add -s directly in German (no -ies).',
        fr: 'Pour les mots en -y, ajoutez simplement -s (pas de -ies).',
        de: 'Bei Wörtern auf -y hängt man im Deutschen nur -s an.',
      },
    },
    {
      id: 'cm-3',
      wrong: 'Die Ärztinen arbeiten viel.',
      right: 'Die Ärztinnen arbeiten viel.',
      explanation_i18n: {
        en: 'Feminine nouns ending in -in must double the n in the plural (-innen).',
        fr: 'Les noms féminins en -in doublent obligatoirement le n au pluriel (-innen).',
        de: 'Bei weiblichen Berufsbezeichnungen auf -in verdoppelt sich das n im Plural (-innen).',
      },
      principle_i18n: {
        en: 'Convert -in → -innen for plural female nouns.',
        fr: 'Transformez -in en -innen au pluriel.',
        de: 'Endung -in wird im Plural immer zu -innen.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'German nouns form the plural with five endings: —/¨, -e/¨-e, -er/¨-er, -(e)n, or -s, all taking die.',
      key_pattern: 'Feminine nouns → mostly -(e)n (-in → -innen); -er/-el/-en/-chen → —/¨; loanwords/vowel endings → -s.',
      mistake_warning: 'Do not default to -s (*Kinds) and do not write *-ies (*Hobbies → Hobbys).',
      self_check: 'Give the plural of: der Tisch, die Lampe, das Buch, die Lehrerin, das Auto.',
    },
    fr: {
      central_rule: 'Les noms allemands ont cinq formes de pluriel (—/¨, -e/¨-e, -er/¨-er, -(e)n, -s), toutes précédées de die.',
      key_pattern: 'Féminins → surtout -(e)n (-in → -innen) ; -er/-el/-en/-chen → —/¨ ; emprunts/voyelles → -s.',
      mistake_warning: 'N’ajoutez pas -s par défaut (*Kinds) et n’écrivez pas *-ies (*Hobbies → Hobbys).',
      self_check: 'Donnez le pluriel de : der Tisch, die Lampe, das Buch, die Lehrerin, das Auto.',
    },
    de: {
      central_rule: 'Deutsche Nomen bilden den Plural auf fünf Arten (—/¨, -e/¨-e, -er/¨-er, -(e)n, -s) mit dem Artikel die.',
      key_pattern: 'Feminina → meist -(e)n (-in → -innen); -er/-el/-en/-chen → —/¨; Fremdwörter/Vollvokale → -s.',
      mistake_warning: 'Hänge nicht pauschal -s an (*Kinds) und schreibe nicht *-ies (*Hobbies → Hobbys).',
      self_check: 'Wie lautet der Plural von: der Tisch, die Lampe, das Buch, die Lehrerin, das Auto?',
    },
  },
  practice_mapping: [
    {
      id: 'a1-11-plural-formation',
      label_i18n: {
        en: 'Forming the plural of high-frequency A1 nouns across all 5 plural groups',
        fr: 'Formation du pluriel des noms A1 selon les 5 groupes',
        de: 'Pluralbildung häufiger A1-Nomen über alle 5 Pluraltypen',
      },
      formats: ['multiple_choice', 'gap_fill', 'matching', 'transformation'],
    },
    {
      id: 'a1-11-special-plurals',
      label_i18n: {
        en: 'Applying -in → -innen and -y → -ys rules without English -ies/-s errors',
        fr: 'Application des règles -in → -innen et -y → -ys',
        de: 'Regeln zu -in → -innen und -y → -ys korrekt anwenden',
      },
      formats: ['error_correction', 'gap_fill', 'true_false'],
    },
  ],
};
