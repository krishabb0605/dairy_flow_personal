import { useEffect, useState } from 'react';

import type { OwnerBillingApiStatus, OwnerBillingRecord } from '../../../types';
import Badge from '../../../components/ui/badge';
import { getBillingStatusVariant } from '../../../constants';

type BillingTableRowProps = {
  row: OwnerBillingRecord;
  onSaveNotes: (row: OwnerBillingRecord, notes: string) => Promise<void>;
  onStatusChange: (
    row: OwnerBillingRecord,
    nextStatus: OwnerBillingApiStatus,
  ) => Promise<void>;
  formatCurrency: (amount: number) => string;
};

const BillingTableRow = ({
  row,
  onSaveNotes,
  onStatusChange,
  formatCurrency,
}: BillingTableRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notesDraft, setNotesDraft] = useState(row.notes ?? '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setNotesDraft(row.notes ?? '');
    }
  }, [isEditing, row.notes]);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await onSaveNotes(row, notesDraft);
      setIsEditing(false);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleStatusChange = async (nextStatus: OwnerBillingApiStatus) => {
    setSavingStatus(true);
    try {
      await onStatusChange(row, nextStatus);
    } finally {
      setSavingStatus(false);
    }
  };

  return (
    <tr key={row.id} className='hover:bg-primary/5 transition-colors'>
      <td className='px-6 py-4 text-sm font-bold text-slate-800'>{row.id}</td>

      <td className='px-6 py-4 text-sm font-medium text-slate-700'>
        <div>{row.customerName}</div>
        <div className='text-xs text-slate-400'>{row.mobile}</div>
      </td>

      <td className='px-6 py-4 text-sm text-center text-slate-700'>
        {row.month}
      </td>

      <td className='px-6 py-4 text-sm text-center text-slate-700'>
        {row.qty.toFixed(1)} L
      </td>

      <td className='px-6 py-4 text-sm text-center font-semibold text-slate-800'>
        {formatCurrency(row.amount)}
      </td>

      <td className='px-6 py-4 text-center'>
        {isEditing ? (
          <input
            type='text'
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            className='w-full max-w-55 mx-auto h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary focus-visible:outline-primary/50'
            placeholder='Add notes...'
          />
        ) : row.notes ? (
          <div className='relative inline-flex group'>
            <span className='max-w-35 truncate text-sm text-slate-600'>
              {row.notes}
            </span>
            <div className='pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-md bg-slate-900 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'>
              {row.notes}
            </div>
          </div>
        ) : (
          <span className='text-sm text-slate-400'>-</span>
        )}
      </td>

      <td className='px-6 py-4 text-center'>
        <Badge variant={getBillingStatusVariant(row.status)} icon>
          {row.status}
        </Badge>
      </td>

      <td className='px-6 py-4 text-center'>
        <div className='flex items-center justify-end gap-2'>
          {isEditing ? (
            <>
              <button
                onClick={handleSaveNotes}
                className='h-8 w-8 p-1.5 text-primary hover:text-primary/80 disabled:opacity-50'
                disabled={savingNotes}
                aria-label='Save notes'
              >
                <span className='material-symbols-outlined text-[20px]'>
                  check
                </span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className='h-8 w-8 p-1.5 text-slate-500 hover:text-slate-700 disabled:opacity-50'
                disabled={savingNotes}
                aria-label='Cancel edit'
              >
                <span className='material-symbols-outlined text-[20px]'>
                  close
                </span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className='h-8 w-8 p-1.5 text-slate-500 hover:text-slate-700'
              aria-label='Edit notes'
            >
              <span className='material-symbols-outlined text-[20px]'>
                edit
              </span>
            </button>
          )}
          <div className='relative'>
            <select
              value={row.status}
              onChange={(e) =>
                handleStatusChange(e.target.value as OwnerBillingApiStatus)
              }
              className='appearance-none border border-slate-200 bg-white text-slate-700 text-xs font-medium rounded-full pl-3 pr-8 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition disabled:opacity-50'
              disabled={savingStatus}
            >
              <option value='UNPAID'>Unpaid</option>
              <option value='PENDING_COD'>Pending COD</option>
              <option value='PAID'>Paid</option>
              <option value='FAILED'>Failed</option>
            </select>
            <span className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-base leading-none'>
              ▾
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default BillingTableRow;
