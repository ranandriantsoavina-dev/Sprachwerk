import type { Question } from '../types/domain';

export interface GapToken {
  type: 'text' | 'blank';
  value: string;
  blankIndex?: number;
  expectedLength?: number;
}

export interface GapWordCluster {
  /** Keeps word-internal blanks like "Bergstra[__]e" together on one line while allowing word wrapping */
  tokens: GapToken[];
  hasBlank: boolean;
}

export interface ParsedGapPrompt {
  context: string | null;
  sentenceClusters: GapWordCluster[];
  instruction: string | null;
  blankCount: number;
  separator: string;
}

export interface ParsedStructuredPrompt {
  context: string | null;
  instruction: string | null;
  primarySentence: string | null;
  targetPattern: string | null;
  note: string | null;
  rawFallback: string;
}

export function normalizeAnswer(raw: string, caseSensitive?: boolean): string {
  const collapsed = raw.trim().replace(/\s+/g, ' ');
  return caseSensitive ? collapsed : collapsed.toLowerCase();
}

/**
 * Parses a prompt of the form:
 *   "Context: „Sentence“ (Note)"  or  "Instruction: \"Sentence\" (Note)"
 * cleanly without dropping any information.
 */
export function extractStructuredPrompt(rawPrompt: string): ParsedStructuredPrompt {
  let remaining = rawPrompt.trim();
  let note: string | null = null;
  let context: string | null = null;
  let instruction: string | null = null;
  let primarySentence: string | null = null;
  let targetPattern: string | null = null;

  // Extract trailing parenthetical note e.g. "(Ergänze: ß oder ss)" or "(Use «heißen»)"
  const noteMatch = remaining.match(/\s*\(([^()]{2,110})\)\s*$/);
  if (noteMatch) {
    note = noteMatch[1].trim();
    remaining = remaining.slice(0, noteMatch.index).trim();
  }

  // Handle Transformation pattern with arrow: „Orig“ → „Target“
  const arrowSplit = remaining.split(/\s*(?:→|->)\s*/);
  if (arrowSplit.length === 2) {
    const leftPart = arrowSplit[0].trim();
    const rightPart = arrowSplit[1].trim();
    const rightQuote = rightPart.match(/^[„"«](.+)[“"»]$/);
    targetPattern = rightQuote ? rightQuote[1].trim() : rightPart;
    remaining = leftPart;
  }

  // Look for a quoted primary sentence: „...“, "...", or «...»
  const quoteRegex = /[„"«]([^“"»]+)[“"»]/g;
  const quotes: Array<{ text: string; index: number; fullLen: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = quoteRegex.exec(remaining)) !== null) {
    quotes.push({ text: m[1].trim(), index: m.index, fullLen: m[0].length });
  }

  if (quotes.length > 0) {
    // Prefer the longest quoted segment or the last substantial quote as the primary sentence
    const mainQuote = quotes.reduce((best, curr) =>
      curr.text.length >= best.text.length ? curr : best
    );
    const beforeQuote = remaining.slice(0, mainQuote.index).trim().replace(/[:\-–—]\s*$/, '').trim();
    const afterQuote = remaining.slice(mainQuote.index + mainQuote.fullLen).trim();

    if (beforeQuote && !afterQuote) {
      // Split "Context: Instruction" if colon exists inside beforeQuote
      const colonIdx = beforeQuote.indexOf(':');
      if (colonIdx > 0 && colonIdx < 40) {
        context = beforeQuote.slice(0, colonIdx).trim();
        instruction = beforeQuote.slice(colonIdx + 1).trim();
      } else {
        instruction = beforeQuote;
      }
      primarySentence = mainQuote.text;
    } else if (beforeQuote && afterQuote) {
      // e.g. "Im Satz „...“ schreibt man..." -> keep full sentence with context separated
      const colonIdx = beforeQuote.indexOf(':');
      if (colonIdx > 0 && colonIdx < 35) {
        context = beforeQuote.slice(0, colonIdx).trim();
        instruction = `${beforeQuote.slice(colonIdx + 1).trim()} „${mainQuote.text}“ ${afterQuote}`.trim();
      } else {
        instruction = remaining;
      }
    } else {
      primarySentence = mainQuote.text;
      if (afterQuote) instruction = afterQuote;
    }
  } else {
    // No quotes: check for leading "Context: sentence"
    const colonIdx = remaining.indexOf(':');
    if (colonIdx > 0 && colonIdx < 48) {
      instruction = remaining.slice(0, colonIdx).trim();
      primarySentence = remaining.slice(colonIdx + 1).trim();
    }
  }

  return {
    context,
    instruction,
    primarySentence,
    targetPattern,
    note,
    rawFallback: rawPrompt,
  };
}

/**
 * Parses a gap_fill prompt into inline sentence clusters where every `___` (2+ underscores)
 * becomes an interactive inline blank sized proportionally to its expected answer.
 */
export function parseGapFillPrompt(rawPrompt: string, solution: string): ParsedGapPrompt {
  let remaining = rawPrompt.trim();
  let instruction: string | null = null;
  let context: string | null = null;

  // Extract trailing parenthetical instruction like "(Ergänze: ß oder ss)"
  const trailingParen = remaining.match(/\s*\(([^()]{2,110})\)\s*$/);
  if (trailingParen) {
    instruction = trailingParen[1].trim();
    remaining = remaining.slice(0, trailingParen.index).trim();
  }

  // Extract leading context before colon if followed by a quoted sentence or sentence with blanks
  const colonMatch = remaining.match(/^([^:]{2,45}):\s*(.+)$/);
  if (colonMatch) {
    const candidateContext = colonMatch[1].trim();
    const candidateBody = colonMatch[2].trim();
    if (/_{2,}/.test(candidateBody)) {
      context = candidateContext;
      remaining = candidateBody;
    }
  }

  // Strip wrapping German/English quotes around the entire sentence if present
  const wrappedQuote = remaining.match(/^[„"«](.+)[“"»]$/);
  if (wrappedQuote) {
    remaining = wrappedQuote[1].trim();
  }

  // Count blanks
  const blankMatches = remaining.match(/_{2,}/g) || [];
  const blankCount = blankMatches.length;

  // Determine multi-blank separator & expected per-blank lengths
  let separator = ' ';
  let expectedSegments: string[] = [solution];

  if (blankCount > 1) {
    if (solution.includes(' | ')) {
      separator = ' | ';
      expectedSegments = solution.split(' | ');
    } else if (solution.includes(', ')) {
      separator = ', ';
      expectedSegments = solution.split(', ');
    } else if (solution.includes(' / ')) {
      separator = ' / ';
      expectedSegments = solution.split(' / ');
    } else {
      const wsParts = solution.trim().split(/\s+/);
      if (wsParts.length === blankCount) {
        separator = ' ';
        expectedSegments = wsParts;
      }
    }
  }

  // Split sentence by whitespace into word clusters, preserving blanks inside words like "Bergstra___e"
  const rawWords = remaining.split(/(\s+)/);
  const sentenceClusters: GapWordCluster[] = [];
  let blankCursor = 0;

  for (const chunk of rawWords) {
    if (!chunk) continue;
    if (/^\s+$/.test(chunk)) {
      sentenceClusters.push({
        tokens: [{ type: 'text', value: ' ' }],
        hasBlank: false,
      });
      continue;
    }

    const parts = chunk.split(/(_{2,})/);
    const tokens: GapToken[] = [];
    let hasBlank = false;

    for (const part of parts) {
      if (!part) continue;
      if (/^_{2,}$/.test(part)) {
        const expected = expectedSegments[blankCursor] ?? solution;
        tokens.push({
          type: 'blank',
          value: '',
          blankIndex: blankCursor,
          expectedLength: expected.trim().length,
        });
        blankCursor += 1;
        hasBlank = true;
      } else {
        tokens.push({ type: 'text', value: part });
      }
    }

    sentenceClusters.push({ tokens, hasBlank });
  }

  return {
    context,
    sentenceClusters,
    instruction,
    blankCount,
    separator,
  };
}

/**
 * Determines whether a multiple_choice question expects multiple selected options
 * based on its existing solution/accepted_answers and options_de.
 */
export function isMultiSelectQuestion(question: Question): boolean {
  if (question.type !== 'multiple_choice' || !question.options_de) return false;
  if (question.options_de.includes(question.solution)) return false;
  const parts = question.solution
    .split(/\s*[|,;]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length <= 1) return false;
  return parts.every((p) => question.options_de!.includes(p));
}

export function getMultiSelectOptionsFromDraft(draft: string, options: string[]): string[] {
  if (!draft.trim()) return [];
  const rawParts = draft.split(/\s*[|,;]\s*/).map((s) => s.trim());
  return options.filter((opt) => rawParts.includes(opt));
}

/**
 * Deterministic shuffle of right-column matching options seeded by question ID.
 */
export function getShuffledMatchingRights(question: Question | undefined): string[] {
  if (!question?.matching_pairs || question.matching_pairs.length === 0) return [];
  const items = question.matching_pairs.map((p) => p.right);
  let seed = 0;
  for (let i = 0; i < question.id.length; i++) {
    seed = (seed * 31 + question.id.charCodeAt(i)) >>> 0;
  }
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (arr.every((val, idx) => val === items[idx]) && arr.length > 1) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

export interface DiffToken {
  text: string;
  status: 'same' | 'added' | 'removed';
}

/**
 * Computes a clean word-level diff between an erroneous/user sentence and the expected solution
 * for clear visual feedback in Error Correction and Transformation exercises.
 */
export function computeWordDiff(source: string, target: string): {
  sourceTokens: DiffToken[];
  targetTokens: DiffToken[];
} {
  const a = source.trim().split(/\s+/).filter(Boolean);
  const b = target.trim().split(/\s+/).filter(Boolean);

  // LCS matrix
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[i][j] = 1 + dp[i + 1][j + 1];
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const sourceTokens: DiffToken[] = [];
  const targetTokens: DiffToken[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      sourceTokens.push({ text: a[i], status: 'same' });
      targetTokens.push({ text: b[j], status: 'same' });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      sourceTokens.push({ text: a[i], status: 'removed' });
      i++;
    } else {
      targetTokens.push({ text: b[j], status: 'added' });
      j++;
    }
  }
  while (i < a.length) {
    sourceTokens.push({ text: a[i++], status: 'removed' });
  }
  while (j < b.length) {
    targetTokens.push({ text: b[j++], status: 'added' });
  }

  return { sourceTokens, targetTokens };
}
