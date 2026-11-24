import type { Lesson } from '../../types/domain';

export const LESSON_A1_19: Lesson = {
  id: 'a1-19',
  level: 'A1',
  unit: 19,
  title_en: 'Basic sentence structure',
  title_de: 'Satzbau im Hauptsatz',
  topic: 'Basic sentence structure',
  hasContent: true,
  tags: ['satzbau', 'hauptsatz', 'v2-regel', 'inversion', 'te-ka-mo-lo'],
  estimated_study_minutes: 15,
  prerequisite_knowledge_i18n: {
    en: 'Helpful to know nominative and accusative nouns/pronouns (A1-12 to A1-14).',
    fr: 'Utile de connaître le nominatif et l’accusatif (A1-12 à A1-14).',
    de: 'Hilfreich sind Nominativ und Akkusativ (A1-12 bis A1-14).',
  },
  objectives: {
    en: 'Build grammatically correct German main clauses by keeping the conjugated verb in Position 2, fronting time or place expressions with subject inversion, and ordering middle-field elements naturally.',
    fr: 'Construire des propositions principales correctes en maintenant le verbe conjugué en position 2, en pratiquant l’inversion après un complément en tête et en ordonnant le milieu de phrase.',
    de: 'Korrekte deutsche Hauptsätze mit dem konjugierten Verb auf Position 2 bilden, bei Zeit- oder Ortsangaben auf Position 1 das Subjekt hinter das Verb setzen und Zeit vor Ort stellen.',
  },
  learning_objectives_i18n: {
    en: [
      'Apply the golden V2 rule of German main clauses: Position 1 = one single element (subject OR time/place/object); Position 2 = conjugated verb.',
      'Invert subject and verb whenever a non-subject element (e.g., Heute, Am Montag, In Berlin) occupies Position 1.',
      'Order middle-field information naturally with Time before Place (z. B. heute in Berlin).',
    ],
    fr: [
      'Appliquer la règle d’or V2 de la principale : Position 1 = un seul groupe (sujet OU complément) ; Position 2 = verbe conjugué.',
      'Placer le sujet juste après le verbe (inversion) lorsqu’un autre élément (Heute, Am Montag, In Berlin) ouvre la phrase.',
      'Ordonner naturellement les compléments dans le champ médian : Temps avant Lieu (ex. heute in Berlin).',
    ],
    de: [
      'Die Grundregel des Hauptsatzes (V2) anwenden: Position 1 = genau ein Satzglied; Position 2 = konjugiertes Verb.',
      'Subjekt und Verb umstellen (Inversion), sobald eine Zeitangabe, Ortsangabe oder ein Objekt auf Position 1 steht.',
      'Im Mittelfeld Angaben natürlich ordnen: Zeit vor Ort (z. B. heute im Büro).',
    ],
  },
  introduction_i18n: {
    en: 'German word order is more flexible than English at the start of a sentence, yet stricter about where the verb goes. In a normal German statement (Hauptsatz), one chosen piece of information takes Position 1, and the conjugated verb always anchors Position 2.',
    fr: 'L’ordre des mots allemand est plus souple qu’en français en début de phrase, mais très rigoureux sur la place du verbe. Dans une proposition principale déclarative (Hauptsatz), un seul élément occupe la position 1, et le verbe conjugué ancre toujours la position 2.',
    de: 'Im deutschen Hauptsatz (Aussagesatz) kannst du flexibel entscheiden, womit der Satz beginnt – aber der Platz des Verbs ist fest: Auf Position 1 steht genau ein Satzglied, und auf Position 2 steht immer das konjugierte Verb.',
  },
  explanation_i18n: {
    en: [
      '1. Standard order: Subject – Verb – Rest',
      '[Pos. 1: Subject] + [Pos. 2: Conjugated Verb] + [Time] + [Place / Object]',
      'Example: "Ich (1) lerne (2) heute (Time) in der Bibliothek (Place)."',
      'Remember: Position 1 means one grammatical unit ("Mein großer Bruder", "Am Montagabend"), not necessarily one word.',
      '',
      '2. Fronting & Inversion: Time/Place on Position 1',
      'To emphasize time, place, or another detail, move it into Position 1. Because the verb MUST stay in Position 2, the subject immediately moves to Position 3:',
      '• "Heute (1) lerne (2) ich (3) in der Bibliothek."',
      '• "In der Bibliothek (1) lerne (2) ich (3) heute."',
      'Note: Do NOT put a comma after "Heute" or "Am Montag" in Position 1.',
      '',
      '3. Natural order inside the sentence (Time before Place)',
      'When both a time expression and a place expression appear after the verb, German normally puts Time before Place:',
      '• "Wir treffen uns morgen (Time) am Bahnhof (Place)."',
    ].join('\n'),
    fr: [
      '1. Ordre neutre : Sujet – Verbe – Compléments',
      '[Pos. 1 : Sujet] + [Pos. 2 : Verbe conjugué] + [Temps] + [Lieu / Objet]',
      'Exemple : « Ich (1) lerne (2) heute (Temps) in der Bibliothek (Lieu). »',
      'Attention : « Position 1 » signifie un groupe grammatical entier (« Mein großer Bruder », « Am Montagabend »), pas forcément un seul mot.',
      '',
      '2. Mise en tête et inversion',
      'Pour insister sur le moment ou le lieu, placez-le en position 1. Comme le verbe reste en position 2, le sujet passe directement en position 3 :',
      '• « Heute (1) lerne (2) ich (3) in der Bibliothek. »',
      '• « In der Bibliothek (1) lerne (2) ich (3) heute. »',
      'Remarque : on ne met jamais de virgule après « Heute » ou « Am Montag » en début de phrase.',
      '',
      '3. Ordre naturel après le verbe : Temps avant Lieu',
      'Lorsque la phrase contient à la fois un repère de temps et de lieu après le verbe, le temps précède généralement le lieu :',
      '• « Wir treffen uns morgen (Temps) am Bahnhof (Lieu). »',
    ].join('\n'),
    de: [
      '1. Grundstellung: Subjekt – Verb – Rest',
      '[Pos. 1: Subjekt] + [Pos. 2: Konjugiertes Verb] + [Zeit] + [Ort / Objekt]',
      'Beispiel: „Ich (1) lerne (2) heute (Zeit) in der Bibliothek (Ort).“',
      'Wichtig: Position 1 bedeutet ein Satzglied (z. B. „Mein großer Bruder“ oder „Am Montagabend“), nicht nur ein einzelnes Wort.',
      '',
      '2. Umstellung (Inversion) bei Zeit oder Ort auf Position 1',
      'Wenn du die Zeit oder den Ort betonen willst, stellst du dieses Satzglied auf Position 1. Das Verb bleibt auf Position 2, und das Subjekt rückt direkt auf Position 3 hinter das Verb:',
      '• „Heute (1) lerne (2) ich (3) in der Bibliothek.“',
      '• „In der Bibliothek (1) lerne (2) ich (3) heute.“',
      'Hinweis: Nach Zeit- oder Ortsangaben am Satzanfang steht im Deutschen kein Komma.',
      '',
      '3. Natürliche Reihenfolge: Zeit vor Ort',
      'Stehen Zeit- und Ortsangaben hinter dem Verb, kommt im Deutschen in der Regel zuerst die Zeit und dann der Ort:',
      '• „Wir treffen uns morgen (Zeit) am Bahnhof (Ort).“',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-v2-one-slot',
      title: 'Vor dem konjugierten Verb steht genau ein Satzglied',
      body: 'Position 1 nimmt genau eine Informationseinheit ein (Subjekt, Zeitangabe, Ortsangabe oder Objekt); sofort danach folgt auf Position 2 das Verb.',
      title_i18n: {
        en: 'Exactly one sentence element precedes the verb (V2)',
        fr: 'Un seul groupe précède le verbe conjugué (règle V2)',
        de: 'Vor dem konjugierten Verb steht genau ein Satzglied',
      },
      body_i18n: {
        en: 'Never stack two elements like *Heute ich lerne... — placing a time word in Position 1 pushes the subject to Position 3 after the verb.',
        fr: 'On ne place jamais deux éléments avant le verbe (*Heute ich lerne...) : le temps en position 1 renvoie le sujet après le verbe.',
        de: 'Nie zwei Satzglieder vor das Verb stellen (*Heute ich lerne...): Kommt die Zeit auf Position 1, steht das Subjekt auf Position 3.',
      },
    },
    {
      id: 'rule-time-before-place',
      title: 'Zeit vor Ort im Mittelfeld',
      body: 'In neutralen Sätzen stehen Zeitangaben vor Ortsangaben: „Ich arbeite montags im Büro.“',
      title_i18n: {
        en: 'Time before Place in neutral order',
        fr: 'Temps avant Lieu dans l’ordre neutre',
        de: 'Zeit vor Ort im Mittelfeld',
      },
      body_i18n: {
        en: 'English often says "at the office on Mondays" (Place → Time), whereas German prefers Time → Place: "montags im Büro".',
        fr: 'Contrairement à l’anglais qui met souvent le lieu avant le temps, l’allemand préfère Temps → Lieu : « montags im Büro ».',
        de: 'Anders als im Englischen stehen Zeitangaben im Deutschen normalerweise vor Ortsangaben: „montags im Büro“.',
      },
    },
  ],
  tables: [
    {
      id: 'tbl-v2-slots',
      title_i18n: {
        en: 'Three ways to build the same main clause (V2 stays fixed)',
        fr: 'Trois variantes d’une même phrase principale (le verbe reste en 2)',
        de: 'Drei Satzvarianten – das Verb bleibt fest auf Position 2',
      },
      columns_i18n: {
        en: ['Position 1', 'Position 2 (Verb)', 'Position 3', 'Rest of clause'],
        fr: ['Position 1', 'Position 2 (Verbe)', 'Position 3', 'Suite'],
        de: ['Position 1', 'Position 2 (Verb)', 'Position 3', 'Rest'],
      },
      rows: [
        ['Ich', 'kaufe', 'heute', 'im Supermarkt Obst.'],
        ['Heute', 'kaufe', 'ich', 'im Supermarkt Obst.'],
        ['Im Supermarkt', 'kaufe', 'ich', 'heute Obst.'],
        ['Meine Schwester', 'wohnt', 'seit September', 'in Köln.'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Meine Kollegen trinken jeden Morgen zusammen Kaffee.',
      highlight: 'Meine Kollegen | trinken',
      note: 'Multi-word subject in Position 1, verb in Position 2',
      translation_i18n: {
        en: 'My colleagues drink coffee together every morning.',
        fr: 'Mes collègues boivent du café ensemble tous les matins.',
        de: 'Meine Kollegen trinken jeden Morgen zusammen Kaffee.',
      },
      explanation_i18n: {
        en: 'Meine Kollegen counts as a single grammatical unit (Position 1), so trinken is in Position 2.',
        fr: 'Meine Kollegen constitue un seul groupe sujet (position 1) devant le verbe trinken (position 2).',
        de: 'Meine Kollegen ist ein einzelnes Satzglied (Position 1), darauf folgt direkt trinken (Position 2).',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Am Wochenende fahren wir zu unseren Freunden ans Meer.',
      highlight: 'Am Wochenende | fahren | wir',
      note: 'Time in Pos. 1 triggers subject inversion to Pos. 3',
      translation_i18n: {
        en: 'On the weekend we are driving to our friends at the seaside.',
        fr: 'Ce week-end, nous allons chez nos amis au bord de la mer.',
        de: 'Am Wochenende fahren wir zu unseren Freunden ans Meer.',
      },
      explanation_i18n: {
        en: 'Am Wochenende takes Position 1; fahren remains Position 2; wir follows in Position 3 without a comma.',
        fr: 'Am Wochenende occupe la position 1, fahren reste en position 2 et wir passe en position 3 sans virgule.',
        de: 'Am Wochenende steht auf Position 1 (ohne Komma), fahren auf Position 2 und wir auf Position 3.',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Der Kurs findet dienstags und donnerstags in Raum 204 statt.',
      highlight: 'dienstags und donnerstags in Raum 204',
      note: 'Time before Place order',
      translation_i18n: {
        en: 'The course takes place on Tuesdays and Thursdays in Room 204.',
        fr: 'Le cours a lieu les mardis et jeudis en salle 204.',
        de: 'Der Kurs findet dienstags und donnerstags in Raum 204 statt.',
      },
      explanation_i18n: {
        en: 'The time phrase (dienstags und donnerstags) precedes the location (in Raum 204).',
        fr: 'L’indication temporelle précède l’indication de lieu (in Raum 204).',
        de: 'Die Zeitangabe steht vor der Ortsangabe (in Raum 204).',
      },
    },
    {
      id: 'ex-4',
      sentence: 'Dieses Buch lese ich besonders gern.',
      highlight: 'Dieses Buch | lese | ich',
      note: 'Object fronted to Position 1 for emphasis',
      translation_i18n: {
        en: 'I especially enjoy reading this book.',
        fr: 'Ce livre, j’aime particulièrement le lire.',
        de: 'Dieses Buch lese ich besonders gern.',
      },
      explanation_i18n: {
        en: 'Even an object (Dieses Buch) can open the sentence in Position 1; the verb stays in Position 2 and ich moves to Position 3.',
        fr: 'Même un objet (Dieses Buch) peut être mis en tête en position 1, entraînant l’inversion lese ich.',
        de: 'Auch ein Objekt (Dieses Buch) kann auf Position 1 stehen; dann folgt das Verb und dahinter das Subjekt ich.',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-comma-after-pos1',
      contrast_pair: 'Heute regnet es.  (no comma)  vs.  *Heute, regnet es.',
      title_i18n: {
        en: 'No comma after a fronted time or place phrase',
        fr: 'Pas de virgule après un complément en tête de phrase',
        de: 'Kein Komma nach Zeit- oder Ortsangaben auf Position 1',
      },
      body_i18n: {
        en: 'Unlike English ("Today, it is raining") or French ("Aujourd’hui, il pleut"), German never puts a comma after a single word or phrase in Position 1 before the verb.',
        fr: 'Contrairement au français (« Aujourd’hui, il pleut »), l’allemand ne met jamais de virgule entre l’élément en position 1 et le verbe en position 2.',
        de: 'Anders als im Englischen oder Französischen steht nach einem Satzglied auf Position 1 im Deutschen kein Komma vor dem Verb.',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Heute ich arbeite bis 18 Uhr.',
      right: 'Heute arbeite ich bis 18 Uhr.',
      explanation_i18n: {
        en: 'Putting Heute in Position 1 leaves only Position 2 for the verb arbeite; the subject ich must move behind the verb.',
        fr: 'Avec Heute en position 1, le verbe arbeite doit venir tout de suite en position 2, avant le sujet ich.',
        de: 'Heute belegt Position 1, arbeite steht auf Position 2 und ich rückt auf Position 3.',
      },
      principle_i18n: {
        en: 'The conjugated verb must always stay in Position 2 in main statements.',
        fr: 'Le verbe conjugué occupe toujours la 2e position dans une phrase déclarative.',
        de: 'Im Aussagesatz bleibt das konjugierte Verb immer auf Position 2.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Am Samstag, wir fahren nach Salzburg.',
      right: 'Am Samstag fahren wir nach Salzburg.',
      explanation_i18n: {
        en: 'There are two errors: no comma after Am Samstag, and the verb fahren must precede wir (Position 2).',
        fr: 'Double erreur : pas de virgule après Am Samstag, et le verbe fahren doit précéder wir.',
        de: 'Kein Komma nach Am Samstag und Verbzweitstellung beachten: fahren vor wir.',
      },
      principle_i18n: {
        en: 'Omit the comma after Position 1 and place the verb immediately before the subject.',
        fr: 'Supprimez la virgule après la position 1 et placez le verbe devant le sujet.',
        de: 'Nach Position 1 kein Komma setzen und das Verb vor das Subjekt stellen.',
      },
    },
    {
      id: 'cm-3',
      wrong: 'Ich treffe meine Freundin im Café um 15 Uhr.',
      right: 'Ich treffe meine Freundin um 15 Uhr im Café.',
      explanation_i18n: {
        en: 'In neutral German word order, time expressions (um 15 Uhr) precede place expressions (im Café).',
        fr: 'Dans l’ordre neutre allemand, le temps (um 15 Uhr) précède le lieu (im Café).',
        de: 'In der neutralen Wortstellung stehen Zeitangaben (um 15 Uhr) vor Ortsangaben (im Café).',
      },
      principle_i18n: {
        en: 'Place Time before Place (Zeit vor Ort) in neutral main clauses.',
        fr: 'Placez l’indication de temps avant l’indication de lieu.',
        de: 'Ordne Angaben im Mittelfeld nach dem Prinzip „Zeit vor Ort“.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'In a German main statement, one unit stands in Position 1 and the conjugated verb always holds Position 2.',
      key_pattern: '[Subject OR Time/Place] + [Conjugated Verb] + [Subject if moved] + [Time] + [Place]',
      mistake_warning: 'Never write *Heute, ich gehe... — omit the comma and put the verb directly after Heute.',
      self_check: 'Rewrite starting with "Am Montag": "Wir lernen am Montag in der Schule."',
    },
    fr: {
      central_rule: 'Dans la principale déclarative, un seul élément occupe la position 1 et le verbe conjugué reste en position 2.',
      key_pattern: '[Sujet OU Temps/Lieu] + [Verbe conjugué] + [Sujet si inversé] + [Temps] + [Lieu]',
      mistake_warning: 'N’écrivez jamais *Heute, ich gehe... : pas de virgule et le verbe juste après Heute.',
      self_check: 'Commencez par « Am Montag » : « Wir lernen am Montag in der Schule. »',
    },
    de: {
      central_rule: 'Im deutschen Hauptsatz steht auf Position 1 ein einziges Satzglied und auf Position 2 immer das konjugierte Verb.',
      key_pattern: '[Subjekt ODER Zeit/Ort] + [Verb] + [Subjekt bei Inversion] + [Zeit] + [Ort]',
      mistake_warning: 'Nie *Heute, ich gehe... schreiben – kein Komma und Verb direkt nach Heute.',
      self_check: 'Beginne mit „Am Montag“: „Wir lernen am Montag in der Schule.“',
    },
  },
  practice_mapping: [
    {
      id: 'a1-19-v2-inversion',
      label_i18n: {
        en: 'Keeping the conjugated verb in Position 2 when fronting time/place phrases',
        fr: 'Maintien du verbe en position 2 avec inversion du sujet',
        de: 'Verbzweitstellung und Inversion bei Zeit- oder Ortsangaben auf Position 1',
      },
      formats: ['sentence_construction', 'transformation', 'error_correction'],
    },
    {
      id: 'a1-19-time-before-place',
      label_i18n: {
        en: 'Ordering Time before Place inside the main clause',
        fr: 'Ordre Temps avant Lieu dans le milieu de phrase',
        de: 'Zeit vor Ort im Hauptsatz anordnen',
      },
      formats: ['sentence_construction', 'multiple_choice'],
    },
  ],
};
