import type { Lesson } from '../../types/domain';

export const LESSON_A1_24: Lesson = {
  id: 'a1-24',
  level: 'A1',
  unit: 24,
  title_en: 'Basic time expressions',
  title_de: 'Zeitangaben',
  topic: 'Basic time expressions',
  hasContent: true,
  tags: ['zeitangaben', 'adverbien', 'haeufigkeit', 'wochentage'],
  estimated_study_minutes: 15,
  prerequisite_knowledge_i18n: {
    en: 'Helpful to know main clause inversion (A1-19) and present-tense verbs (A1-05).',
    fr: 'Utile de connaître l’inversion en principale (A1-19) et le présent (A1-05).',
    de: 'Hilfreich sind der Satzbau im Hauptsatz (A1-19) und Verben im Präsens (A1-05).',
  },
  objectives: {
    en: 'Use high-frequency German time words (heute, morgen, gestern, jetzt, gleich, bald), frequency adverbs (immer, oft, manchmal, selten, nie), and habitual weekday/time-of-day adverbs (montags, morgens, abends) with accurate capitalization and V2 placement.',
    fr: 'Utiliser les repères temporels courants (heute, morgen, gestern, jetzt, gleich, bald), les adverbes de fréquence (immer, oft, manchmal, selten, nie) et les adverbes habituels (montags, morgens, abends) avec la bonne orthographe et la règle V2.',
    de: 'Wichtige Zeitangaben (heute, morgen, gestern, jetzt), Häufigkeitsadverbien (immer, oft, manchmal, selten, nie) sowie gewohnheitsmäßige Zeitadverbien (montags, morgens) mit korrekter Groß-/Kleinschreibung und Verbzweitstellung anwenden.',
  },
  learning_objectives_i18n: {
    en: [
      'Use point-in-time adverbs (jetzt, heute, morgen, übermorgen, gestern, vorgestern, bald, gleich, später) accurately.',
      'Order frequency adverbs from 100% to 0%: immer → meistens → oft → manchmal → selten → nie.',
      'Distinguish capitalized nouns with prepositions (am Montag, am Morgen) from lowercase habitual -s adverbs (montags, morgens, dienstags, abends).',
      'Place time expressions either in Position 1 (with subject inversion) or after the conjugated verb (before place phrases).',
    ],
    fr: [
      'Employer les adverbes de temps courants (jetzt, heute, morgen, übermorgen, gestern, vorgestern, bald, gleich, später).',
      'Graduer la fréquence de 100 % à 0 % : immer → meistens → oft → manchmal → selten → nie.',
      'Distinguer les noms avec préposition en majuscule (am Montag, am Morgen) des adverbes d’habitude en -s avec minuscule (montags, morgens, abends).',
      'Placer les expressions temporelles en position 1 (avec inversion du sujet) ou après le verbe conjugué, avant le lieu.',
    ],
    de: [
      'Zeitadverbien der Gegenwart, Zukunft und Vergangenheit sicher verwenden (jetzt, heute, morgen, übermorgen, gestern, bald, gleich).',
      'Häufigkeitsadverbien von 100 % bis 0 % abstufen: immer → meistens → oft → manchmal → selten → nie.',
      'Substantive mit am + Großschreibung (am Montag, am Morgen) von kleingeschriebenen Gewohnheitsadverbien auf -s (montags, morgens) unterscheiden.',
      'Zeitangaben entweder auf Position 1 (mit Inversion) oder hinter dem konjugierten Verb vor Ortsangaben einbauen.',
    ],
  },
  introduction_i18n: {
    en: 'Talking about your daily routine, plans, and schedule starts with basic time expressions. German lets you say when something happens (heute, gestern, morgen), how often it happens (immer, oft, nie), and whether it is a single event (am Montag) or a weekly habit (montags).',
    fr: 'Parler de son emploi du temps, de ses habitudes et de ses projets repose sur les expressions de temps. L’allemand distingue le moment précis (heute, gestern, morgen), la fréquence (immer, oft, nie) et l’opposition entre un événement ponctuel (am Montag) et une habitude régulière (montags).',
    de: 'Um über deinen Alltag, Pläne oder Termine zu sprechen, brauchst du Zeitangaben. Sie zeigen, wann etwas passiert (heute, morgen, gestern), wie oft es passiert (immer, oft, nie) und ob es einmalig (am Montag) oder regelmäßig (montags) stattfindet.',
  },
  explanation_i18n: {
    en: [
      '1. Everyday time points and sequence words',
      '• Relative days: vorgestern (the day before yesterday) ← gestern (yesterday) ← heute (today) → morgen (tomorrow) → übermorgen (the day after tomorrow).',
      '• Immediate & near time: jetzt (now), gerade (right now), sofort (immediately), gleich (right away / in a moment), später (later), bald (soon).',
      '• Note spelling: Morgen (capital M) = "the morning" ("am Morgen"); morgen (lowercase m) = "tomorrow" ("morgen früh").',
      '',
      '2. Frequency scale (How often? — Wie oft?)',
      'immer (always, 100%) → meistens (mostly) → oft (often) → manchmal (sometimes) → selten (rarely) → nie / niemals (never, 0%).',
      'Specific frequency: einmal pro Woche (once a week), zweimal im Monat (twice a month), jeden Tag (every day), jede Woche (every week).',
      '',
      '3. One-time vs. repeated routines (-s adverbs)',
      '• am + capitalized weekday or part of day refers to a specific day ("Am Montag habe ich frei").',
      '• Lowercase noun + -s expresses a regular habit ("montags" = on Mondays / every Monday; "morgens" = in the mornings; "abends" = in the evenings; "wochentags" = on weekdays).',
      'Watch the exception for night: die Nacht → nachts (no am, just lowercase nachts, or in der Nacht for a specific night).',
    ].join('\n'),
    fr: [
      '1. Repères de temps du quotidien',
      '• Les jours : vorgestern (avant-hier) ← gestern (hier) ← heute (aujourd’hui) → morgen (demain) → übermorgen (après-demain).',
      '• Instant et suite : jetzt (maintenant), gerade (en ce moment), sofort (tout de suite), gleich (dans un instant), später (plus tard), bald (bientôt).',
      '• Attention à la majuscule : der Morgen = « le matin » (am Morgen), alors que morgen (minuscule) = « demain ».',
      '',
      '2. Échelle de fréquence (Wie oft ?)',
      'immer (toujours, 100 %) → meistens (la plupart du temps) → oft (souvent) → manchmal (parfois) → selten (rarement) → nie (jamais, 0 %).',
      'Fréquence chiffrée : einmal pro Woche, zweimal im Monat, jeden Tag, jede Woche.',
      '',
      '3. Événement ponctuel vs habitude (-s en minuscule)',
      '• am + nom avec majuscule désigne un moment précis : « Am Montag habe ich einen Termin. »',
      '• Le mot en minuscule terminé par -s désigne une habitude : montags (tous les lundis), morgens (le matin en général), abends (le soir en général), nachts (la nuit en général).',
    ].join('\n'),
    de: [
      '1. Wichtige Zeitpunkte und Zeitwörter',
      '• Tage: vorgestern ← gestern ← heute → morgen → übermorgen.',
      '• Nähe und Abfolge: jetzt, gerade, sofort, gleich, später, bald, dann, danach.',
      '• Schreibung beachten: der Morgen (Tageszeit, groß) vs. morgen (der nächste Tag, klein).',
      '',
      '2. Häufigkeit (Wie oft?)',
      'immer (100 %) → meistens → oft → manchmal → selten → nie (0 %).',
      'Außerdem: jeden Tag, jede Woche, einmal pro Woche, zweimal im Monat.',
      '',
      '3. Einmalig vs. regelmäßig (-s-Adverbien)',
      '• am + Nomen (großgeschrieben) meint meist einen konkreten Tag oder Tagesabschnitt: „Am Montag habe ich einen Termin.“',
      '• Kleingeschriebene Adverbien auf -s meinen eine Gewohnheit: montags (= jeden Montag), morgens (= jeden Morgen), nachmittags, abends, nachts.',
    ].join('\n'),
  },
  rules: [
    {
      id: 'rule-time-habitual-s',
      title: 'am Montag (konkret, groß) vs. montags (regelmäßig, klein)',
      body: 'Für einmalige Termine nutzt man meist am + Nomen; für Gewohnheiten kleingeschriebene Adverbien auf -s (montags, morgens, nachts).',
      title_i18n: {
        en: 'am Montag (capitalized noun) vs. montags (lowercase habitual adverb)',
        fr: 'am Montag (nom avec majuscule) vs montags (adverbe en minuscule)',
        de: 'am Montag (konkret, groß) vs. montags (regelmäßig, klein)',
      },
      body_i18n: {
        en: 'Write capitalized nouns after am/im (am Dienstag, am Abend) and lowercase adverbs without an article when ending in -s (dienstags, abends, nachts).',
        fr: 'Les noms après am prennent une majuscule (am Dienstag, am Abend) ; les adverbes en -s sans préposition prennent une minuscule (dienstags, abends, nachts).',
        de: 'Nach am steht ein Nomen mit Großbuchstaben (am Dienstag, am Abend); Adverbien auf -s schreibt man klein (dienstags, abends, nachts).',
      },
    },
    {
      id: 'rule-time-v2-placement',
      title: 'Position von Zeitangaben im Satz',
      body: 'Zeitangaben stehen entweder auf Position 1 (mit Inversion des Subjekts) oder direkt hinter dem konjugierten Verb bzw. Personalpronomen.',
      title_i18n: {
        en: 'Placement of time expressions in a sentence',
        fr: 'Place des expressions de temps dans la phrase',
        de: 'Position von Zeitangaben im Satz',
      },
      body_i18n: {
        en: 'Never stack a time word between subject and verb (*Ich immer trinke Kaffee is wrong; say Ich trinke immer Kaffee or Immer trinke ich...).',
        fr: 'Ne placez jamais un adverbe de fréquence entre le sujet et le verbe conjugué (*Ich immer trinke est faux ; dites Ich trinke immer...).',
        de: 'Stelle Zeit- oder Häufigkeitsadverbien nie zwischen Subjekt und Verb (*Ich immer trinke ist falsch; richtig: Ich trinke immer).',
      },
    },
  ],
  tables: [
    {
      id: 'tbl-time-expressions',
      title_i18n: {
        en: 'Core A1 time words, frequency adverbs, and habitual forms',
        fr: 'Repères temporels, fréquence et formes habituelles (A1)',
        de: 'Wichtige Zeitangaben im Überblick (A1)',
      },
      columns_i18n: {
        en: ['Category', 'German', 'Meaning (EN)'],
        fr: ['Catégorie', 'Allemand', 'Sens (FR)'],
        de: ['Kategorie', 'Deutsch', 'Bedeutung / Gebrauch'],
      },
      rows: [
        ['Days', 'vorgestern / gestern / heute / morgen / übermorgen', 'day before yesterday / yesterday / today / tomorrow / day after tomorrow'],
        ['Now / soon', 'jetzt / gerade / gleich / bald / später', 'now / right now / in a moment / soon / later'],
        ['Frequency', 'immer / meistens / oft / manchmal / selten / nie', 'always / mostly / often / sometimes / rarely / never'],
        ['Repeated parts of day', 'morgens / vormittags / mittags / nachmittags / abends / nachts', 'in the mornings / mornings / at noon / afternoons / evenings / at night'],
        ['Repeated weekdays', 'montags, dienstags, mittwochs, donnerstags, freitags, samstags, sonntags', 'on Mondays, Tuesdays, ... (every week)'],
      ],
    },
  ],
  examples_de: [
    {
      id: 'ex-1',
      sentence: 'Morgens trinke ich immer zuerst eine Tasse schwarzen Tee.',
      highlight: 'Morgens ... immer',
      note: 'Habitual adverb in Pos. 1 + frequency adverb after verb/subject',
      translation_i18n: {
        en: 'In the mornings I always drink a cup of black tea first.',
        fr: 'Le matin, je bois toujours d’abord une tasse de thé noir.',
        de: 'Morgens trinke ich immer zuerst eine Tasse schwarzen Tee.',
      },
      explanation_i18n: {
        en: 'Morgens (in Position 1) describes a daily habit; trinke stays in Position 2 and immer follows the pronoun ich.',
        fr: 'Morgens en position 1 exprime l’habitude quotidienne ; immer se place après le sujet inversé ich.',
        de: 'Morgens auf Pos. 1 drückt die Gewohnheit aus; immer steht hinter dem Subjekt ich.',
      },
    },
    {
      id: 'ex-2',
      sentence: 'Heute habe ich wenig Zeit, aber morgen früh können wir telefonieren.',
      highlight: 'Heute / morgen früh',
      note: 'Lowercase morgen ("tomorrow") vs. time-of-day modifier',
      translation_i18n: {
        en: 'Today I have little time, but tomorrow morning we can talk on the phone.',
        fr: 'Aujourd’hui j’ai peu de temps, mais demain matin nous pouvons nous appeler.',
        de: 'Heute habe ich wenig Zeit, aber morgen früh können wir telefonieren.',
      },
      explanation_i18n: {
        en: 'Notice lowercase morgen in morgen früh ("tomorrow morning") and V2 word order in both clauses.',
        fr: 'Notez la minuscule à morgen dans morgen früh (« demain matin ») et le verbe en position 2.',
        de: 'Beachte die Kleinschreibung bei morgen früh und die Verbzweitstellung in beiden Teilen.',
      },
    },
    {
      id: 'ex-3',
      sentence: 'Wir gehen zweimal pro Woche ins Schwimmbad, aber dienstags bleiben wir zu Hause.',
      highlight: 'zweimal pro Woche / dienstags',
      note: 'Counted frequency + habitual weekday adverb',
      translation_i18n: {
        en: 'We go to the swimming pool twice a week, but on Tuesdays we stay at home.',
        fr: 'Nous allons à la piscine deux fois par semaine, mais le mardi nous restons à la maison.',
        de: 'Wir gehen zweimal pro Woche ins Schwimmbad, aber dienstags bleiben wir zu Hause.',
      },
      explanation_i18n: {
        en: 'zweimal pro Woche states how often; lowercase dienstags means "every Tuesday".',
        fr: 'zweimal pro Woche indique la fréquence ; dienstags en minuscule signifie « tous les mardis ».',
        de: 'zweimal pro Woche gibt die Häufigkeit an; dienstags bedeutet „jeden Dienstag“.',
      },
    },
    {
      id: 'ex-4',
      sentence: 'Der Supermarkt ist am Sonntag nie geöffnet.',
      highlight: 'am Sonntag nie',
      note: 'Specific day preposition + zero-frequency nie',
      translation_i18n: {
        en: 'The supermarket is never open on Sunday.',
        fr: 'Le supermarché n’est jamais ouvert le dimanche.',
        de: 'Der Supermarkt ist am Sonntag nie geöffnet.',
      },
      explanation_i18n: {
        en: 'am Sonntag uses capitalized Sonntag after am; nie stays before the predicate geöffnet.',
        fr: 'am Sonntag prend une majuscule après am ; nie se place avant geöffnet.',
        de: 'Nach am steht Sonntag groß; nie steht vor dem Adjektiv/Prädikat geöffnet.',
      },
    },
  ],
  usage_and_contrasts: [
    {
      id: 'contrast-morgen-vs-Morgen',
      contrast_pair: 'morgen  (tomorrow)  vs.  der Morgen / am Morgen  (the morning)',
      title_i18n: {
        en: 'Capitalization changes meaning: morgen vs. Morgen',
        fr: 'La majuscule change le sens : morgen vs der Morgen',
        de: 'Groß oder klein? morgen vs. der Morgen',
      },
      body_i18n: {
        en: 'Lowercase morgen means "tomorrow" ("Bis morgen!"), whereas capitalized Morgen means "morning" ("Guten Morgen!", "am Morgen"). Notice both words combine in "morgen Morgen" ("tomorrow morning", or more idiomatically "morgen früh").',
        fr: 'morgen (minuscule) signifie « demain » (« Bis morgen! »), tandis que der Morgen (majuscule) signifie « le matin » (« am Morgen »). Pour « demain matin », on dit le plus souvent morgen früh.',
        de: 'morgen (klein) bedeutet der nächste Tag („Bis morgen!“), der Morgen (groß) ist die Tageszeit („am Morgen“). Für „tomorrow morning“ sagt man meist morgen früh.',
      },
    },
  ],
  common_mistakes: [
    {
      id: 'cm-1',
      wrong: 'Ich immer lerne am Abend Vokabeln.',
      right: 'Ich lerne am Abend immer Vokabeln.',
      explanation_i18n: {
        en: 'Unlike English ("I always study"), German never places a frequency adverb between the subject and the conjugated verb.',
        fr: 'Contrairement à l’anglais (« I always study »), on ne place jamais immer entre le sujet et le verbe en allemand.',
        de: 'Anders als im Englischen darf immer nicht zwischen Subjekt und Verb stehen; das Verb bleibt auf Position 2.',
      },
      principle_i18n: {
        en: 'Put frequency adverbs (immer, oft, nie) after the conjugated verb (or in Position 1 before the verb).',
        fr: 'Placez les adverbes de fréquence après le verbe conjugué (ou en position 1).',
        de: 'Häufigkeitsadverbien stehen hinter dem konjugierten Verb (oder auf Position 1).',
      },
    },
    {
      id: 'cm-2',
      wrong: 'Am Montags habe ich Gitarrenunterricht.',
      right: 'Montags habe ich Gitarrenunterricht.',
      explanation_i18n: {
        en: 'Do not combine am with the -s ending. Either say am Montag (capitalized noun) or montags (lowercase adverb without am).',
        fr: 'Ne combinez jamais am avec la terminaison -s : soit am Montag, soit montags.',
        de: 'am und die Endung -s darf man nicht kombinieren: entweder am Montag oder montags.',
      },
      principle_i18n: {
        en: 'Choose either am + [Capitalized Day] OR lowercase [day]-s, never both.',
        fr: 'Choisissez soit am + [Jour majuscule], soit [jour]-s en minuscule.',
        de: 'Entweder am + Nomen (am Montag) oder kleingeschriebenes Adverb (montags).',
      },
    },
  ],
  quick_review_i18n: {
    en: {
      central_rule: 'Time and frequency adverbs follow the V2 rule (either Position 1 with inversion or after the conjugated verb) and distinguish am + Noun from lowercase -s habits.',
      key_pattern: 'immer → meistens → oft → manchmal → selten → nie  |  am Montag vs. montags',
      mistake_warning: 'Never place immer/oft between subject and verb (*Ich oft gehe...), and never write *am montags.',
      self_check: 'Translate: "We rarely go to the cinema on Fridays."',
    },
    fr: {
      central_rule: 'Les adverbes de temps et de fréquence respectent la règle V2 (en position 1 ou après le verbe) et distinguent am + Nom des habitudes en -s.',
      key_pattern: 'immer → meistens → oft → manchmal → selten → nie  |  am Montag vs montags',
      mistake_warning: 'Ne placez jamais immer/oft entre le sujet et le verbe, et n’écrivez jamais *am montags.',
      self_check: 'Traduisez : « Le vendredi (tous les vendredis), nous allons rarement au cinéma. »',
    },
    de: {
      central_rule: 'Zeit- und Häufigkeitsadverbien stehen auf Position 1 (mit Inversion) oder hinter dem konjugierten Verb; Gewohnheiten auf -s stehen ohne am und klein.',
      key_pattern: 'immer → meistens → oft → manchmal → selten → nie  |  am Montag vs. montags',
      mistake_warning: 'Nie *Ich oft gehe... und nie *am montags schreiben.',
      self_check: 'Bilde einen Satz mit „freitags“ und „selten“: Wir / ins Kino / gehen.',
    },
  },
  practice_mapping: [
    {
      id: 'a1-24-time-and-frequency-meaning',
      label_i18n: {
        en: 'Selecting accurate time-point and frequency adverbs (heute/morgen/gestern, immer–nie)',
        fr: 'Emploi des repères de temps et de fréquence (heute/morgen/gestern, immer–nie)',
        de: 'Zeit- und Häufigkeitsadverbien passend wählen',
      },
      formats: ['multiple_choice', 'gap_fill', 'matching'],
    },
    {
      id: 'a1-24-habitual-s-and-position',
      label_i18n: {
        en: 'Distinguishing am Montag vs. montags and placing adverbs in V2 clauses',
        fr: 'Distinction am Montag vs montags et placement des adverbes dans la phrase V2',
        de: 'am Montag vs. montags unterscheiden und Zeitadverbien richtig platzieren',
      },
      formats: ['error_correction', 'sentence_construction', 'gap_fill'],
    },
  ],
};
