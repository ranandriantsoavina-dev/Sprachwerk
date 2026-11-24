import type { InterfaceLang, Lesson } from '../types/domain';

export type ExplanationBlock =
  | { kind: 'prose'; text: string }
  | { kind: 'comparison'; label: string; text: string }
  | { kind: 'warning'; text: string }
  | { kind: 'tip'; text: string }
  | { kind: 'concept-cards'; items: ConceptCardItem[] }
  | { kind: 'bullet-list'; items: string[] };

export interface ConceptCardItem {
  groupTag?: string;
  title: string;
  patternBadge?: string;
  body: string;
  examples: string[];
  subItems?: string[];
  hasWarning?: boolean;
}

export interface ParsedExplanationSection {
  id: string;
  number: string | null;
  title: string;
  blocks: ExplanationBlock[];
}

export interface VocabularyEntry {
  id: string;
  primary: string;
  secondary?: string;
  meta?: string;
  category?: string;
  spokenGerman?: string;
}

const GROUP_PREFIX_RE = /^(Group|Groupe|Typ|Type|Profile|Profil)\s+(\d+)(?:\s*\((.+?)\))?\s*[:：]\s*(.*)$/i;
const COMPARE_PREFIX_RE = /^(Compare|Vergleich|Comparaison|Example|Beispiel|Exemple)\s*[:：]\s*(.+)$/i;
const TIP_PREFIX_RE = /^(Note|Tip|Hint|Remarque|Astuce|Hinweis|Merke|Tipp)\b[:：]?\s*(.+)$/i;
const WARNING_PREFIX_RE = /^(Warning|Attention|Achtung|Important|Wichtig|Watch out)\b[:：]?\s*(.+)$/i;
const SUB_BULLET_RE = /^\s*[–-]\s+(.+)$/;

function isExplicitWarningText(text: string): boolean {
  return /\*[A-Za-zÄÖÜäöüß]+|\bNOT\b|\bnever\s+(?:use|say|add|change)\b|\bniemals\b|\bjamais\s+\*/i.test(text);
}

/**
 * Extracts clickable Lesson references from prerequisite strings like:
 * - "Lessons A1-08 and A1-09"
 * - "(A1-02 to A1-06)" / "(A1-02 through A1-06)" / "(A1-12 à A1-14)" / "(A1-12 bis A1-14)"
 * - "(leçons A1-08 et A1-09)"
 */
export function extractPrerequisiteLinks(prereqText: string, allLessons: Lesson[]): Lesson[] {
  if (!prereqText || allLessons.length === 0) return [];

  const byId = new Map<string, Lesson>(allLessons.map((l) => [l.id.toLowerCase(), l]));
  const foundIds: string[] = [];
  const pushId = (id: string) => {
    const normalized = id.toLowerCase();
    if (byId.has(normalized) && !foundIds.includes(normalized)) {
      foundIds.push(normalized);
    }
  };

  // Match ranges like A1-02 through A1-06 / A1-02 to A1-06 / A1-12 bis A1-14 / A1-12 à A1-14
  const rangeRegex = /\b(A1|A2|B1|B2|C1)-(\d{1,2})\s+(?:to|through|bis|à|-)\s+(?:(A1|A2|B1|B2|C1)-)?(\d{1,2})\b/gi;
  let match: RegExpExecArray | null;
  while ((match = rangeRegex.exec(prereqText)) !== null) {
    const lvlStart = match[1].toLowerCase();
    const numStart = parseInt(match[2], 10);
    const lvlEnd = (match[3] || match[1]).toLowerCase();
    const numEnd = parseInt(match[4], 10);
    if (lvlStart === lvlEnd && numEnd >= numStart && numEnd - numStart <= 12) {
      for (let n = numStart; n <= numEnd; n++) {
        pushId(`${lvlStart}-${String(n).padStart(2, '0')}`);
      }
    }
  }

  // Match explicit lesson codes like A1-08, A1-09
  const singleRegex = /\b(A1|A2|B1|B2|C1)-(\d{1,2})\b/gi;
  while ((match = singleRegex.exec(prereqText)) !== null) {
    const lvl = match[1].toLowerCase();
    const num = String(parseInt(match[2], 10)).padStart(2, '0');
    pushId(`${lvl}-${num}`);
  }

  // Match shorthand like "A1-05/06"
  const slashRegex = /\b(A1|A2|B1|B2|C1)-(\d{1,2})\/(\d{1,2})\b/gi;
  while ((match = slashRegex.exec(prereqText)) !== null) {
    const lvl = match[1].toLowerCase();
    pushId(`${lvl}-${String(parseInt(match[2], 10)).padStart(2, '0')}`);
    pushId(`${lvl}-${String(parseInt(match[3], 10)).padStart(2, '0')}`);
  }

  return foundIds.map((id) => byId.get(id)!).filter(Boolean);
}

/**
 * Splits parenthesized or trailing German example segments from a concept bullet
 * without losing any original text or explanation words.
 */
function extractConceptDetails(rawBullet: string): ConceptCardItem {
  const cleaned = rawBullet.replace(/^•\s*/, '').trim();

  // Check if bullet starts with "Group 1 (— / ¨): ..." / "Group 4 (-(e)n): ..."
  const groupMatch = cleaned.match(GROUP_PREFIX_RE);
  if (groupMatch) {
    const [, kindWord, num, parenPattern, rest] = groupMatch;
    const { bodyText, examples } = splitTrailingParentheticalExamples(rest.trim());
    return {
      groupTag: `${kindWord.toUpperCase()} ${num}`,
      title: `${kindWord} ${num}`,
      patternBadge: parenPattern?.trim() || undefined,
      body: bodyText,
      examples,
      hasWarning: isExplicitWarningText(cleaned),
    };
  }

  // Check for "Label = description" or "Label: description"
  const colonIdx = findSeparatorIndex(cleaned);
  if (colonIdx > 0 && colonIdx <= 48) {
    const rawLabel = cleaned.slice(0, colonIdx).trim();
    const sep = cleaned[colonIdx];
    const rest = cleaned.slice(colonIdx + 1).trim();

    // Extract optional parenthetical pattern from label e.g. "e → i (short)" or "nach"
    const labelPatternMatch = rawLabel.match(/^(.+?)\s*\(([^)]+)\)$/);
    let title = rawLabel;
    let patternBadge: string | undefined;

    if (sep === '=' || /→|↔|-\w+|^[a-zäöüß]+\s*\/\s*[a-zäöüß]+/i.test(rawLabel)) {
      if (labelPatternMatch) {
        title = labelPatternMatch[1].trim();
        patternBadge = labelPatternMatch[2].trim();
      }
    }

    const { bodyText, examples } = splitTrailingParentheticalExamples(rest);
    return {
      title,
      patternBadge,
      body: bodyText,
      examples,
      hasWarning: isExplicitWarningText(cleaned),
    };
  }

  const { bodyText, examples } = splitTrailingParentheticalExamples(cleaned);
  return {
    title: '',
    body: bodyText,
    examples,
    hasWarning: isExplicitWarningText(cleaned),
  };
}

function findSeparatorIndex(text: string): number {
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1);
    else if (depth === 0 && (ch === ':' || ch === '：' || ch === '=')) {
      // Avoid splitting URLs or times like 14:15
      if (ch === ':' && /\d/.test(text[i - 1] || '') && /\d/.test(text[i + 1] || '')) continue;
      return i;
    }
  }
  return -1;
}

/**
 * Extracts explicit German transformation/example list from a trailing parenthetical
 * such as "(der Tisch → die Tische, der Stuhl → die Stühle)" when it clearly lists examples,
 * leaving non-example prose inside bodyText intact so zero content is lost.
 */
function splitTrailingParentheticalExamples(text: string): { bodyText: string; examples: string[] } {
  // Match a parenthetical containing `→` examples, optionally followed by a trailing remark sentence
  const arrowParenMatch = text.match(/^(.*?)\(([^()]*→[^()]*)\)[.!]?\s*(.*)$/);
  if (arrowParenMatch && arrowParenMatch[2].length >= 5) {
    const prefix = arrowParenMatch[1].trim().replace(/[—–:\-]\s*$/, '').trim();
    const suffix = arrowParenMatch[3].trim();
    const parts = arrowParenMatch[2]
      .split(/[;,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      const combinedBody = [prefix, suffix].filter(Boolean).join(' ');
      return {
        bodyText: combinedBody || text,
        examples: parts,
      };
    }
  }

  // If text contains inline transformation items separated by semicolons:
  // e.g. "sprechen → du sprichst, er spricht; helfen → du hilfst, er hilft"
  if (text.includes('→') && text.includes(';') && !text.includes('(')) {
    const semiParts = text
      .split(';')
      .map((s) => s.trim().replace(/\.$/, ''))
      .filter(Boolean);
    if (semiParts.length >= 2 && semiParts.every((p) => p.includes('→'))) {
      return {
        bodyText: '',
        examples: semiParts,
      };
    }
  }

  return { bodyText: text, examples: [] };
}

function classifySingleLine(line: string): 'comparison' | 'warning' | 'tip' | 'prose' {
  if (COMPARE_PREFIX_RE.test(line)) return 'comparison';
  if (WARNING_PREFIX_RE.test(line)) return 'warning';
  if (TIP_PREFIX_RE.test(line)) return 'tip';
  return 'prose';
}

/**
 * Parses `explanation_i18n[lang]` into numbered sections and rich educational blocks
 * while preserving 100% of the authored text verbatim.
 */
export function parseLessonExplanation(rawText: string): ParsedExplanationSection[] {
  if (!rawText || !rawText.trim()) return [];

  const chunks = rawText
    .split(/\n{2,}/)
    .map((c) => c.trim())
    .filter(Boolean);

  return chunks.map((chunk, sIdx) => {
    const lines = chunk.split('\n').map((l) => l.trimEnd());
    const firstLine = lines[0]?.trim() || '';

    const headingMatch = firstLine.match(/^(\d+)\.\s+(.+)$/);
    const sectionNumber = headingMatch ? headingMatch[1] : null;
    const sectionTitle = headingMatch ? headingMatch[2] : `Section ${sIdx + 1}`;
    const bodyLines = headingMatch ? lines.slice(1) : lines;

    const blocks: ExplanationBlock[] = [];
    let bulletBuffer: Array<{ text: string; subItems: string[] }> = [];

    const flushBullets = () => {
      if (bulletBuffer.length === 0) return;

      const parsedItems = bulletBuffer.map((b) => {
        const card = extractConceptDetails(b.text);
        if (b.subItems.length > 0) {
          card.subItems = b.subItems;
        }
        return card;
      });

      // Render as structured Concept Cards when bullets represent distinct concepts/groups/rules
      // (i.e., have group tags, pattern badges, extracted examples, or distinct labeled titles across >= 2 items)
      const labeledCount = parsedItems.filter(
        (it) => Boolean(it.groupTag || it.patternBadge || it.title || it.examples.length > 0)
      ).length;

      if (
        parsedItems.some((it) => Boolean(it.groupTag)) ||
        (parsedItems.length >= 2 && labeledCount >= Math.ceil(parsedItems.length * 0.6))
      ) {
        blocks.push({ kind: 'concept-cards', items: parsedItems });
      } else {
        // Keep simple short bullets as a clean bullet list (per §7: don't force every list into cards)
        const flatBullets = bulletBuffer.map((b) => {
          const base = b.text.replace(/^•\s*/, '').trim();
          return b.subItems.length > 0 ? `${base} — ${b.subItems.join(' · ')}` : base;
        });
        blocks.push({ kind: 'bullet-list', items: flatBullets });
      }

      bulletBuffer = [];
    };

    for (let i = 0; i < bodyLines.length; i++) {
      const rawLine = bodyLines[i];
      const trimmed = rawLine.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('•')) {
        bulletBuffer.push({ text: trimmed, subItems: [] });
        continue;
      }

      if (SUB_BULLET_RE.test(rawLine) && bulletBuffer.length > 0) {
        const subMatch = rawLine.match(SUB_BULLET_RE);
        if (subMatch) {
          bulletBuffer[bulletBuffer.length - 1].subItems.push(subMatch[1].trim());
          continue;
        }
      }

      flushBullets();

      const kind = classifySingleLine(trimmed);
      if (kind === 'comparison') {
        const m = trimmed.match(COMPARE_PREFIX_RE);
        blocks.push({
          kind: 'comparison',
          label: m ? m[1] : 'Compare',
          text: m ? m[2] : trimmed,
        });
      } else if (kind === 'warning') {
        blocks.push({ kind: 'warning', text: trimmed });
      } else if (kind === 'tip') {
        blocks.push({ kind: 'tip', text: trimmed });
      } else {
        // Merge consecutive plain prose lines if appropriate or keep distinct
        const prev = blocks[blocks.length - 1];
        if (prev && prev.kind === 'prose') {
          prev.text = `${prev.text}\n${trimmed}`;
        } else {
          blocks.push({ kind: 'prose', text: trimmed });
        }
      }
    }

    flushBullets();

    return {
      id: `lesson-concept-${sIdx + 1}`,
      number: sectionNumber,
      title: sectionTitle,
      blocks,
    };
  });
}

/**
 * Splits a contrast pair string ("X vs. Y" or "X ↔ Y") into left and right sides.
 */
export function splitContrastPair(pair: string): { left: string; right: string; connector: string } | null {
  if (!pair) return null;
  if (/\s+vs\.?\s+/i.test(pair)) {
    const parts = pair.split(/\s+vs\.?\s+/i);
    if (parts.length === 2) {
      return { left: parts[0].trim(), right: parts[1].trim(), connector: 'vs.' };
    }
  }
  if (pair.includes('↔') && !pair.includes('|')) {
    const parts = pair.split('↔');
    if (parts.length === 2) {
      return { left: parts[0].trim(), right: parts[1].trim(), connector: '↔' };
    }
  }
  return null;
}

/**
 * Builds structured interactive key-form / vocabulary cards from existing lesson tables
 * (only extracting real rows already present in the lesson — zero fabricated entries).
 */
function isNonGermanColumnHeader(header: string): boolean {
  return /meaning|bedeutung|sens|english|englisch|anglais|french|französisch|français|translation|übersetzung|traduction|gender|genre|genus|category|kategorie|catégorie|used for|verwendung|usage|emploi|reliability|zuverlässigkeit|fiabilité|stem note|stamm|pattern|muster|modèle|plural type|positive element|place type|clock\s*\/\s*date|comma|komma|virgule|\btype\b|\btyp\b|person\s*&?\s*number|endings|groups|endungen|groupes|terminaisons|reliable/i.test(
    header.trim()
  );
}

function isGermanExampleHeader(header: string): boolean {
  return /example|beispiel|exemple|sentence|satz|phrase|answer|antwort|réponse/i.test(header.trim());
}

function cleanSpokenGermanPart(text: string): string {
  return text
    .replace(/\s*\((?:(?:m\.|f\.|n\.|pl\.|sg\.|nom\.|acc\.|akk\.|dat\.|gen\.)\s*)+\)/gi, '')
    .replace(/\s*\((?:things|people|predicative[^)]*|adverbial[^)]*|\d{1,2}:\d{2})\)/gi, '')
    .replace(/\s*\/\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractVocabularyItems(lesson: Lesson, lang: InterfaceLang): VocabularyEntry[] {
  const entries: VocabularyEntry[] = [];
  if (!lesson.tables || lesson.tables.length === 0) return entries;

  for (const tbl of lesson.tables) {
    if (tbl.id === 'tbl-v2-slots' || tbl.id === 'tbl-verb-positions') continue;

    const cols = tbl.columns_i18n?.[lang] || tbl.columns_i18n?.en || tbl.columns_i18n?.de || [];
    const singIdx = cols.findIndex((c) =>
      /^(singular|singulier|infinitive|infinitiv|adjective|adjektiv|w-word|w-wort|w-frage|mot interrogatif|nominative|nominativ|nominatif|conjunction|konjunktion|conjonction)$/i.test(
        c.trim()
      )
    );
    const exactPlurIdx = cols.findIndex((c) =>
      /^(plural|pluriel|opposite|gegenteil|contraire|accusative|akkusativ|accusatif)$/i.test(c.trim())
    );
    const plurIdx =
      exactPlurIdx !== -1
        ? exactPlurIdx
        : cols.findIndex(
            (c, idx) =>
              idx !== singIdx &&
              /plural|pluriel|opposite|gegenteil|contraire|accusative|akkusativ|accusatif|meaning|bedeutung|sens/i.test(c) &&
              !/type|typ/i.test(c)
          );

    // Case 1: Singular / Plural / Adjective / W-word / Nom->Acc / Conjunction tables
    if (singIdx !== -1 && plurIdx !== -1 && tbl.rows.length > 0 && tbl.rows.length <= 12) {
      const hasCategoryCol = Boolean(cols[0] && singIdx !== 0);
      const metaColIdx = cols.findIndex(
        (_, idx) => idx !== singIdx && idx !== plurIdx && !(hasCategoryCol && idx === 0) && !/comma|komma|virgule/i.test(cols[idx] || '')
      );
      const plurIsGerman = !isNonGermanColumnHeader(cols[plurIdx] || '');
      const metaIsExample = metaColIdx >= 0 && isGermanExampleHeader(cols[metaColIdx] || '');

      for (let ri = 0; ri < tbl.rows.length; ri++) {
        const row = tbl.rows[ri];
        const primary = row[singIdx] || '';
        const secondary = row[plurIdx] || '';
        const meta = metaColIdx >= 0 ? row[metaColIdx] : undefined;
        if (primary && secondary) {
          const spokenParts = [cleanSpokenGermanPart(primary)];
          if (plurIsGerman) spokenParts.push(cleanSpokenGermanPart(secondary));
          if (metaIsExample && meta) spokenParts.push(cleanSpokenGermanPart(meta));
          entries.push({
            id: `${tbl.id}-${ri}`,
            primary,
            secondary,
            meta,
            category: hasCategoryCol ? row[0] : undefined,
            spokenGerman: spokenParts.filter(Boolean).join('. '),
          });
        }
      }
      if (entries.length > 0) return entries;
    }

    // Case 2: Place / Time / Article / Pronoun tables with explicit German phrases
    if (cols.length >= 3 && cols.length <= 4 && tbl.rows.length > 0 && tbl.rows.length <= 8) {
      const hasGermanMarkers = tbl.rows.some((r) =>
        r.some((c) => /\b(der|die|das|ein|eine|ich|du|er|sie|es|zu Hause|nach|aus|beim|am|im)\b/i.test(c))
      );
      if (hasGermanMarkers) {
        const isNounToPronoun = tbl.id === 'table-noun-to-pronoun';
        for (let ri = 0; ri < tbl.rows.length; ri++) {
          const row = tbl.rows[ri];
          const germanCols = row
            .map((cell, ci) => ({ cell, header: cols[ci] || '' }))
            .filter(({ cell, header }) => cell && !isNonGermanColumnHeader(header) && !isGermanExampleHeader(header))
            .map(({ cell }) => cleanSpokenGermanPart(cell));
          const exampleCols = row
            .map((cell, ci) => ({ cell, header: cols[ci] || '' }))
            .filter(({ cell, header }) => cell && isGermanExampleHeader(header))
            .map(({ cell }) => cleanSpokenGermanPart(cell));
          const spokenParts = germanCols.length > 0 ? [...germanCols, ...exampleCols] : exampleCols;

          if (isNounToPronoun) {
            entries.push({
              id: `${tbl.id}-${ri}`,
              category: row[1],
              primary: row[0],
              secondary: row[2],
              meta: row[3],
              spokenGerman: spokenParts.filter(Boolean).join('. ') || cleanSpokenGermanPart(row[0]),
            });
          } else {
            entries.push({
              id: `${tbl.id}-${ri}`,
              category: row[0],
              primary: row[1],
              secondary: row[2],
              meta: row[3],
              spokenGerman: spokenParts.filter(Boolean).join('. ') || cleanSpokenGermanPart(row[2] || row[1]),
            });
          }
        }
        if (entries.length > 0) return entries;
      }
    }
  }

  return entries;
}
