import React from 'react';

const GERMAN_CHARS = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'] as const;

interface GermanCharBarProps {
  onInsert: (char: string) => void;
  disabled?: boolean;
  label?: string;
}

/**
 * Compact 1-tap special character toolbar for mobile and non-German keyboards.
 * Uses onMouseDown preventDefault so tapping a character never dismisses the mobile keyboard.
 */
export const GermanCharBar: React.FC<GermanCharBarProps> = ({
  onInsert,
  disabled = false,
  label,
}) => {
  return (
    <div
      className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar"
      role="group"
      aria-label={label || 'German special characters'}
    >
      {GERMAN_CHARS.map((ch) => (
        <button
          key={ch}
          type="button"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onInsert(ch)}
          className="min-w-[38px] min-h-[38px] px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm font-semibold hover:border-[#DD0000] dark:hover:border-[#FFCE00] active:scale-95 transition-transform cursor-pointer disabled:opacity-40 disabled:cursor-default shrink-0 flex items-center justify-center"
        >
          {ch}
        </button>
      ))}
    </div>
  );
};
