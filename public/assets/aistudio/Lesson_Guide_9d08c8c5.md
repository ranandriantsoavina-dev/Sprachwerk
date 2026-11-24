# Lesson_Guide.md
## AI Content Authoring Guide — German Grammar Academy


## How to use this guide

This file is a **standing reference guide only**. It describes the expected structure, quality, accuracy, localization, and formatting of a lesson. It does not independently request or initiate lesson generation.

The user's separate instruction determines which lesson to prepare. For example: **“Use this guide to prepare Lesson 3 of A1.”** In that case, prepare only the requested lesson. Do not generate the other lessons in A1, a complete CEFR level, all 180 lessons, or a batch of lessons unless the user explicitly asks for them.

Use the exact lesson title, ID, level, unit, and objectives from the supplied curriculum or project data. If “Lesson 3 of A1” cannot be matched to a verified curriculum entry, ask for the curriculum list or the lesson title instead of guessing.

### 1. Mission

This guide defines the standards for individual lessons in **German Grammar Academy**, a revision-first German grammar web application for learners from **A1 to C1**.

A lesson prepared according to this guide should be accurate, self-contained, and accessible in any order. The app is not a linear course: do not introduce prerequisites, locked lessons, compulsory sequences, XP, points, rewards, or progression gates.

Each lesson is a reference-and-learning unit. It must teach the selected grammar point clearly, show how it works in real German, anticipate common learner errors, and provide a direct route into **Lesson Practice**.

Follow the supplied lesson title, lesson ID, CEFR level, unit, topic, and learning objectives exactly when these are provided. Do not rename canonical German lesson titles or silently change the curriculum scope.

### 2. Product and learner experience

The content must support these product principles:

- **Self-directed access:** every A1–C1 lesson is available immediately.
- **Revision first:** explanations should be useful both for first understanding and quick review.
- **Clear and practical:** prioritize usable rules, patterns, examples, contrasts, and common mistakes.
- **German remains the learning language:** all German examples, target forms, sentence prompts, and source learning material remain in German.
- **Localized teaching:** explanations are authored separately in French, English, and German.
- **Practice connection:** every lesson should identify the concepts that its Lesson Practice questions can assess.
- **Offline-friendly content:** lessons must be complete, structured, and independent of live web lookups.

### 3. Required lesson structure

When a lesson is requested, its content should follow the sections below. Do not omit a relevant section; if a section genuinely does not apply to that lesson, explain why briefly rather than inventing irrelevant material.

#### A. Lesson metadata
Include:

- `id`: stable, unique lesson ID supplied by the curriculum. If none is supplied, do not invent a canonical ID; ask for the project convention or clearly mark a proposed ID as provisional.
- `level`: one of `A1`, `A2`, `B1`, `B2`, `C1`.
- `unit`: supplied curriculum unit, if available.
- `title_de`: canonical German lesson title. Preserve it exactly.
- `topic`: concise canonical topic/category.
- `tags`: searchable topic and grammar tags.
- `learning_objectives`: 2–5 observable outcomes beginning with action verbs.
- `prerequisite_knowledge`: optional reference only; never use it to block access.
- `estimated_study_minutes`: realistic estimate, not a promise.

#### B. Learning objective and orientation
Write a short introduction explaining what the learner will be able to understand or do after studying the lesson. State where the grammar point is commonly used, if relevant. Avoid generic introductions that could fit any lesson.

#### C. Core explanation
Explain the grammar point in a logical sequence, from the central idea to its application.

Requirements:
- Provide separate authored versions in **French (`fr`)**, **English (`en`)**, and **German (`de`)**.
- Use learner-appropriate terminology and sentence complexity.
- Define technical terms when they first appear.
- Explain not only *what* the rule is, but *why/when* it is used and how to recognize it.
- Distinguish rules from tendencies, stylistic preferences, and exceptions.
- Do not claim that a simplified rule has no exceptions if it does.
- Keep explanations focused on the lesson's objectives; do not turn one lesson into an entire grammar chapter.

#### D. Forms, rules, and patterns
Present the actual grammatical forms in a readable, reusable way. Depending on the topic, this may include:

- declension or case tables;
- article, adjective, or pronoun endings;
- conjugation tables;
- word-order patterns and sentence templates;
- tense or voice formation;
- preposition + case patterns;
- conjunction and clause-position patterns;
- comparison or transformation patterns;
- irregular forms and exceptions.

Tables must be correct and complete for the scope of the lesson. Label columns and rows clearly. Do not fill tables with fabricated or uncertain forms.

#### E. German examples
Provide natural, idiomatic German examples that demonstrate the rule in context.

For each example, include:
- `sentence_de`: the original German sentence;
- `focus`: the target form or structure;
- `explanation_i18n`: a concise explanation in French, English, and German;
- `translation_i18n`: a faithful translation where useful.

Example requirements:
- Use correct spelling, capitalization, punctuation, and word order.
- Highlight or identify the target structure without changing the German sentence.
- Include varied subjects, verbs, contexts, and sentence patterns.
- Include affirmative, negative, and question forms when relevant.
- Include main and subordinate clauses when relevant to the target.
- Do not use unnatural sentences merely to force a grammar form.
- Avoid repeating the same sentence with only one noun changed.
- Do not machine-translate or rewrite the German source sentence when localizing explanations.

#### F. Usage, contrasts, and exceptions
Explain meaningful distinctions that learners commonly confuse. Use minimal pairs or contrast tables when they genuinely clarify the lesson. Include exceptions only when relevant and verified.

#### G. Common mistakes
Include realistic learner errors. For each item provide:
- `incorrect_de`;
- `correct_de`;
- `why_it_is_wrong_i18n` in `fr`, `en`, and `de`;
- a short correction principle.

Errors must be plausible and directly related to the lesson. Do not invent errors that are actually acceptable German variants.

#### H. Quick review
End with a compact recap:
- the central rule;
- the most important form or word-order pattern;
- one warning about a common mistake;
- a short self-check question or recall cue.

#### I. Lesson Practice mapping
List the exact grammar subskills that should be practised from this lesson. These labels should be suitable for question metadata and filtering. Indicate which exercise formats can validly test each subskill. Do not create the full question bank in this guide unless explicitly requested.

### 4. CEFR alignment

The assigned lesson level controls the depth of the explanation, examples, and expected learner knowledge.

- **A1:** foundational forms, short direct explanations, simple present-tense contexts, basic word order, everyday vocabulary.
- **A2:** expanded everyday usage, common case patterns, Perfekt and other core structures, more varied sentence contexts.
- **B1:** independent use in connected speech and writing, subordinate/relative clauses, common contrasts, and more nuanced tense or mood choices.
- **B2:** accurate use in complex contexts, advanced clause structures, passive variations, nominalization, connectors, and reported-speech structures where relevant.
- **C1:** precise, flexible, nuanced usage; complex syntax, register, formal/academic contexts, subtle meaning distinctions, and advanced exceptions where relevant.

CEFR is not a rule that every grammar topic must first appear at only one level. Respect the supplied curriculum placement and teach the depth expected at that level.

### 5. Localization and source-language rules

The app supports French, English, and German interface/explanation languages.

- Localize explanations, teaching notes, instructions, and feedback text.
- Keep `title_de` unchanged in all interface languages.
- Keep every German example and German learning prompt exactly as authored.
- Keep German grammar terminology canonical; add a localized gloss where helpful.
- Never translate German examples as a substitute for the original.
- Do not ask a runtime translator to generate missing lesson content.
- If one localized explanation is unavailable, mark it as missing so the app can apply its explicit fallback behavior. Do not fabricate a translation and present it as reviewed.

### 6. Accuracy and editorial standards

Before finalizing:
1. Verify every German form, ending, agreement pattern, and word-order claim.
2. Check that every example actually demonstrates the stated rule.
3. Check that translations preserve the meaning and grammatical focus.
4. Check that exceptions and alternative forms are represented accurately.
5. Ensure the lesson stays within its supplied title, level, and objectives.
6. Remove duplicate, vague, circular, or filler explanations.
7. Ensure the common mistakes are genuinely wrong in the intended context.
8. Ensure the Lesson Practice mapping is testable and specific.

Never guess when a grammatical fact is uncertain. Flag the uncertainty for editorial review instead of presenting it as fact.

### 7. Output and data contract

When asked for structured content, return valid JSON matching the requested schema. Do not wrap JSON in commentary or Markdown fences unless explicitly requested.

Recommended conceptual shape:

```json
{
  "id": "A1-001",
  "level": "A1",
  "unit": "Unit 1",
  "title_de": "Supplied canonical title",
  "topic": "articles",
  "tags": ["artikel", "nominativ", "grammatisches-geschlecht"],
  "learning_objectives": [],
  "estimated_study_minutes": 10,
  "introduction_i18n": {
    "fr": "",
    "en": "",
    "de": ""
  },
  "explanation_i18n": {
    "fr": [],
    "en": [],
    "de": []
  },
  "rules": [],
  "tables": [],
  "examples_de": [],
  "usage_and_contrasts_i18n": {
    "fr": [],
    "en": [],
    "de": []
  },
  "common_mistakes": [],
  "quick_review_i18n": {
    "fr": [],
    "en": [],
    "de": []
  },
  "practice_mapping": []
}
```

The shape above is a conceptual baseline, not permission to rename fields in an existing application schema. If the project supplies a schema, follow it exactly. Use stable IDs for nested records where supported. Use arrays for repeatable sections and avoid embedding unrelated practice questions in lesson records.

### 8. What not to create

Do not add:
- XP, points, gems, lives, rankings, achievements, shops, quests, or locked progress;
- forced lesson sequences or prerequisite gates;
- automatic translations of German source content;
- generic filler paragraphs or decorative facts;
- practice questions unrelated to the lesson;
- unsupported claims about CEFR certification or exam guarantees.

**Definition of done:** a learner can open the lesson independently, understand the target grammar in their chosen explanation language, inspect accurate German examples and forms, recognize common errors, and launch relevant Lesson Practice directly.
