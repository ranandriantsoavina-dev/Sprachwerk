import type { Lesson } from '../../types/domain';

export const LESSON_A1_26: Lesson = {
  id: 'a1-26',
  level: 'A1',
  unit: 26,
  title_en: 'Prepositions of place',
  title_de: 'Lokale Präpositionen',
  topic: 'Prepositions of place',
  hasContent: true,
  tags: ['lokale-praepositionen', 'wo-wohin-woher', 'nach-in-zu-aus', 'zu-hause'],
  estimated_study_minutes: 15,
  prerequisite_knowledge_i18n: {
    en: 'Connects wo / wohin / woher (A1-18) and definite articles (A1-08). Full dative and two-way prepositions are studied in A2.',
    fr: 'Relie wo / wohin / woher (A1-18) et les articles définis (A1-08). Le datif complet et les prépositions mixtes sont étudiés en A2.',
    de: 'Verbindet wo / wohin / woher (A1-18) und Artikel (A1-08). Der vollständige Dativ und alle Wechselpräpositionen folgen in A2.',
  },
  objectives: {
    en: 'Use core A1 place expressions accurately to answer Wo? (in, an, auf, bei, zu Hause), Wohin? (nach, in/ins, zu/zum/zur, nach Hause), and Woher? (aus, von/vom).',
    fr: 'Employer les expressions de lieu essentielles au niveau A1 pour répondre à Wo? (in, an, auf, bei, zu Hause), Wohin? (nach, in/ins, zu/zum/zur, nach Hause) et Woher? (aus, von/vom).',
    de: 'Die wichtigsten A1-Ortsangaben sicher für Wo? (in, an, auf, bei, zu Hause), Wohin? (nach, in/ins, zu/zum/zur, nach Hause) und Woher? (aus, von/vom) anwenden.',
  },
  learning_objectives_i18n: {
    en: [
      'Answer Wohin? (destination): nach for cities, continents, and countries without articles + nach Hause; in (ins / in die) for enclosed spaces and countries with articles; zu (zum / zur) for people, shops, and institutions.',
      'Answer Wo? (location): in (im / in der) for cities, countries, and indoor rooms; bei for people and workplaces; an / auf in common fixed expressions (am Bahnhof, auf der Arbeit), plus zu Hause.',
      'Answer Woher? (origin): aus for countries, cities, and buildings; von (vom) for people, activities, and open places.',
    ],
    fr: [
      'Répondre à Wohin? (destination) : nach pour les villes et pays sans article + nach Hause ; in (ins / in die) pour les lieux fermés et pays avec article ; zu (zum / zur) pour les personnes, commerces et services.',
      'Répondre à Wo? (lieu fixe) : in (im / in der) pour villes, pays et intérieurs ; bei pour les personnes et employeurs ; an / auf dans les expressions courantes (am Bahnhof, auf der Arbeit) et zu Hause.',
      'Répondre à Woher? (origine) : aus pour pays, villes et intérieurs ; von (vom) pour personnes, activités et lieux ouverts.',
    ],
    de: [
      'Wohin? (Ziel) beantworten: nach für Städte und Länder ohne Artikel sowie nach Hause; in (ins / in die) für Räume und Länder mit Artikel; zu (zum / zur) für Personen, Geschäfte und Einrichtungen.',
      'Wo? (Ort) beantworten: in (im / in der) für Städte, Länder und Räume; bei für Personen und Firmen; feste Verbindungen wie am Bahnhof, auf der Arbeit und zu Hause.',
      'Woher? (Herkunft) beantworten: aus für Länder, Städte und Gebäude; von (vom) für Personen, Aktivitäten und Orte.',
    ],
  },
  introduction_i18n: {
    en: 'In German, local prepositions depend on whether you are talking about being somewhere (Wo?), going somewhere (Wohin?), or coming from somewhere (Woher?). At A1, learning the core everyday combinations (like nach Berlin, in die Schule, zum Arzt, aus Italien, and zu Hause vs. nach Hause) lets you describe locations and directions naturally.',
    fr: 'En allemand, les prépositions de lieu dépendent d’abord de la question posée : être quelque part (Wo?), aller quelque part (Wohin?) ou venir de quelque part (Woher?). Au niveau A1, la maîtrise des combinaisons courantes (nach Berlin, in die Schule, zum Arzt, aus Italien, zu Hause vs nach Hause) vous permet de vous orienter au quotidien.',
    de: 'Lokale Präpositionen richten sich im Deutschen nach der Frage: Bist du an einem Ort (Wo?), gehst du irgendwohin (Wohin?) oder kommst du irgendwoher (Woher?). Mit den festen A1-Grundmustern kannst du Orte, Ziele und Herkunft sicher benennen.',
  },
  explanation_i18n: {
    en: [
      '1. Wohin? (Going to a destination)',
      '• nach = cities, continents, compass points, and countries WITHOUT an article ("Ich fliege nach Spanien / nach München / nach Norden"), plus the fixed phrase "nach Hause" (going home).',
      '• in (+ accusative: in den, in die, ins = in das) = enclosed spaces ("ins Kino", "in die Küche", "in den Park") and countries WITH an article ("in die Schweiz", "in die Türkei", "in die USA").',
      '• zu (zum = zu dem, zur = zu der) = people, jobs, events, and everyday errands ("zum Arzt", "zur Post", "zur Arbeit", "zu Anna").',
      '',
      '2. Wo? (Being at a location)',
      '• in (im = in dem, in der) = cities ("in Wien"), countries ("in Frankreich", "in der Schweiz"), and rooms/buildings ("im Büro", "in der Schule").',
      '• bei (beim = bei dem) = at someone’s place ("bei meinen Eltern"), at a company/workplace ("Ich arbeite bei Siemens"), or during an appointment ("beim Arzt").',
      '• Common fixed expressions: "zu Hause" (at home), "am Bahnhof" (at the station), "auf der Arbeit" / "bei der Arbeit" (at work), "an der Universität".',
      '',
      '3. Woher? (Coming from somewhere)',
      '• aus = from cities, countries, and inside buildings ("aus Berlin", "aus der Schweiz", "aus dem Supermarkt").',
      '• von (vom = von dem) = coming back from a person, event, or place ("vom Arzt", "von der Arbeit", "von zu Hause").',
    ].join('\n'),
    fr: [
      '1. Wohin ? (Aller vers une destination)',
      '• nach = villes, continents, points cardinaux et pays SANS article (« nach Spanien », « nach München »), ainsi que « nach Hause » (rentrer chez soi).',
      '• in (+ accusatif : in den, in die, ins = in das) = lieux fermés (« ins Kino », « in die Schule ») et pays AVEC article (« in die Schweiz », « in die USA »).',
      '• zu (zum = zu dem, zur = zu der) = personnes, professionnels, démarches (« zum Arzt », « zur Post », « zur Arbeit », « zu Anna »).',
      '',
      '2. Wo ? (Être à un endroit)',
      '• in (im = in dem, in der) = villes (« in Wien »), pays (« in Frankreich », « in der Schweiz ») et intérieurs (« im Büro », « in der Schule »).',
      '• bei (beim = bei dem) = chez quelqu’un (« bei Anna », « bei meinen Eltern ») ou une entreprise (« bei Bosch »).',
      '• Expressions fréquentes : « zu Hause » (à la maison), « am Bahnhof » (à la gare), « auf der Arbeit » (au travail).',
      '',
      '3. Woher ? (Venir de quelque part)',
      '• aus = villes, pays et sortie d’un bâtiment (« aus Berlin », « aus der Türkei », « aus dem Supermarkt »).',
      '• von (vom = von dem) = revenir de chez quelqu’un ou d’une activité (« vom Arzt », « von der Arbeit », « von zu Hause »).',
    ].join('\n'),
    de: [
      '1. Wohin? (Richtung und Ziel)',
      '• nach = Städte, Kontinente, Himmelsrichtungen und Länder OHNE Artikel („nach Spanien“, „nach München“) sowie die feste Wendung „nach Hause“.',
      '• in (+ Akkusativ: in den, in die, ins = in das) = Räume/Gebäude („ins Kino“, „in die Schule“) und Länder MIT Artikel („in die Schweiz“, „in die Türkei“, „in die USA“).',
      '• zu (zum = zu dem, zur = zu der) = Personen, Berufe, Orte/Termine („zum Arzt“, „zur Post“, „zur Arbeit“, „zu Anna“).',
      '',
      '2. Wo? (Ort / Position)',
      '• in (im = in dem, in der) = Städte („in Wien“), Länder („in Österreich“, „in der Schweiz“) und Gebäude/Räume („im Büro“, „in der Schule“).',
      '• bei (beim = bei dem) = bei Personen („bei meinen Eltern“), Firmen („bei Siemens“) oder Terminen („beim Friseur“).',
      '• Wichtige feste Wendungen: „zu Hause“ (daheim), „am Bahnhof“, „auf der Arbeit“ / „am Meer“.',
      '',
      '3. Woher? (Herkunft)',
      '• aus = Städte, Länder und geschlossene Räume („aus Berlin“, „aus der Schweiz“, „aus dem Büro“).',
      '• von (vom = von dem) = von Personen, Aktivitäten oder Orten („vom Arzt“, „von der Arbeit“, „von zu Hause“).',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-nach-vs-in-countries',
      title: 'nach (Länder ohne Artikel) vs. in die / in den (Länder mit Artikel)',
      body: 'nach Deutschland, nach Japan, nach Italien — aber in die Schweiz, in die Türkei, in die USA, in den Iran.',
      title_i18n: {
        en: 'nach for countries without an article vs. in for countries with an article',
        fr: 'nach pour les pays sans article vs in pour les pays avec article',
        de: 'nach (Länder ohne Artikel) vs. in die / in den (Länder mit Artikel)',
      },
      body_i18n: {
        en: 'Cities and most countries have no article and use nach (nach Paris, nach Polen). Countries with a feminine/plural/masculine article use in (in die Schweiz, in die USA).',
        fr: 'Villes et la plupart des pays utilisent nach (nach Paris, nach Polen). Les pays avec article utilisent in (in die Schweiz, in die USA).',
        de: 'Städte und Länder ohne Artikel stehen mit nach (nach Paris, nach Polen); Länder mit Artikel stehen mit in (in die Schweiz, in die USA).',
      },
    },
    {
      id: 'rule-zu-hause-vs-nach-hause',
      title: 'zu Hause (Wo?) vs. nach Hause (Wohin?)',
      body: 'zu Hause = am Wohnort sein („Ich bin zu Hause“); nach Hause = auf dem Weg heim („Ich gehe nach Hause“).',
      title_i18n: {
        en: 'zu Hause (at home — Wo?) vs. nach Hause (going home — Wohin?)',
        fr: 'zu Hause (à la maison — Wo?) vs nach Hause (rentrer chez soi — Wohin?)',
        de: 'zu Hause (Wo?) vs. nach Hause (Wohin?)',
      },
      body_i18n: {
        en: 'Keep these two fixed phrases strictly separate: "Ich bleibe zu Hause" (location) vs. "Ich fahre nach Hause" (direction).',
        fr: 'Distinguez nettement ces deux expressions figées : « Ich bleibe zu Hause » (lieu) vs « Ich fahre nach Hause » (direction).',
        de: 'Merke fest: „Ich bleibe zu Hause“ (Ort) und „Ich fahre nach Hause“ (Richtung).',
      },
    },
  ],
  tables: [
    {
      id: 'tbl-place-preps',
      title_i18n: {
        en: 'Everyday local prepositions by question (Wo? / Wohin? / Woher?)',
        fr: 'Prépositions de lieu courantes selon la question (Wo? / Wohin? / Woher?)',
        de: 'Lokale Präpositionen nach Wo? / Wohin? / Woher? (A1)',
      },
      columns_i18n: {
        en: ['Place type', 'Wo? (Location)', 'Wohin? (Direction)', 'Woher? (Origin)'],
        fr: ['Type de lieu', 'Wo? (Lieu)', 'Wohin? (Destination)', 'Woher? (Origine)'],
        de: ['Ort / Kategorie', 'Wo?', 'Wohin?', 'Woher?'],
      },
      rows: [
        ['Home', 'zu Hause', 'nach Hause', 'von zu Hause'],
        ['Cities & articleless countries', 'in Köln, in Österreich', 'nach Köln, nach Österreich', 'aus Köln, aus Österreich'],
        ['Countries with article', 'in der Schweiz, in den USA', 'in die Schweiz, in die USA', 'aus der Schweiz, aus den USA'],
        ['Enclosed places / buildings', 'im Kino, in der Schule', 'ins Kino, in die Schule', 'aus dem Kino, aus der Schule'],
        ['People & errands', 'bei Anna, beim Arzt', 'zu Anna, zum Arzt, zur Post', 'von Anna, vom Arzt, von der Post'],
        ['Station / sea / work', 'am Bahnhof, am Meer, auf der Arbeit', 'zum Bahnhof, ans Meer, zur Arbeit', 'vom Bahnhof, vom Meer, von der Arbeit'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Meine Tante kommt aus der Schweiz, aber sie wohnt jetzt in München.',
      highlight: 'aus der Schweiz / in München',
      note: 'Origin (country with article) vs. location (city)',
      translation_i18n: {
        en: 'My aunt comes from Switzerland, but she lives in Munich now.',
        fr: 'Ma tante vient de Suisse, mais elle habite maintenant à Munich.',
        de: 'Meine Tante kommt aus der Schweiz, aber sie wohnt jetzt in München.',
      },
      explanation_i18n: {
        en: 'die Schweiz keeps its article after aus (aus der Schweiz); cities use in for static location.',
        fr: 'die Schweiz conserve son article après aus (aus der Schweiz) ; les villes prennent in pour le lieu fixe.',
        de: 'die Schweiz behält den Artikel (aus der Schweiz); Städte stehen bei Wo? mit in.',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Nach der Arbeit gehe ich noch kurz in den Supermarkt und fahre dann nach Hause.',
      highlight: 'in den Supermarkt / nach Hause',
      note: 'Direction into a building (in + acc.) and direction home (nach Hause)',
      translation_i18n: {
        en: 'After work I quickly go into the supermarket and then go home.',
        fr: 'Après le travail, je passe vite au supermarché puis je rentre à la maison.',
        de: 'Nach der Arbeit gehe ich noch kurz in den Supermarkt und fahre dann nach Hause.',
      },
      explanation_i18n: {
        en: 'in + masculine accusative Supermarkt becomes in den Supermarkt; "going home" is always nach Hause.',
        fr: 'in + Supermarkt (masculin accusatif) donne in den Supermarkt ; rentrer chez soi se dit toujours nach Hause.',
        de: 'Richtung ins Gebäude: in den Supermarkt (Akkusativ); Richtung nach daheim: nach Hause.',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Heute Vormittag ist Jonas beim Zahnarzt, am Abend ist er wieder zu Hause.',
      highlight: 'beim Zahnarzt / zu Hause',
      note: 'Static location with a person/profession (beim) and at home (zu Hause)',
      translation_i18n: {
        en: 'This morning Jonas is at the dentist’s; in the evening he is back at home.',
        fr: 'Ce matin, Jonas est chez le dentiste ; le soir, il est de retour à la maison.',
        de: 'Heute Vormittag ist Jonas beim Zahnarzt, am Abend ist er wieder zu Hause.',
      },
      explanation_i18n: {
        en: 'bei + dem contracts to beim for being at a doctor’s office; being at home is zu Hause.',
        fr: 'bei + dem se contracte en beim chez un professionnel ; être chez soi se dit zu Hause.',
        de: 'Wo bei Personen/Berufen: beim Zahnarzt; Ort daheim: zu Hause.',
      },
    },
    {
      id: 'ex-4',
      sentence: 'Am Wochenende fahren wir ins Kino oder ans Meer.',
      highlight: 'ins Kino / ans Meer',
      note: 'A1 contractions ins (= in das) and ans (= an das)',
      translation_i18n: {
        en: 'On the weekend we are going to the cinema or to the seaside.',
        fr: 'Ce week-end, nous allons au cinéma ou au bord de la mer.',
        de: 'Am Wochenende fahren wir ins Kino oder ans Meer.',
      },
      explanation_i18n: {
        en: 'in + das Kino contracts to ins Kino; an + das Meer contracts to ans Meer.',
        fr: 'in + das se contracte en ins et an + das en ans pour exprimer la destination.',
        de: 'Kurzformen im Akkusativ: ins (= in das) und ans (= an das).',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-nach-vs-zu',
      contrast_pair: 'nach  (cities, countries, nach Hause)  vs.  zu  (people, shops, zum/zur)',
      title_i18n: {
        en: 'When "to" is nach vs. zu vs. in',
        fr: 'Quand traduire « à / chez / vers » par nach, zu ou in',
        de: 'Wann sagt man nach, zu oder in (Wohin?)',
      },
      body_i18n: {
        en: 'Never use *nach before a person or a shop: *nach Anna or *nach dem Arzt is incorrect. Use zu Anna / zum Arzt / zur Bäckerei. Reserve nach for geographic names without articles (nach Berlin, nach Frankreich), compass directions (nach links), and nach Hause.',
        fr: 'N’employez jamais *nach devant une personne ou un commerce : dites zu Anna, zum Arzt, zur Post. Réservez nach aux villes/pays sans article (nach Berlin, nach Frankreich) et à nach Hause.',
        de: 'Vor Personen und Geschäften steht nie *nach, sondern zu (zu Anna, zum Arzt, zur Post). nach gilt für Städte, Länder ohne Artikel, Richtungen (nach links) und nach Hause.',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Ich gehe nach Hause und bleibe nach Hause.',
      right: 'Ich gehe nach Hause und bleibe zu Hause.',
      explanation_i18n: {
        en: 'gehen is movement home (nach Hause), while bleiben expresses staying in one place (zu Hause).',
        fr: 'gehen indique un déplacement (nach Hause), mais bleiben indique une position fixe (zu Hause).',
        de: 'gehen (Wohin?) braucht nach Hause, bleiben (Wo?) braucht zu Hause.',
      },
      principle_i18n: {
        en: 'Use nach Hause for movement/direction and zu Hause for location.',
        fr: 'Utilisez nach Hause pour le mouvement et zu Hause pour le lieu fixe.',
        de: 'Richtung: nach Hause — Ort: zu Hause.',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Wir fliegen im Sommer nach Schweiz.',
      right: 'Wir fliegen im Sommer in die Schweiz.',
      explanation_i18n: {
        en: 'die Schweiz is a country with a definite article, so direction requires in + accusative (in die Schweiz), not nach.',
        fr: 'die Schweiz possède un article défini ; la direction exige in die Schweiz et non nach.',
        de: 'Länder mit Artikel wie die Schweiz nehmen bei Wohin? in die (nicht nach).',
      },
      principle_i18n: {
        en: 'Countries with articles use in (in die Schweiz, in den USA / in die USA) rather than nach.',
        fr: 'Les pays avec article prennent in (in die Schweiz, in die USA) au lieu de nach.',
        de: 'Bei Ländern mit Artikel immer in verwenden (in die Schweiz / in der Schweiz).',
      },
    },
    {
      id: 'cm-3',
      wrong: 'Heute Nachmittag gehe ich nach dem Arzt.',
      right: 'Heute Nachmittag gehe ich zum Arzt.',
      explanation_i18n: {
        en: 'Going to see a person or professional takes zu (zu + dem = zum), never nach.',
        fr: 'Aller chez une personne ou un médecin exige zu (zum Arzt), jamais nach.',
        de: 'Zu einer Person oder Praxis geht man mit zu (zum Arzt), niemals mit nach.',
      },
      principle_i18n: {
        en: 'Use zu (zum / zur) when going to people, professionals, or local services.',
        fr: 'Utilisez zu (zum / zur) pour aller chez une personne ou dans un service local.',
        de: 'Für Personen und Einrichtungen immer zu (zum / zur) verwenden.',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'Match the preposition to Wo? (location), Wohin? (destination), or Woher? (origin) and pay attention to whether countries have articles.',
      key_pattern: 'zu Hause ↔ nach Hause  |  nach Berlin ↔ in die Schweiz  |  zum Arzt ↔ beim Arzt ↔ vom Arzt',
      mistake_warning: 'Never say *nach + person, never confuse zu Hause / nach Hause, and remember countries with articles take in / aus + article.',
      self_check: 'Complete: "Ich fahre ___ Berlin, meine Freundin fliegt ___ USA, und abends bleiben wir ___ Hause."',
    },
    fr: {
      central_rule: 'Choisissez la préposition selon Wo? (lieu), Wohin? (destination) ou Woher? (origine), et vérifiez si le pays prend un article.',
      key_pattern: 'zu Hause ↔ nach Hause  |  nach Berlin ↔ in die Schweiz  |  zum Arzt ↔ beim Arzt ↔ vom Arzt',
      mistake_warning: 'Jamais *nach + personne ; distinguez zu Hause / nach Hause et in die Schweiz / aus der Schweiz.',
      self_check: 'Complétez : « Ich fahre ___ Berlin, meine Freundin fliegt ___ USA, und abends bleiben wir ___ Hause. »',
    },
    de: {
      central_rule: 'Wähle die Präposition nach Wo? (Ort), Wohin? (Ziel) oder Woher? (Herkunft) und prüfe, ob ein Land einen Artikel hat.',
      key_pattern: 'zu Hause ↔ nach Hause  |  nach Berlin ↔ in die Schweiz  |  zum Arzt ↔ beim Arzt ↔ vom Arzt',
      mistake_warning: 'Nie *nach + Person, zu Hause vs. nach Hause nicht verwechseln und Länder mit Artikel mit in/aus + Artikel verwenden.',
      self_check: 'Ergänze: „Ich fahre ___ Berlin, meine Freundin fliegt ___ USA, und abends bleiben wir ___ Hause.“',
    },
  },
  practice_mapping: [
    {
      id: 'a1-26-wo-wohin-woher-preps',
      label_i18n: {
        en: 'Choosing place prepositions for Wo? (in/bei/am/zu Hause), Wohin? (nach/in/zu), and Woher? (aus/von)',
        fr: 'Choix des prépositions de lieu selon Wo?, Wohin? et Woher?',
        de: 'Lokale Präpositionen nach Wo?, Wohin? und Woher? wählen',
      },
      formats: ['multiple_choice', 'gap_fill', 'matching'],
    },
    {
      id: 'a1-26-countries-and-home',
      label_i18n: {
        en: 'Handling articleless vs. article countries and zu Hause vs. nach Hause',
        fr: 'Pays avec/sans article et opposition zu Hause / nach Hause',
        de: 'Länder mit/ohne Artikel sowie zu Hause vs. nach Hause richtig nutzen',
      },
      formats: ['error_correction', 'gap_fill'],
    },
  ],
};
