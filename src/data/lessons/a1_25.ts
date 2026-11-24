import type { Lesson } from '../../types/domain';

export const LESSON_A1_25: Lesson = {
  id: 'a1-25',
  level: 'A1',
  unit: 25,
  title_en: 'Prepositions of time',
  title_de: 'Temporale Präpositionen',
  topic: 'Prepositions of time',
  hasContent: true,
  tags: ['temporale-praepositionen', 'um-am-im', 'von-bis', 'ab-seit'],
  estimated_study_minutes: 15,
  prerequisite_knowledge_i18n: {
    en: 'Helpful to know basic time words (A1-24) and numbers/days/months (A1-30).',
    fr: 'Utile de connaître les repères temporels (A1-24) et les jours/mois (A1-30).',
    de: 'Hilfreich sind einfache Zeitangaben (A1-24) sowie Wochentage und Monate (A1-30).',
  },
  objectives: {
    en: 'Pair clock times, days, dates, months, seasons, and time spans with the right German time prepositions (um, am, im, von ... bis, ab, seit) and apply the exception "in der Nacht".',
    fr: 'Associer les heures, jours, dates, mois, saisons et durées aux prépositions temporelles allemandes exactes (um, am, im, von ... bis, ab, seit) et retenir l’exception « in der Nacht ».',
    de: 'Uhrzeiten, Wochentage, Daten, Monate, Jahreszeiten und Zeiträume mit den richtigen temporalen Präpositionen verbinden (um, am, im, von ... bis, ab, seit) und die Ausnahme „in der Nacht“ anwenden.',
  },
  learning_objectives_i18n: {
    en: [
      'Use um for exact clock times ("um 8 Uhr", "um halb zehn").',
      'Use am for days of the week, dates, parts of the day, and das Wochenende ("am Montag", "am 3. Mai", "am Abend"), noting the exception in der Nacht.',
      'Use im for months, seasons, and years without a preposition ("im Juli", "im Winter", vs. "2026" or "im Jahr 2026").',
      'Express start points and durations with von ... bis (range), ab (from now/then onward), and seit (ongoing since the past, used with Präsens).',
    ],
    fr: [
      'Employer um pour l’heure précise (« um 8 Uhr », « um halb zehn »).',
      'Employer am pour les jours de la semaine, les dates, les moments de la journée et le week-end (« am Montag », « am Abend », « am Wochenende »), avec l’exception in der Nacht.',
      'Employer im pour les mois et les saisons (« im Juli », « im Winter »), et aucun mot ou im Jahr devant une année.',
      'Exprimer les intervalles et points de départ avec von ... bis, ab (à partir de) et seit (depuis, avec le présent en allemand).',
    ],
    de: [
      'um für genaue Uhrzeiten nutzen („um 8 Uhr“, „um halb zehn“).',
      'am für Wochentage, Daten, Tageszeiten und das Wochenende verwenden („am Montag“, „am 3. Mai“, „am Abend“), samt Ausnahme „in der Nacht“.',
      'im für Monate und Jahreszeiten gebrauchen („im Juli“, „im Winter“; Jahreszahlen ohne Präposition oder mit „im Jahr“).',
      'Zeiträume und Beginn mit von ... bis, ab und seit (mit Präsens bei noch andauernder Handlung) ausdrücken.',
    ],
  },
  introduction_i18n: {
    en: 'In English you have to remember when to use "at", "on", and "in". German gives you an even cleaner three-way core pattern for clock times (um), days and parts of the day (am), and months or seasons (im)—plus practical prepositions for opening hours and ongoing durations (von ... bis, ab, seit).',
    fr: 'En allemand, trois prépositions forment la base des repères temporels : um pour l’heure exacte, am pour les jours, dates et moments de la journée, et im pour les mois et saisons — complétées par von ... bis, ab et seit pour les durées et points de départ.',
    de: 'Für genaue Zeitpunkte hat das Deutsche drei Grundpräpositionen: um für die Uhrzeit, am für Tage, Daten und Tageszeiten sowie im für Monate und Jahreszeiten. Für Zeiträume und den Beginn kommen von ... bis, ab und seit dazu.',
  },
  explanation_i18n: {
    en: [
      '1. The core trio: um – am – im',
      '• um = exact clock times ("um 7 Uhr", "um Viertel nach drei", "um Mitternacht").',
      '• am (= an + dem) = days of the week ("am Dienstag"), dates ("am 14. Oktober"), parts of the day ("am Morgen", "am Vormittag", "am Mittag", "am Nachmittag", "am Abend"), and "am Wochenende". Exception: "in der Nacht" (at night, because Nacht is feminine!).',
      '• im (= in + dem) = months ("im Januar", "im Mai") and seasons ("im Frühling", "im Sommer", "im Herbst", "im Winter"). For years alone, do not use im: write "2026" or "im Jahr 2026" (never *in 2026).',
      '',
      '2. Time ranges and starting points: von ... bis, ab, seit',
      '• von ... bis = start to end of a period ("von Montag bis Freitag", "von 9 bis 17 Uhr").',
      '• ab = starting from a point onward ("ab morgen", "ab 1. September", "ab 18 Uhr").',
      '• seit = since / for an action that started in the past and is STILL true now. In German, seit normally pairs with the present tense: "Ich lerne seit sechs Monaten Deutsch" (= I have been learning German for six months).',
    ].join('\n'),
    fr: [
      '1. Le trio de base : um – am – im',
      '• um = heures précises (« um 7 Uhr », « um Viertel nach drei », « um Mitternacht »).',
      '• am (= an + dem) = jours de la semaine (« am Dienstag »), dates (« am 14. Oktober »), moments de la journée (« am Morgen », « am Nachmittag », « am Abend ») et « am Wochenende ». Exception : « in der Nacht » (die Nacht est féminin).',
      '• im (= in + dem) = mois (« im Januar ») et saisons (« im Sommer », « im Winter »). Devant une année seule, on ne met rien ou « im Jahr 2026 » (jamais *in 2026).',
      '',
      '2. Durées et points de départ : von ... bis, ab, seit',
      '• von ... bis = de ... à ... (« von Montag bis Freitag », « von 9 bis 17 Uhr »).',
      '• ab = à partir de (« ab morgen », « ab 18 Uhr »).',
      '• seit = depuis (action commencée dans le passé et qui continue aujourd’hui). En allemand, on emploie le présent (Präsens) avec seit : « Ich wohne seit zwei Jahren in Köln. »',
    ].join('\n'),
    de: [
      '1. Die drei Grundregeln: um – am – im',
      '• um = genaue Uhrzeiten („um 7 Uhr“, „um Viertel nach drei“, „um Mitternacht“).',
      '• am (= an + dem) = Wochentage („am Dienstag“), Daten („am 14. Oktober“), Tageszeiten („am Morgen“, „am Mittag“, „am Nachmittag“, „am Abend“) und „am Wochenende“. Ausnahme: „in der Nacht“.',
      '• im (= in + dem) = Monate („im Januar“) und Jahreszeiten („im Frühling“, „im Sommer“, „im Herbst“, „im Winter“). Jahreszahlen stehen ohne Präposition („2026“) oder mit „im Jahr 2026“.',
      '',
      '2. Zeitspannen und Beginn: von ... bis, ab, seit',
      '• von ... bis = Anfang bis Ende eines Zeitraums („von Montag bis Freitag“, „von 9 bis 17 Uhr“).',
      '• ab = Beginn ab einem Zeitpunkt („ab morgen“, „ab 18 Uhr“).',
      '• seit = Beginn in der Vergangenheit bis heute (im Deutschen steht dann das Präsens!): „Ich lerne seit sechs Monaten Deutsch.“',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-um-am-im',
      title: 'um (Uhrzeit) – am (Tag/Datum/Tageszeit) – im (Monat/Jahreszeit)',
      body: 'um 8 Uhr | am Montag / am Abend / am 10. Juni | im April / im Sommer (Ausnahme: in der Nacht).',
      title_i18n: {
        en: 'um (clock time) – am (day/date/part of day) – im (month/season)',
        fr: 'um (heure) – am (jour/date/moment du jour) – im (mois/saison)',
        de: 'um (Uhrzeit) – am (Tag/Datum/Tageszeit) – im (Monat/Jahreszeit)',
      },
      body_i18n: {
        en: 'Keep the one major exception in mind: am Morgen / am Abend, but in der Nacht (because die Nacht is feminine).',
        fr: 'Retenez l’exception majeure : am Morgen / am Abend, mais in der Nacht (car die Nacht est féminin).',
        de: 'Wichtige Ausnahme: am Morgen / am Abend, aber immer in der Nacht.',
      },
    },
    {
      id: 'rule-seit-with-present',
      title: 'seit + Präsens für Handlungen bis heute',
      body: 'Was in der Vergangenheit begonnen hat und jetzt noch dauert, steht nach seit im Präsens: „Ich lebe seit 2022 hier.“',
      title_i18n: {
        en: 'seit pairs with the present tense for ongoing situations',
        fr: 'seit s’emploie avec le présent pour une action toujours en cours',
        de: 'seit + Präsens für Handlungen bis heute',
      },
      body_i18n: {
        en: 'Do not use a past tense for "I have lived here for 3 years" — German uses present tense + seit: "Ich wohne seit drei Jahren hier."',
        fr: 'Pour « J’habite ici depuis 3 ans », l’allemand utilise le présent avec seit : « Ich wohne seit drei Jahren hier. »',
        de: 'Für „Ich wohne schon lange hier und wohne noch hier“ nutzt man seit + Präsens.',
      },
    },
  ],
  tables: [
    {
      id: 'tbl-time-preps',
      title_i18n: {
        en: 'A1 German prepositions of time',
        fr: 'Prépositions temporelles allemandes (A1)',
        de: 'Temporale Präpositionen im Überblick (A1)',
      },
      columns_i18n: {
        en: ['Preposition', 'Used for', 'Examples'],
        fr: ['Préposition', 'Emploi', 'Exemples'],
        de: ['Präposition', 'Verwendung', 'Beispiele'],
      },
      rows: [
        ['um', 'Clock time / midnight', 'um 9 Uhr, um halb acht, um Mitternacht'],
        ['am', 'Days, dates, parts of day, weekend', 'am Freitag, am 5. Mai, am Nachmittag, am Wochenende'],
        ['in (in der)', 'Night (exception)', 'in der Nacht'],
        ['im', 'Months, seasons, "in the year"', 'im August, im Herbst, im Jahr 2026'],
        ['von ... bis', 'Start to finish (range)', 'von Montag bis Donnerstag, von 8 bis 16 Uhr'],
        ['ab', 'From a point onward (present/future)', 'ab heute, ab nächster Woche, ab 14 Uhr'],
        ['seit', 'Started in the past, still continuing', 'seit einem Jahr, seit Mai, seit gestern'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Der Zug fährt am Freitag um 14:20 Uhr ab.',
      highlight: 'am Freitag um 14:20 Uhr',
      note: 'Combining am (day) and um (clock time)',
      translation_i18n: {
        en: 'The train departs on Friday at 2:20 p.m.',
        fr: 'Le train part vendredi à 14 h 20.',
        de: 'Der Zug fährt am Freitag um 14:20 Uhr ab.',
      },
      explanation_i18n: {
        en: 'am pairs with the weekday Freitag and um pairs with the clock time 14:20 Uhr.',
        fr: 'am accompagne le jour Freitag et um l’heure exacte 14:20 Uhr.',
        de: 'am steht beim Wochentag Freitag, um bei der Uhrzeit 14:20 Uhr.',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Im Winter schneit es oft in den Bergen, aber in der Nacht wird es besonders kalt.',
      highlight: 'Im Winter / in der Nacht',
      note: 'im (season) vs. in der Nacht (exception)',
      translation_i18n: {
        en: 'In winter it often snows in the mountains, and at night it gets especially cold.',
        fr: 'En hiver il neige souvent à la montagne, et la nuit il fait particulièrement froid.',
        de: 'Im Winter schneit es oft in den Bergen, aber in der Nacht wird es besonders kalt.',
      },
      explanation_i18n: {
        en: 'Seasons take im (Im Winter), while Nacht uses in der Nacht instead of *am Nacht.',
        fr: 'Les saisons prennent im (Im Winter), tandis que Nacht demande in der Nacht.',
        de: 'Jahreszeiten stehen mit im (Im Winter), die Nacht mit in der Nacht.',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Die Praxis ist von Montag bis Donnerstag von 8 bis 18 Uhr geöffnet.',
      highlight: 'von Montag bis Donnerstag von 8 bis 18 Uhr',
      note: 'Time span with von ... bis',
      translation_i18n: {
        en: 'The medical practice is open from Monday to Thursday from 8 a.m. to 6 p.m.',
        fr: 'Le cabinet médical est ouvert du lundi au jeudi de 8 h à 18 h.',
        de: 'Die Praxis ist von Montag bis Donnerstag von 8 bis 18 Uhr geöffnet.',
      },
      explanation_i18n: {
        en: 'von ... bis expresses both day spans and opening-hour ranges cleanly without articles.',
        fr: 'von ... bis indique une plage de jours comme d’heures d’ouverture.',
        de: 'von ... bis beschreibt Zeiträume bei Tagen und Uhrzeiten.',
      },
    },
    {
      id: 'ex-4',
      sentence: 'Ab nächstem Monat arbeite ich in Wien; ich wohne aber schon seit einem Jahr dort.',
      highlight: 'Ab ... / seit einem Jahr',
      note: 'ab (future start) vs. seit (ongoing duration with Präsens)',
      translation_i18n: {
        en: 'Starting next month I am working in Vienna; however, I have already been living there for a year.',
        fr: 'À partir du mois prochain je travaille à Vienne ; j’y habite déjà depuis un an.',
        de: 'Ab nächstem Monat arbeite ich in Wien; ich wohne aber schon seit einem Jahr dort.',
      },
      explanation_i18n: {
        en: 'ab marks a future starting point, whereas seit + present tense expresses a duration continuing up to now.',
        fr: 'ab marque le début futur et seit + présent exprime une durée commencée dans le passé qui continue.',
        de: 'ab markiert den Startpunkt, seit + Präsens die bis heute andauernde Zeitspanne.',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-years-no-in',
      contrast_pair: '2025 / im Jahr 2025  (no standalone *in 2025)',
      title_i18n: {
        en: 'Saying years in German without *in',
        fr: 'Exprimer une année sans *in',
        de: 'Jahreszahlen ohne *in',
      },
      body_i18n: {
        en: 'English "in 2025" and French "en 2025" translate into German WITHOUT in: say "2025 ziehe ich um" or "im Jahr 2025 ziehe ich um". Saying *in 2025 is an anglicism in standard German.',
        fr: 'Contrairement au français (« en 2025 ») et à l’anglais (« in 2025 »), on écrit simplement l’année seule (« 2025 ziehe ich um ») ou « im Jahr 2025 ».',
        de: 'Vor einer Jahreszahl steht im Standarddeutschen kein in: Entweder nur „2025 ziehe ich um“ oder „im Jahr 2025“.',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Am Nacht kann ich nicht gut schlafen.',
      right: 'In der Nacht kann ich nicht gut schlafen.',
      explanation_i18n: {
        en: 'Although Morgens/Abends take am, die Nacht is an exception and requires in der Nacht (or nachts for every night).',
        fr: 'Bien que les autres moments du jour prennent am, die Nacht fait exception : on dit in der Nacht (ou nachts).',
        de: 'Obwohl Morgen, Mittag, Nachmittag und Abend am nehmen, heißt es immer in der Nacht.',
      },
      principle_i18n: {
        en: 'Use am for Morgen/Tag/Abend, but always in der Nacht.',
        fr: 'Utilisez am pour Morgen/Tag/Abend, mais toujours in der Nacht.',
        de: 'Bei Nacht immer „in der Nacht“ (oder „nachts“) verwenden.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Der Deutschkurs beginnt an 9 Uhr in April.',
      right: 'Der Deutschkurs beginnt um 9 Uhr im April.',
      explanation_i18n: {
        en: 'Clock times always take um (not an), and months always take im (= in dem, not bare in).',
        fr: 'L’heure exacte exige um, et les mois exigent im (= in dem).',
        de: 'Vor Uhrzeiten steht um, vor Monaten steht im.',
      },
      principle_i18n: {
        en: 'Pair clock time with um, days/dates with am, and months/seasons with im.',
        fr: 'Associez um à l’heure, am au jour/date et im au mois/saison.',
        de: 'Uhrzeit → um, Tag/Datum → am, Monat/Jahreszeit → im.',
      },
    },
    {
      id: 'cm-3',
      wrong: 'Mein Geburtstag ist in 12. Mai in 2026.',
      right: 'Mein Geburtstag ist am 12. Mai 2026.',
      explanation_i18n: {
        en: 'Specific dates take am (am 12. Mai), and the year follows directly without *in.',
        fr: 'Les dates précises prennent am (am 12. Mai), et l’année s’ajoute sans préposition in.',
        de: 'Ein konkretes Datum steht mit am (am 12. Mai); die Jahreszahl folgt ohne in.',
      },
      principle_i18n: {
        en: 'Use am before calendar dates and omit *in before years.',
        fr: 'Mettez am devant une date précise et supprimez *in devant l’année.',
        de: 'Vor Kalendertagen steht am; Jahreszahlen stehen ohne in.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'um = clock times, am = days/dates/parts of day/weekend (except in der Nacht), im = months/seasons.',
      key_pattern: 'um 10 Uhr  |  am Montag / am 5. Mai  |  in der Nacht  |  im Juli / im Sommer  |  seit + Präsens',
      mistake_warning: 'Never say *am Nacht or *in 2026; use in der Nacht and 2026 / im Jahr 2026.',
      self_check: 'Fill the gaps: "___ Samstag ___ 19 Uhr feiern wir ___ Garten. Das machen wir schon ___ drei Jahren."',
    },
    fr: {
      central_rule: 'um = heure, am = jours/dates/moments du jour/week-end (sauf in der Nacht), im = mois/saisons.',
      key_pattern: 'um 10 Uhr  |  am Montag / am 5. Mai  |  in der Nacht  |  im Juli / im Sommer  |  seit + présent',
      mistake_warning: 'Évitez *am Nacht et *in 2026 ; dites in der Nacht et 2026 / im Jahr 2026.',
      self_check: 'Complétez : « ___ Samstag ___ 19 Uhr feiern wir ___ Garten. Das machen wir schon ___ drei Jahren. »',
    },
    de: {
      central_rule: 'um = Uhrzeit, am = Tag/Datum/Tageszeit/Wochenende (Ausnahme: in der Nacht), im = Monat/Jahreszeit.',
      key_pattern: 'um 10 Uhr  |  am Montag / am 5. Mai  |  in der Nacht  |  im Juli / im Sommer  |  seit + Präsens',
      mistake_warning: 'Nie *am Nacht oder *in 2026 sagen, sondern in der Nacht und 2026 / im Jahr 2026.',
      self_check: 'Ergänze: „___ Samstag ___ 19 Uhr feiern wir ___ Garten. Das machen wir schon ___ drei Jahren.“',
    },
  },
  practice_mapping: [
    {
      id: 'a1-25-um-am-im-selection',
      label_i18n: {
        en: 'Choosing between um, am, im, and in der (Nacht)',
        fr: 'Choix entre um, am, im et in der (Nacht)',
        de: 'um, am, im und in der (Nacht) richtig wählen',
      },
      formats: ['multiple_choice', 'gap_fill', 'matching'],
    },
    {
      id: 'a1-25-von-bis-ab-seit',
      label_i18n: {
        en: 'Using von ... bis, ab, and seit (with present tense)',
        fr: 'Emploi de von ... bis, ab et seit (+ présent)',
        de: 'von ... bis, ab und seit (+ Präsens) anwenden',
      },
      formats: ['gap_fill', 'error_correction', 'sentence_construction'],
    },
  ],
};
