import type { Lesson } from '../../types/domain';

export const LESSON_A1_05: Lesson = {
  id: 'a1-05',
  level: 'A1',
  unit: 5,
  title_en: 'Regular verbs in the present tense',
  title_de: 'Regelmäßige Verben im Präsens',
  topic: 'Regular verbs in the present tense',
  hasContent: true,
  tags: ['praesens', 'regelmaessige-verben', 'verbendungen', 'stamm'],
  estimated_study_minutes: 15,
  prerequisite_knowledge_i18n: {
    en: 'Helpful to know nominative personal pronouns (Lesson A1-02).',
    fr: 'Utile de connaître les pronoms personnels sujets au nominatif (leçon A1-02).',
    de: 'Hilfreich sind die Personalpronomen im Nominativ (Lektion A1-02).',
  },
  objectives: {
    en: 'Conjugate regular German verbs in the present tense using stem + personal endings, apply the -e- and -s- adjustments, and talk about present and scheduled future actions.',
    fr: 'Conjuguer les verbes réguliers allemands au présent (radical + terminaisons), appliquer les ajustements en -e- et -s-, et parler du présent ou d’un futur proche.',
    de: 'Regelmäßige Verben im Präsens mit Verbstamm und Personalendungen konjugieren, Besonderheiten bei -t/-d und -s/-ß/-z beachten sowie über Gegenwart und nahe Zukunft sprechen.',
  },
  learning_objectives_i18n: {
    en: [
      'Separate a German infinitive into its stem and ending (-en / -n) and attach the six present-tense endings (-e, -st, -t, -en, -t, -en).',
      'Insert the linking -e- in du, er/sie/es, and ihr for stems ending in -t, -d, or heavy consonant clusters (arbeiten, finden, öffnen).',
      'Drop the extra -s- in the du-form for stems ending in -s, -ß, -z, or -x (heißen, reisen, tanzen).',
      'Use the German present tense (Präsens) for current habits, ongoing states, and planned near-future events with time words.',
    ],
    fr: [
      'Identifier le radical d’un verbe régulier (infinitif sans -en/-n) et ajouter les terminaisons du présent (-e, -st, -t, -en, -t, -en).',
      'Insérer le -e- intercalaire à du, er/sie/es et ihr pour les radicaux terminés par -t, -d ou certains groupes de consonnes (arbeiten, finden, öffnen).',
      'Supprimer le -s- supplémentaire à la 2e personne du singulier (du) quand le radical finit par -s, -ß, -z ou -x (heißen, reisen, tanzen).',
      'Employer le Präsens pour les actions actuelles, les habitudes et le futur proche accompagné d’un indicateur de temps.',
    ],
    de: [
      'Den Verbstamm vom Infinitiv (-en / -n) abtrennen und die Präsensendungen (-e, -st, -t, -en, -t, -en) anhängen.',
      'Bei Stämmen auf -t, -d oder Konsonantengruppen (arbeiten, finden, öffnen) das Stütz-e bei du, er/sie/es und ihr einsetzen.',
      'Bei Stämmen auf -s, -ß, -z oder -x (heißen, reisen, tanzen) in der du-Form das -s weglassen.',
      'Das Präsens für Gegenwart, Gewohnheiten und geplante Zukunft mit Zeitangabe verwenden.',
    ],
  },
  introduction_i18n: {
    en: 'Most German verbs are regular in the present tense (Präsens). Once you learn one clean set of six personal endings, you can conjugate hundreds of everyday verbs such as lernen, wohnen, kaufen, machen, and arbeiten—and express both what is happening now and what you plan to do tomorrow.',
    fr: 'La grande majorité des verbes allemands sont réguliers au présent (Präsens). Dès que vous maîtrisez une seule série de six terminaisons, vous savez conjuguer des centaines de verbes courants comme lernen, wohnen, kaufen, machen ou arbeiten, aussi bien pour le présent que pour le futur proche.',
    de: 'Die meisten deutschen Verben sind im Präsens regelmäßig. Mit einer einzigen Reihe aus sechs Personalendungen kannst du Hunderte Alltagswörter wie lernen, wohnen, kaufen, machen und arbeiten richtig beugen – sowohl für die Gegenwart als auch für geplante Handlungen in der Zukunft.',
  },
  explanation_i18n: {
    en: [
      '1. How to form the present tense of regular verbs',
      'Start with the dictionary form (infinitive), which almost always ends in -en (lernen, wohnen) or occasionally -n (wandern, klingeln). Remove -en to find the verb stem (lern-, wohn-), then attach the personal ending matching the subject:',
      'ich → -e | du → -st | er/sie/es → -t | wir → -en | ihr → -t | sie/Sie → -en.',
      '',
      '2. Two important spelling and pronunciation adjustments',
      '• Stems ending in -t, -d, or consonant + m/n (like arbeiten, antworten, finden, öffnen, regnen): To make the verb pronounceable, insert an extra -e- before -st and -t: du arbeitest, er arbeitet, ihr arbeitet.',
      '• Stems ending in -s, -ß, -z, -tz, or -x (like heißen, reisen, tanzen, sitzen): Because the stem already ends in an s-sound, du takes only -t instead of -st: du heißt, du reist, du tanzt. As a result, du and er/sie/es look identical (du heißt / sie heißt).',
      '• Verbs ending in -eln / -ern (wandern, sammeln): wir/sie/Sie take -n (wir wandern), and -eln verbs usually drop the stem -e- in ich (ich sammle).',
      '',
      '3. What Präsens expresses',
      'German has no separate "-ing" continuous form: "Ich lerne Deutsch" means both "I learn German" and "I am learning German." With a time expression, Präsens also expresses the future: "Morgen kaufe ich ein Buch."',
    ].join('\n'),
    fr: [
      '1. Former le présent des verbes réguliers',
      'Partez de l’infinitif (qui se termine presque toujours par -en comme lernen, wohnen, parfois par -n comme wandern). Retirez -en pour obtenir le radical (lern-, wohn-), puis ajoutez la terminaison correspondant au sujet :',
      'ich → -e | du → -st | er/sie/es → -t | wir → -en | ihr → -t | sie/Sie → -en.',
      '',
      '2. Deux ajustements orthographiques et phonétiques réguliers',
      '• Radicaux en -t, -d ou consonne + m/n (arbeiten, antworten, finden, öffnen, regnen) : pour faciliter la prononciation, on ajoute un -e- intercalaire devant -st et -t : du arbeitest, er arbeitet, ihr arbeitet.',
      '• Radicaux en -s, -ß, -z, -tz ou -x (heißen, reisen, tanzen, sitzen) : comme le radical se termine déjà par un son [s], du ne prend que -t au lieu de -st : du heißt, du reist, du tanzt. Les formes de du et de er/sie/es deviennent donc identiques.',
      '• Verbes en -eln / -ern (wandern, sammeln) : wir/sie/Sie prennent -n (wir wandern), et les verbes en -eln perdent souvent le -e- du radical à ich (ich sammle).',
      '',
      '3. Valeurs du Präsens',
      'L’allemand ne possède pas de forme progressive spécifique : « Ich lerne Deutsch » traduit aussi bien « j’apprends l’allemand » que « je suis en train d’apprendre l’allemand ». Avec un repère temporel, le Präsens exprime aussi le futur proche : « Morgen kaufe ich ein Buch. »',
    ].join('\n'),
    de: [
      '1. Bildung des Präsens bei regelmäßigen Verben',
      'Man nimmt den Infinitiv (fast immer auf -en wie lernen, wohnen; selten auf -n wie wandern), streicht -en und erhält den Verbstamm (lern-, wohn-). Daran hängt man die Personalendung:',
      'ich → -e | du → -st | er/sie/es → -t | wir → -en | ihr → -t | sie/Sie → -en.',
      '',
      '2. Wichtige Besonderheiten am Stammende',
      '• Stamm auf -t, -d oder Konsonant + m/n (arbeiten, antworten, finden, öffnen, regnen): Für eine klare Aussprache schiebt man bei du, er/sie/es und ihr ein -e- ein: du arbeitest, er arbeitet, ihr arbeitet.',
      '• Stamm auf -s, -ß, -z, -tz oder -x (heißen, reisen, tanzen, sitzen): Bei du entfällt das s der Endung; du bekommst nur -t: du heißt, du reist, du tanzt. Dadurch sind die du-Form und die er/sie/es-Form gleich.',
      '• Verben auf -eln / -ern (wandern, sammeln): wir/sie/Sie enden nur auf -n (wir wandern); bei -eln entfällt bei ich meist das e im Stamm (ich sammle).',
      '',
      '3. Bedeutung des Präsens',
      'Das Präsens drückt aktuelle Handlungen, Gewohnheiten und Fakten aus („Ich wohne in Köln“). Mit einer Zeitangabe beschreibt es oft auch die Zukunft („Morgen besuche ich meine Tante“).',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-regular-endings',
      title: 'Standardendungen: -e, -st, -t, -en, -t, -en',
      body: 'Verbstamm + -e (ich), -st (du), -t (er/sie/es), -en (wir), -t (ihr), -en (sie/Sie).',
      title_i18n: {
        en: 'Standard personal endings: -e, -st, -t, -en, -t, -en',
        fr: 'Terminaisons standard : -e, -st, -t, -en, -t, -en',
        de: 'Standardendungen: -e, -st, -t, -en, -t, -en',
      },
      body_i18n: {
        en: 'Notice that er/sie/es and ihr share -t (er lernt, ihr lernt), while wir, sie (plural), and Sie share -en (and match the infinitive).',
        fr: 'Notez que er/sie/es et ihr prennent tous deux -t (er lernt, ihr lernt), tandis que wir, sie (pluriel) et Sie prennent -en (identique à l’infinitif).',
        de: 'er/sie/es und ihr haben dieselbe Endung -t (er lernt, ihr lernt); wir, sie und Sie haben -en wie der Infinitiv.',
      },
    },
    {
      id: 'rule-linking-e',
      title: 'Stütz-e nach -t, -d oder Konsonant + m/n',
      body: 'Bei arbeiten, finden, öffnen steht ein -e- vor -st und -t: du arbeitest, er arbeitet, ihr arbeitet.',
      title_i18n: {
        en: 'Linking -e- after -t, -d, or consonant + m/n',
        fr: 'Ajout d’un -e- intercalaire après -t, -d ou consonne + m/n',
        de: 'Einschub von -e- nach -t, -d oder Konsonant + m/n',
      },
      body_i18n: {
        en: 'Verbs like arbeiten, warten, finden, antworten, and öffnen insert -e- before -st and -t: du findest, er antwortet, ihr öffnet.',
        fr: 'Les verbes comme arbeiten, warten, finden, antworten et öffnen ajoutent -e- devant -st et -t : du findest, er antwortet, ihr öffnet.',
        de: 'Bei Verben wie arbeiten, warten, finden, antworten oder öffnen steht vor -st und -t ein -e-: du findest, er antwortet, ihr öffnet.',
      },
    },
    {
      id: 'rule-s-sound-drop',
      title: 'Kein extra -s bei du nach -s, -ß, -z, -x',
      body: 'heißen → du heißt, tanzen → du tanzt, reisen → du reist.',
      title_i18n: {
        en: 'Drop -s in du-form after -s, -ß, -z, -tz, -x',
        fr: 'Suppression du -s à du après -s, -ß, -z, -tz, -x',
        de: 'Kein zweites -s bei du nach -s, -ß, -z, -tz, -x',
      },
      body_i18n: {
        en: 'When a stem already ends in an s-sound, add only -t for du: du heißt, du reist, du tanzt, du sitzt.',
        fr: 'Si le radical finit déjà par un son [s], on ajoute seulement -t à du : du heißt, du reist, du tanzt, du sitzt.',
        de: 'Endet der Verbstamm auf -s, -ß, -z, -tz oder -x, erhält du nur -t: du heißt, du reist, du tanzt, du sitzt.',
      },
    },
  ],
  tables: [
    {
      id: 'table-regular-verbs',
      title_i18n: {
        en: 'Present Tense Conjugation of Regular Verbs',
        fr: 'Conjugaison des verbes réguliers au présent',
        de: 'Präsens-Konjugation regelmäßiger Verben',
      },
      columns_i18n: {
        en: ['Pronoun', 'Ending', 'lernen (standard)', 'arbeiten (-t stem)', 'heißen (-ß stem)'],
        fr: ['Pronom', 'Terminaison', 'lernen (standard)', 'arbeiten (radical -t)', 'heißen (radical -ß)'],
        de: ['Pronomen', 'Endung', 'lernen (Standard)', 'arbeiten (-t-Stamm)', 'heißen (-ß-Stamm)'],
      },
      rows: [
        ['ich', '-e', 'lerne', 'arbeite', 'heiße'],
        ['du', '-st (-t)', 'lernst', 'arbeitest', 'heißt'],
        ['er / sie / es', '-t', 'lernt', 'arbeitet', 'heißt'],
        ['wir', '-en', 'lernen', 'arbeiten', 'heißen'],
        ['ihr', '-t', 'lernt', 'arbeitet', 'heißt'],
        ['sie / Sie', '-en', 'lernen', 'arbeiten', 'heißen'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Ich lerne jeden Tag zwanzig Minuten Deutsch.',
      highlight: 'lerne',
      note: '1st person singular (-e)',
      translation_i18n: {
        en: 'I study German for twenty minutes every day.',
        fr: 'J’étudie l’allemand vingt minutes chaque jour.',
        de: 'Ich lerne jeden Tag zwanzig Minuten Deutsch.',
      },
      explanation_i18n: {
        en: 'Regular stem lern- + -e for ich.',
        fr: 'Radical régulier lern- + -e pour ich.',
        de: 'Regelmäßiger Stamm lern- + -e bei ich.',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Wie heißt du und wo wohnst du jetzt?',
      highlight: 'heißt / wohnst',
      note: '-ß stem takes -t (heißt); regular stem takes -st (wohnst)',
      translation_i18n: {
        en: 'What is your name and where do you live now?',
        fr: 'Comment t’appelles-tu et où habites-tu maintenant ?',
        de: 'Wie heißt du und wo wohnst du jetzt?',
      },
      explanation_i18n: {
        en: 'Contrasts heißen (drops -s in du heißt) with wohnen (standard du wohnst).',
        fr: 'Oppose heißen (du heißt, sans second s) à wohnen (du wohnst).',
        de: 'Vergleicht heißen (du heißt ohne zusätzliches s) mit wohnen (du wohnst).',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Meine Kollegin arbeitet am Samstag bis vierzehn Uhr.',
      highlight: 'arbeitet',
      note: 'Stem ending in -t inserts -e- (arbeitet)',
      translation_i18n: {
        en: 'My colleague works until two p.m. on Saturday.',
        fr: 'Ma collègue travaille le samedi jusqu’à quatorze heures.',
        de: 'Meine Kollegin arbeitet am Samstag bis vierzehn Uhr.',
      },
      explanation_i18n: {
        en: '3rd person singular adds -et to arbeit- for pronounceability.',
        fr: 'La 3e personne du singulier ajoute -et à arbeit- pour faciliter la prononciation.',
        de: 'Bei arbeiten steht in der 3. Person Singular ein Stütz-e: arbeitet.',
      },
    },
    {
      id: 'ex-4',
      sentence: 'Am Sonntag wandern wir durch den Wald.',
      highlight: 'wandern',
      note: '-ern verb takes -n in wir',
      translation_i18n: {
        en: 'On Sunday we hike through the forest.',
        fr: 'Dimanche, nous faisons une randonnée dans la forêt.',
        de: 'Am Sonntag wandern wir durch den Wald.',
      },
      explanation_i18n: {
        en: 'Verbs in -ern keep the -n ending in wir/sie/Sie without adding -en.',
        fr: 'Les verbes en -ern gardent simplement -n à wir/sie/Sie.',
        de: 'Verben auf -ern enden bei wir/sie/Sie auf -n (wandern).',
      },
    },
    {
      id: 'ex-5',
      sentence: 'Kinder, öffnet bitte die Hefte und antwortet auf die Frage!',
      highlight: 'öffnet / antwortet',
      note: 'ihr-form with linking -e-',
      translation_i18n: {
        en: 'Children, please open your notebooks and answer the question!',
        fr: 'Les enfants, ouvrez vos cahiers et répondez à la question !',
        de: 'Kinder, öffnet bitte die Hefte und antwortet auf die Frage!',
      },
      explanation_i18n: {
        en: 'Both öffnen (-fn-) and antworten (-t) require -et in the 2nd person plural (ihr) and plural imperative.',
        fr: 'öffnen (-fn-) et antworten (-t) prennent -et à la 2e personne du pluriel.',
        de: 'öffnen und antworten brauchen in der 2. Person Plural das Stütz-e (-et).',
      },
    },
    {
      id: 'ex-6',
      sentence: 'Morgen kaufen wir frisches Brot beim Bäcker.',
      highlight: 'kaufen',
      note: 'Präsens with time adverb expressing planned future',
      translation_i18n: {
        en: 'Tomorrow we are buying fresh bread at the bakery.',
        fr: 'Demain, nous achetons (achèterons) du pain frais à la boulangerie.',
        de: 'Morgen kaufen wir frisches Brot beim Bäcker.',
      },
      explanation_i18n: {
        en: 'Uses the present tense with morgen to express a planned future action.',
        fr: 'Emploie le présent avec morgen pour exprimer un futur planifié.',
        de: 'Drückt mit morgen eine geplante Handlung in der Zukunft im Präsens aus.',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-no-progressive',
      contrast_pair: 'ich lerne  =  I learn / I am learning',
      title_i18n: {
        en: 'No separate "-ing" form in German',
        fr: 'Pas de forme progressive « être en train de » obligatoire',
        de: 'Keine eigene Verlaufsform wie im Englischen',
      },
      body_i18n: {
        en: 'Never translate "I am working" with *Ich bin arbeiten or *Ich bin arbeitend. German simply uses the standard present tense: "Ich arbeite" (add gerade if you want to emphasize "right now": "Ich arbeite gerade").',
        fr: 'Ne traduisez jamais « I am working » par *Ich bin arbeiten. L’allemand utilise simplement le Präsens : « Ich arbeite » (ou « Ich arbeite gerade » pour « en ce moment »).',
        de: 'Für laufende Handlungen nutzt das Deutsche das normale Präsens („Ich arbeite“ oder mit gerade: „Ich arbeite gerade“).',
      },
    },
    {
      id: 'contrast-present-future',
      contrast_pair: 'Präsens + Zeitangabe  =  Future meaning',
      title_i18n: {
        en: 'Expressing the near future with Präsens',
        fr: 'Exprimer le futur proche avec le Präsens',
        de: 'Zukunft mit dem Präsens ausdrücken',
      },
      body_i18n: {
        en: 'In everyday German, scheduled future plans usually use Präsens plus a time word rather than Futur I: "Nächste Woche reisen wir nach Wien."',
        fr: 'Dans la langue courante, on emploie le plus souvent le Präsens avec un indicateur temporel pour le futur : « Nächste Woche reisen wir nach Wien. »',
        de: 'Im Alltag nutzt man für zukünftige Pläne meist das Präsens mit einer Zeitangabe: „Nächste Woche reisen wir nach Wien.“',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Ich bin lernen Deutsch.',
      right: 'Ich lerne Deutsch.',
      explanation_i18n: {
        en: 'German does not combine sein + infinitive to form a progressive tense.',
        fr: 'L’allemand ne forme pas le présent continu avec sein + infinitif.',
        de: 'Im Deutschen bildet man die Gegenwart ohne sein + Infinitiv direkt mit dem konjugierten Verb.',
      },
      principle_i18n: {
        en: 'Use the single conjugated present-tense verb for both simple and ongoing actions.',
        fr: 'Utilisez simplement le verbe conjugué au Präsens.',
        de: 'Verwende einfach das konjugierte Verb im Präsens.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Wie heißst du?',
      right: 'Wie heißt du?',
      explanation_i18n: {
        en: 'Because the stem heiß- already ends in ß, the du-ending drops the s and becomes -t.',
        fr: 'Le radical heiß- se termine déjà par ß : la terminaison de du perd donc son s et devient -t.',
        de: 'Nach einem Stamm auf -ß entfällt das s der du-Endung: richtig ist heißt.',
      },
      principle_i18n: {
        en: 'Stems ending in -s, -ß, -z, or -x take -t (not -st) with du.',
        fr: 'Après un radical en -s, -ß, -z ou -x, du prend seulement -t.',
        de: 'Stämme auf -s, -ß, -z oder -x erhalten bei du nur -t.',
      },
    },
    {
      id: 'cm-3',
      wrong: 'Er arbeitt heute im Büro.',
      right: 'Er arbeitet heute im Büro.',
      explanation_i18n: {
        en: 'Stems ending in -t or -d require a linking -e- before the -t ending.',
        fr: 'Les radicaux en -t ou -d exigent un -e- de liaison devant -t.',
        de: 'Nach Stämmen auf -t oder -d braucht man vor -t ein Stütz-e.',
      },
      principle_i18n: {
        en: 'Insert -e- before -st and -t for stems ending in -t or -d (du arbeitest, er arbeitet).',
        fr: 'Ajoutez -e- devant -st et -t après -t ou -d (du arbeitest, er arbeitet).',
        de: 'Schiebe bei -t/-d-Stämmen ein -e- vor -st und -t ein.',
      },
    },
    {
      id: 'cm-4',
      wrong: 'Meine Freunde wohnt in Zürich.',
      right: 'Meine Freunde wohnen in Zürich.',
      explanation_i18n: {
        en: 'Meine Freunde is plural ("they"), so the verb takes the plural ending -en, not singular -t.',
        fr: 'Meine Freunde est au pluriel (« ils ») : le verbe prend la terminaison -en et non -t.',
        de: 'Meine Freunde steht im Plural; deshalb endet das Verb auf -en, nicht auf -t.',
      },
      principle_i18n: {
        en: 'Match plural noun subjects (die Kinder, meine Freunde) with the -en ending.',
        fr: 'Accordez les sujets au pluriel avec la terminaison -en.',
        de: 'Plural-Subjekte verlangen immer die Endung -en.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'Regular present tense = verb stem + -e, -st, -t, -en, -t, -en.',
      key_pattern: 'Insert -e- after -t/-d stems (er arbeitet); drop -s in du after -s/-ß/-z/-x (du heißt).',
      mistake_warning: 'Never translate "I am + -ing" using *ich bin + verb, and check whether noun subjects are singular or plural.',
      self_check: 'Conjugate arbeiten and tanzen for ich, du, er, and ihr.',
    },
    fr: {
      central_rule: 'Présent régulier = radical + -e, -st, -t, -en, -t, -en.',
      key_pattern: 'Ajoutez -e- après -t/-d (er arbeitet) ; supprimez -s à du après -s/-ß/-z/-x (du heißt).',
      mistake_warning: 'Ne traduisez jamais « être en train de » par *ich bin + verbe, et vérifiez si le sujet nominal est singulier ou pluriel.',
      self_check: 'Conjuguez arbeiten et tanzen à ich, du, er et ihr.',
    },
    de: {
      central_rule: 'Regelmäßiges Präsens = Verbstamm + -e, -st, -t, -en, -t, -en.',
      key_pattern: 'Stütz-e nach -t/-d (er arbeitet); kein zusätzliches s bei du nach -s/-ß/-z/-x (du heißt).',
      mistake_warning: 'Bilde das Präsens nie mit *ich bin + Infinitiv und prüfe bei Nomen-Subjekten immer Singular vs. Plural.',
      self_check: 'Konjugiere arbeiten und tanzen für ich, du, er und ihr.',
    },
  },
  practice_mapping: [
    {
      id: 'a1-05-standard-endings',
      label_i18n: {
        en: 'Attaching regular present-tense endings (-e, -st, -t, -en, -t, -en)',
        fr: 'Ajout des terminaisons régulières du présent (-e, -st, -t, -en, -t, -en)',
        de: 'Regelmäßige Präsensendungen (-e, -st, -t, -en, -t, -en) anwenden',
      },
      formats: ['multiple_choice', 'gap_fill', 'matching'],
    },
    {
      id: 'a1-05-linking-e-and-s-drop',
      label_i18n: {
        en: 'Applying the linking -e- (-t/-d stems) and -s drop (-s/-ß/-z/-x stems)',
        fr: 'Application du -e- intercalaire (-t/-d) et de la perte du -s (-s/-ß/-z/-x)',
        de: 'Stütz-e bei -t/-d-Stämmen und Wegfall des -s bei -s/-ß/-z/-x-Stämmen',
      },
      formats: ['gap_fill', 'error_correction', 'multiple_choice'],
    },
    {
      id: 'a1-05-subject-verb-agreement',
      label_i18n: {
        en: 'Subject-verb agreement with noun subjects and avoiding *bin + infinitive',
        fr: 'Accord sujet-verbe avec des noms et emploi direct du Präsens',
        de: 'Subjekt-Verb-Kongruenz bei Nomen-Subjekten',
      },
      formats: ['error_correction', 'true_false', 'translation'],
    },
  ],
};
