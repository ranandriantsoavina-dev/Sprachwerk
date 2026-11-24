import type { Lesson } from '../../types/domain';

export const LESSON_A1_07: Lesson = {
  id: 'a1-07',
  level: 'A1',
  unit: 7,
  title_en: 'Verb conjugation',
  title_de: 'Verbkonjugation',
  topic: 'Verb conjugation',
  hasContent: true,
  tags: ['verbkonjugation', 'praesens', 'kongruenz', 'stamm', 'endungen'],
  estimated_study_minutes: 14,
  prerequisite_knowledge_i18n: {
    en: 'Synthesizes Lessons A1-02 through A1-06 (personal pronouns, sein, haben, regular and stem-changing verbs).',
    fr: 'Synthétise les leçons A1-02 à A1-06 (pronoms personnels, sein, haben, verbes réguliers et à changement vocalique).',
    de: 'Fasst die Lektionen A1-02 bis A1-06 zusammen (Personalpronomen, sein, haben, regelmäßige und starke Verben).',
  },
  objectives: {
    en: 'Choose the right conjugation pattern for any A1 verb, match verb endings reliably to both pronoun and noun subjects, and conjugate the auxiliary verb werden.',
    fr: 'Choisir le bon modèle de conjugaison pour tout verbe A1, accorder le verbe avec un pronom ou un nom sujet, et conjuguer werden au présent.',
    de: 'Das passende Konjugationsmuster für jedes A1-Verb wählen, Subjekt und Verbform sicher abstimmen und das Verb werden im Präsens konjugieren.',
  },
  learning_objectives_i18n: {
    en: [
      'Classify A1 verbs into four present-tense conjugation groups: regular, stem-adjustment (-t/-d and -s/-ß/-z), stem-changing, and fully irregular (sein, haben, werden).',
      'Match noun subjects (singular vs. plural, compound subjects like Anna und Tim) to the correct verb ending.',
      'Conjugate werden (ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden) accurately.',
    ],
    fr: [
      'Classer les verbes A1 selon quatre profils au présent : réguliers, avec ajustement (-t/-d et -s/-ß/-z), à changement vocalique, et irréguliers (sein, haben, werden).',
      'Accorder correctement le verbe avec un sujet nominal (singulier, pluriel, ou double sujet comme Anna und Tim).',
      'Conjuguer werden au présent (ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden).',
    ],
    de: [
      'A1-Verben in vier Präsensgruppen einordnen: regelmäßig, mit Stammauslaut-Regel (-t/-d bzw. -s/-ß/-z), mit Vokalwechsel und unregelmäßig (sein, haben, werden).',
      'Die Verbform sicher an Nomen-Subjekte (Singular, Plural, mehrere Personen wie Anna und Tim) anpassen.',
      'Das Verb werden im Präsens konjugieren (ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden).',
    ],
  },
  introduction_i18n: {
    en: 'By now you have seen regular verbs, stem-changing verbs, sein, and haben. This consolidation unit puts the entire A1 present-tense conjugation system side by side—including how to handle noun subjects, polite Sie, and the third core irregular verb werden ("to become")—so you can conjugate confidently without guessing.',
    fr: 'Vous avez déjà découvert les verbes réguliers, les verbes à changement vocalique, sein et haben. Cette leçon de synthèse rassemble tout le système de conjugaison du présent au niveau A1 — y compris l’accord avec les sujets nominaux, la forme Sie et le verbe irrégulier werden (« devenir ») — pour automatiser vos réflexes.',
    de: 'Du kennst bereits regelmäßige Verben, Verben mit Vokalwechsel sowie sein und haben. Diese Überblickslektion bündelt das gesamte Konjugationssystem im Präsens auf A1-Niveau – inklusive Nomen-Subjekten, Höflichkeitsform Sie und dem Verb werden („to become“) –, damit du jede Verbform sicher bildest.',
  },
  explanation_i18n: {
    en: [
      '1. One unified agreement principle (Subjekt-Verb-Kongruenz)',
      'In German, the finite (conjugated) verb always agrees in person and number with the subject—never with an object. Before choosing an ending, ask: "Who or what is the subject?"',
      '• One person/thing (der Mann, die Tasche, das Kind, niemand, jeder) → 3rd person singular (-t or irregular singular: ist, hat, wird, fährt).',
      '• Two or more items or a plural noun (die Kinder, Anna und Max, meine Eltern) → 3rd person plural (-en, or sind/haben/werden).',
      '• You + someone else (Anna und ich) → 1st person plural (wir → -en).',
      '',
      '2. The 4 verb profiles in A1 Präsens',
      '• Profile 1 (Regular): machen → mache, machst, macht, machen, macht, machen.',
      '• Profile 2 (Orthographic adjustment): arbeiten (-e- before -st/-t) and heißen (no extra -s in du heißt).',
      '• Profile 3 (Vowel change in du & er/sie/es): sprechen (sprichst, spricht), lesen (liest), fahren (fährst, fährt).',
      '• Profile 4 (Core irregulars): sein (bin, bist, ist, sind, seid, sind), haben (habe, hast, hat, haben, habt, haben), and werden (werde, wirst, wird, werden, werdet, werden).',
      '',
      '3. Introducing werden ("to become / get")',
      'At A1, werden is used mostly with adjectives or professions ("Es wird kalt", "Ich werde Arzt"). Note that du wirst and er/sie/es wird change e → i and drop the -d- in du wirst and the -t ending in er wird.',
    ].join('\n'),
    fr: [
      '1. Un principe unique d’accord (Subjekt-Verb-Kongruenz)',
      'En allemand, le verbe conjugué s’accorde toujours en personne et en nombre avec le sujet — jamais avec le complément. Identifiez d’abord le sujet :',
      '• Un nom singulier ou un pronom indéfini comme niemand / jeder → 3e personne du singulier (-t ou forme irrégulière : ist, hat, wird, fährt).',
      '• Un nom pluriel ou plusieurs sujets reliés par und (die Kinder, Anna und Max) → 3e personne du pluriel (-en, sind/haben/werden).',
      '• Quelqu’un + ich (Anna und ich) → équivaut à wir (-en).',
      '',
      '2. Les 4 profils verbaux du présent (A1)',
      '• Profil 1 (Régulier) : machen → mache, machst, macht, machen, macht, machen.',
      '• Profil 2 (Ajustement phonétique/orthographique) : arbeiten (-e- devant -st/-t) et heißen (pas de -s supplémentaire à du heißt).',
      '• Profil 3 (Changement vocalique à du et er/sie/es) : sprechen (sprichst, spricht), lesen (liest), fahren (fährst, fährt).',
      '• Profil 4 (Irréguliers fondamentaux) : sein, haben et werden (werde, wirst, wird, werden, werdet, werden).',
      '',
      '3. Le verbe werden (« devenir »)',
      'Au niveau A1, werden s’emploie surtout avec un adjectif ou une profession (« Es wird kalt », « Ich werde Arzt »). À du wirst et er/sie/es wird, le e devient i et les terminaisons sont particulières.',
    ].join('\n'),
    de: [
      '1. Das Grundprinzip der Kongruenz',
      'Das konjugierte Verb richtet sich immer nach dem Subjekt des Satzes (nie nach dem Objekt). Frage zuerst nach dem Subjekt:',
      '• Ein einzelnes Nomen im Singular (der Mann, die Familie, das Kind) → 3. Person Singular (-t oder Sonderform: ist, hat, wird, fährt).',
      '• Ein Plural-Nomen oder zwei Subjekte mit und (die Kinder, Anna und Max) → 3. Person Plural (-en, sind, haben, werden).',
      '• Eine Person + ich (Anna und ich) → entspricht wir (-en).',
      '',
      '2. Die vier Verbtypen im A1-Präsens',
      '• Typ 1 (Regelmäßig): machen → mache, machst, macht, machen, macht, machen.',
      '• Typ 2 (Stammauslaut-Regel): arbeiten (Stütz-e vor -st/-t) und heißen (kein zusätzliches s bei du).',
      '• Typ 3 (Vokalwechsel bei du & er/sie/es): sprechen, lesen, fahren.',
      '• Typ 4 (Wichtige unregelmäßige Verben): sein, haben und werden (werde, wirst, wird, werden, werdet, werden).',
      '',
      '3. Das Verb werden',
      'Auf A1-Niveau benutzt man werden vor allem mit Adjektiven oder Berufen („Es wird kalt“, „Sie wird Ärztin“). Merke dir besonders du wirst und er/sie/es wird.',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-plural-matching',
      title: 'Kongruenz bei Nomen-Subjekten und Doppel-Subjekten',
      body: 'Singular-Nomen (meine Familie) → 3. Person Singular (-t); Plural oder „A und B“ → 3. Person Plural (-en); „A und ich“ → wir (-en).',
      title_i18n: {
        en: 'Watch collective singular nouns like die Familie',
        fr: 'Attention aux noms collectifs singuliers comme die Familie',
        de: 'Auf Sammelbegriffe im Singular achten (z. B. die Familie)',
      },
      body_i18n: {
        en: 'Collective nouns that look singular take singular verbs: "Meine Familie wohnt in Graz" (singular). Two linked nouns take plural verbs: "Anna und Tom wohnen in Graz" (plural).',
        fr: 'Un nom collectif singulier comme die Familie demande un verbe au singulier (« Meine Familie wohnt in Graz »). Deux sujets reliés par und demandent le pluriel (« Anna und Tom wohnen in Graz »).',
        de: 'Ein einzelnes Nomen wie die Familie steht im Singular und braucht -t („Meine Familie wohnt in Graz“). Zwei Personen mit und stehen im Plural („Anna und Tom wohnen in Graz“).',
      },
    },
    {
      id: 'rule-werden-forms',
      title: 'Präsens von werden',
      body: 'ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden.',
      title_i18n: {
        en: 'Present-tense conjugation of werden',
        fr: 'Conjugaison de werden au présent',
        de: 'Präsensformen von werden',
      },
      body_i18n: {
        en: 'Learn werden alongside sein and haben: ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden.',
        fr: 'Apprenez werden avec sein et haben : ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden.',
        de: 'Lerne werden direkt zu sein und haben dazu: ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden.',
      },
    },
  ],
  tables: [
    {
      id: 'table-conjugation-overview',
      title_i18n: {
        en: 'A1 Verb Conjugation Overview (Präsens)',
        fr: 'Vue d’ensemble de la conjugaison A1 (Präsens)',
        de: 'Gesamtübersicht der Verbkonjugation im Präsens (A1)',
      },
      columns_i18n: {
        en: ['Pronoun', 'machen (reg.)', 'arbeiten (-t)', 'sprechen (e→i)', 'sein', 'haben', 'werden'],
        fr: ['Pronom', 'machen (rég.)', 'arbeiten (-t)', 'sprechen (e→i)', 'sein', 'haben', 'werden'],
        de: ['Pronomen', 'machen (reg.)', 'arbeiten (-t)', 'sprechen (e→i)', 'sein', 'haben', 'werden'],
      },
      rows: [
        ['ich', 'mache', 'arbeite', 'spreche', 'bin', 'habe', 'werde'],
        ['du', 'machst', 'arbeitest', 'sprichst', 'bist', 'hast', 'wirst'],
        ['er / sie / es', 'macht', 'arbeitet', 'spricht', 'ist', 'hat', 'wird'],
        ['wir', 'machen', 'arbeiten', 'sprechen', 'sind', 'haben', 'werden'],
        ['ihr', 'macht', 'arbeitet', 'sprecht', 'seid', 'habt', 'werdet'],
        ['sie / Sie', 'machen', 'arbeiten', 'sprechen', 'sind', 'haben', 'werden'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Meine Familie wohnt in Basel, aber meine Freunde wohnen in Bern.',
      highlight: 'wohnt / wohnen',
      note: 'Singular collective noun (wohnt) vs. plural noun (wohnen)',
      translation_i18n: {
        en: 'My family lives in Basel, but my friends live in Bern.',
        fr: 'Ma famille habite à Bâle, mais mes amis habitent à Berne.',
        de: 'Meine Familie wohnt in Basel, aber meine Freunde wohnen in Bern.',
      },
      explanation_i18n: {
        en: 'die Familie is grammatically singular (wohnt), while die Freunde is plural (wohnen).',
        fr: 'die Familie est singulier (wohnt), alors que die Freunde est pluriel (wohnen).',
        de: 'die Familie ist Singular (wohnt), meine Freunde ist Plural (wohnen).',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Lukas und ich lernen zusammen für die Prüfung.',
      highlight: 'lernen',
      note: 'Compound subject including ich = wir (-en)',
      translation_i18n: {
        en: 'Lukas and I are studying together for the exam.',
        fr: 'Lukas et moi révisons ensemble pour l’examen.',
        de: 'Lukas und ich lernen zusammen für die Prüfung.',
      },
      explanation_i18n: {
        en: 'A subject of "someone + ich" equals wir, so the verb takes -en (lernen).',
        fr: 'Un sujet « quelqu’un + ich » équivaut à wir et prend la terminaison -en.',
        de: '„Lukas und ich“ entspricht wir; das Verb endet auf -en.',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Am Abend wird es schnell dunkel und kühl.',
      highlight: 'wird',
      note: '3rd person singular of werden (es wird)',
      translation_i18n: {
        en: 'In the evening it gets dark and cool quickly.',
        fr: 'Le soir, il fait vite sombre et frais.',
        de: 'Am Abend wird es schnell dunkel und kühl.',
      },
      explanation_i18n: {
        en: 'Uses es wird ("it becomes / gets") in Position 2 after Am Abend.',
        fr: 'Emploie es wird (« il devient / se fait ») en position 2 après Am Abend.',
        de: 'Verwendet es wird an Position 2 nach Am Abend.',
      },
    },
    {
      id: 'ex-4',
      sentence: 'Wirst du nächste Woche dreißig Jahre alt?',
      highlight: 'Wirst',
      note: '2nd person singular of werden in a yes/no question',
      translation_i18n: {
        en: 'Are you turning thirty next week?',
        fr: 'Vas-tu avoir trente ans la semaine prochaine ?',
        de: 'Wirst du nächste Woche dreißig Jahre alt?',
      },
      explanation_i18n: {
        en: 'Uses du wirst ("you are turning / becoming") in Position 1 for a question.',
        fr: 'Emploie du wirst en position 1 pour demander un changement d’âge.',
        de: 'Zeigt die unregelmäßige Form du wirst am Satzanfang.',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-subject-not-object',
      contrast_pair: 'Den Film findet meine Schwester gut.',
      title_i18n: {
        en: 'The verb agrees with the subject, even when another phrase comes first',
        fr: 'Le verbe s’accorde avec le sujet, même s’il n’est pas en tête de phrase',
        de: 'Das Verb richtet sich immer nach dem Subjekt, nicht nach dem ersten Satzglied',
      },
      body_i18n: {
        en: 'Even if an adverb or object opens the sentence ("Die Bücher liest mein Vater gern."), look for the nominative subject (mein Vater = singular → liest, not lesen!).',
        fr: 'Même si un complément pluriel commence la phrase (« Die Bücher liest mein Vater gern. »), le verbe s’accorde avec le sujet au nominatif (mein Vater → liest).',
        de: 'Auch wenn ein anderes Satzglied am Anfang steht („Die Bücher liest mein Vater gern“), bestimmt allein das Subjekt (mein Vater → liest) die Endung.',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Es wirdt heute sehr warm.',
      right: 'Es wird heute sehr warm.',
      explanation_i18n: {
        en: 'The 3rd person singular of werden is simply wird—there is no extra -t at the end.',
        fr: 'La 3e personne du singulier de werden est wird, sans -t final.',
        de: 'Die 3. Person Singular von werden heißt wird (ohne zusätzliches -t).',
      },
      principle_i18n: {
        en: 'Write du wirst and er/sie/es wird for werden.',
        fr: 'Écrivez du wirst et er/sie/es wird.',
        de: 'Merke dir: du wirst, er/sie/es wird.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Meine Familie wohnen in Hamburg.',
      right: 'Meine Familie wohnt in Hamburg.',
      explanation_i18n: {
        en: 'die Familie is a singular noun in German, so it takes the 3rd-person singular ending -t.',
        fr: 'die Familie est un nom singulier en allemand : il demande le verbe au singulier (wohnt).',
        de: 'das Wort Familie ist ein Nomen im Singular und braucht deshalb die Singularform wohnt.',
      },
      principle_i18n: {
        en: 'Match singular collective nouns (Familie, Gruppe, Klasse) with singular verb forms.',
        fr: 'Accordez les noms collectifs singuliers (Familie, Gruppe, Klasse) au singulier.',
        de: 'Sammelbegriffe im Singular (Familie, Gruppe) bekommen das Verb im Singular.',
      },
    },
    {
      id: 'cm-3',
      wrong: 'Paul und ich spreche gut Deutsch.',
      right: 'Paul und ich sprechen gut Deutsch.',
      explanation_i18n: {
        en: 'Paul und ich means "we" (wir), so the verb requires the plural ending -en, not -e.',
        fr: 'Paul und ich équivaut à « nous » (wir) : il faut donc sprechen et non spreche.',
        de: '„Paul und ich“ steht für wir; deshalb muss das Verb sprechen im Plural stehen.',
      },
      principle_i18n: {
        en: 'Treat "X und ich" as wir (-en).',
        fr: 'Considérez « X und ich » comme wir (-en).',
        de: '„X und ich“ entspricht immer wir (-en).',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'Conjugate every verb to match its nominative subject using one of four A1 patterns (regular, -t/-s adjustment, vowel shift, or sein/haben/werden).',
      key_pattern: 'werden: ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden.',
      mistake_warning: 'Do not write *er wirdt, and do not conjugate for ich when the subject is "Paul und ich" (= wir).',
      self_check: 'Choose the right verb form: "Meine Klasse ___ (sein) groß, und wir ___ (werden) bald fertig."',
    },
    fr: {
      central_rule: 'Chaque verbe s’accorde avec son sujet au nominatif selon l’un des 4 modèles A1 (régulier, ajustement -t/-s, alternance vocalique, ou sein/haben/werden).',
      key_pattern: 'werden : ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden.',
      mistake_warning: 'N’écrivez pas *er wirdt, et n’accordez pas avec ich quand le sujet est « Paul und ich » (= wir).',
      self_check: 'Complétez : « Meine Klasse ___ (sein) groß, und wir ___ (werden) bald fertig. »',
    },
    de: {
      central_rule: 'Jedes konjugierte Verb stimmt mit seinem Subjekt im Nominativ überein (4 Muster: regelmäßig, Stammauslaut, Vokalwechsel, sein/haben/werden).',
      key_pattern: 'werden: ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden.',
      mistake_warning: 'Schreibe nie *er wirdt und achte auf „X und ich“ (= wir) sowie Singular-Nomen wie Familie.',
      self_check: 'Ergänze: „Meine Klasse ___ (sein) groß, und wir ___ (werden) bald fertig.“',
    },
  },
  practice_mapping: [
    {
      id: 'a1-07-four-verb-profiles',
      label_i18n: {
        en: 'Conjugating across all four A1 verb profiles including werden',
        fr: 'Conjugaison des quatre profils verbaux A1, dont werden',
        de: 'Konjugation über alle vier A1-Verbtypen inklusive werden',
      },
      formats: ['multiple_choice', 'gap_fill', 'matching'],
    },
    {
      id: 'a1-07-noun-and-compound-subjects',
      label_i18n: {
        en: 'Subject-verb agreement with collective singulars and compound subjects (A und ich / A und B)',
        fr: 'Accord avec les noms collectifs et les sujets composés (A und ich / A und B)',
        de: 'Kongruenz bei Sammelbegriffen und zusammengesetzten Subjekten',
      },
      formats: ['gap_fill', 'error_correction', 'true_false'],
    },
  ],
};
