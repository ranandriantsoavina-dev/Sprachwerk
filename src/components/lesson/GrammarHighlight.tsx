import React from 'react';

const ARTICLE_RE = /\b(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|kein|keine|keinen|keinem|keiner|keines|mein|meine|meinen|meinem|meiner|dein|deine|deinen|deinem|deiner|sein|seine|seinen|seinem|seiner|ihr|ihre|ihren|ihrem|ihrer|unser|unsere|unseren|unserem|unserer|euer|eure|euren|eurem|eurer|Ihr|Ihre|Ihren|Ihrem|Ihrer|im|ins|am|ans|zum|zur|beim|vom)\b/g;

// Lowercase German article/contraction followed directly by a capitalized German noun (prevents French "des noms" or English "am"/"die" false positives in prose)
const GERMAN_NOUN_ARTICLE_RE = /\b(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|kein|keine|keinen|keinem|keiner|keines|im|ins|am|ans|zum|zur|beim|vom)(?=\s+[A-ZÄÖÜ][a-zäöüß])/g;

// Inline transformation pair embedded inside prose (e.g. "die Ärztin → die Ärztinnen" or "e → i")
const INLINE_ARROW_RE = /((?:[A-Za-zÄÖÜäöüß*]+\s+){0,2}[A-Za-zÄÖÜäöüß*]+\s*→\s*(?:[A-Za-zÄÖÜäöüß*]+\s+){0,3}[A-Za-zÄÖÜäöüß*]+)/g;

const STAR_ERROR_RE = /(\*[A-Za-zÄÖÜäöüß]+)/g;

/**
 * Highlights articles in blue and Umlaut shifts / suffixes in transformation strings
 * such as "der Apfel → die Äpfel", "der Tisch → die Tische", "das Buch → die Bücher".
 * Use `mode="prose"` for multilingual explanation paragraphs so French/English words
 * like "des", "am", or "die" are never miscolored as German articles.
 */
export const GrammarTransformationText: React.FC<{
  text: string;
  compact?: boolean;
  mode?: 'german' | 'prose';
}> = ({ text, compact = false, mode = 'german' }) => {
  if (mode === 'prose') {
    return <ProseHighlightedText text={text} />;
  }

  // Check for explicit arrow transformations like "der Tisch → die Tische"
  if (text.includes('→')) {
    const segments = text.split('→');
    if (segments.length === 2) {
      const left = segments[0].trim();
      const right = segments[1].trim();
      return (
        <span className={`inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-[15px]'}`}>
          <HighlightedPhrase phrase={left} />
          <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-500 font-semibold px-0.5">
            →
          </span>
          <HighlightedTransformedPhrase left={left} right={right} />
        </span>
      );
    }
  }

  return <HighlightedPhrase phrase={text} />;
};

const ProseHighlightedText: React.FC<{ text: string }> = ({ text }) => {
  // First split out any inline arrow transformations (e.g. "die Ärztin → die Ärztinnen")
  const arrowParts = text.split(INLINE_ARROW_RE);

  return (
    <>
      {arrowParts.map((segment, idx) => {
        if (!segment) return null;
        if (segment.includes('→')) {
          const halves = segment.split('→');
          if (halves.length === 2) {
            const left = halves[0].trim();
            const right = halves[1].trim();
            return (
              <span key={`arr-${idx}`} className="font-medium">
                <HighlightedPhrase phrase={left} />
                <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-500 font-semibold px-1">
                  →
                </span>
                <HighlightedTransformedPhrase left={left} right={right} />
              </span>
            );
          }
        }
        return <ProseSafeTokens key={`seg-${idx}`} text={segment} />;
      })}
    </>
  );
};

const ProseSafeTokens: React.FC<{ text: string }> = ({ text }) => {
  // Highlight *incorrect forms first, then German article+CapitalizedNoun phrases
  const errParts = text.split(STAR_ERROR_RE);
  return (
    <>
      {errParts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith('*') && /^\*[A-Za-zÄÖÜäöüß]+$/.test(part)) {
          return (
            <span
              key={`err-${i}`}
              className="text-[#DD0000] dark:text-red-400 font-semibold line-through decoration-1"
            >
              {part}
            </span>
          );
        }
        return <HighlightedPhrase key={`gn-${i}`} phrase={part} regexPattern={GERMAN_NOUN_ARTICLE_RE.source} />;
      })}
    </>
  );
};

const HighlightedPhrase: React.FC<{ phrase: string; regexPattern?: string }> = ({
  phrase,
  regexPattern = ARTICLE_RE.source,
}) => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(regexPattern, 'g');

  while ((match = regex.exec(phrase)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <React.Fragment key={`t-${lastIndex}`}>{phrase.slice(lastIndex, match.index)}</React.Fragment>
      );
    }
    parts.push(
      <span
        key={`a-${match.index}`}
        className="text-sky-700 dark:text-sky-400 font-semibold"
      >
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < phrase.length) {
    parts.push(<React.Fragment key={`t-end`}>{phrase.slice(lastIndex)}</React.Fragment>);
  }
  return <>{parts}</>;
};

const HighlightedTransformedPhrase: React.FC<{ left: string; right: string }> = ({ left, right }) => {
  // Compare last word of left and first/last word of right when they are a singular→plural or stem pair
  const leftWords = left.split(/\s+/);
  const rightWords = right.split(/\s+/);
  const leftWord = leftWords[leftWords.length - 1] || '';

  // Highlight articles in right, and inspect noun words for suffix/umlaut differences vs leftWord
  return (
    <>
      {rightWords.map((word, wi) => {
        const isLast = wi === rightWords.length - 1;
        const space = isLast ? '' : ' ';
        const stripped = word.replace(/[.,!?;:]+$/, '');
        const punct = word.slice(stripped.length);

        if (new RegExp(`^(${ARTICLE_RE.source})$`).test(stripped)) {
          return (
            <React.Fragment key={wi}>
              <span className="text-sky-700 dark:text-sky-400 font-semibold">{stripped}</span>
              {punct}
              {space}
            </React.Fragment>
          );
        }

        if (stripped.startsWith('*')) {
          return (
            <React.Fragment key={wi}>
              <span className="text-[#DD0000] dark:text-red-400 font-semibold line-through decoration-1">
                {stripped}
              </span>
              {punct}
              {space}
            </React.Fragment>
          );
        }

        // Compare noun transformation against leftWord when lengths & stems resemble each other
        const cleanLeft = leftWord.replace(/[.,!?;:]+$/, '');
        const renderedWord = renderWordDiff(cleanLeft, stripped);
        return (
          <React.Fragment key={wi}>
            <span className="font-semibold text-neutral-900 dark:text-white">{renderedWord}</span>
            {punct}
            {space}
          </React.Fragment>
        );
      })}
    </>
  );
};

function stripUmlautChar(ch: string): string {
  switch (ch) {
    case 'ä':
      return 'a';
    case 'Ä':
      return 'A';
    case 'ö':
      return 'o';
    case 'Ö':
      return 'O';
    case 'ü':
      return 'u';
    case 'Ü':
      return 'U';
    default:
      return ch;
  }
}

function renderWordDiff(baseWord: string, targetWord: string): React.ReactNode {
  if (!baseWord || baseWord.length < 3 || targetWord.length < 3) return targetWord;
  if (baseWord.toLowerCase() === targetWord.toLowerCase()) return targetWord;

  // Find longest stem match allowing umlaut shifts (e.g. Apfel -> Äpfel, Buch -> Bücher, Stuhl -> Stühle)
  let matchLen = 0;
  const maxCheck = Math.min(baseWord.length, targetWord.length);
  while (matchLen < maxCheck) {
    const bCh = stripUmlautChar(baseWord[matchLen]).toLowerCase();
    const tCh = stripUmlautChar(targetWord[matchLen]).toLowerCase();
    if (bCh !== tCh) break;
    matchLen++;
  }

  // Only highlight stem+suffix diff when at least 3 leading characters correspond
  if (matchLen < 3) {
    return targetWord;
  }

  const stemPart = targetWord.slice(0, matchLen);
  const suffixPart = targetWord.slice(matchLen);

  // Highlight any umlaut characters inside stemPart in orange, and suffixPart in purple
  const stemNodes: React.ReactNode[] = [];
  for (let i = 0; i < stemPart.length; i++) {
    const ch = stemPart[i];
    const baseCh = baseWord[i];
    const changedToUmlaut = /[äöüÄÖÜ]/.test(ch) && ch !== baseCh;
    if (changedToUmlaut) {
      stemNodes.push(
        <span
          key={`u-${i}`}
          className="text-amber-700 dark:text-amber-300 bg-amber-500/15 dark:bg-amber-400/20 rounded-xs px-[1px] font-bold"
        >
          {ch}
        </span>
      );
    } else {
      stemNodes.push(<React.Fragment key={`s-${i}`}>{ch}</React.Fragment>);
    }
  }

  if (suffixPart && suffixPart.length <= 4) {
    return (
      <>
        {stemNodes}
        <span className="text-violet-700 dark:text-violet-300 bg-violet-500/12 dark:bg-violet-400/20 rounded-xs px-[2px] font-bold">
          {suffixPart}
        </span>
      </>
    );
  }

  return (
    <>
      {stemNodes}
      {suffixPart}
    </>
  );
};

/**
 * Highlights pattern suffixes (-e, -(e)n, -er, -innen, -s, ¨-e, etc.) or starred errors (*Kinds)
 * inside badges and concise rule headings.
 */
export const GrammarPatternBadge: React.FC<{ pattern: string }> = ({ pattern }) => {
  const hasUmlaut = /[¨äöüÄÖÜ]/.test(pattern);
  const toneClass = hasUmlaut
    ? 'border-amber-200 dark:border-amber-800/70 bg-amber-50/90 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
    : 'border-violet-200 dark:border-violet-800/70 bg-violet-50/90 dark:bg-violet-950/50 text-violet-800 dark:text-violet-300';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border font-mono-tabular text-xs font-bold tracking-tight ${toneClass}`}
    >
      {pattern}
    </span>
  );
};

/**
 * Highlights a specific target substring (`highlight` fragments separated by `/`) inside a German example sentence.
 */
export const HighlightedGermanSentence: React.FC<{
  sentence: string;
  highlight?: string;
}> = ({ sentence, highlight }) => {
  if (!highlight || !highlight.trim()) {
    return <>{sentence}</>;
  }

  const needles = highlight
    .split('/')
    .map((s) => s.trim())
    .filter((s) => s.length >= 2)
    .sort((a, b) => b.length - a.length);

  if (needles.length === 0) return <>{sentence}</>;

  const escaped = needles.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'g');
  const parts = sentence.split(regex);

  return (
    <>
      {parts.map((part, idx) => {
        const isHit = needles.some((n) => n === part);
        if (!isHit) return <React.Fragment key={idx}>{part}</React.Fragment>;
        return (
          <mark
            key={idx}
            className="bg-violet-500/12 dark:bg-violet-400/20 text-violet-900 dark:text-violet-200 px-1 py-0.5 rounded-xs font-bold not-italic"
          >
            {part}
          </mark>
        );
      })}
    </>
  );
};
