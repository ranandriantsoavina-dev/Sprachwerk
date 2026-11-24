import type { Lesson } from '../../types/domain';

export const LESSON_A1_15: Lesson = {
  id: 'a1-15',
  level: 'A1',
  unit: 15,
  title_en: 'Possessive articles',
  title_de: 'Possessivartikel',
  topic: 'Possessive articles',
  hasContent: true,
  tags: ['possessivartikel', 'mein-dein-sein-ihr', 'nominativ', 'akkusativ'],
  estimated_study_minutes: 15,
  prerequisite_knowledge_i18n: {
    en: 'Builds on indefinite articles (A1-09), nominative (A1-12), and accusative (A1-13).',
    fr: 'S’appuie sur les articles indéfinis (A1-09), le nominatif (A1-12) et l’accusatif (A1-13).',
    de: 'Baut auf den unbestimmten Artikeln (A1-09), dem Nominativ (A1-12) und dem Akkusativ (A1-13) auf.',
  },
  objectives: {
    en: 'Choose the correct German possessive stem (mein, dein, sein, ihr, unser, euer, ihr/Ihr) for the owner and apply the right nominative or accusative ending for the noun.',
    fr: 'Choisir le bon déterminant possessif (mein, dein, sein, ihr, unser, euer, ihr/Ihr) selon le possesseur et accorder sa terminaison au nominatif et à l’accusatif.',
    de: 'Den passenden Possessivartikel je nach Besitzer wählen (mein, dein, sein, ihr, unser, euer, ihr/Ihr) und im Nominativ sowie Akkusativ richtig deklinierten.',
  },
  learning_objectives_i18n: {
    en: [
      'Match each personal pronoun to its possessive stem: ich → mein, du → dein, er/es → sein, sie → ihr, wir → unser, ihr → euer, sie/Sie → ihr/Ihr.',
      'Attach the ein-word endings (-, -e, -en) based on the grammatical gender, number, and case of the possessed noun.',
      'Apply the e-drop rule with euer before endings (euer Hund → eure Katze, euren Freund).',
      'Distinguish sein (his/its) from ihr (her/their) and Ihr (your, formal).',
    ],
    fr: [
      'Associer chaque pronom à son radical possessif : ich → mein, du → dein, er/es → sein, sie → ihr, wir → unser, ihr → euer, sie/Sie → ihr/Ihr.',
      'Ajouter les terminaisons de type ein (-, -e, -en) selon le genre, le nombre et le cas du nom possédé.',
      'Appliquer la chute du -e- dans euer devant une terminaison (euer Hund → eure Katze, euren Freund).',
      'Distinguer sein (son/sa à lui) de ihr (son/sa à elle ou leur) et Ihr (votre, vouvoiement).',
    ],
    de: [
      'Jedem Personalpronomen den richtigen Possessivstamm zuordnen: ich → mein, du → dein, er/es → sein, sie → ihr, wir → unser, ihr → euer, sie/Sie → ihr/Ihr.',
      'Die Endungen wie bei ein/kein (-, -e, -en) nach Genus, Numerus und Kasus des Nomens anhängen.',
      'Bei euer vor einer Endung das innere e streichen (euer Hund → eure Katze, euren Freund).',
      'sein (männlicher/sächlicher Besitzer), ihr (weibliche Besitzerin / Plural) und Ihr (Sie-Form) sicher unterscheiden.',
    ],
  },
  introduction_i18n: {
    en: 'Possessive articles such as mein (my), dein (your), and unser (our) replace articles like ein or der before a noun to show who owns or belongs to someone or something. German possessive articles work with a two-step logic: the stem tells you who the owner is, while the ending matches the noun itself.',
    fr: 'Les déterminants possessifs comme mein (mon/ma/mes), dein (ton/ta/tes) ou unser (notre/nos) remplacent l’article devant un nom pour exprimer l’appartenance. En allemand, ils obéissent à deux axes clairs : le radical indique le possesseur, et la terminaison s’accorde avec le nom possédé.',
    de: 'Possessivartikel wie mein, dein oder unser stehen wie ein Artikel vor dem Nomen und zeigen Besitz oder Zugehörigkeit an. Im Deutschen gilt ein einfaches Zwei-Schritte-Prinzip: Der Stamm nennt den Besitzer, und die Endung richtet sich nach dem Nomen dahinter.',
  },
  explanation_i18n: {
    en: [
      '1. Step 1 — Choose the stem according to the owner',
      'ich → mein- | du → dein- | er → sein- | es → sein- | sie (she) → ihr- | wir → unser- | ihr (you pl.) → euer- | sie (they) → ihr- | Sie (formal) → Ihr- (always capitalized).',
      'Notice that er and es share the stem sein-, while sie (she) and sie (they) share ihr-.',
      '',
      '2. Step 2 — Choose the ending according to the noun',
      'Possessive articles take the exact same endings as kein in nominative and accusative:',
      '• Masculine nominative & Neuter nom./acc.: no ending (mein Vater, mein Buch).',
      '• Feminine nom./acc. & All Plurals nom./acc.: -e (meine Mutter, meine Bücher).',
      '• Masculine accusative: -en (Ich suche meinen Schlüssel).',
      '',
      '3. Spelling note for euer',
      'Whenever euer gets an ending (-e or -en), the second e inside the stem drops: euer Lehrer, but eure Lehrerin, euren Lehrer, eure Kinder.',
    ].join('\n'),
    fr: [
      '1. Étape 1 — Choisir le radical selon le possesseur',
      'ich → mein- | du → dein- | er → sein- | es → sein- | sie (elle) → ihr- | wir → unser- | ihr (vous fam.) → euer- | sie (ils/elles) → ihr- | Sie (vous poli) → Ihr- (toujours avec majuscule).',
      'Remarque : er et es ont le même radical sein-, et sie (elle) comme sie (ils/elles) ont ihr-.',
      '',
      '2. Étape 2 — Ajouter la terminaison selon le nom possédé',
      'Les possessifs suivent exactement le modèle de kein au nominatif et à l’accusatif :',
      '• Masculin nominatif et Neutre nom./acc. : sans terminaison (mein Vater, mein Buch).',
      '• Féminin nom./acc. et Pluriel nom./acc. : -e (meine Mutter, meine Bücher).',
      '• Masculin accusatif : -en (Ich suche meinen Schlüssel).',
      '',
      '3. Particularité de euer',
      'Dès que euer prend une terminaison (-e ou -en), le deuxième e du radical disparaît : euer Lehrer, mais eure Lehrerin, euren Lehrer, eure Kinder.',
    ].join('\n'),
    de: [
      '1. Schritt 1 — Stamm nach dem Besitzer wählen',
      'ich → mein- | du → dein- | er → sein- | es → sein- | sie (Singular) → ihr- | wir → unser- | ihr (Plural) → euer- | sie (Plural) → ihr- | Sie (Höflichkeitsform) → Ihr- (immer großgeschrieben).',
      'er und es teilen sich sein-; sie (Sg.) und sie (Pl.) teilen sich ihr-.',
      '',
      '2. Schritt 2 — Endung nach dem Nomen dahinter wählen',
      'Possessivartikel bekommen im Nominativ und Akkusativ genau dieselben Endungen wie kein:',
      '• Maskulin Nominativ sowie Neutrum Nom./Akk.: ohne Endung (mein Vater, mein Buch).',
      '• Feminin Nom./Akk. sowie Plural Nom./Akk.: -e (meine Mutter, meine Bücher).',
      '• Maskulin Akkusativ: -en (Ich suche meinen Schlüssel).',
      '',
      '3. Besonderheit bei euer',
      'Bekommen Formen von euer eine Endung (-e oder -en), fällt das zweite e im Stamm weg: euer Freund, aber eure Freundin, euren Freund, eure Freunde.',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-possessive-two-axes',
      title: 'Zwei Achsen: Besitzer = Stamm, Nomen = Endung',
      body: 'Der Stamm zeigt den Besitzer (mein, dein, sein, ihr...), die Endung richtet sich nach Genus, Numerus und Kasus des Nomens.',
      title_i18n: {
        en: 'Two axes: owner determines stem, noun determines ending',
        fr: 'Deux axes : possesseur = radical, nom = terminaison',
        de: 'Zwei Achsen: Besitzer = Stamm, Nomen = Endung',
      },
      body_i18n: {
        en: 'Unlike English "his/her", German endings depend on the grammatical gender and case of the following noun: sein Vater (masculine), seine Mutter (feminine).',
        fr: 'En allemand, la terminaison ne dépend pas du sexe du possesseur mais du genre et du cas du nom qui suit : sein Vater (masculin), seine Mutter (féminin).',
        de: 'Die Endung hängt nie vom Besitzer ab, sondern immer von Genus, Numerus und Kasus des folgenden Nomens: sein Vater, seine Mutter.',
      },
    },
    {
      id: 'rule-possessive-masculine-acc',
      title: 'Maskulin im Akkusativ endet auf -en',
      body: 'Wie einen und keinen endet auch der maskuline Possessivartikel im Akkusativ auf -en: meinen, deinen, seinen, ihren, unseren, euren, Ihren.',
      title_i18n: {
        en: 'Masculine accusative ends in -en',
        fr: 'Le masculin accusatif se termine par -en',
        de: 'Maskulin im Akkusativ endet auf -en',
      },
      body_i18n: {
        en: 'Just like einen and keinen, every possessive takes -en before a masculine singular direct object: "Ich nehme meinen Kaffee."',
        fr: 'Comme einen et keinen, le possessif prend -en devant un complément d’objet direct masculin singulier : « Ich nehme meinen Kaffee. »',
        de: 'Wie einen und keinen erhalten Possessivartikel vor einem maskulinen Akkusativobjekt die Endung -en: „Ich nehme meinen Kaffee.“',
      },
    },
    {
      id: 'rule-possessive-euer-drop',
      title: 'euer verliert das zweite e vor einer Endung',
      body: 'euer Bruder (ohne Endung), aber eure Schwester und euren Bruder (mit Endung).',
      title_i18n: {
        en: 'euer drops its second -e- before endings',
        fr: 'euer perd son deuxième -e- devant une terminaison',
        de: 'euer verliert das zweite e vor einer Endung',
      },
      body_i18n: {
        en: 'Use euer without endings (euer Auto), and drop the inner -e- whenever -e or -en is added (eure Tasche, euren Hund).',
        fr: 'On écrit euer sans terminaison (euer Auto), mais eure et euren dès qu’une terminaison s’ajoute (eure Tasche, euren Hund).',
        de: 'Ohne Endung heißt es euer (euer Auto), mit Endung eure oder euren (eure Tasche, euren Hund).',
      },
    },
  ],
  tables: [
    {
      id: 'tbl-possessive-stems',
      title_i18n: {
        en: 'Possessive stems and endings (Nominative & Accusative)',
        fr: 'Radicaux possessifs et terminaisons (Nominatif et Accusatif)',
        de: 'Possessivartikel im Nominativ und Akkusativ',
      },
      columns_i18n: {
        en: ['Owner', 'Stem', 'Masc. Nom. / Neut.', 'Masc. Acc.', 'Fem. & Plural'],
        fr: ['Possesseur', 'Radical', 'Masc. Nom. / Neutre', 'Masc. Acc.', 'Féminin & Pluriel'],
        de: ['Besitzer', 'Stamm', 'Mask. Nom. / Neutrum', 'Mask. Akk.', 'Feminin & Plural'],
      },
      rows: [
        ['ich', 'mein-', 'mein', 'meinen', 'meine'],
        ['du', 'dein-', 'dein', 'deinen', 'deine'],
        ['er / es', 'sein-', 'sein', 'seinen', 'seine'],
        ['sie (sg.)', 'ihr-', 'ihr', 'ihren', 'ihre'],
        ['wir', 'unser-', 'unser', 'unseren', 'unsere'],
        ['ihr (pl.)', 'euer-', 'euer', 'euren', 'eure'],
        ['sie (pl.)', 'ihr-', 'ihr', 'ihren', 'ihre'],
        ['Sie (formal)', 'Ihr-', 'Ihr', 'Ihren', 'Ihre'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Mein Bruder wohnt in Hamburg, aber meine Schwester lebt in Basel.',
      highlight: 'Mein / meine',
      note: 'Nominative masculine (mein) vs. feminine (meine)',
      translation_i18n: {
        en: 'My brother lives in Hamburg, but my sister lives in Basel.',
        fr: 'Mon frère habite à Hambourg, mais ma sœur vit à Bâle.',
        de: 'Mein Bruder wohnt in Hamburg, aber meine Schwester lebt in Basel.',
      },
      explanation_i18n: {
        en: 'Both nouns are nominative subjects; Bruder is masculine (mein) and Schwester is feminine (meine).',
        fr: 'Les deux noms sont sujets au nominatif : Bruder est masculin (mein) et Schwester est féminin (meine).',
        de: 'Beide Nomen stehen im Nominativ: der Bruder → mein, die Schwester → meine.',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Paul sucht seinen Pass und sein Handy.',
      highlight: 'seinen / sein',
      note: 'Accusative masculine (-en) vs. neuter (no ending)',
      translation_i18n: {
        en: 'Paul is looking for his passport and his mobile phone.',
        fr: 'Paul cherche son passeport et son téléphone portable.',
        de: 'Paul sucht seinen Pass und sein Handy.',
      },
      explanation_i18n: {
        en: 'suchen takes the accusative: der Pass (masculine) → seinen Pass; das Handy (neuter) → sein Handy.',
        fr: 'suchen régit l’accusatif : der Pass (masculin) → seinen Pass ; das Handy (neutre) → sein Handy.',
        de: 'suchen verlangt den Akkusativ: der Pass (maskulin) → seinen Pass; das Handy (neutrum) → sein Handy.',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Anna besucht heute ihre Großeltern.',
      highlight: 'ihre',
      note: 'Plural accusative with female owner (ihr + -e)',
      translation_i18n: {
        en: 'Anna is visiting her grandparents today.',
        fr: 'Anna rend visite à ses grands-parents aujourd’hui.',
        de: 'Anna besucht heute ihre Großeltern.',
      },
      explanation_i18n: {
        en: 'Anna takes the stem ihr-, and the plural noun Großeltern adds -e in the accusative.',
        fr: 'Pour Anna, le radical est ihr-, et le pluriel Großeltern prend la terminaison -e.',
        de: 'Für Anna gilt der Stamm ihr-; im Plural steht die Endung -e: ihre Großeltern.',
      },
    },
    {
      id: 'ex-4',
      sentence: 'Vergesst bitte eure Fahrkarten und euren Ausweis nicht!',
      highlight: 'eure / euren',
      note: 'euer stem drops inner -e- before endings',
      translation_i18n: {
        en: 'Please do not forget your tickets and your ID!',
        fr: 'N’oubliez pas vos billets et votre pièce d’identité !',
        de: 'Vergesst bitte eure Fahrkarten und euren Ausweis nicht!',
      },
      explanation_i18n: {
        en: 'With ihr (you plural), euer becomes eure (plural Fahrkarten) and euren (masculine accusative Ausweis).',
        fr: 'Avec ihr (vous), euer devient eure (pluriel) et euren (masculin accusatif).',
        de: 'Bei ihr entfällt vor einer Endung das e im Stamm: eure (Plural), euren (Maskulin Akkusativ).',
      },
    },
    {
      id: 'ex-5',
      sentence: 'Frau Becker, ist das Ihre Tasche oder Ihr Koffer?',
      highlight: 'Ihre / Ihr',
      note: 'Formal Ihr is always capitalized',
      translation_i18n: {
        en: 'Ms. Becker, is this your bag or your suitcase?',
        fr: 'Madame Becker, est-ce votre sac ou votre valise ?',
        de: 'Frau Becker, ist das Ihre Tasche oder Ihr Koffer?',
      },
      explanation_i18n: {
        en: 'Capitalized Ihr addresses Frau Becker politely; Tasche (f.) takes Ihre, Koffer (m. nominative) takes Ihr.',
        fr: 'Ihr avec majuscule correspond au vouvoiement ; die Tasche → Ihre, der Koffer (nominatif) → Ihr.',
        de: 'Großgeschriebenes Ihr zeigt die Höflichkeitsform; die Tasche → Ihre, der Koffer (Nominativ) → Ihr.',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-sein-ihr-Ihr',
      contrast_pair: 'sein  vs.  ihr  vs.  Ihr',
      title_i18n: {
        en: 'Distinguishing sein, ihr, and Ihr',
        fr: 'Distinguer sein, ihr et Ihr',
        de: 'sein, ihr und Ihr unterscheiden',
      },
      body_i18n: {
        en: 'Use sein for a male or neuter owner ("Das Kind sucht seinen Ball"), lowercase ihr for one female owner or several owners ("Marie und Tom suchen ihr Auto"), and capitalized Ihr for formal "you" ("Herr Müller, hier ist Ihr Schlüssel").',
        fr: 'Utilisez sein pour un possesseur masculin ou neutre (« Das Kind sucht seinen Ball »), ihr (minuscule) pour une femme ou plusieurs possesseurs (« ihr Auto ») et Ihr (majuscule) pour le vouvoiement (« Ihr Schlüssel »).',
        de: 'sein gilt für er/es („Das Kind sucht seinen Ball“), kleingeschriebenes ihr für sie (Singular und Plural) und großgeschriebenes Ihr für die Anrede Sie.',
      },
    },
    {
      id: 'contrast-unser-vs-euer',
      contrast_pair: 'unser / unsere  vs.  euer / eure',
      title_i18n: {
        en: 'unser keeps its -e-; euer drops it before endings',
        fr: 'unser garde son -e-, euer le perd devant une terminaison',
        de: 'unser behält das e, euer verliert es vor Endungen',
      },
      body_i18n: {
        en: 'Standard spelling keeps the e in unser (unsere Wohnung, unseren Lehrer), whereas euer routinely drops the second e (eure Wohnung, euren Lehrer).',
        fr: 'L’orthographe standard conserve le e de unser (unsere Wohnung), tandis que euer perd son deuxième e dès qu’il prend une terminaison (eure Wohnung).',
        de: 'Bei unser bleibt das e erhalten (unsere Wohnung, unseren Lehrer), bei euer fällt es vor -e und -en weg (eure Wohnung, euren Lehrer).',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Tom besucht heute ihr Freund.',
      right: 'Tom besucht heute seinen Freund.',
      explanation_i18n: {
        en: 'Two mistakes often appear together: Tom is male (stem sein-, not ihr-), and der Freund is a masculine accusative object (seinen, not sein).',
        fr: 'Tom étant masculin, le radical est sein- (et non ihr-), et der Freund à l’accusatif prend -en (seinen).',
        de: 'Tom verlangt den Stamm sein-, und der Freund steht nach besuchen im Akkusativ Maskulin: seinen Freund.',
      },
      principle_i18n: {
        en: 'Choose the stem from the owner (Tom → sein) and the ending from the noun case (masculine acc. → -en).',
        fr: 'Choisissez le radical selon le possesseur et la terminaison selon le cas et le genre du nom.',
        de: 'Stamm nach dem Besitzer, Endung nach Genus und Kasus des Nomens.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Ist das euer Katze?',
      right: 'Ist das eure Katze?',
      explanation_i18n: {
        en: 'Katze is feminine (die Katze), so it needs the -e ending and drops the second e in euer → eure.',
        fr: 'Katze est féminin (die Katze) : le possessif prend -e et euer devient eure.',
        de: 'Katze ist feminin (die Katze); deshalb braucht man die Endung -e und schreibt eure.',
      },
      principle_i18n: {
        en: 'Add -e for feminine and plural nouns, and drop the inner -e- in eure/euren.',
        fr: 'Ajoutez -e au féminin et au pluriel, et utilisez la forme contractée eure/euren.',
        de: 'Vor femininen und pluralen Nomen steht -e; bei euer entfällt dabei das innere e.',
      },
    },
    {
      id: 'cm-3',
      wrong: 'Ich sehe mein Vater morgen.',
      right: 'Ich sehe meinen Vater morgen.',
      explanation_i18n: {
        en: 'sehen requires the accusative case, and Vater is masculine (der Vater → meinen Vater).',
        fr: 'sehen demande l’accusatif et Vater est masculin (der Vater → meinen Vater).',
        de: 'sehen verlangt den Akkusativ; da Vater maskulin ist, muss es meinen Vater heißen.',
      },
      principle_i18n: {
        en: 'Always mark masculine singular direct objects with -en on the possessive article.',
        fr: 'Marquez toujours l’objet direct masculin singulier avec la terminaison -en.',
        de: 'Maskuline Akkusativobjekte brauchen immer die Endung -en.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'Owner picks the stem (mein, dein, sein, ihr, unser, euer, ihr, Ihr); noun gender, number, and case pick the ending (-, -e, -en).',
      key_pattern: 'Masc. nom. & Neut.: mein | Fem. & Plural: meine | Masc. acc.: meinen.',
      mistake_warning: 'Do not forget -en in the masculine accusative (meinen Bruder) and drop the inner e in eure / euren.',
      self_check: 'Translate: "She is looking for her bag and her brother." (die Tasche, der Bruder)',
    },
    fr: {
      central_rule: 'Le possesseur donne le radical (mein, dein, sein, ihr, unser, euer, ihr, Ihr) ; le nom possédé donne la terminaison (-, -e, -en).',
      key_pattern: 'Masc. nom. & Neutre : mein | Fém. & Pluriel : meine | Masc. acc. : meinen.',
      mistake_warning: 'N’oubliez pas le -en au masculin accusatif (meinen Bruder) ni la contraction eure / euren.',
      self_check: 'Traduisez : « Elle cherche son sac et son frère. » (die Tasche, der Bruder)',
    },
    de: {
      central_rule: 'Der Besitzer bestimmt den Stamm (mein, dein, sein, ihr, unser, euer, ihr, Ihr), das Nomen bestimmt die Endung (-, -e, -en).',
      key_pattern: 'Mask. Nom. & Neutrum: mein | Fem. & Plural: meine | Mask. Akk.: meinen.',
      mistake_warning: 'Vergiss -en im maskulinen Akkusativ nicht (meinen Bruder) und schreibe eure / euren ohne das zweite e.',
      self_check: 'Ergänze für „sie“ (Singular): „Sie sucht ___ Tasche und ___ Bruder.“',
    },
  },
  practice_mapping: [
    {
      id: 'a1-15-stem-by-owner',
      label_i18n: {
        en: 'Selecting the possessive stem for the owner (mein/dein/sein/ihr/unser/euer/Ihr)',
        fr: 'Choix du radical possessif selon le possesseur',
        de: 'Den passenden Possessivstamm zum Besitzer wählen',
      },
      formats: ['multiple_choice', 'matching', 'gap_fill'],
    },
    {
      id: 'a1-15-nom-acc-endings',
      label_i18n: {
        en: 'Inflecting possessive articles in nominative and accusative (-, -e, -en)',
        fr: 'Accord des déterminants possessifs au nominatif et à l’accusatif',
        de: 'Possessivartikel im Nominativ und Akkusativ deklinieren',
      },
      formats: ['gap_fill', 'error_correction', 'multiple_choice'],
    },
    {
      id: 'a1-15-euer-contraction',
      label_i18n: {
        en: 'Applying the e-drop rule in eure and euren',
        fr: 'Application de la forme contractée eure / euren',
        de: 'Richtiger Gebrauch von euer, eure und euren',
      },
      formats: ['gap_fill', 'error_correction'],
    },
  ],
};
