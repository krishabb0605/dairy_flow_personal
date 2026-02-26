import * as React from 'react';

type TableProps = React.TableHTMLAttributes<HTMLTableElement>;
type TableSectionProps = React.HTMLAttributes<HTMLTableSectionElement>;
type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;
type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;
type TableHeadCellProps = React.ThHTMLAttributes<HTMLTableCellElement>;

const cx = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(' ');

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className = '', ...props }, ref) => (
    <table
      ref={ref}
      className={cx('w-full text-left border-collapse', className)}
      {...props}
    />
  ),
);

Table.displayName = 'Table';

export const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  TableSectionProps
>(({ className = '', ...props }, ref) => (
  <thead
    ref={ref}
    className={cx('bg-slate-50/60 border-b border-slate-200', className)}
    {...props}
  />
));

TableHead.displayName = 'TableHead';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableSectionProps
>(({ className = '', ...props }, ref) => (
  <tbody ref={ref} className={cx('divide-y divide-primary/5', className)} {...props} />
));

TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className = '', ...props }, ref) => (
    <tr ref={ref} className={cx('hover:bg-primary/5 transition-colors', className)} {...props} />
  ),
);

TableRow.displayName = 'TableRow';

export const TableHeadCell = React.forwardRef<
  HTMLTableCellElement,
  TableHeadCellProps
>(({ className = '', ...props }, ref) => (
  <th
    ref={ref}
    className={cx(
      'px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider',
      className,
    )}
    {...props}
  />
));

TableHeadCell.displayName = 'TableHeadCell';

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className = '', ...props }, ref) => (
    <td ref={ref} className={cx('px-6 py-4 text-sm text-slate-700', className)} {...props} />
  ),
);

TableCell.displayName = 'TableCell';
