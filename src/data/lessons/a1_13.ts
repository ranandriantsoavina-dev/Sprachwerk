import type { Lesson } from '../../types/domain';

export const LESSON_A1_13: Lesson = {
  id: 'a1-13',
  level: 'A1',
  unit: 13,
  title_en: 'Accusative case',
  title_de: 'Akkusativ',
  topic: 'Accusative case',
  hasContent: true,
  tags: ['akkusativ', 'kasus', 'objekt', 'praepositionen'],
  estimated_study_minutes: 15,
  prerequisite_knowledge_i18n: {
    en: 'Requires Nominative case basics (Lesson A1-12).',
    fr: 'S’appuie sur les bases du nominatif (leçon A1-12).',
    de: 'Setzt Grundlagen des Nominativs (Lektion A1-12) voraus.',
  },
  objectives: {
    en: 'Use the accusative case for direct objects and after accusative prepositions, changing masculine singular articles from der/ein/kein to den/einen/keinen.',
    fr: 'Employer l’accusatif pour les compléments d’objet direct et après les prépositions de l’accusatif, en transformant der/ein/kein en den/einen/keinen au masculin singulier.',
    de: 'Den Akkusativ für direkte Objekte und nach Akkusativ-Präpositionen verwenden und maskuline Artikel im Singular zu den/einen/keinen ändern.',
  },
  learning_objectives_i18n: {
    en: [
      'Apply the core accusative change: ONLY masculine singular changes (der → den, ein → einen, kein → keinen), while feminine, neuter, and plural stay identical to nominative.',
      'Identify common A1 verbs that take an accusative direct object (haben, brauchen, kaufen, suchen, lesen, essen, trinken, sehen, mögen, finden).',
      'Use the accusative after the fixed prepositions für, ohne, durch, gegen, um (and bis).',
      'Ask about accusative objects using Wen? (for people) and Was? (for things).',
    ],
    fr: [
      'Appliquer la règle centrale : SEUL le masculin singulier change à l’accusatif (der → den, ein → einen, kein → keinen) ; féminin, neutre et pluriel restent identiques au nominatif.',
      'Reconnaître les verbes courants suivis d’un COD à l’accusatif (haben, brauchen, kaufen, suchen, lesen, essen, trinken, sehen, mögen, finden).',
      'Employer l’accusatif après les prépositions für, ohne, durch, gegen, um (et bis).',
      'Poser des questions sur le COD avec Wen ? (personnes) et Was ? (choses).',
    ],
    de: [
      'Die Grundregel anwenden: NUR das Maskulinum Singular ändert sich (der → den, ein → einen, kein → keinen); Femininum, Neutrum und Plural bleiben gleich.',
      'Wichtige A1-Verben mit Akkusativobjekt kennen (haben, brauchen, kaufen, suchen, lesen, essen, trinken, sehen, mögen, finden).',
      'Den Akkusativ nach festen Präpositionen verwenden: für, ohne, durch, gegen, um (und bis).',
      'Nach Akkusativobjekten mit Wen? (Personen) und Was? (Sachen) fragen.',
    ],
  },
  introduction_i18n: {
    en: 'The accusative (Akkusativ) is the first non-nominative case you learn in German, and it is remarkably learner-friendly: feminine, neuter, and plural articles do not change at all. Only masculine singular articles change—by adding -en (der → den, ein → einen, kein → keinen)—whenever a noun is a direct object or follows an accusative preposition.',
    fr: 'L’accusatif (Akkusativ) est le premier cas complément que l’on apprend en allemand, et il est très accessible : au féminin, au neutre et au pluriel, les articles ne changent pas du tout. Seul le masculin singulier change en prenant la marque -en (der → den, ein → einen, kein → keinen), pour un complément d’objet direct ou après une préposition régissant l’accusatif.',
    de: 'Der Akkusativ ist der wichtigste Objekt-Kasus auf A1-Niveau und leicht zu merken: Femininum, Neutrum und Plural bleiben genauso wie im Nominativ. Nur im Maskulinum Singular ändert sich der Artikel (der → den, ein → einen, kein → keinen) – immer beim direkten Objekt und nach bestimmten Präpositionen.',
  },
  explanation_i18n: {
    en: [
      '1. When do we use the Akkusativ?',
      '• For the direct object (answering "Wen oder was?") of most action verbs: haben, brauchen, kaufen, suchen, nehmen, essen, trinken, lesen, schreiben, sehen, hören, besuchen, lieben, finden, kennen, and "es gibt" ("Hier gibt es einen Park").',
      '• After fixed accusative prepositions: für (for), ohne (without), durch (through), gegen (against), um (around / at [time]).',
      '',
      '2. The golden rule: only masculine singular changes!',
      '• Masculine: der → den, ein → einen, kein → keinen ("Ich suche den Schlüssel." / "Ich habe keinen Stift.")',
      '• Feminine: die → die, eine → eine, keine → keine ("Ich lese die Zeitung.")',
      '• Neuter: das → das, ein → ein, kein → kein ("Er kauft ein Fahrrad.")',
      '• Plural: die → die, — → —, keine → keine ("Wir essen keine Äpfel.")',
      '',
      '3. Asking questions: Wen? vs. Was?',
      'Use Wen? (Whom?) for people ("Wen besuchst du? – Meinen Bruder.") and Was? (What?) for things ("Was kaufst du? – Einen Kaffee.").',
    ].join('\n'),
    fr: [
      '1. Quand emploie-t-on l’Akkusativ ?',
      '• Pour le complément d’objet direct (répondant à « Wen oder was ? ») après la plupart des verbes d’action : haben, brauchen, kaufen, suchen, nehmen, essen, trinken, lesen, schreiben, sehen, hören, besuchen, finden, kennen, ainsi que « es gibt » (« Hier gibt es einen Park »).',
      '• Après les prépositions toujours suivies de l’accusatif : für (pour), ohne (sans), durch (à travers), gegen (contre), um (autour de).',
      '',
      '2. La règle d’or : seul le masculin singulier change !',
      '• Masculin : der → den, ein → einen, kein → keinen (« Ich suche den Schlüssel. » / « Ich habe keinen Stift. »)',
      '• Féminin : die → die, eine → eine, keine → keine (« Ich lese die Zeitung. »)',
      '• Neutre : das → das, ein → ein, kein → kein (« Er kauft ein Fahrrad. »)',
      '• Pluriel : die → die, — → —, keine → keine (« Wir essen keine Äpfel. »)',
      '',
      '3. Poser la question : Wen ? vs Was ?',
      'Utilisez Wen ? pour une personne (« Wen besuchst du ? ») et Was ? pour une chose (« Was kaufst du ? »).',
    ].join('\n'),
    de: [
      '1. Wann steht der Akkusativ?',
      '• Beim direkten Objekt (Frage: „Wen oder was?“) nach Verben wie haben, brauchen, kaufen, suchen, nehmen, essen, trinken, lesen, schreiben, sehen, hören, besuchen, finden, kennen sowie nach „es gibt“ („Hier gibt es einen Park“).',
      '• Nach festen Akkusativ-Präpositionen: für, ohne, durch, gegen, um (und bis).',
      '',
      '2. Die Grundregel: Nur das Maskulinum Singular ändert sich!',
      '• Maskulinum: der → den, ein → einen, kein → keinen („Ich suche den Schlüssel.“ / „Ich habe keinen Stift.“)',
      '• Femininum: die → die, eine → eine, keine → keine („Ich lese die Zeitung.“)',
      '• Neutrum: das → das, ein → ein, kein → kein („Er kauft ein Fahrrad.“)',
      '• Plural: die → die, — → —, keine → keine („Wir essen keine Äpfel.“)',
      '',
      '3. Fragewörter: Wen? vs. Was?',
      'Für Personen fragt man „Wen?“ („Wen besuchst du?“), für Sachen „Was?“ („Was kaufst du?“).',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-akk-masc-en',
      title: 'Maskulinum Singular im Akkusativ: -en (den, einen, keinen)',
      body: 'Nur der maskuline Artikel verändert sich im Akkusativ: der → den, ein → einen, kein → keinen.',
      title_i18n: {
        en: 'Masculine singular takes -en in the accusative',
        fr: 'Le masculin singulier prend -en à l’accusatif',
        de: 'Maskulinum Singular bekommt im Akkusativ -en',
      },
      body_i18n: {
        en: 'Change der → den, ein → einen, kein → keinen (and mein → meinen) when a masculine noun is a direct object or follows an accusative preposition.',
        fr: 'Transformez der → den, ein → einen, kein → keinen (et mein → meinen) pour un nom masculin COD ou après une préposition de l’accusatif.',
        de: 'Ändere der → den, ein → einen, kein → keinen (und mein → meinen) beim maskulinen Akkusativobjekt oder nach Akkusativ-Präpositionen.',
      },
    },
    {
      id: 'rule-akk-prepositions',
      title: 'Feste Präpositionen mit Akkusativ: für, ohne, durch, gegen, um',
      body: 'Nach für, ohne, durch, gegen, um steht immer der Akkusativ (für meinen Vater, ohne einen Schirm).',
      title_i18n: {
        en: 'Fixed accusative prepositions: für, ohne, durch, gegen, um',
        fr: 'Prépositions suivies de l’accusatif : für, ohne, durch, gegen, um',
        de: 'Präpositionen mit Akkusativ: für, ohne, durch, gegen, um',
      },
      body_i18n: {
        en: 'Remember the five core accusative prepositions (FUDGO: für, um, durch, gegen, ohne). Whatever follows them takes the accusative.',
        fr: 'Retenez les cinq prépositions clés de l’accusatif : für, ohne, durch, gegen, um (le groupe suivant est toujours à l’accusatif).',
        de: 'Merke dir die Präpositionen für, ohne, durch, gegen, um – sie verlangen immer den Akkusativ.',
      },
    },
  ],
  tables: [
    {
      id: 'table-akkusativ-articles',
      title_i18n: {
        en: 'Nominative vs. Accusative Articles',
        fr: 'Articles au nominatif et à l’accusatif',
        de: 'Artikel im Nominativ und Akkusativ',
      },
      columns_i18n: {
        en: ['Gender / Number', 'Nominative', 'Accusative', 'Accusative Example'],
        fr: ['Genre / Nombre', 'Nominatif', 'Accusatif', 'Exemple à l’accusatif'],
        de: ['Genus / Numerus', 'Nominativ', 'Akkusativ', 'Beispiel im Akkusativ'],
      },
      rows: [
        ['Masculine (Sg.)', 'der / ein / kein', 'den / einen / keinen', 'Ich kaufe den / einen Tisch.'],
        ['Feminine (Sg.)', 'die / eine / keine', 'die / eine / keine', 'Sie liest die / eine Zeitung.'],
        ['Neuter (Sg.)', 'das / ein / kein', 'das / ein / kein', 'Wir suchen das / ein Hotel.'],
        ['Plural (all)', 'die / — / keine', 'die / — / keine', 'Er isst die / keine Äpfel.'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Ich brauche einen neuen Schlüssel für den Schrank.',
      highlight: 'einen / für den',
      note: 'Direct object einen Schlüssel + accusative preposition für den Schrank',
      translation_i18n: {
        en: 'I need a new key for the cabinet.',
        fr: 'J’ai besoin d’une nouvelle clé pour l’armoire.',
        de: 'Ich brauche einen neuen Schlüssel für den Schrank.',
      },
      explanation_i18n: {
        en: 'Both der Schlüssel and der Schrank are masculine, so both show -en in the accusative.',
        fr: 'der Schlüssel et der Schrank étant masculins, ils prennent tous deux la marque -en à l’accusatif.',
        de: 'Beide Nomen sind maskulin: einen nach brauchen und den nach für.',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Es gibt hier keinen Supermarkt, nur eine Bäckerei.',
      highlight: 'keinen / eine',
      note: 'es gibt + Akkusativ: masculine keinen vs. feminine eine',
      translation_i18n: {
        en: 'There is no supermarket here, only a bakery.',
        fr: 'Il n’y a pas de supermarché ici, seulement une boulangerie.',
        de: 'Es gibt hier keinen Supermarkt, nur eine Bäckerei.',
      },
      explanation_i18n: {
        en: 'The fixed phrase es gibt always triggers the accusative: der Supermarkt → keinen Supermarkt.',
        fr: 'L’expression es gibt commande toujours l’accusatif : keinen Supermarkt.',
        de: 'Nach es gibt steht immer der Akkusativ (der Supermarkt → keinen Supermarkt).',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Wen triffst du heute? – Ich treffe meinen Freund ohne meinen Bruder.',
      highlight: 'Wen / meinen Freund / ohne meinen Bruder',
      note: 'Accusative question Wen? and accusative preposition ohne',
      translation_i18n: {
        en: 'Whom are you meeting today? – I am meeting my friend without my brother.',
        fr: 'Qui rencontres-tu aujourd’hui ? – Je retrouve mon ami sans mon frère.',
        de: 'Wen triffst du heute? – Ich treffe meinen Freund ohne meinen Bruder.',
      },
      explanation_i18n: {
        en: 'Uses Wen? (not Wer?) for an accusative person, meinen Freund after treffe, and meinen Bruder after ohne.',
        fr: 'Emploie Wen ? (et non Wer ?) pour la personne COD, puis meinen Freund et meinen Bruder.',
        de: 'Fragt mit Wen? nach dem Objekt und setzt meinen nach treffen sowie nach ohne.',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-wer-vs-wen',
      contrast_pair: 'Wer besucht Anna? (Subjekt)  vs.  Wen besucht Anna? (Objekt)',
      title_i18n: {
        en: 'Wer? (subject) vs. Wen? (direct object)',
        fr: 'Wer ? (sujet) vs Wen ? (COD)',
        de: 'Wer? (Nominativ) vs. Wen? (Akkusativ)',
      },
      body_i18n: {
        en: '"Wer besucht Anna?" asks who is doing the visiting (answer: Paul). "Wen besucht Anna?" asks whom Anna is visiting (answer: Paul, whom Anna goes to see).',
        fr: '« Wer besucht Anna ? » demande qui rend visite (sujet). « Wen besucht Anna ? » demande à qui Anna rend visite (objet).',
        de: '„Wer besucht Anna?“ fragt nach dem Subjekt; „Wen besucht Anna?“ fragt nach dem Akkusativobjekt.',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Ich trinke ein Kaffee.',
      right: 'Ich trinke einen Kaffee.',
      explanation_i18n: {
        en: 'Kaffee is masculine (der Kaffee) and is the direct object of trinke, so ein must change to einen.',
        fr: 'Kaffee est masculin (der Kaffee) et COD de trinke : ein devient obligatoirement einen.',
        de: 'Kaffee ist maskulin (der Kaffee) und steht im Akkusativ: einen Kaffee.',
      },
      principle_i18n: {
        en: 'Always change ein/der/kein to einen/den/keinen for masculine singular direct objects.',
        fr: 'Changez toujours ein/der/kein en einen/den/keinen pour un COD masculin singulier.',
        de: 'Maskuline Objekte im Singular erhalten immer -en (den/einen/keinen).',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Das Geschenk ist für der Lehrer.',
      right: 'Das Geschenk ist für den Lehrer.',
      explanation_i18n: {
        en: 'The preposition für always requires the accusative case, changing der to den.',
        fr: 'La préposition für régit toujours l’accusatif, donc der devient den.',
        de: 'Nach der Präposition für steht immer der Akkusativ (den Lehrer).',
      },
      principle_i18n: {
        en: 'Use den / einen / keinen after für, ohne, durch, gegen, and um.',
        fr: 'Utilisez den / einen / keinen après für, ohne, durch, gegen et um.',
        de: 'Nach für, ohne, durch, gegen, um steht immer der Akkusativ.',
      },
    },
    {
      id: 'cm-3',
      wrong: 'Er liest dasen Buch.',
      right: 'Er liest das Buch.',
      explanation_i18n: {
        en: 'Neuter nouns (das Buch) never change in the accusative—only masculine nouns add -en.',
        fr: 'Les noms neutres (das Buch) ne changent jamais à l’accusatif : seul le masculin change.',
        de: 'Neutrale Nomen (das Buch) ändern ihren Artikel im Akkusativ nicht.',
      },
      principle_i18n: {
        en: 'Leave feminine (die/eine), neuter (das/ein), and plural (die/keine) unchanged in the accusative.',
        fr: 'Ne modifiez ni le féminin, ni le neutre, ni le pluriel à l’accusatif.',
        de: 'Femininum, Neutrum und Plural bleiben im Akkusativ unverändert.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'Use the accusative for direct objects (Wen oder was?) and after für, ohne, durch, gegen, um.',
      key_pattern: 'Only masculine singular changes: der → den, ein → einen, kein → keinen.',
      mistake_warning: 'Don’t forget -en on masculine objects after haben, brauchen, suchen, and es gibt—and never change das/die in the accusative.',
      self_check: 'Complete: "Ich suche ___ (der) Schlüssel und kaufe ___ (ein) Apfel für ___ (mein) Freund."',
    },
    fr: {
      central_rule: 'L’accusatif s’emploie pour le COD (Wen oder was ?) et après für, ohne, durch, gegen, um.',
      key_pattern: 'Seul le masculin singulier change : der → den, ein → einen, kein → keinen.',
      mistake_warning: 'N’oubliez pas -en au masculin après haben, brauchen, suchen et es gibt, et ne modifiez pas das/die.',
      self_check: 'Complétez : « Ich suche ___ (der) Schlüssel und kaufe ___ (ein) Apfel für ___ (mein) Freund. »',
    },
    de: {
      central_rule: 'Der Akkusativ steht beim direkten Objekt (Wen oder was?) und nach für, ohne, durch, gegen, um.',
      key_pattern: 'Nur das Maskulinum Singular ändert sich: der → den, ein → einen, kein → keinen.',
      mistake_warning: 'Vergiss -en bei maskulinen Objekten (auch nach es gibt) nicht, und verändere das/die im Akkusativ nie.',
      self_check: 'Ergänze: „Ich suche ___ (der) Schlüssel und kaufe ___ (ein) Apfel für ___ (mein) Freund.“',
    },
  },
  practice_mapping: [
    {
      id: 'a1-13-akk-articles',
      label_i18n: {
        en: 'Selecting den/einen/keinen vs. unchanged feminine, neuter, and plural articles in the accusative',
        fr: 'Choix de den/einen/keinen au masculin et maintien du féminin/neutre/pluriel à l’accusatif',
        de: 'Akkusativartikel (den/einen/keinen) sicher anwenden',
      },
      formats: ['multiple_choice', 'gap_fill', 'error_correction'],
    },
    {
      id: 'a1-13-akk-prepositions-questions',
      label_i18n: {
        en: 'Using accusative after für, ohne, durch, gegen, um, es gibt, and with Wen?/Was?',
        fr: 'Emploi de l’accusatif après für, ohne, durch, gegen, um, es gibt et avec Wen?/Was?',
        de: 'Akkusativ nach für, ohne, durch, gegen, um, es gibt sowie mit Wen?/Was?',
      },
      formats: ['gap_fill', 'translation', 'transformation'],
    },
  ],
};
