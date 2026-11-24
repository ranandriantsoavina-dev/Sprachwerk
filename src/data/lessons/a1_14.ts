import type { Lesson } from '../../types/domain';

export const LESSON_A1_14: Lesson = {
  id: 'a1-14',
  level: 'A1',
  unit: 14,
  title_en: 'Accusative personal pronouns',
  title_de: 'Personalpronomen im Akkusativ',
  topic: 'Accusative personal pronouns',
  hasContent: true,
  tags: ['personalpronomen', 'akkusativ', 'mich-dich-ihn'],
  estimated_study_minutes: 12,
  prerequisite_knowledge_i18n: {
    en: 'Requires nominative personal pronouns (Lesson A1-02) and the accusative case (Lesson A1-13).',
    fr: 'S’appuie sur les pronoms personnels au nominatif (A1-02) et l’accusatif (A1-13).',
    de: 'Setzt Personalpronomen im Nominativ (A1-02) und den Akkusativ (A1-13) voraus.',
  },
  objectives: {
    en: 'Use all nine accusative personal pronouns (mich, dich, ihn, sie, es, uns, euch, sie, Sie) as direct objects and after accusative prepositions.',
    fr: 'Employer les pronoms personnels à l’accusatif (mich, dich, ihn, sie, es, uns, euch, sie, Sie) comme COD et après les prépositions de l’accusatif.',
    de: 'Alle Personalpronomen im Akkusativ (mich, dich, ihn, sie, es, uns, euch, sie, Sie) als Objekt und nach Akkusativ-Präpositionen sicher verwenden.',
  },
  learning_objectives_i18n: {
    en: [
      'Transform nominative pronouns to accusative: ich → mich, du → dich, er → ihn, wir → uns, ihr → euch (while sie, es, and Sie stay unchanged).',
      'Replace masculine, feminine, neuter, and plural direct-object nouns with ihn, sie, or es according to grammatical gender.',
      'Use accusative pronouns correctly after für, ohne, durch, gegen, and um.',
    ],
    fr: [
      'Transformer les pronoms sujets en pronoms à l’accusatif : ich → mich, du → dich, er → ihn, wir → uns, ihr → euch (sie, es et Sie restant inchangés).',
      'Remplacer un COD nominal par ihn, sie ou es selon son genre grammatical.',
      'Employer les pronoms à l’accusatif après für, ohne, durch, gegen et um.',
    ],
    de: [
      'Personalpronomen vom Nominativ in den Akkusativ setzen: ich → mich, du → dich, er → ihn, wir → uns, ihr → euch (sie, es und Sie bleiben gleich).',
      'Akkusativobjekte je nach Genus/Numerus durch ihn, sie oder es ersetzen.',
      'Personalpronomen im Akkusativ nach für, ohne, durch, gegen und um anwenden.',
    ],
  },
  introduction_i18n: {
    en: 'Once you know how to form nouns in the accusative, you also need the accusative forms of personal pronouns so you can say "I see him", "Do you hear me?", or "This gift is for you" instead of repeating the same noun.',
    fr: 'Dès que vous savez employer les noms à l’accusatif, il vous faut les pronoms personnels correspondants pour dire « je le vois », « m’entends-tu ? » ou « ce cadeau est pour toi » sans répéter le nom.',
    de: 'Wenn du Nomen im Akkusativ verwendest, brauchst du auch die passenden Personalpronomen, um Sätze wie „Ich sehe ihn“, „Hörst du mich?“ oder „Das ist für dich“ zu bilden.',
  },
  explanation_i18n: {
    en: [
      '1. Five forms change—four stay the same',
      'Compare nominative → accusative:',
      '• ich → mich | du → dich | er → ihn | wir → uns | ihr → euch',
      '• sie (she) → sie | es → es | sie (they) → sie | Sie (formal) → Sie',
      '',
      '2. Replacing objects according to grammatical gender',
      'Just as in the nominative, object pronouns follow grammatical gender: "Kaufst du den Tisch? – Ja, ich kaufe ihn." (der Tisch → ihn). "Liest du die Zeitung? – Ja, ich lese sie." (die Zeitung → sie). "Nimmst du das Buch? – Ja, ich nehme es." (das Buch → es).',
      '',
      '3. Placement in simple statements and questions',
      'In a simple A1 sentence, the pronoun object directly follows the verb (unless inverted): "Ich besuche dich morgen." / "Hörst du mich?"',
    ].join('\n'),
    fr: [
      '1. Cinq formes changent, quatre restent identiques',
      'Comparez nominatif → accusatif :',
      '• ich → mich | du → dich | er → ihn | wir → uns | ihr → euch',
      '• sie (elle) → sie | es → es | sie (ils/elles) → sie | Sie (vouvoiement) → Sie',
      '',
      '2. Remplacer un COD selon le genre grammatical',
      'Comme au nominatif, le pronom suit le genre grammatical du nom : « Kaufst du den Tisch ? – Ja, ich kaufe ihn. » (der Tisch → ihn). « Liest du die Zeitung ? – Ja, ich lese sie. » (die Zeitung → sie). « Nimmst du das Buch ? – Ja, ich nehme es. » (das Buch → es).',
      '',
      '3. Place du pronom en allemand',
      'En allemand, le pronom COD se place après le verbe conjugué (et non avant le verbe comme en français) : « Ich besuche dich morgen. » (« Je te rends visite demain. ») / « Hörst du mich ? » (« M’entends-tu ? »).',
    ].join('\n'),
    de: [
      '1. Fünf Formen ändern sich – vier bleiben gleich',
      'Vergleiche Nominativ → Akkusativ:',
      '• ich → mich | du → dich | er → ihn | wir → uns | ihr → euch',
      '• sie (Sg.) → sie | es → es | sie (Pl.) → sie | Sie (höflich) → Sie',
      '',
      '2. Nomen durch Pronomen im Akkusativ ersetzen',
      'Wie im Nominativ richtet sich das Pronomen nach dem Genus des Nomens: „Kaufst du den Tisch? – Ja, ich kaufe ihn.“ (der Tisch → ihn), „Liest du die Zeitung? – Ja, ich lese sie.“, „Nimmst du das Buch? – Ja, ich nehme es.“',
      '',
      '3. Stellung im Satz',
      'In einfachen Sätzen steht das Pronomen meist direkt nach dem Verb (und vor Zeitangaben): „Ich besuche dich morgen.“ / „Hörst du mich?“',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-akk-pronouns-list',
      title: 'Pronomen im Akkusativ: mich, dich, ihn, sie, es, uns, euch, sie, Sie',
      body: 'Nur ich (mich), du (dich), er (ihn), wir (uns) und ihr (euch) unterscheiden sich vom Nominativ.',
      title_i18n: {
        en: 'Memorize the five changed forms: mich, dich, ihn, uns, euch',
        fr: 'Mémoriser les cinq formes modifiées : mich, dich, ihn, uns, euch',
        de: 'Fünf neue Formen merken: mich, dich, ihn, uns, euch',
      },
      body_i18n: {
        en: 'Notice the -n in ihn (matching den/einen). Feminine sie, neuter es, plural sie, and formal Sie stay unchanged.',
        fr: 'Repérez le -n de ihn (comme den/einen). Les formes sie, es, sie et Sie ne changent pas.',
        de: 'ihn endet auf -n (wie den/einen). sie, es, sie und Sie bleiben unverändert.',
      },
    },
    {
      id: 'rule-akk-pronoun-order',
      title: 'Pronomen stehen nach dem konjugierten Verb',
      body: 'Im Deutschen steht das Objektpronomen nach dem Verb: Ich sehe dich (nicht *Ich dich sehe).',
      title_i18n: {
        en: 'Place the pronoun after the conjugated verb',
        fr: 'Placer le pronom après le verbe conjugué',
        de: 'Das Pronomen steht nach dem Verb',
      },
      body_i18n: {
        en: 'Unlike French ("Je te vois"), German puts the object pronoun after the verb: "Ich sehe dich."',
        fr: 'Contrairement au français (« Je te vois »), l’allemand place le pronom après le verbe : « Ich sehe dich. »',
        de: 'Im Hauptsatz steht das Objektpronomen hinter dem Verb auf Position 2 („Ich sehe dich“).',
      },
    },
  ],
  tables: [
    {
      id: 'table-pronouns-nom-akk',
      title_i18n: {
        en: 'Personal Pronouns: Nominative vs. Accusative',
        fr: 'Pronoms personnels : Nominatif vs Accusatif',
        de: 'Personalpronomen im Nominativ und Akkusativ',
      },
      columns_i18n: {
        en: ['Nominative', 'Accusative', 'Example'],
        fr: ['Nominatif', 'Accusatif', 'Exemple'],
        de: ['Nominativ', 'Akkusativ', 'Beispiel'],
      },
      rows: [
        ['ich', 'mich', 'Verstehst du mich?'],
        ['du', 'dich', 'Ich rufe dich heute an.'],
        ['er', 'ihn', 'Der Film ist gut. Ich sehe ihn gern.'],
        ['sie (sg.)', 'sie', 'Die Tasche ist schön. Ich kaufe sie.'],
        ['es', 'es', 'Das Buch ist neu. Ich lese es.'],
        ['wir', 'uns', 'Besuchst du uns am Sonntag?'],
        ['ihr', 'euch', 'Wir laden euch herzlich ein.'],
        ['sie (pl.)', 'sie', 'Die Äpfel sind frisch. Wir essen sie.'],
        ['Sie', 'Sie', 'Ich frage Sie morgen.'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Hörst du mich? – Ja, ich höre dich gut.',
      highlight: 'mich / dich',
      note: '1st and 2nd person singular accusative pronouns',
      translation_i18n: {
        en: 'Do you hear me? – Yes, I hear you well.',
        fr: 'M’entends-tu ? – Oui, je t’entends bien.',
        de: 'Hörst du mich? – Ja, ich höre dich gut.',
      },
      explanation_i18n: {
        en: 'Uses mich ("me") and dich ("you") as direct objects after hören.',
        fr: 'Emploie mich (« me ») et dich (« te ») après le verbe hören.',
        de: 'Zeigt mich und dich als Akkusativobjekte nach hören.',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Wo ist mein Stift? Ich finde ihn nicht!',
      highlight: 'ihn',
      note: 'der Stift → ihn (masculine accusative)',
      translation_i18n: {
        en: 'Where is my pen? I can’t find it!',
        fr: 'Où est mon stylo ? Je ne le trouve pas !',
        de: 'Wo ist mein Stift? Ich finde ihn nicht!',
      },
      explanation_i18n: {
        en: 'Because der Stift is masculine, "find it" uses ihn (not es).',
        fr: 'Comme der Stift est masculin, « le » se traduit par ihn (et non es).',
        de: 'der Stift ist maskulin; als Akkusativobjekt wird er durch ihn ersetzt.',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Diese Blumen sind für dich, und das Paket ist für uns.',
      highlight: 'für dich / für uns',
      note: 'Accusative pronouns after für',
      translation_i18n: {
        en: 'These flowers are for you, and the parcel is for us.',
        fr: 'Ces fleurs sont pour toi, et le colis est pour nous.',
        de: 'Diese Blumen sind für dich, und das Paket ist für uns.',
      },
      explanation_i18n: {
        en: 'After für, German always requires the accusative pronoun (dich, uns).',
        fr: 'Après für, on emploie toujours le pronom à l’accusatif (dich, uns).',
        de: 'Nach der Akkusativ-Präposition für stehen dich und uns im Akkusativ.',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-ihn-vs-er',
      contrast_pair: 'Er ist neu. (Nom.)  vs.  Ich kaufe ihn. (Akk.)',
      title_i18n: {
        en: 'Masculine object: er (Nom.) vs. ihn (Akk.)',
        fr: 'Objet masculin : er (Nom.) vs ihn (Akk.)',
        de: 'Maskulinum: er (Nominativ) vs. ihn (Akkusativ)',
      },
      body_i18n: {
        en: 'For masculine nouns, remember the pair er (subject) / ihn (direct object): "Der Kuchen ist lecker. Ich esse ihn gern."',
        fr: 'Pour un nom masculin, retenez le couple er (sujet) / ihn (COD) : « Der Kuchen ist lecker. Ich esse ihn gern. »',
        de: 'Bei maskulinen Nomen unterscheidet man er (Subjekt) und ihn (Akkusativobjekt): „Der Kuchen ist lecker. Ich esse ihn gern.“',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Der Mantel ist schön. Ich kaufe er.',
      right: 'Der Mantel ist schön. Ich kaufe ihn.',
      explanation_i18n: {
        en: 'Mantel is the direct object of kaufe (accusative), so masculine er must become ihn.',
        fr: 'Mantel est COD de kaufe (accusatif) : le pronom masculin doit être ihn et non er.',
        de: 'Nach kaufen steht der Akkusativ; das maskuline Pronomen heißt ihn, nicht er.',
      },
      principle_i18n: {
        en: 'Replace masculine direct objects with ihn (never er or es).',
        fr: 'Remplacez un COD masculin par ihn (jamais er ou es).',
        de: 'Ersetze ein maskulines Akkusativobjekt immer durch ihn.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Ich dich liebe. / Wir euch besuchen.',
      right: 'Ich liebe dich. / Wir besuchen euch.',
      explanation_i18n: {
        en: 'In a German main clause, the conjugated verb stays in Position 2, so the pronoun follows the verb.',
        fr: 'En proposition principale allemande, le verbe reste en position 2 : le pronom se place après le verbe.',
        de: 'Im deutschen Hauptsatz steht das Verb an Position 2; das Pronomen folgt nach dem Verb.',
      },
      principle_i18n: {
        en: 'Put the conjugated verb in Position 2 before the object pronoun.',
        fr: 'Placez toujours le verbe en position 2 avant le pronom complément.',
        de: 'Lass das konjugierte Verb auf Position 2 vor dem Objektpronomen.',
      },
    },
    {
      id: 'cm-3',
      wrong: 'Ohne du gehe ich nicht.',
      right: 'Ohne dich gehe ich nicht.',
      explanation_i18n: {
        en: 'The preposition ohne requires the accusative case, so du changes to dich.',
        fr: 'La préposition ohne exige l’accusatif : du devient donc dich.',
        de: 'Nach ohne steht immer der Akkusativ (dich statt du).',
      },
      principle_i18n: {
        en: 'Use accusative pronouns (mich, dich, ihn, uns, euch) after für, ohne, durch, gegen, um.',
        fr: 'Employez les pronoms à l’accusatif après für, ohne, durch, gegen, um.',
        de: 'Nach für, ohne, durch, gegen, um stehen immer Akkusativpronomen.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'Accusative personal pronouns are mich, dich, ihn, sie, es, uns, euch, sie, Sie.',
      key_pattern: 'ich → mich | du → dich | er → ihn | wir → uns | ihr → euch; pronoun follows the conjugated verb.',
      mistake_warning: 'Never use *er or *es for a masculine der-object (*Ich finde es → Ich finde ihn for der Schlüssel).',
      self_check: 'Replace the bold nouns with pronouns: "Ich kenne **den Mann**, aber ich sehe **die Frau** und **dich** nicht."',
    },
    fr: {
      central_rule: 'Les pronoms personnels à l’accusatif sont mich, dich, ihn, sie, es, uns, euch, sie, Sie.',
      key_pattern: 'ich → mich | du → dich | er → ihn | wir → uns | ihr → euch ; le pronom suit le verbe conjugué.',
      mistake_warning: 'N’utilisez pas *er ni *es pour un objet masculin (der Schlüssel → ihn).',
      self_check: 'Remplacez les noms par des pronoms : « Ich kenne **den Mann**, und ich höre **das Kind** und **meine Freunde**. »',
    },
    de: {
      central_rule: 'Die Personalpronomen im Akkusativ lauten: mich, dich, ihn, sie, es, uns, euch, sie, Sie.',
      key_pattern: 'ich → mich | du → dich | er → ihn | wir → uns | ihr → euch; das Pronomen steht hinter dem Verb.',
      mistake_warning: 'Ersetze maskuline Objekte mit ihn (nie *er oder *es für der Schlüssel).',
      self_check: 'Ersetze durch Pronomen: „Ich kenne den Mann, ich lese die Zeitung und ich suche das Buch.“',
    },
  },
  practice_mapping: [
    {
      id: 'a1-14-akk-pronoun-forms',
      label_i18n: {
        en: 'Selecting mich, dich, ihn, sie, es, uns, euch, sie, Sie in direct-object and prepositional slots',
        fr: 'Choix de mich, dich, ihn, sie, es, uns, euch, sie, Sie comme COD et après préposition',
        de: 'Auswahl der Akkusativpronomen im Satz und nach Präpositionen',
      },
      formats: ['multiple_choice', 'gap_fill', 'matching'],
    },
    {
      id: 'a1-14-noun-replacement',
      label_i18n: {
        en: 'Replacing der/die/das/plural objects with ihn, sie, es, and sie',
        fr: 'Remplacement des COD nominaux par ihn, sie, es et sie',
        de: 'Akkusativobjekte durch ihn, sie, es und sie ersetzen',
      },
      formats: ['transformation', 'error_correction', 'gap_fill'],
    },
  ],
};
