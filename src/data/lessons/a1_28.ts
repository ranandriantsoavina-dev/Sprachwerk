import type { Lesson } from '../../types/domain';

export const LESSON_A1_28: Lesson = {
  id: 'a1-28',
  level: 'A1',
  unit: 28,
  title_en: 'Connecting main clauses',
  title_de: 'Hauptsatzverbindungen',
  topic: 'Connecting main clauses',
  hasContent: true,
  tags: ['hauptsatzverbindungen', 'konjunktionaladverbien', 'dann-deshalb', 'position-0-vs-1'],
  estimated_study_minutes: 15,
  prerequisite_knowledge_i18n: {
    en: 'Directly compares with Position-0 conjunctions (A1-27) and V2 inversion (A1-19).',
    fr: 'S’appuie directement sur les conjonctions en position 0 (A1-27) et l’inversion V2 (A1-19).',
    de: 'Baut direkt auf den Position-0-Konjunktionen (A1-27) und der V2-Inversion (A1-19) auf.',
  },
  objectives: {
    en: 'Connect two main clauses smoothly using connecting adverbs (Konjunktionaladverbien) such as dann, danach, deshalb, and trotzdem, placing them in Position 1 with immediate subject-verb inversion.',
    fr: 'Relier deux propositions principales avec des adverbes de liaison (dann, danach, deshalb, trotzdem) en position 1 suivis directement de l’inversion verbe-sujet.',
    de: 'Zwei Hauptsätze mit Konjunktionaladverbien wie dann, danach, deshalb und trotzdem verknüpfen und auf Position 1 sofort das konjugierte Verb (mit Inversion) folgen lassen.',
  },
  learning_objectives_i18n: {
    en: [
      'Use common A1 clause-connecting adverbs to show sequence (zuerst, dann, danach), consequence (deshalb), and unexpected contrast (trotzdem).',
      'Contrast Position-0 conjunctions (und, aber, oder, denn → Subject + Verb) with Position-1 connecting adverbs (dann, danach, deshalb, trotzdem → Verb + Subject).',
      'Link clauses using either a period or a comma + und before the connecting adverb ("... und dann gehe ich...").',
    ],
    fr: [
      'Employer les connecteurs adverbiaux courants pour la chronologie (zuerst, dann, danach), la conséquence (deshalb) et l’opposition (trotzdem).',
      'Opposer les conjonctions en position 0 (und, aber, oder, denn → Sujet + Verbe) aux adverbes en position 1 (dann, danach, deshalb, trotzdem → Verbe + Sujet).',
      'Enchaîner deux propositions avec un point ou avec und devant l’adverbe (« ... und dann gehe ich... »).',
    ],
    de: [
      'Wichtige Konjunktionaladverbien nutzen: zuerst, dann, danach (Abfolge), deshalb (Folge) und trotzdem (Gegensatz).',
      'Position-0-Konjunktionen (und, aber, oder, denn → Subjekt + Verb) von Position-1-Adverbien (dann, danach, deshalb, trotzdem → Verb + Subjekt) klar unterscheiden.',
      'Sätze sauber mit Punkt oder mit „und dann / und deshalb“ verbinden.',
    ],
  },
  introduction_i18n: {
    en: 'Once you know und, aber, oder, and denn (Position 0), the next big step in German storytelling and daily conversation is connecting sentences with words like dann (then), danach (afterwards), deshalb (therefore), and trotzdem (nevertheless). Unlike Position-0 conjunctions, these words count as Position 1, so the conjugated verb follows immediately!',
    fr: 'Après und, aber, oder et denn (position 0), l’étape suivante pour raconter ou argumenter consiste à utiliser des adverbes de liaison comme dann (ensuite), danach (après cela), deshalb (c’est pourquoi) et trotzdem (malgré tout). Contrairement aux conjonctions de position 0, ces mots occupent la position 1 : le verbe suit tout de suite !',
    de: 'Um Abläufe und Zusammenhänge flüssig zu erzählen, nutzt das Deutsche Konjunktionaladverbien wie dann, danach, deshalb oder trotzdem. Im Unterschied zu und, aber, oder, denn stehen sie selbst auf Position 1 – direkt danach kommt also sofort das konjugierte Verb.',
  },
  explanation_i18n: {
    en: [
      '1. Position-1 connectors (Konjunktionaladverbien)',
      'Words like zuerst (first), dann (then), danach (after that), später (later), deshalb / darum (that’s why / therefore), and trotzdem (even so / nevertheless) are adverbs, NOT Position-0 conjunctions. When they start a main clause, they occupy Position 1:',
      '• Clause 1. [Pos. 1: Dann / Deshalb / Trotzdem] + [Pos. 2: Verb] + [Pos. 3: Subject] + Rest.',
      '• Example: "Ich habe morgen eine Prüfung. Deshalb (1) lerne (2) ich (3) heute Abend."',
      '',
      '2. Combining und + Position-1 adverb',
      'You can also put und (Position 0) right before dann or deshalb (Position 1):',
      '• "Zuerst frühstücke ich, und (0) dann (1) fahre (2) ich (3) zur Arbeit."',
      'Because und is Position 0, dann still fills Position 1 and forces inversion (fahre ich).',
      '',
      '3. Logic flip: denn (reason) vs. deshalb (result)',
      '• Reason (why): "Ich nehme einen Schirm mit, denn es regnet."',
      '• Result (therefore): "Es regnet. Deshalb nehme ich einen Schirm mit."',
    ].join('\n'),
    fr: [
      '1. Les connecteurs en Position 1 (adverbes de liaison)',
      'Des mots comme zuerst (d’abord), dann (ensuite), danach (après), deshalb (c’est pourquoi) et trotzdem (pourtant/quand même) sont des adverbes qui prennent la position 1 en début de phrase :',
      '• Phrase 1. [Pos. 1 : Dann / Deshalb / Trotzdem] + [Pos. 2 : Verbe] + [Pos. 3 : Sujet] + Suite.',
      '• Exemple : « Ich habe morgen eine Prüfung. Deshalb (1) lerne (2) ich (3) heute Abend. »',
      '',
      '2. Combinaison und + adverbe en Position 1',
      'On peut enchaîner und (position 0) suivi de dann ou deshalb (position 1) :',
      '• « Zuerst frühstücke ich und (0) dann (1) fahre (2) ich (3) zur Arbeit. »',
      '',
      '3. Inversion de logique : denn (cause) vs deshalb (conséquence)',
      '• Cause : « Ich nehme einen Schirm mit, denn es regnet. »',
      '• Conséquence : « Es regnet. Deshalb nehme ich einen Schirm mit. »',
    ].join('\n'),
    de: [
      '1. Satzverbindungen auf Position 1 (Konjunktionaladverbien)',
      'Wörter wie zuerst, dann, danach, später, deshalb (darum) und trotzdem besetzen am Satzanfang selbst Position 1:',
      '• Satz 1. [Pos. 1: Dann / Deshalb / Trotzdem] + [Pos. 2: Verb] + [Pos. 3: Subjekt] + Rest.',
      '• Beispiel: „Ich habe morgen eine Prüfung. Deshalb (1) lerne (2) ich (3) heute Abend.“',
      '',
      '2. Kombination: und (Position 0) + dann / deshalb (Position 1)',
      'Nach und auf Position 0 kann direkt dann oder deshalb auf Position 1 folgen – das Verb bleibt vor dem Subjekt:',
      '• „Zuerst frühstücke ich und (0) dann (1) fahre (2) ich (3) zur Arbeit.“',
      '',
      '3. Perspektivwechsel: denn (Grund) vs. deshalb (Folge)',
      '• Grund: „Ich nehme einen Schirm mit, denn es regnet.“',
      '• Folge: „Es regnet. Deshalb nehme ich einen Schirm mit.“',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-pos1-adverb-inversion',
      title: 'dann, danach, deshalb, trotzdem stehen auf Position 1 → Verb folgt sofort',
      body: 'Stehen diese Wörter am Satzanfang, folgt sofort das konjugierte Verb (Position 2) und erst danach das Subjekt.',
      title_i18n: {
        en: 'dann, danach, deshalb, trotzdem fill Position 1 → Verb follows immediately',
        fr: 'dann, danach, deshalb, trotzdem occupent la position 1 → le verbe suit aussitôt',
        de: 'dann, danach, deshalb, trotzdem stehen auf Position 1 → Verb folgt sofort',
      },
      body_i18n: {
        en: 'Do not use a comma after Deshalb or Dann, and never put the subject directly after them (*Deshalb ich bleibe... is wrong; write Deshalb bleibe ich...).',
        fr: 'Ne mettez pas de virgule après Deshalb ou Dann, et placez le verbe avant le sujet (Deshalb bleibe ich...).',
        de: 'Nach Deshalb oder Dann kein Komma setzen und immer Verb vor Subjekt stellen (Deshalb bleibe ich...).',
      },
    },
    {
      id: 'rule-pos0-vs-pos1-contrast',
      title: 'Position 0 (und, aber, oder, denn) vs. Position 1 (dann, deshalb, trotzdem)',
      body: 'Position-0-Wörter ändern nichts am Satzbau; Position-1-Wörter lösen die Umstellung von Subjekt und Verb aus.',
      title_i18n: {
        en: 'Position 0 (und, aber, oder, denn) vs. Position 1 (dann, deshalb, trotzdem)',
        fr: 'Position 0 (und, aber, oder, denn) vs Position 1 (dann, deshalb, trotzdem)',
        de: 'Position 0 (und, aber, oder, denn) vs. Position 1 (dann, deshalb, trotzdem)',
      },
      body_i18n: {
        en: 'You can also place dann/deshalb/trotzdem after the verb instead of Position 1: "Ich bleibe deshalb zu Hause."',
        fr: 'On peut aussi placer dann/deshalb/trotzdem après le verbe : « Ich bleibe deshalb zu Hause. »',
        de: 'Alternativ können dann, deshalb und trotzdem auch hinter dem Verb stehen: „Ich bleibe deshalb zu Hause.“',
      },
    },
  ],
  tables: [
    {
      id: 'tbl-pos0-vs-pos1',
      title_i18n: {
        en: 'Position-0 conjunctions vs. Position-1 connecting adverbs',
        fr: 'Conjonctions en Position 0 vs Adverbes de liaison en Position 1',
        de: 'Position-0-Konjunktionen vs. Position-1-Adverbien',
      },
      columns_i18n: {
        en: ['Connector', 'Slot', 'Function', 'Word order after it'],
        fr: ['Connecteur', 'Position', 'Sens', 'Ordre des mots après'],
        de: ['Konnektor', 'Position', 'Funktion', 'Wortstellung danach'],
      },
      rows: [
        ['und, aber, oder, denn', 'Pos. 0', 'and, but, or, because', 'Subject + Verb (no inversion)'],
        ['zuerst, dann, danach', 'Pos. 1', 'first, then, afterwards', 'Verb + Subject (inversion)'],
        ['deshalb (darum)', 'Pos. 1', 'therefore / so', 'Verb + Subject (inversion)'],
        ['trotzdem', 'Pos. 1', 'nevertheless / even so', 'Verb + Subject (inversion)'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Zuerst frühstücke ich in Ruhe, danach fahre ich mit dem Fahrrad zur Arbeit.',
      highlight: 'Zuerst frühstücke ich | danach fahre ich',
      note: 'Sequence connectors in Position 1 triggering inversion',
      translation_i18n: {
        en: 'First I eat breakfast calmly, afterwards I ride my bike to work.',
        fr: 'D’abord je prends mon petit-déjeuner tranquillement, ensuite je vais au travail à vélo.',
        de: 'Zuerst frühstücke ich in Ruhe, danach fahre ich mit dem Fahrrad zur Arbeit.',
      },
      explanation_i18n: {
        en: 'Both zuerst and danach stand in Position 1 of their clauses, so the verbs frühstücke and fahre stay in Position 2 before ich. Note: separating two full main clauses with a period or semicolon is also standard.',
        fr: 'Zuerst et danach occupent la position 1, plaçant frühstücke et fahre juste avant ich.',
        de: 'Zuerst und danach stehen auf Position 1; deshalb folgen die Verben frühstücke und fahre sofort auf Position 2.',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Der Bus hat Verspätung. Deshalb komme ich zehn Minuten später.',
      highlight: 'Deshalb komme ich',
      note: 'Cause-and-result link with deshalb in Position 1',
      translation_i18n: {
        en: 'The bus is delayed. Therefore I am arriving ten minutes later.',
        fr: 'Le bus a du retard. C’est pourquoi j’arrive dix minutes plus tard.',
        de: 'Der Bus hat Verspätung. Deshalb komme ich zehn Minuten später.',
      },
      explanation_i18n: {
        en: 'Deshalb fills Position 1 of the second sentence, so komme stands in Position 2 and ich in Position 3.',
        fr: 'Deshalb occupe la position 1 ; le verbe komme est en position 2 devant ich.',
        de: 'Deshalb belegt Position 1 im zweiten Satz, komme steht auf Position 2 vor ich.',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Das Wetter ist heute kühl, aber wir gehen trotzdem im Park spazieren.',
      highlight: ', aber wir gehen trotzdem',
      note: 'Pos. 0 aber + middle-field adverb trotzdem',
      translation_i18n: {
        en: 'The weather is chilly today, but we are going for a walk in the park anyway.',
        fr: 'Le temps est frais aujourd’hui, mais nous allons quand même nous promener dans le parc.',
        de: 'Das Wetter ist heute kühl, aber wir gehen trotzdem im Park spazieren.',
      },
      explanation_i18n: {
        en: 'After Pos. 0 aber, wir (Pos. 1) + gehen (Pos. 2) is followed by trotzdem in the middle field.',
        fr: 'Après aber (pos. 0), on a wir gehen (Sujet + Verbe) puis trotzdem dans le milieu de phrase.',
        de: 'Nach aber (Pos. 0) bleibt die normale Stellung wir gehen, trotzdem steht im Mittelfeld.',
      },
    },
    {
      id: 'ex-4',
      sentence: 'Sie hat wenig Zeit. Trotzdem hilft sie mir beim Umzug.',
      highlight: 'Trotzdem hilft sie',
      note: 'trotzdem in Position 1 with immediate verb inversion',
      translation_i18n: {
        en: 'She has little time. Even so, she is helping me with the move.',
        fr: 'Elle a peu de temps. Malgré cela, elle m’aide pour le déménagement.',
        de: 'Sie hat wenig Zeit. Trotzdem hilft sie mir beim Umzug.',
      },
      explanation_i18n: {
        en: 'Trotzdem fills Position 1, so hilft stays in Position 2 before sie.',
        fr: 'Trotzdem est en position 1, donc hilft se place directement en position 2 avant sie.',
        de: 'Trotzdem auf Pos. 1 erzwingt das Verb hilft auf Pos. 2 direkt vor sie.',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-denn-vs-deshalb',
      contrast_pair: 'denn  (reason, Pos. 0)  vs.  deshalb  (result, Pos. 1)',
      title_i18n: {
        en: 'Don’t confuse cause (denn) and result (deshalb)',
        fr: 'Ne pas confondre la cause (denn) et la conséquence (deshalb)',
        de: 'Grund (denn) vs. Folge (deshalb) nicht verwechseln',
      },
      body_i18n: {
        en: 'Both order the events logically, but in opposite directions: "Ich lerne viel, denn ich habe eine Prüfung" (action → reason) vs. "Ich habe eine Prüfung. Deshalb lerne ich viel" (reason → result).',
        fr: 'denn introduit la cause (en position 0 : denn ich habe...), tandis que deshalb introduit la conséquence (en position 1 : Deshalb lerne ich...).',
        de: 'denn nennt den Grund (Position 0: denn ich habe...), deshalb nennt die Folge (Position 1: Deshalb lerne ich...).',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Es regnet stark. Deshalb ich bleibe zu Hause.',
      right: 'Es regnet stark. Deshalb bleibe ich zu Hause.',
      explanation_i18n: {
        en: 'Deshalb occupies Position 1, so the conjugated verb bleibe must come immediately in Position 2 before ich.',
        fr: 'Deshalb occupe la position 1 : le verbe bleibe doit suivre tout de suite en position 2 avant ich.',
        de: 'Deshalb steht auf Position 1; deshalb kommt das konjugierte Verb bleibe sofort vor ich.',
      },
      principle_i18n: {
        en: 'Invert Subject and Verb whenever dann, danach, deshalb, or trotzdem opens a clause.',
        fr: 'Inversez Verbe et Sujet dès que dann, danach, deshalb ou trotzdem ouvre la proposition.',
        de: 'Nach dann, danach, deshalb und trotzdem am Satzanfang immer Verb vor Subjekt stellen.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Zuerst dusche ich, und dann ich trinke Kaffee.',
      right: 'Zuerst dusche ich, und dann trinke ich Kaffee.',
      explanation_i18n: {
        en: 'Because und is Position 0, dann still fills Position 1 of the second clause and requires trinke ich.',
        fr: 'Puisque und est en position 0, dann occupe la position 1 et impose trinke ich.',
        de: 'Da und auf Position 0 steht, belegt dann Position 1 – das Verb trinke steht vor ich.',
      },
      principle_i18n: {
        en: 'Even after und, a fronted adverb like dann fills Position 1 before the verb.',
        fr: 'Même après und, un adverbe en tête comme dann prend la position 1 avant le verbe.',
        de: 'Auch nach und gilt: dann auf Position 1 verlangt Verb auf Position 2.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'Position-1 connectors (dann, danach, deshalb, trotzdem) count as Position 1, so the conjugated verb follows immediately before the subject.',
      key_pattern: 'Sentence 1. [Dann / Danach / Deshalb / Trotzdem (Pos. 1)] + [Verb (Pos. 2)] + [Subject (Pos. 3)]',
      mistake_warning: 'Never write *Deshalb ich gehe... or *Dann wir essen... — put the verb directly after the connector.',
      self_check: 'Connect with deshalb: "Ich bin sehr müde. Ich gehe früh ins Bett."',
    },
    fr: {
      central_rule: 'Les connecteurs en position 1 (dann, danach, deshalb, trotzdem) imposent le verbe conjugué tout de suite en position 2 avant le sujet.',
      key_pattern: 'Phrase 1. [Dann / Danach / Deshalb / Trotzdem (Pos. 1)] + [Verbe (Pos. 2)] + [Sujet (Pos. 3)]',
      mistake_warning: 'Jamais *Deshalb ich gehe... ni *Dann wir essen... : mettez le verbe juste après le connecteur.',
      self_check: 'Reliez avec deshalb : « Ich bin sehr müde. Ich gehe früh ins Bett. »',
    },
    de: {
      central_rule: 'Konnektoren auf Position 1 (dann, danach, deshalb, trotzdem) verlangen sofort das konjugierte Verb auf Position 2 vor dem Subjekt.',
      key_pattern: 'Satz 1. [Dann / Danach / Deshalb / Trotzdem (Pos. 1)] + [Verb (Pos. 2)] + [Subjekt (Pos. 3)]',
      mistake_warning: 'Nie *Deshalb ich gehe... schreiben – das Verb steht direkt nach dem Konnektor.',
      self_check: 'Verbinde mit deshalb: „Ich bin sehr müde. Ich gehe früh ins Bett.“',
    },
  },
  practice_mapping: [
    {
      id: 'a1-28-pos1-connector-inversion',
      label_i18n: {
        en: 'Applying V2 inversion after dann, danach, deshalb, and trotzdem',
        fr: 'Inversion verbe-sujet après dann, danach, deshalb et trotzdem',
        de: 'Inversion nach dann, danach, deshalb und trotzdem richtig bilden',
      },
      formats: ['sentence_construction', 'error_correction', 'transformation'],
    },
    {
      id: 'a1-28-connector-logic',
      label_i18n: {
        en: 'Choosing between und/aber/denn (Pos. 0) and dann/deshalb/trotzdem (Pos. 1)',
        fr: 'Choix logique entre Position 0 (und/aber/denn) et Position 1 (dann/deshalb/trotzdem)',
        de: 'Passende Satzverbindung wählen (denn vs. deshalb, aber vs. trotzdem)',
      },
      formats: ['multiple_choice', 'gap_fill'],
    },
  ],
};
