import type { Lesson } from '../../types/domain';

export const LESSON_A1_17: Lesson = {
  id: 'a1-17',
  level: 'A1',
  unit: 17,
  title_en: 'Yes/no questions',
  title_de: 'Ja-/Nein-Fragen',
  topic: 'Yes/no questions',
  hasContent: true,
  tags: ['ja-nein-fragen', 'entscheidungsfragen', 'verb-erststellung', 'doch'],
  estimated_study_minutes: 10,
  prerequisite_knowledge_i18n: {
    en: 'Helpful to know present-tense verb conjugation (A1-05, A1-06).',
    fr: 'Utile de connaître la conjugaison au présent (A1-05, A1-06).',
    de: 'Hilfreich ist die Konjugation im Präsens (A1-05, A1-06).',
  },
  objectives: {
    en: 'Form German yes/no questions by placing the conjugated verb in Position 1, use rising intonation, and answer with Ja, Nein, or Doch accurately.',
    fr: 'Former des questions fermées (oui/non) en plaçant le verbe conjugué en 1re position et répondre correctement par Ja, Nein ou Doch.',
    de: 'Ja-/Nein-Fragen mit dem konjugierten Verb auf Position 1 bilden und passend mit Ja, Nein oder Doch antworten.',
  },
  learning_objectives_i18n: {
    en: [
      'Transform a statement into a yes/no question by moving the conjugated verb to Position 1 followed immediately by the subject.',
      'Form yes/no questions directly without adding an auxiliary like English "do/does".',
      'Answer negative yes/no questions accurately using Doch to contradict a negative assumption and Nein to confirm the negative.',
    ],
    fr: [
      'Transformer une phrase affirmative en question fermée en plaçant le verbe conjugué en position 1, suivi directement du sujet.',
      'Construire des questions directement avec le verbe principal, sans auxiliaire équivalent à « do/does » ou « est-ce que ».',
      'Répondre aux questions négatives avec Doch (si !) pour contredire la négation, et Nein pour la confirmer.',
    ],
    de: [
      'Aussagesätze in Ja-/Nein-Fragen umwandeln, indem das konjugierte Verb auf Position 1 und das Subjekt direkt dahinter steht.',
      'Fragen direkt mit dem Verb ohne Hilfsverb wie englisch „do/does“ bilden.',
      'Auf negative Fragen richtig mit Doch (Widerspruch) oder Nein (Bestätigung der Verneinung) antworten.',
    ],
  },
  introduction_i18n: {
    en: 'Yes/no questions (Ja-/Nein-Fragen or Entscheidungsfragen) ask whether something is true or not. Unlike English, German does not need an extra helper word like "do" or "does": you simply place the conjugated verb at the very beginning of the question.',
    fr: 'Les questions fermées (Ja-/Nein-Fragen) appellent une réponse par oui ou par non. Contrairement à l’anglais (« do/does ») ou au français (« est-ce que »), l’allemand place tout simplement le verbe conjugué en toute première position.',
    de: 'Ja-/Nein-Fragen fragen danach, ob eine Aussage zutrifft oder nicht. Im Deutschen braucht man dafür kein extra Fragewort und kein Hilfsverb: Das konjugierte Verb steht einfach ganz vorn auf Position 1.',
  },
  explanation_i18n: {
    en: [
      '1. Word order: Verb first (Position 1)',
      'Statement: Du kommst heute. (Subject = Pos. 1, Verb = Pos. 2)',
      'Yes/No Question: Kommst du heute? (Verb = Pos. 1, Subject = Pos. 2, Rest + ?)',
      'Notice that the verb keeps its exact subject agreement (Kommst du...? / Arbeitet Herr Weber...? / Habt ihr...?). In speech, your voice rises slightly at the end of the question.',
      '',
      '2. Answering positive questions (Ja / Nein)',
      '• Frage: "Wohnst du in Köln?" → "Ja, ich wohne in Köln." / "Nein, ich wohne in Bonn."',
      '',
      '3. Answering negative questions (Doch vs. Nein)',
      'When a yes/no question contains nicht or kein ("Trinkst du keinen Kaffee?"), Ja can feel ambiguous. German therefore uses Doch to say "Yes, on the contrary I do!":',
      '• "Trinkst du keinen Kaffee?" → "Doch, ich trinke gern Kaffee." (Contradicts the negative question = Yes, I do.)',
      '• "Trinkst du keinen Kaffee?" → "Nein, ich trinke keinen Kaffee." (Confirms the negative = No, I don’t.)',
    ].join('\n'),
    fr: [
      '1. Ordre des mots : le verbe en position 1',
      'Phrase affirmative : Du kommst heute. (Sujet = Pos. 1, Verbe = Pos. 2)',
      'Question fermée : Kommst du heute? (Verbe = Pos. 1, Sujet = Pos. 2, suite + ?)',
      'Le verbe reste accordé avec le sujet (Kommst du...? / Arbeitet Herr Weber...?). À l’oral, l’intonation monte en fin de phrase.',
      '',
      '2. Répondre à une question positive (Ja / Nein)',
      '• Question : « Wohnst du in Köln? » → « Ja, ich wohne in Köln. » / « Nein, ich wohne in Bonn. »',
      '',
      '3. Répondre à une question négative (Doch vs Nein)',
      'Si la question contient nicht ou kein (« Trinkst du keinen Kaffee? »), l’allemand emploie Doch (équivalent du « Si ! » français) pour contredire la négation :',
      '• « Trinkst du keinen Kaffee? » → « Doch, ich trinke gern Kaffee. » (Si, j’en bois !)',
      '• « Trinkst du keinen Kaffee? » → « Nein, ich trinke keinen Kaffee. » (Non, je n’en bois pas.)',
    ].join('\n'),
    de: [
      '1. Satzbau: Konjugiertes Verb auf Position 1',
      'Aussagesatz: Du kommst heute. (Subjekt = Pos. 1, Verb = Pos. 2)',
      'Ja-/Nein-Frage: Kommst du heute? (Verb = Pos. 1, Subjekt = Pos. 2, Rest + ?)',
      'Das Verb behält die passende Personalendung (Kommst du...? / Arbeitet Herr Weber...?). Beim Sprechen steigt die Satzmelodie am Ende an.',
      '',
      '2. Antworten auf positive Fragen (Ja / Nein)',
      '• Frage: „Wohnst du in Köln?“ → „Ja, ich wohne in Köln.“ / „Nein, ich wohne in Bonn.“',
      '',
      '3. Antworten auf negative Fragen (Doch vs. Nein)',
      'Enthält die Frage nicht oder kein („Trinkst du keinen Kaffee?“), nutzt man Doch als positive Gegenantwort:',
      '• „Trinkst du keinen Kaffee?“ → „Doch, ich trinke gern Kaffee.“ (Widerspruch = doch, ich trinke Kaffee)',
      '• „Trinkst du keinen Kaffee?“ → „Nein, ich trinke keinen Kaffee.“ (Bestätigung = nein, ich trinke keinen)',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-verb-first',
      title: 'Verb auf Position 1, Subjekt auf Position 2',
      body: 'In Ja-/Nein-Fragen beginnt der Satz mit dem konjugierten Verb; direkt dahinter folgt das Subjekt.',
      title_i18n: {
        en: 'Verb in Position 1, subject in Position 2',
        fr: 'Verbe en position 1, sujet en position 2',
        de: 'Verb auf Position 1, Subjekt auf Position 2',
      },
      body_i18n: {
        en: 'Pattern: [Conjugated Verb] + [Subject] + [Other elements] + ?. No helper verb like "do/does" is added.',
        fr: 'Modèle : [Verbe conjugué] + [Sujet] + [Compléments] + ?. Aucun auxiliaire n’est ajouté.',
        de: 'Muster: [Konjugiertes Verb] + [Subjekt] + [weitere Satzglieder] + ?. Kein Hilfsverb nötig.',
      },
    },
    {
      id: 'rule-doch',
      title: 'Doch als Antwort auf verneinte Fragen',
      body: 'Bei Fragen mit nicht oder kein antwortet man mit Doch, wenn die positive Aussage stimmt.',
      title_i18n: {
        en: 'Doch answers negative questions positively',
        fr: 'Doch répond positivement à une question négative',
        de: 'Doch als Antwort auf verneinte Fragen',
      },
      body_i18n: {
        en: 'Never answer a negative question with Ja when you mean "Yes, actually I do!" — use Doch.',
        fr: 'Pour contredire une question contenant nicht ou kein, employez Doch (« si ! ») plutôt que Ja.',
        de: 'Auf eine Frage mit nicht oder kein antwortet man mit Doch (nicht mit Ja), wenn man widerspricht.',
      },
    },
  ],
  tables: [
    {
      id: 'tbl-yes-no-transform',
      title_i18n: {
        en: 'Statement → Yes/No Question → Answer',
        fr: 'Affirmation → Question fermée → Réponse',
        de: 'Aussagesatz → Ja-/Nein-Frage → Antwort',
      },
      columns_i18n: {
        en: ['Statement (V2)', 'Yes/No Question (V1)', 'Positive / Negative Answer'],
        fr: ['Affirmation (V2)', 'Question (V1)', 'Réponse'],
        de: ['Aussagesatz (V2)', 'Ja-/Nein-Frage (V1)', 'Mögliche Antwort'],
      },
      rows: [
        ['Sie sprechen Deutsch.', 'Sprechen Sie Deutsch?', 'Ja, ein bisschen. / Nein, noch nicht.'],
        ['Das Buch ist interessant.', 'Ist das Buch interessant?', 'Ja, es ist sehr spannend.'],
        ['Ihr habt heute Zeit.', 'Habt ihr heute Zeit?', 'Ja, ab 17 Uhr. / Nein, leider nicht.'],
        ['Du hast keine Zeit.', 'Hast du keine Zeit?', 'Doch, ich habe Zeit! / Nein, leider keine.'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Arbeiten Sie am Samstag im Büro?',
      highlight: 'Arbeiten Sie',
      note: 'Formal yes/no question with verb first',
      translation_i18n: {
        en: 'Do you work in the office on Saturday?',
        fr: 'Travaillez-vous au bureau le samedi ?',
        de: 'Arbeiten Sie am Samstag im Büro?',
      },
      explanation_i18n: {
        en: 'The conjugated verb Arbeiten stands in Position 1, followed directly by the subject Sie.',
        fr: 'Le verbe Arbeiten occupe la 1re position, suivi du sujet Sie.',
        de: 'Das Verb Arbeiten steht auf Position 1, direkt dahinter folgt das Subjekt Sie.',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Liest du abends gern Romane?',
      highlight: 'Liest du',
      note: 'Irregular verb (lesen → liest) in V1 position',
      translation_i18n: {
        en: 'Do you like reading novels in the evening?',
        fr: 'Aimes-tu lire des romans le soir ?',
        de: 'Liest du abends gern Romane?',
      },
      explanation_i18n: {
        en: 'Even irregular stem-changing verbs keep their du-form (liest) when moved to Position 1.',
        fr: 'Même avec un changement de radical (liest), le verbe passe simplement en 1re position.',
        de: 'Auch Verben mit Vokalwechsel (liest) behalten in der V1-Frage ihre du-Form.',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Kommt der Zug aus Frankfurt pünktlich an?',
      highlight: 'Kommt ... an',
      note: 'Yes/no question preview with noun subject and separable prefix',
      translation_i18n: {
        en: 'Is the train from Frankfurt arriving on time?',
        fr: 'Le train de Francfort arrive-t-il à l’heure ?',
        de: 'Kommt der Zug aus Frankfurt pünktlich an?',
      },
      explanation_i18n: {
        en: 'The noun phrase der Zug aus Frankfurt acts as the subject right after the verb Kommt.',
        fr: 'Le groupe nominal der Zug aus Frankfurt suit immédiatement le verbe Kommt.',
        de: 'Das Subjekt der Zug aus Frankfurt steht direkt hinter dem Verb auf Position 1.',
      },
    },
    {
      id: 'ex-4',
      sentence: 'Magst du keine Schokolade? — Doch, ich esse sie sehr gern!',
      highlight: 'keine ... Doch',
      note: 'Using Doch to contradict a negative question',
      translation_i18n: {
        en: 'Don’t you like chocolate? — Yes I do, I love eating it!',
        fr: 'Tu n’aimes pas le chocolat ? — Si, j’aime beaucoup ça !',
        de: 'Magst du keine Schokolade? — Doch, ich esse sie sehr gern!',
      },
      explanation_i18n: {
        en: 'Because the question is negative (keine Schokolade), the positive reply begins with Doch.',
        fr: 'La question étant négative (keine), la réponse positive commence obligatoirement par Doch.',
        de: 'Da die Frage negativ formuliert ist (keine), antwortet man positiv mit Doch.',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-ja-vs-doch',
      contrast_pair: 'Ja  (positive question)  vs.  Doch  (negative question)',
      title_i18n: {
        en: 'When to use Ja vs. Doch',
        fr: 'Quand utiliser Ja ou Doch',
        de: 'Wann antwortet man mit Ja und wann mit Doch?',
      },
      body_i18n: {
        en: 'Both Ja and Doch mean "yes", but they answer different questions: "Hast du Hunger? — Ja." (positive question) vs. "Hast du keinen Hunger? — Doch!" (negative question containing nicht or kein).',
        fr: 'Ja et Doch signifient tous deux « oui/si », mais s’emploient selon la forme de la question : « Hast du Hunger? — Ja. » (question positive) vs « Hast du keinen Hunger? — Doch ! » (question négative).',
        de: 'Auf positive Fragen antwortet man mit Ja oder Nein („Hast du Hunger? – Ja“). Auf verneinte Fragen mit nicht oder kein antwortet man bei Zustimmung zum positiven Inhalt mit Doch („Hast du keinen Hunger? – Doch!“).',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Tust du Deutsch sprechen?',
      right: 'Sprichst du Deutsch?',
      explanation_i18n: {
        en: 'German never uses tun ("to do") as a question auxiliary. Move the main verb sprechen directly to Position 1.',
        fr: 'L’allemand n’utilise pas d’auxiliaire comme « do » : placez directement le verbe conjugué en tête.',
        de: 'Im Deutschen gibt es kein Frage-Hilfsverb wie im Englischen; das Vollverb selbst rückt auf Position 1.',
      },
      principle_i18n: {
        en: 'Place the conjugated main verb directly in Position 1 without an auxiliary.',
        fr: 'Placez directement le verbe principal conjugué en première position.',
        de: 'Stelle das konjugierte Vollverb direkt auf Position 1.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Du kommst aus Österreich?',
      right: 'Kommst du aus Österreich?',
      explanation_i18n: {
        en: 'While rising intonation on a statement exists in casual speech, standard grammatical yes/no questions invert verb and subject (Kommst du...?).',
        fr: 'Dans la grammaire standard, la question fermée inverse le verbe et le sujet : le verbe est en position 1.',
        de: 'Eine korrekte Ja-/Nein-Frage beginnt im Deutschen mit dem Verb auf Position 1.',
      },
      principle_i18n: {
        en: 'Use Verb + Subject word order for standard yes/no questions.',
        fr: 'Utilisez l’ordre Verbe + Sujet pour les questions fermées standard.',
        de: 'Nutze die Wortstellung Verb + Subjekt für Standardfragen.',
      },
    },
    {
      id: 'cm-3',
      wrong: 'Wohnst du nicht in Berlin? — Ja, ich wohne in Berlin.',
      right: 'Wohnst du nicht in Berlin? — Doch, ich wohne in Berlin.',
      explanation_i18n: {
        en: 'Because the question contains nicht, contradicting it requires Doch instead of Ja.',
        fr: 'Comme la question comporte nicht, on la contredit avec Doch et non avec Ja.',
        de: 'Auf eine verneinte Frage widerspricht man im Deutschen mit Doch, nicht mit Ja.',
      },
      principle_i18n: {
        en: 'Use Doch (not Ja) to contradict a question containing nicht or kein.',
        fr: 'Répondez Doch (et non Ja) pour contredire une question négative.',
        de: 'Beantworte negative Fragen bei positivem Sachverhalt mit Doch.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'Yes/no questions put the conjugated verb in Position 1, followed immediately by the subject.',
      key_pattern: 'Conjugated Verb + Subject + ... + ?  (e.g., Kommst du mit?)',
      mistake_warning: 'Never add *tust/"do", and remember to reply with Doch (not Ja) to negative questions.',
      self_check: 'Turn "Ihr besucht heute eure Tante." into a yes/no question.',
    },
    fr: {
      central_rule: 'Dans une question fermée, le verbe conjugué est en position 1, suivi directement du sujet.',
      key_pattern: 'Verbe conjugué + Sujet + ... + ?  (ex. : Kommst du mit?)',
      mistake_warning: 'N’ajoutez jamais d’auxiliaire « faire » et répondez Doch (et non Ja) aux questions négatives.',
      self_check: 'Transformez en question : « Ihr besucht heute eure Tante. »',
    },
    de: {
      central_rule: 'In der Ja-/Nein-Frage steht das konjugierte Verb auf Position 1, direkt gefolgt vom Subjekt.',
      key_pattern: 'Konjugiertes Verb + Subjekt + ... + ?  (z. B. Kommst du mit?)',
      mistake_warning: 'Kein Hilfsverb wie *tust hinzufügen und verneinte Fragen positiv mit Doch beantworten.',
      self_check: 'Forme um zur Ja-/Nein-Frage: „Ihr besucht heute eure Tante.“',
    },
  },
  practice_mapping: [
    {
      id: 'a1-17-v1-formation',
      label_i18n: {
        en: 'Forming V1 yes/no questions from statements',
        fr: 'Formation de questions V1 à partir de phrases affirmatives',
        de: 'Ja-/Nein-Fragen mit Verb auf Position 1 bilden',
      },
      formats: ['transformation', 'sentence_construction', 'error_correction'],
    },
    {
      id: 'a1-17-ja-nein-doch',
      label_i18n: {
        en: 'Choosing between Ja, Nein, and Doch in replies',
        fr: 'Choisir entre Ja, Nein et Doch dans les réponses',
        de: 'Passende Antwort mit Ja, Nein oder Doch wählen',
      },
      formats: ['multiple_choice', 'gap_fill', 'matching'],
    },
  ],
};
