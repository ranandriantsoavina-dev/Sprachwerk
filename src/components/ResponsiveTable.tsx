import React, { useCallback, useEffect, useRef, useState } from 'react';

export type ResponsiveTableVariant = 'auto' | 'cards' | 'matrix';
export type ResponsiveTableMode = 'cards' | 'matrix';

export function resolveResponsiveTableMode(
  columnCount: number,
  variant: ResponsiveTableVariant = 'auto'
): ResponsiveTableMode {
  if (variant !== 'auto') return variant;
  return columnCount >= 5 ? 'matrix' : 'cards';
}

export interface ResponsiveTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  columnCount: number;
  variant?: ResponsiveTableVariant;
  wrapperClassName?: string;
  paddedCards?: boolean;
  children: React.ReactNode;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columnCount,
  variant = 'auto',
  wrapperClassName = 'overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-xl',
  paddedCards = false,
  className = 'w-full text-left border-collapse text-xs sm:text-sm',
  children,
  ...tableProps
}) => {
  const mode = resolveResponsiveTableMode(columnCount, variant);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const syncScrollState = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    setScrolled(el.scrollLeft > 2);
  }, []);

  useEffect(() => {
    if (mode !== 'matrix') {
      setScrolled(false);
      return;
    }
    syncScrollState();
  }, [mode, syncScrollState]);

  const modeWrapperClass =
    mode === 'matrix'
      ? 'sw-table-wrap--matrix'
      : paddedCards
      ? 'sw-table-wrap--cards sw-table-wrap--padded'
      : 'sw-table-wrap--cards';

  const modeTableClass = mode === 'matrix' ? 'sw-table-matrix' : 'sw-table-cards';

  return (
    <div
      ref={wrapRef}
      onScroll={mode === 'matrix' ? syncScrollState : undefined}
      data-table-mode={mode}
      data-scrolled={mode === 'matrix' && scrolled ? 'true' : undefined}
      className={`${wrapperClassName} ${modeWrapperClass}`.trim()}
    >
      <table className={`${className} ${modeTableClass}`.trim()} {...tableProps}>
        {children}
      </table>
    </div>
  );
};

export type ResponsiveTableHeadProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const ResponsiveTableHead: React.FC<ResponsiveTableHeadProps> = ({
  className = 'bg-neutral-50 dark:bg-neutral-900/70 border-b border-neutral-200 dark:border-neutral-800',
  ...props
}) => <thead className={className} {...props} />;

export type ResponsiveTableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const ResponsiveTableBody: React.FC<ResponsiveTableBodyProps> = ({
  className = 'divide-y divide-neutral-200 dark:divide-neutral-800',
  ...props
}) => <tbody className={className} {...props} />;

export type ResponsiveTableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

export const ResponsiveTableRow: React.FC<ResponsiveTableRowProps> = ({
  className = 'hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40',
  ...props
}) => <tr className={className} {...props} />;

export type ResponsiveTableHeaderProps = React.ThHTMLAttributes<HTMLTableCellElement>;

export const ResponsiveTableHeader: React.FC<ResponsiveTableHeaderProps> = ({
  className = 'px-3.5 py-2.5 font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap',
  ...props
}) => <th className={className} {...props} />;

export interface ResponsiveTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  label?: string;
}

export const ResponsiveTableCell: React.FC<ResponsiveTableCellProps> = ({
  label,
  className = 'px-3.5 py-2 text-neutral-700 dark:text-neutral-300',
  ...props
}) => (
  <td
    data-label={label && label.trim().length > 0 ? label : undefined}
    className={className}
    {...props}
  />
);

export interface ResponsiveTableEmptyRowProps {
  colSpan: number;
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveTableEmptyRow: React.FC<ResponsiveTableEmptyRowProps> = ({
  colSpan,
  children,
  className = 'px-4 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400',
}) => (
  <tr className="sw-table-empty-row">
    <td colSpan={Math.max(colSpan, 1)} className={`sw-table-empty-cell ${className}`.trim()}>
      {children}
    </td>
  </tr>
);

export interface ResponsiveDataTableProps<T = React.ReactNode> {
  columns?: string[];
  rows: T[][];
  variant?: ResponsiveTableVariant;
  wrapperClassName?: string;
  tableClassName?: string;
  theadClassName?: string;
  thClassName?: string;
  tbodyClassName?: string;
  paddedCards?: boolean;
  emptyState?: React.ReactNode;
  getRowClassName?: (row: T[], rowIndex: number) => string;
  getCellClassName?: (cell: T, rowIndex: number, colIndex: number) => string;
  renderCell?: (cell: T, rowIndex: number, colIndex: number) => React.ReactNode;
}

export function ResponsiveDataTable<T = React.ReactNode>({
  columns,
  rows,
  variant = 'auto',
  wrapperClassName,
  tableClassName,
  theadClassName,
  thClassName,
  tbodyClassName,
  paddedCards = false,
  emptyState = '—',
  getRowClassName,
  getCellClassName,
  renderCell,
}: ResponsiveDataTableProps<T>): React.ReactElement {
  const hasHeader = Boolean(columns && columns.length > 0);
  const inferredColumns = Math.max(
    columns?.length ?? 0,
    rows.reduce((max, row) => Math.max(max, row.length), 0),
    1
  );

  return (
    <ResponsiveTable
      columnCount={inferredColumns}
      variant={variant}
      wrapperClassName={wrapperClassName}
      className={tableClassName}
      paddedCards={paddedCards}
    >
      {hasHeader && columns && (
        <ResponsiveTableHead className={theadClassName}>
          <tr>
            {columns.map((col, ci) => (
              <ResponsiveTableHeader key={ci} scope="col" className={thClassName}>
                {col}
              </ResponsiveTableHeader>
            ))}
          </tr>
        </ResponsiveTableHead>
      )}
      <ResponsiveTableBody className={tbodyClassName}>
        {rows.length === 0 ? (
          <ResponsiveTableEmptyRow colSpan={inferredColumns}>{emptyState}</ResponsiveTableEmptyRow>
        ) : (
          rows.map((row, ri) => (
            <ResponsiveTableRow key={ri} className={getRowClassName ? getRowClassName(row, ri) : undefined}>
              {row.map((cell, ci) => {
                const headerLabel = hasHeader && columns ? columns[ci] : undefined;
                const cellClass = getCellClassName ? getCellClassName(cell, ri, ci) : undefined;
                return (
                  <ResponsiveTableCell key={ci} label={headerLabel} className={cellClass}>
                    {renderCell ? renderCell(cell, ri, ci) : (cell as React.ReactNode)}
                  </ResponsiveTableCell>
                );
              })}
            </ResponsiveTableRow>
          ))
        )}
      </ResponsiveTableBody>
    </ResponsiveTable>
  );
}
