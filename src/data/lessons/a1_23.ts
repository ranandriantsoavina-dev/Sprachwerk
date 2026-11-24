import type { Lesson } from '../../types/domain';

export const LESSON_A1_23: Lesson = {
  id: 'a1-23',
  level: 'A1',
  unit: 23,
  title_en: 'Separable verbs',
  title_de: 'Trennbare Verben',
  topic: 'Separable verbs',
  hasContent: true,
  tags: ['trennbare-verben', 'praefix', 'satzklammer', 'nicht-trennbar'],
  estimated_study_minutes: 15,
  prerequisite_knowledge_i18n: {
    en: 'Connects present-tense conjugation (A1-05/06), verb brackets (A1-20), and modal verbs (A1-21).',
    fr: 'Relie la conjugaison au présent (A1-05/06), l’encadrement verbal (A1-20) et les modaux (A1-21).',
    de: 'Verbindet das Präsens (A1-05/06), die Satzklammer (A1-20) und Modalverben (A1-21).',
  },
  objectives: {
    en: 'Recognize common German separable prefixes (ab-, an-, auf-, aus-, ein-, mit-, vor-, zurück-), conjugate the stem in Position 2 (or 1) while placing the prefix at the end of the clause, and keep the infinitive together after modal verbs.',
    fr: 'Identifier les particules séparables fréquentes (ab-, an-, auf-, aus-, ein-, mit-, vor-, zurück-), conjuguer le verbe en position 2/1 tout en renvoyant la particule à la fin, et garder l’infinitif soudé après un modal.',
    de: 'Häufige trennbare Präfixe (ab-, an-, auf-, aus-, ein-, mit-, vor-, zurück-) erkennen, im Präsens/Imperativ das Präfix ans Satzende stellen und nach Modalverben den Infinitiv zusammenschreiben.',
  },
  learning_objectives_i18n: {
    en: [
      'Recognize stressed separable prefixes (e.g., anrufen, aufstehen, einkaufen, mitkommen, abfahren, zurückkommen) versus unstressed non-separable prefixes (be-, ver-, er-, ent-, ge-).',
      'Split separable verbs in present-tense main clauses, questions, and imperatives: conjugated verb in Position 2 (or 1), prefix at the very end.',
      'Keep separable verbs unsplit as a single infinitive at the end after modal verbs ("Ich muss um 7 Uhr aufstehen.").',
    ],
    fr: [
      'Identifier les préfixes séparables accentués (anrufen, aufstehen, einkaufen, mitkommen, abfahren) par opposition aux préfixes inséparables non accentués (be-, ver-, er-, ent-, ge-).',
      'Séparer les verbes à particule au présent et à l’impératif : verbe conjugué en position 2 (ou 1) et particule tout à la fin.',
      'Laisser l’infinitif attaché en fin de phrase après un verbe de modalité (« Ich muss um 7 Uhr aufstehen. »).',
    ],
    de: [
      'Betonte trennbare Präfixe (anrufen, aufstehen, einkaufen, mitkommen, abfahren) von unbetonten nicht trennbaren Präfixen (be-, ver-, er-, ent-, ge-) unterscheiden.',
      'Trennbare Verben im Präsens und Imperativ teilen: konjugiertes Verb auf Pos. 2 (oder 1), Präfix ganz ans Satzende.',
      'Nach Modalverben den gesamten Infinitiv zusammengeschrieben ans Satzende stellen („Ich muss früh aufstehen.“).',
    ],
  },
  introduction_i18n: {
    en: 'German creates hundreds of everyday verbs by attaching a short prefix to a base verb—turning kaufen (to buy) into einkaufen (to shop), or stehen (to stand) into aufstehen (to get up). When conjugated in a main clause, most of these common A1 prefixes split off and move all the way to the end of the sentence.',
    fr: 'L’allemand forme de très nombreux verbes du quotidien en ajoutant un préfixe à un verbe de base : kaufen (acheter) devient einkaufen (faire les courses), stehen devient aufstehen (se lever). Au présent et à l’impératif, la particule se détache et part tout à la fin de la phrase.',
    de: 'Im Deutschen entstehen viele wichtige Alltagsverben durch Präfixe: Aus kaufen wird einkaufen, aus stehen wird aufstehen. Wenn ein trennbares Verb im Hauptsatz oder Imperativ konjugiert wird, wandert das Präfix ans Satzende.',
  },
  explanation_i18n: {
    en: [
      '1. How separable verbs work in a main clause',
      'Take anrufen (to call someone) = prefix an- + base verb rufen:',
      '• Infinitive: anrufen',
      '• Main statement: "Ich rufe (Pos. 2) meine Mutter heute Abend an (End)."',
      '• Yes/no question: "Rufst (Pos. 1) du mich morgen an (End)?"',
      '• Imperative: "Ruf (Pos. 1) mich bitte an (End)!"',
      'Notice that the base verb keeps any regular or irregular stem change: an|fangen → es fängt ... an; ein|laden → er lädt ... ein; fern|sehen → wir sehen ... fern.',
      '',
      '2. When a separable verb stays together',
      'Whenever another verb takes Position 2—such as a modal verb (können, müssen, wollen)—the separable verb sits at the end as a single infinitive:',
      '• "Ich muss heute noch im Supermarkt einkaufen." (NOT *Ich muss ... kaufen ein).',
      '',
      '3. Separating vs. non-separating prefixes (sound clue!)',
      '• Separable prefixes are ALWAYS STRESSED when spoken: ABfahren, ANkommen, AUFstehen, AUSsteigen, EINkaufen, FERNsehen, MITkommen, VORbereiten, ZUmachen, ZURÜCKkommen.',
      '• Unstressed prefixes NEVER separate: be- (besuchen, bezahlen), er- (erzählen), ver- (verstehen, vergessen), ent-, emp-, zer-, miss-. Example: "Ich besuche heute meine Oma." (NEVER *Ich suche meine Oma be).',
    ].join('\n'),
    fr: [
      '1. Fonctionnement dans la proposition principale',
      'Prenons anrufen (appeler au téléphone) = particule an- + base rufen :',
      '• Infinitif : anrufen',
      '• Phrase déclarative : « Ich rufe (Pos. 2) meine Mutter heute Abend an (Fin). »',
      '• Question fermée : « Rufst (Pos. 1) du mich morgen an (Fin)? »',
      '• Impératif : « Ruf (Pos. 1) mich bitte an (Fin)! »',
      'La base verbale conserve ses éventuels changements de radical : an|fangen → es fängt ... an ; ein|laden → er lädt ... ein ; fern|sehen → du siehst ... fern.',
      '',
      '2. Quand le verbe reste soudé',
      'Après un verbe de modalité en position 2, le verbe à particule reste en un seul mot à l’infinitif à la fin :',
      '• « Ich muss heute noch im Supermarkt einkaufen. »',
      '',
      '3. Particules séparables vs préfixes inséparables (indice d’accentuation)',
      '• Séparables (toujours accentuées à l’oral) : ab-, an-, auf-, aus-, ein-, fern-, mit-, vor-, zu-, zurück-.',
      '• Inséparables (jamais accentuées) : be- (besuchen, bezahlen), er- (erzählen), ver- (verstehen, vergessen), ent-, emp-, zer-, miss-. Exemple : « Ich verstehe das Wort nicht. » (jamais *Ich stehe das Wort ver).',
    ].join('\n'),
    de: [
      '1. So funktionieren trennbare Verben im Satz',
      'Beispiel anrufen = Präfix an- + Basisverb rufen:',
      '• Aussagesatz: „Ich rufe (Pos. 2) meine Mutter heute Abend an (Ende).“',
      '• Ja-/Nein-Frage: „Rufst (Pos. 1) du mich morgen an (Ende)?“',
      '• Imperativ: „Ruf (Pos. 1) mich bitte an (Ende)!“',
      'Starke Verben behalten ihren Vokalwechsel in der konjugierten Basis: an|fangen → es fängt ... an; ein|laden → du lädst ... ein; fern|sehen → er sieht ... fern.',
      '',
      '2. Wann bleibt das Verb zusammen?',
      'Wenn ein Modalverb auf Position 2 steht, bleibt das trennbare Verb als ganzer Infinitiv am Satzende:',
      '• „Ich muss heute im Supermarkt einkaufen.“',
      '',
      '3. Trennbare vs. nicht trennbare Präfixe',
      '• Trennbar (Präfix immer betont): ab-, an-, auf-, aus-, ein-, fern-, mit-, vor-, zu-, zurück-.',
      '• Nicht trennbar (Präfix immer unbetont): be- (besuchen), er- (erklären), ver- (verstehen), ent-, emp-, zer-, miss-. Beispiel: „Ich bezahle die Rechnung.“',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-separable-split',
      title: 'Betontes Präfix trennt sich im Präsens und Imperativ',
      body: 'Der konjugierte Verbteil steht auf Position 2 (oder 1), das betonte Präfix steht ganz am Satzende.',
      title_i18n: {
        en: 'Stressed prefix moves to the end in present tense and imperative',
        fr: 'Le préfixe accentué passe à la fin au présent et à l’impératif',
        de: 'Betontes Präfix trennt sich im Präsens und Imperativ',
      },
      body_i18n: {
        en: 'Everything else (objects, time, place, nicht) sits inside the bracket between the conjugated verb and the final prefix.',
        fr: 'Tous les compléments et nicht se placent à l’intérieur de la parenthèse, entre le verbe et sa particule finale.',
        de: 'Alle Angaben, Objekte und nicht stehen innerhalb der Satzklammer vor dem Präfix.',
      },
    },
    {
      id: 'rule-inseparable-prefixes',
      title: 'be-, er-, ver-, ent-, zer- trennen sich nie',
      body: 'Verben wie besuchen, verstehen oder erzählen bleiben immer ein Wort.',
      title_i18n: {
        en: 'be-, er-, ver-, ent-, zer- never separate',
        fr: 'be-, er-, ver-, ent-, zer- ne se séparent jamais',
        de: 'be-, er-, ver-, ent-, zer- trennen sich nie',
      },
      body_i18n: {
        en: 'Always keep unstressed prefixes attached: "Ich verstehe alles", "Er besucht uns".',
        fr: 'Les préfixes atones restent toujours attachés : « Ich verstehe alles », « Er besucht uns ».',
        de: 'Unbetonte Präfixe bleiben immer am Verb: „Ich verstehe alles“, „Er besucht uns“.',
      },
    },
  ],
  tables: [
    {
      id: 'tbl-separable-vs-inseparable',
      title_i18n: {
        en: 'Common A1 separable prefixes vs. non-separable prefixes',
        fr: 'Préfixes séparables fréquents vs préfixes inséparables (A1)',
        de: 'Häufige trennbare und nicht trennbare Präfixe (A1)',
      },
      columns_i18n: {
        en: ['Type', 'Prefixes', 'Example infinitives', 'Sentence example'],
        fr: ['Type', 'Préfixes', 'Exemples d’infinitifs', 'Exemple en phrase'],
        de: ['Typ', 'Präfixe', 'Beispielverben', 'Beispielsatz'],
      },
      rows: [
        ['Separable (stressed)', 'ab-, an-, auf-, aus-', 'abfahren, anrufen, aufstehen, aussteigen', 'Der Zug fährt um 8 Uhr ab.'],
        ['Separable (stressed)', 'ein-, mit-, vor-, zu-, zurück-', 'einkaufen, mitkommen, vorlesen, zumachen, zurückkommen', 'Kaufst du bitte Milch ein?'],
        ['Separable (compound)', 'fern-, spazieren-', 'fernsehen, spazieren gehen', 'Abends sieht mein Vater gern fern.'],
        ['Non-separable (unstressed)', 'be-, er-, ver-, ent-, zer-', 'besuchen, erzählen, verstehen, vergessen', 'Wir besuchen am Sonntag unsere Oma.'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Unser Deutschkurs fängt jeden Montag um 9 Uhr an.',
      highlight: 'fängt ... an',
      note: 'Irregular verb (anfangen → fängt ... an) with end prefix',
      translation_i18n: {
        en: 'Our German course starts every Monday at 9 o’clock.',
        fr: 'Notre cours d’allemand commence tous les lundis à 9 heures.',
        de: 'Unser Deutschkurs fängt jeden Montag um 9 Uhr an.',
      },
      explanation_i18n: {
        en: 'anfangen is separable and has an a → ä vowel change in the 3rd person singular: fängt ... an.',
        fr: 'anfangen est séparable et subit l’alternance a → ä : fängt ... an.',
        de: 'anfangen ist trennbar und hat Vokalwechsel a → ä: fängt ... an.',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Machst du bitte das Fenster zu? Es ist kalt.',
      highlight: 'Machst ... zu',
      note: 'Yes/no question with separable prefix zu at the end',
      translation_i18n: {
        en: 'Could you close the window please? It is cold.',
        fr: 'Tu fermes la fenêtre s’il te plaît ? Il fait froid.',
        de: 'Machst du bitte das Fenster zu? Es ist kalt.',
      },
      explanation_i18n: {
        en: 'In a yes/no question, Machst stands in Position 1 while zu closes the question.',
        fr: 'Dans la question fermée, Machst est en position 1 et zu est renvoyé à la fin.',
        de: 'In der Ja-/Nein-Frage steht Machst auf Position 1, das Präfix zu am Ende.',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Morgen müssen wir am Bahnhof umsteigen.',
      highlight: 'müssen ... umsteigen',
      note: 'Modal verb keeps separable infinitive unsplit at the end',
      translation_i18n: {
        en: 'Tomorrow we have to change trains at the station.',
        fr: 'Demain, nous devons changer de train à la gare.',
        de: 'Morgen müssen wir am Bahnhof umsteigen.',
      },
      explanation_i18n: {
        en: 'Because müssen is conjugated in Position 2, umsteigen remains one word at the end.',
        fr: 'Comme müssen est conjugué en position 2, umsteigen reste soudé à l’infinitif en fin de phrase.',
        de: 'Da müssen das konjugierte Verb ist, bleibt umsteigen als Infinitiv zusammengeschrieben.',
      },
    },
    {
      id: 'ex-4',
      sentence: 'Ich verstehe diese Übung noch nicht, aber meine Lehrerin erklärt sie.',
      highlight: 'verstehe / erklärt',
      note: 'Non-separable ver- and er- stay attached',
      translation_i18n: {
        en: 'I don’t understand this exercise yet, but my teacher explains it.',
        fr: 'Je ne comprends pas encore cet exercice, mais ma professeure l’explique.',
        de: 'Ich verstehe diese Übung noch nicht, aber meine Lehrerin erklärt sie.',
      },
      explanation_i18n: {
        en: 'ver- and er- are unstressed prefixes, so they never separate from stehen or klären.',
        fr: 'ver- et er- sont des préfixes inséparables : ils restent toujours attachés au verbe.',
        de: 'ver- und er- sind unbetont und bleiben fest mit dem Verbstamm verbunden.',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-separable-modal-vs-simple',
      contrast_pair: 'Ich stehe um 6 Uhr auf.  vs.  Ich muss um 6 Uhr aufstehen.',
      title_i18n: {
        en: 'Split in simple present vs. together after a modal verb',
        fr: 'Séparé au présent simple vs soudé après un modal',
        de: 'Getrennt im Präsens vs. zusammen beim Modalverb',
      },
      body_i18n: {
        en: 'Only the verb that sits in Position 2 (or 1) carries the conjugation. Without a modal, aufstehen splits (stehe ... auf). With a modal verb, the modal takes Position 2 and aufstehen stays together at the end.',
        fr: 'Sans modal, aufstehen se sépare (stehe ... auf). Avec un modal conjugué en position 2, aufstehen reste en un seul mot à la fin.',
        de: 'Ohne Modalverb teilt sich aufstehen (stehe ... auf). Mit Modalverb steht aufstehen als geschlossener Infinitiv am Ende.',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Ich einkaufe heute Obst und Gemüse.',
      right: 'Ich kaufe heute Obst und Gemüse ein.',
      explanation_i18n: {
        en: 'ein- is a stressed separable prefix, so it detaches and moves to the end of the main clause.',
        fr: 'ein- est une particule séparable : elle doit se détacher et aller en fin de phrase.',
        de: 'ein- ist ein trennbares Präfix und wandert im Präsens-Hauptsatz ans Satzende.',
      },
      principle_i18n: {
        en: 'Split separable prefixes like ein-, an-, auf-, mit- to the end when conjugating in Position 2.',
        fr: 'Détachez les particules séparables (ein-, an-, auf-, mit-) à la fin de la proposition.',
        de: 'Betonte Präfixe wie ein-, an-, auf-, mit- im Hauptsatz ans Satzende stellen.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Ich rufe an meine Schwester jeden Sonntag.',
      right: 'Ich rufe meine Schwester jeden Sonntag an.',
      explanation_i18n: {
        en: 'The prefix does not stay directly next to the verb; it must go to the very end of the clause after all objects and time phrases.',
        fr: 'La particule ne reste pas collée après le verbe : elle se place tout à la fin après tous les compléments.',
        de: 'Das Präfix steht nicht direkt hinter dem Verb, sondern ganz am Satzende hinter den Ergänzungen.',
      },
      principle_i18n: {
        en: 'Send the separated prefix to the very end of the clause, after objects and adverbs.',
        fr: 'Renvoyez la particule tout à la fin, après les objets et les compléments.',
        de: 'Das abgetrennte Präfix gehört ganz ans Satzende.',
      },
    },
    {
      id: 'cm-3',
      wrong: 'Wir suchen unsere Freunde am Samstag be.',
      right: 'Wir besuchen unsere Freunde am Samstag.',
      explanation_i18n: {
        en: 'be- (like ver- and er-) is an unstressed non-separable prefix and never splits off.',
        fr: 'be- (comme ver- et er-) est un préfixe inséparable : il ne se détache jamais.',
        de: 'be- ist ein nicht trennbares Präfix; besuchen darf man nicht trennen.',
      },
      principle_i18n: {
        en: 'Never split unstressed prefixes: be-, er-, ver-, ent-, emp-, zer-, miss-.',
        fr: 'Ne séparez jamais les préfixes atones be-, er-, ver-, ent-, emp-, zer-, miss-.',
        de: 'Unbetonte Präfixe (be-, er-, ver-, ent-, zer-) bleiben immer am Verb.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'Stressed prefixes (ab-, an-, auf-, aus-, ein-, mit-, vor-, zurück-) split to the end of present clauses; unstressed prefixes (be-, er-, ver-, ent-, zer-) never split.',
      key_pattern: 'Ich stehe um 7 Uhr auf.  vs.  Ich muss um 7 Uhr aufstehen.',
      mistake_warning: 'Always place the separated prefix at the very end of the clause, not right after the verb.',
      self_check: 'Which separates, and how? Use "abfahren" (Der Zug / um 10:15 Uhr) and "bezahlen" (Ich / die Rechnung).',
    },
    fr: {
      central_rule: 'Les préfixes accentués (ab-, an-, auf-, aus-, ein-, mit-, vor-, zurück-) vont en fin de phrase au présent ; be-, er-, ver-, ent-, zer- restent soudés.',
      key_pattern: 'Ich stehe um 7 Uhr auf.  vs  Ich muss um 7 Uhr aufstehen.',
      mistake_warning: 'Mettez la particule séparée tout à la fin de la phrase, et non juste après le verbe.',
      self_check: 'Faites deux phrases au présent : « abfahren » (Der Zug / um 10:15 Uhr) et « bezahlen » (Ich / die Rechnung).',
    },
    de: {
      central_rule: 'Betonte Präfixe (ab-, an-, auf-, aus-, ein-, mit-, vor-, zurück-) stehen im Präsens am Satzende; unbetonte (be-, er-, ver-, ent-, zer-) trennen sich nie.',
      key_pattern: 'Ich stehe um 7 Uhr auf.  vs.  Ich muss um 7 Uhr aufstehen.',
      mistake_warning: 'Das Präfix gehört ganz ans Satzende, nicht direkt hinter das Verb.',
      self_check: 'Bilde Sätze im Präsens mit „abfahren“ (Der Zug / um 10:15 Uhr) und „bezahlen“ (Ich / die Rechnung).',
    },
  },
  practice_mapping: [
    {
      id: 'a1-23-separable-vs-inseparable',
      label_i18n: {
        en: 'Distinguishing separable prefixes (an-, auf-, ein-...) from non-separable prefixes (be-, ver-, er-...)',
        fr: 'Distinction entre verbes séparables et verbes inséparables',
        de: 'Trennbare und nicht trennbare Verben unterscheiden',
      },
      formats: ['multiple_choice', 'matching', 'error_correction'],
    },
    {
      id: 'a1-23-split-and-modal',
      label_i18n: {
        en: 'Splitting separable verbs in V2/V1 clauses and keeping them together after modal verbs',
        fr: 'Séparation dans les phrases simples et maintien en un mot après un modal',
        de: 'Trennbare Verben im Hauptsatz trennen und mit Modalverb zusammensetzen',
      },
      formats: ['sentence_construction', 'gap_fill', 'transformation'],
    },
  ],
};
