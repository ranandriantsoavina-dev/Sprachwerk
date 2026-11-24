import type { Lesson } from '../../types/domain';

export const LESSON_A1_27: Lesson = {
  id: 'a1-27',
  level: 'A1',
  unit: 27,
  title_en: 'Conjunctions: und, aber, oder, denn',
  title_de: 'Konjunktionen',
  topic: 'Conjunctions: und, aber, oder, denn',
  hasContent: true,
  tags: ['konjunktionen', 'und-aber-oder-denn', 'position-0', 'hauptsatz'],
  estimated_study_minutes: 12,
  prerequisite_knowledge_i18n: {
    en: 'Helpful to know basic main-clause V2 order (A1-19).',
    fr: 'Utile de connaître l’ordre V2 dans la proposition principale (A1-19).',
    de: 'Hilfreich ist die Verbzweitstellung im Hauptsatz (A1-19).',
  },
  objectives: {
    en: 'Link words and main clauses with the coordinating conjunctions und, aber, oder, and denn in Position 0 (leaving the following subject-verb order completely unchanged), and apply basic comma rules.',
    fr: 'Relier des mots et des propositions principales avec und, aber, oder et denn en position 0 (sans inverser le verbe), en appliquant la ponctuation correcte.',
    de: 'Wörter und Hauptsätze mit den koordinierenden Konjunktionen und, aber, oder und denn auf Position 0 (ohne Inversion!) verbinden und die Kommaregeln beachten.',
  },
  learning_objectives_i18n: {
    en: [
      'Use und (addition), aber (contrast), oder (alternative), and denn (reason: "because/for") accurately in context.',
      'Treat all four conjunctions as Position 0: the next clause begins freshly with Position 1 (usually the subject) + conjugated verb in Position 2.',
      'Place commas accurately: always put a comma before aber and denn when connecting clauses; no comma is needed before und or oder.',
    ],
    fr: [
      'Employer und (addition), aber (opposition), oder (choix) et denn (cause : « car ») selon le sens.',
      'Placer ces quatre conjonctions en position 0 : la proposition suivante garde l’ordre normal [Sujet (Pos. 1) + Verbe (Pos. 2)].',
      'Respecter la virgule : toujours une virgule devant aber et denn ; en général pas de virgule devant und ou oder.',
    ],
    de: [
      'und (Aufzählung), aber (Gegensatz), oder (Alternative) und denn (Begründung) bedeutungsgerecht einsetzen.',
      'Alle vier Konjunktionen auf Position 0 lassen: Danach startet der nächste Hauptsatz normal mit Position 1 + konjugiertem Verb auf Position 2.',
      'Kommas richtig setzen: vor aber und denn steht ein Komma, vor und und oder normalerweise kein Komma.',
    ],
  },
  introduction_i18n: {
    en: 'Short A1 sentences quickly feel choppy if every thought stands alone. The four core coordinating conjunctions—und (and), aber (but), oder (or), and denn (because/for)—join ideas smoothly without changing the word order of the second clause.',
    fr: 'Des phrases courtes deviennent vite hachées si on ne les relie pas. Les quatre conjonctions de coordination essentielles — und (et), aber (mais), oder (ou) et denn (car) — unissent deux propositions principales tout en laissant l’ordre des mots intact après elles.',
    de: 'Mit Konjunktionen verbindest du einzelne Aussagen zu natürlichen Sätzen. Die vier Grundkonjunktionen und, aber, oder und denn stehen auf Position 0 – sie verändern die Wortstellung im zweiten Hauptsatz nicht.',
  },
  explanation_i18n: {
    en: [
      '1. Why they are called "Position 0" (ADUSO words)',
      'When und, aber, oder, or denn (along with sondern, "but rather") connect two main clauses, the conjunction sits outside the counting grid at Position 0. The second clause begins normally with its own Position 1 (often the subject) and conjugated verb in Position 2:',
      'Clause 1 + [Pos. 0: und / aber / oder / denn] + [Pos. 1: Subject/Topic] + [Pos. 2: Verb] + Rest.',
      'Example: "Ich bleibe heute zu Hause, denn (0) ich (1) bin (2) müde." (NEVER *denn bin ich müde!).',
      '',
      '2. Meaning of the four conjunctions',
      '• und = addition ("Tom kocht Suppe und Maria macht Salat.")',
      '• aber = contrast or unexpected obstacle ("Der Mantel ist schön, aber er ist sehr teuer.")',
      '• oder = alternative or choice ("Fahren wir mit dem Zug oder nehmen wir das Auto?")',
      '• denn = reason/explanation, similar to English "for/because" ("Wir gehen nicht spazieren, denn es regnet."). Unlike weil (taught at A2), denn does NOT send the verb to the end.',
      '',
      '3. Punctuation (Comma rule)',
      '• Always put a comma before aber and denn when connecting clauses.',
      '• Before und and oder, standard modern German normally uses NO comma.',
    ].join('\n'),
    fr: [
      '1. La règle de la Position 0',
      'Lorsqu’elles relient deux propositions principales, und, aber, oder et denn se placent en position 0 : on ne les compte pas pour la règle V2. La deuxième proposition recommence normalement avec sa position 1 puis le verbe conjugué en position 2 :',
      'Proposition 1 + [Pos. 0 : und / aber / oder / denn] + [Pos. 1 : Sujet] + [Pos. 2 : Verbe] + Suite.',
      'Exemple : « Ich bleibe heute zu Hause, denn (0) ich (1) bin (2) müde. » (et jamais *denn bin ich müde).',
      '',
      '2. Valeur des quatre conjonctions',
      '• und = addition (« Tom kocht und Maria deckt den Tisch. »)',
      '• aber = opposition (« Das Zimmer ist klein, aber es ist hell. »)',
      '• oder = choix (« Trinkst du Tee oder möchtest du Kaffee? »)',
      '• denn = cause/explication (« car ») : « Wir bleiben drinnen, denn es regnet. » Contrairement à weil (vu en A2), denn laisse le verbe en position 2.',
      '',
      '3. Ponctuation',
      '• On met toujours une virgule devant aber et denn.',
      '• Devant und et oder, on ne met normalement pas de virgule.',
    ].join('\n'),
    de: [
      '1. Warum sie auf Position 0 stehen',
      'und, aber, oder und denn verbinden zwei gleichberechtigte Hauptsätze und stehen zwischen ihnen auf Position 0. Sie zählen für die Verbzweitstellung nicht mit – der zweite Satz beginnt danach ganz normal mit Position 1 + konjugiertem Verb auf Position 2:',
      'Hauptsatz 1 + [Pos. 0: und / aber / oder / denn] + [Pos. 1: Subjekt/Angabe] + [Pos. 2: Verb] + Rest.',
      'Beispiel: „Ich bleibe heute zu Hause, denn (0) ich (1) bin (2) müde.“ (Nicht: *denn bin ich müde!).',
      '',
      '2. Bedeutung der vier Konjunktionen',
      '• und = Verbindung / Aufzählung („Tom kocht Suppe und Maria schneidet Brot.“)',
      '• aber = Gegensatz / Einschränkung („Die Jacke ist schön, aber sie ist teuer.“)',
      '• oder = Alternative („Fahren wir mit dem Zug oder nehmen wir das Auto?“)',
      '• denn = Begründung („Wir nehmen einen Schirm mit, denn es regnet.“). Anders als weil (A2) steht das Verb nach denn auf Position 2.',
      '',
      '3. Kommaregel',
      '• Vor aber und denn steht immer ein Komma.',
      '• Vor und und oder steht zwischen Hauptsätzen im modernen Standarddeutschen meist kein Komma.',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-pos0-no-inversion',
      title: 'Position 0: keine Inversion nach und, aber, oder, denn',
      body: 'Nach und, aber, oder und denn folgt Position 1 (meist Subjekt) + Position 2 (konjugiertes Verb).',
      title_i18n: {
        en: 'Position 0 causes no word-order change',
        fr: 'Position 0 : aucun changement de l’ordre des mots',
        de: 'Position 0: keine Inversion nach und, aber, oder, denn',
      },
      body_i18n: {
        en: 'Only drop the repeated subject after und, aber, or oder if the subject is identical ("Er liest ein Buch und hört Musik"). With denn, always keep the subject.',
        fr: 'On peut omettre le sujet répété après und, aber ou oder s’il est identique, mais après denn on le répète toujours.',
        de: 'Wenn das Subjekt gleich ist, kann man es nach und, aber oder oder weglassen („Er liest und hört Musik“). Nach denn steht immer ein Subjekt.',
      },
    },
    {
      id: 'rule-comma-aber-denn',
      title: 'Komma vor aber und denn; kein Komma vor und/oder',
      body: 'Schreibe ein Komma vor aber und denn; zwischen Sätzen mit und oder oder steht kein Pflichtkomma.',
      title_i18n: {
        en: 'Comma before aber and denn; omit before und and oder',
        fr: 'Virgule devant aber et denn ; pas devant und et oder',
        de: 'Komma vor aber und denn; kein Komma vor und/oder',
      },
      body_i18n: {
        en: 'Compare: "Es ist spät, aber ich bin nicht müde." vs. "Es ist spät und ich gehe schlafen."',
        fr: 'Comparez : « Es ist spät, aber ich bin nicht müde. » vs « Es ist spät und ich gehe schlafen. »',
        de: 'Vergleiche: „Es ist spät, aber ich bin nicht müde.“ vs. „Es ist spät und ich gehe schlafen.“',
      },
    },
  ],
  tables: [
    {
      id: 'tbl-conjunctions-a1',
      title_i18n: {
        en: 'Coordinating conjunctions in Position 0',
        fr: 'Conjonctions de coordination en Position 0',
        de: 'Konjunktionen auf Position 0 (und, aber, oder, denn)',
      },
      columns_i18n: {
        en: ['Conjunction', 'Meaning / relation', 'Comma?', 'Example'],
        fr: ['Conjonction', 'Sens', 'Virgule ?', 'Exemple'],
        de: ['Konjunktion', 'Bedeutung', 'Komma?', 'Beispiel'],
      },
      rows: [
        ['und', 'and (addition)', 'No', 'Lena lernt Deutsch und ihr Bruder lernt Spanisch.'],
        ['aber', 'but (contrast)', 'Yes (, aber)', 'Das Hotel ist alt, aber die Zimmer sind sauber.'],
        ['oder', 'or (choice)', 'No', 'Gehen wir ins Café oder bleiben wir hier?'],
        ['denn', 'because / for (reason)', 'Yes (, denn)', 'Wir fahren mit dem Bus, denn unser Auto ist kaputt.'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Am Samstag kochen wir zusammen und abends schauen wir einen Film.',
      highlight: 'und | abends schauen wir',
      note: 'und at Pos. 0; abends starts a new clause with V2 inversion',
      translation_i18n: {
        en: 'On Saturday we cook together and in the evening we watch a movie.',
        fr: 'Samedi nous cuisinons ensemble et le soir nous regardons un film.',
        de: 'Am Samstag kochen wir zusammen und abends schauen wir einen Film.',
      },
      explanation_i18n: {
        en: 'und is Position 0; the second clause starts freshly with abends in Pos. 1 and schauen in Pos. 2.',
        fr: 'und est en position 0 ; la 2e phrase commence par abends (pos. 1) suivi de schauen (pos. 2).',
        de: 'und zählt als Pos. 0; der neue Hauptsatz startet mit abends (Pos. 1) und schauen (Pos. 2).',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Der Pullover gefällt mir gut, aber er ist leider zu klein.',
      highlight: ', aber er ist',
      note: 'Comma before aber + normal subject-verb order',
      translation_i18n: {
        en: 'I really like the sweater, but unfortunately it is too small.',
        fr: 'Le pull me plaît beaucoup, mais il est malheureusement trop petit.',
        de: 'Der Pullover gefällt mir gut, aber er ist leider zu klein.',
      },
      explanation_i18n: {
        en: 'Comma precedes aber; er takes Position 1 and ist stays in Position 2.',
        fr: 'Virgule devant aber ; er reste en position 1 et ist en position 2.',
        de: 'Komma vor aber; danach ganz normal Subjekt er (Pos. 1) + Verb ist (Pos. 2).',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Nehmen wir heute die U-Bahn oder gehen wir zu Fuß?',
      highlight: 'oder gehen wir',
      note: 'oder connecting two yes/no questions',
      translation_i18n: {
        en: 'Are we taking the subway today or are we walking?',
        fr: 'Prenons-nous le métro aujourd’hui ou allons-nous à pied ?',
        de: 'Nehmen wir heute die U-Bahn oder gehen wir zu Fuß?',
      },
      explanation_i18n: {
        en: 'Both clauses are yes/no questions (V1), linked cleanly by oder in Position 0.',
        fr: 'Les deux questions fermées (V1) sont reliées par oder en position 0 sans virgule.',
        de: 'Beide Ja-/Nein-Fragen (V1) verbindet oder auf Position 0 ohne Komma.',
      },
    },
    {
      id: 'ex-4',
      sentence: 'Paul kauft heute kein Ticket, denn er hat schon eine Monatskarte.',
      highlight: ', denn er hat',
      note: 'Comma before denn + V2 verb hat',
      translation_i18n: {
        en: 'Paul is not buying a ticket today, because he already has a monthly pass.',
        fr: 'Paul n’achète pas de billet aujourd’hui, car il a déjà une carte mensuelle.',
        de: 'Paul kauft heute kein Ticket, denn er hat schon eine Monatskarte.',
      },
      explanation_i18n: {
        en: 'denn gives the reason after a comma and keeps er (Pos. 1) before hat (Pos. 2).',
        fr: 'denn introduit la cause après une virgule tout en gardant er (pos. 1) + hat (pos. 2).',
        de: 'Nach dem Komma und denn steht Subjekt er (Pos. 1) vor hat (Pos. 2).',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-aber-vs-sondern',
      contrast_pair: 'aber  (contrast / limitation)  vs.  sondern  (correction after negation)',
      title_i18n: {
        en: 'Quick note: aber vs. sondern',
        fr: 'Nuance utile : aber vs sondern',
        de: 'Kurzvergleich: aber vs. sondern',
      },
      body_i18n: {
        en: 'Both mean "but", and both sit in Position 0 after a comma. Use aber for a general contrast ("Es ist kalt, aber die Sonne scheint"). Use sondern when the first part contains nicht or kein and the second part replaces it with the opposite truth ("Ich trinke keinen Kaffee, sondern Tee").',
        fr: 'aber exprime une opposition générale ; sondern remplace un élément nié par nicht ou kein (« Ich wohne nicht in Bonn, sondern in Köln »).',
        de: 'aber zeigt einen Gegensatz („Es ist kalt, aber sonnig“). sondern korrigiert eine Verneinung mit nicht oder kein („Ich fahre nicht heute, sondern morgen“).',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Ich lerne Deutsch, denn möchte ich in Wien arbeiten.',
      right: 'Ich lerne Deutsch, denn ich möchte in Wien arbeiten.',
      explanation_i18n: {
        en: 'denn is Position 0, not Position 1, so do not invert the verb before ich.',
        fr: 'denn est en position 0 : on n’inverse pas le verbe et le sujet après denn.',
        de: 'denn steht auf Position 0 – deshalb steht ich auf Position 1 vor möchte.',
      },
      principle_i18n: {
        en: 'Never invert subject and verb directly after und, aber, oder, or denn.',
        fr: 'Ne faites jamais d’inversion sujet-verbe après und, aber, oder ou denn.',
        de: 'Nach Position-0-Konjunktionen (und, aber, oder, denn) keine Inversion machen.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Ich kann nicht kommen, denn ich krank bin.',
      right: 'Ich kann nicht kommen, denn ich bin krank.',
      explanation_i18n: {
        en: 'denn does not push the verb to the end (unlike weil); keep bin in Position 2.',
        fr: 'denn n’envoie pas le verbe à la fin (contrairement à weil) : bin reste en position 2.',
        de: 'Nach denn steht das konjugierte Verb auf Position 2, nicht am Satzende.',
      },
      principle_i18n: {
        en: 'Keep the conjugated verb in Position 2 after denn.',
        fr: 'Gardez le verbe conjugué en position 2 après denn.',
        de: 'Bei denn bleibt das Verb immer auf Position 2.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'und, aber, oder, and denn stand in Position 0 and never alter the word order of the following main clause.',
      key_pattern: 'Clause 1 + (,) [und / aber / oder / denn] + [Subject / Pos. 1] + [Verb / Pos. 2]',
      mistake_warning: 'Never invert (*denn bin ich...) and never send the verb to the end (*denn ich krank bin) after denn; remember the comma before aber and denn.',
      self_check: 'Connect the two sentences logically: "Wir möchten spazieren gehen." + "Es regnet stark."',
    },
    fr: {
      central_rule: 'und, aber, oder et denn sont en position 0 et ne modifient jamais l’ordre des mots de la phrase qui suit.',
      key_pattern: 'Proposition 1 + (,) [und / aber / oder / denn] + [Sujet / Pos. 1] + [Verbe / Pos. 2]',
      mistake_warning: 'Pas d’inversion (*denn bin ich) ni de verbe à la fin (*denn ich krank bin) après denn ; mettez la virgule devant aber et denn.',
      self_check: 'Reliez logiquement : « Wir möchten spazieren gehen. » + « Es regnet stark. »',
    },
    de: {
      central_rule: 'und, aber, oder und denn stehen auf Position 0 und verändern den Satzbau des zweiten Hauptsatzes nicht.',
      key_pattern: 'Hauptsatz 1 + (,) [und / aber / oder / denn] + [Subjekt / Pos. 1] + [Verb / Pos. 2]',
      mistake_warning: 'Nach denn keine Inversion (*denn bin ich) und kein Verb am Satzende (*denn ich krank bin); Komma vor aber und denn setzen.',
      self_check: 'Verbinde sinnvoll: „Wir möchten spazieren gehen.“ + „Es regnet stark.“',
    },
  },
  practice_mapping: [
    {
      id: 'a1-27-conjunction-meaning',
      label_i18n: {
        en: 'Selecting the right conjunction (und, aber, oder, denn) by logical relation',
        fr: 'Choix de la conjonction (und, aber, oder, denn) selon le sens',
        de: 'und, aber, oder und denn bedeutungsgerecht einsetzen',
      },
      formats: ['multiple_choice', 'gap_fill', 'matching'],
    },
    {
      id: 'a1-27-pos0-word-order',
      label_i18n: {
        en: 'Maintaining Position-0 syntax and comma punctuation with und, aber, oder, denn',
        fr: 'Respect de la syntaxe en position 0 et de la virgule',
        de: 'Position-0-Satzbau und Kommasetzung bei und, aber, oder, denn anwenden',
      },
      formats: ['sentence_construction', 'error_correction', 'transformation'],
    },
  ],
};
