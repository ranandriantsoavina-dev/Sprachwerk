# Lesson_practice.md
## AI Content Authoring Guide — Lesson Practice Question Bank


## How to use this guide

This file is a **standing reference guide only**. It defines lesson alignment, question quality, exercise formats, difficulty, localization, metadata, and validation standards. It does not independently request or initiate question generation.

The user's separate instruction determines which lesson, exercise types, difficulty tiers, quantity, and output format are required. Generate only the requested questions for the specified lesson or lessons. Do not automatically generate questions for all 180 lessons, every exercise type, or every difficulty tier. If the user has not specified a quantity and it is not already established in the task, ask for it rather than assuming one. Use the supplied lesson record and the application's existing schema whenever available.

### 1. Mission

This guide defines the standards for **Lesson Practice** questions in German Grammar Academy. Each question should assess the grammar objectives and content of a specific lesson (or an explicitly selected set of lessons).

Lesson Practice is the focused practice path attached to each of the app's 180 self-contained A1–C1 grammar lessons. Learners may open practice directly without first reading the lesson explanation. Therefore, each question must be understandable on its own and must not depend on the learner having read a hidden paragraph.

The learner chooses a lesson, then configures exercise type, difficulty, timer, question count, order, and feedback timing. The exercise engine must retrieve only questions genuinely associated with the selected lesson(s).

### 2. Non-negotiable lesson alignment

Before writing questions, inspect the supplied lesson record and extract:

- stable lesson ID;
- canonical German title;
- CEFR level;
- learning objectives;
- core rules and forms;
- example structures;
- common mistakes;
- explicit scope boundaries;
- practice mapping, if provided.

Use these as the source of truth.

Every question must test at least one explicit learning objective or a directly taught subskill. Tag the exact concept tested. Do not add unrelated grammar merely because it is at a similar CEFR level.

Do not:
- broaden a lesson into a general grammar test;
- test an exception the lesson does not teach unless it is explicitly in scope;
- rely on a different lesson's rule to solve the item;
- create questions whose answer requires information absent from the prompt;
- make all questions simple copies of the lesson's examples.

A learner should be able to practise this lesson independently, without a prerequisite or access gate.

### 3. Lesson-specific difficulty

Use the app's four session difficulty settings:

| App difficulty | Intended range | How to adapt within the lesson |
|---|---|---|
| `easy` | A1 | Test the lesson's most direct, foundational form with short sentences and familiar vocabulary. |
| `medium` | A2–B1 | Test the same lesson objectives in longer everyday contexts, with more varied syntax and connected clauses where appropriate. |
| `difficult` | B2 | Test the lesson's relevant advanced application in genuinely complex B2 contexts. |
| `extreme` | C1–C2 | Test nuanced, precise, formal, or syntactically demanding application of the lesson's target, where the topic supports it. |

**Do not force every lesson to contain every difficulty tier.** A lesson may not naturally support an extreme C1–C2 version. Generate only tiers that can be justified by the lesson's actual grammar scope. The app should display an availability note for unsupported combinations rather than substitute unrelated questions.

The difficulty label must reflect linguistic complexity, not merely difficult distractors. If the task requests every tier, make a genuine attempt to create valid variations of the lesson objective; flag a tier as unavailable if doing so would require unrelated content or fabricated rules.

C2 is an extension of the practice engine, not an additional curriculum lesson level.

### 4. Supported exercise formats

Create only formats that genuinely test the selected lesson. The web app supports:

- `multiple-choice`: choose one correct answer;
- `gap-fill`: enter a missing word, ending, or phrase;
- `sentence-construction`: arrange German words or fragments;
- `error-correction`: identify and correct a grammatical error;
- `transformation`: rewrite a sentence using the lesson's target structure;
- `matching`: match forms, rules, meanings, or examples;
- `true-false`: judge a focused grammatical statement where enabled;
- `translation`: produce a German sentence from a precise meaning or instruction where enabled.

Flashcards are a separate General Practice vocabulary review mode in the product concept. Do not create Lesson Practice flashcards unless the user explicitly requests them and the supplied application schema supports lesson-linked flashcards.

A format is available only when it can validly assess the lesson objective. Do not manufacture a weak or unrelated task just to populate every format.

### 5. Question-writing rules

All questions must be natural, accurate German and must target the selected lesson.

#### Multiple choice
- Use one clearly correct answer unless multiple-answer support is explicit.
- Make distractors reflect realistic errors related to the lesson.
- Vary the correct option position.
- Do not make the answer obvious through option length or grammatical mismatch unrelated to the target.

#### Gap fill
- Make the blank test the lesson's target form.
- Provide a complete sentence and clear expected response type.
- Record all valid alternatives.
- Avoid blanks with multiple unrecorded possible answers.

#### Sentence construction
- Provide all words or fragments needed to build the sentence.
- Make the intended meaning and required structure clear.
- Record valid alternative word orders where applicable.
- Do not penalize a grammatically correct alternative unless the prompt establishes a specific required structure.

#### Error correction
- Use a realistic error that directly reflects a common mistake for this lesson.
- Provide the corrected full sentence and explain the specific rule.
- Ensure the original sentence is genuinely incorrect in context.

#### Transformation
- State exactly which structure the learner must use.
- Keep the meaning stable unless the instruction says otherwise.
- Test the lesson's target, not an unrelated secondary grammar point.
- Record accepted alternatives.

#### Matching
- Match only concepts taught by the selected lesson.
- Ensure each pair has one defensible match, unless the task explicitly supports many-to-many matching.
- Use forms, examples, functions, or rules appropriate to the lesson.

#### True/false
- Test one precise claim about the lesson.
- Avoid ambiguous wording and obscure exceptions.
- Provide a correction or explanation for false statements.

#### Translation
- Give a clear source meaning in the requested interface language.
- The learner's expected response is German.
- Accept natural alternatives that preserve the target grammar and meaning.
- Ensure the translation specifically elicits the lesson's target form.

### 6. Question-bank balance and variety

Within the quantity requested by the user, question sets should vary the way the target grammar is used. Relevant forms of variation include:

- different subjects and grammatical persons;
- singular and plural;
- masculine, feminine, neuter, and plural nouns where relevant;
- affirmative, negative, and interrogative forms;
- different lexical contexts and verbs;
- main and subordinate clauses;
- short and longer sentences;
- everyday, written, formal, or academic contexts appropriate to the tier;
- recognition, controlled production, correction, and transformation.

Do not force irrelevant variations. The target grammar and lesson scope always take priority.

Avoid:
- repeating the same sentence with a different noun;
- changing only distractors while leaving the linguistic task identical;
- copying the lesson examples verbatim across the whole bank;
- using vocabulary so obscure that it becomes the real test;
- making every question test exactly the same micro-skill.

### 7. Feedback and answer evaluation

Every non-flashcard question must include:
- a correct answer or solution;
- `accepted_answers` where more than one answer is valid;
- a concise explanation tied to the lesson's rule;
- optional hint when it adds genuine learning value;
- enough metadata for filtering and answer evaluation.

Feedback should make the link to the lesson concept explicit. Explain the grammatical reason, not just state that an answer is correct.

Accept valid German alternatives. Normalize harmless whitespace and capitalization where appropriate, but preserve meaningful distinctions such as case endings, verb forms, umlauts, ß, word order, and agreement.

Allow the learner to answer, request a hint if enabled, skip, or continue. A skipped item is not an incorrect answer. A timeout is recorded as unanswered for review and must not terminate the session. Do not add lives, penalties, or answer limits.

### 8. Localization boundaries

- Keep all German prompts, sentences, answer options, fragments, target forms, and solutions in German.
- Author instructions, hints, and explanations separately in French, English, and German when the schema supports them.
- Do not translate German question content when the user changes interface language.
- Do not change the canonical lesson title.
- Keep grammar terminology consistent with the linked lesson.
- Never generate missing localized content by silently machine-translating German learning material.

### 9. Required metadata and linkage

Every question must be linked to its source lesson using the exact stable lesson ID.

Include the fields supported by the application's existing schema for:

- stable question `id`;
- `mode`: `lesson-practice`;
- `lesson_id` or `lesson_ids`;
- `lesson_title_de` only if the schema stores it; otherwise resolve the title through the lesson ID;
- `topic` and specific `topic_tags`;
- `learning_objective_id` or equivalent objective reference when available;
- `cefr_level`;
- app `difficulty`;
- `exercise_type`;
- German `prompt_de`;
- German `options_de` or interaction data;
- `correct_answer` / `solution`;
- `accepted_answers`;
- localized `explanation_i18n`;
- optional localized `hint_i18n`;
- source language metadata (`de`).

Stable IDs must be unique across the complete question bank. A question must never point to a non-existent lesson ID. Do not invent fields if the repository already defines a schema; map the concepts above to the real field names.

Conceptual example:

```json
{
  "id": "LP-A1-001-MC-EASY-0001",
  "mode": "lesson-practice",
  "lesson_id": "A1-001",
  "topic": "nominativ",
  "topic_tags": ["bestimmter-artikel", "grammatisches-geschlecht"],
  "learning_objective_id": "A1-001-OBJ-01",
  "cefr_level": "A1",
  "difficulty": "easy",
  "exercise_type": "multiple-choice",
  "prompt_de": "___ Mann ist müde.",
  "options_de": ["Der", "Den", "Dem"],
  "correct_answer": "Der",
  "accepted_answers": ["Der"],
  "explanation_i18n": {
    "fr": "Le sujet est au nominatif. « Mann » est masculin : on utilise « der ».",
    "en": "The subject is in the nominative. « Mann » is masculine, so use « der ».",
    "de": "Das Subjekt steht im Nominativ. « Mann » ist maskulin, deshalb verwendet man « der »."
  },
  "source_language": "de"
}
```

The example is illustrative only. Do not assume its lesson ID or schema fields are valid for a real project unless supplied.

### 10. Quantity and batch-generation requirements

Follow the exact quantity requested by the task. If a quantity is specified per exercise type, per difficulty, or per lesson, satisfy it at that level of granularity.

For large question banks:
- generate in numbered batches with a continuous, non-repeating ID sequence;
- maintain a count for every lesson × difficulty × exercise-type combination;
- continue until all requested combinations have been generated;
- do not stop after a sample or partial batch when the instruction requests the complete dataset;
- do not duplicate items to reach a target count;
- do not silently replace an unsupported format or difficulty with another one;
- explicitly report any combination that cannot be populated without leaving the lesson scope.

When the user explicitly requests questions for multiple lessons, keep each lesson's questions clearly separated and linked to the correct lesson ID. Never mix questions from different lessons under one lesson ID.

### 11. Quality assurance checklist

Before output, verify:

1. The question references an existing lesson ID.
2. The tested skill appears in that lesson's objectives or taught content.
3. The question is solvable without reading hidden lesson content.
4. The German is grammatical, natural, and correctly punctuated.
5. The assigned difficulty is justified by actual linguistic complexity.
6. The exercise format is suitable for the target skill.
7. The correct answer and all valid alternatives are recorded.
8. The explanation accurately teaches the relevant lesson rule.
9. Localization does not alter German source content.
10. There are no duplicate or near-duplicate questions.
11. IDs are unique and metadata is complete.
12. Unsupported combinations are reported, not silently filled with unrelated questions.

### 12. What not to create

Do not add XP, points, gems, lives, rankings, shops, quests, forced progression, lesson prerequisites, or punitive wrong-answer limits. Do not add unrelated grammar, generic mixed-topic questions, unverified exceptions, or automatic translations of German source content.

**Definition of done:** selecting a lesson in the web app retrieves only its relevant questions; the learner can configure a focused session, answer valid interactive tasks, receive localized explanations tied to the lesson, and review performance by lesson and exercise type.
