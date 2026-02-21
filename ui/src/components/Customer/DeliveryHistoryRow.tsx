'use client';

import type { OwnerCustomerDeliveryHistoryItem } from '../../types';
import Button from '../ui/button';

type DeliveryHistoryRowProps = {
  row: OwnerCustomerDeliveryHistoryItem;
};

const DeliveryHistoryRow = ({ row }: DeliveryHistoryRowProps) => {
  const statusBadge =
    row.status === 'delivered' ? (
      <span className='inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold'>
        <span className='material-symbols-outlined text-[14px]'>
          check_circle
        </span>
        Confirmed
      </span>
    ) : row.status === 'pending' ? (
      <span className='inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-amber-100 text-amber-600 text-xs font-bold'>
        <span className='material-symbols-outlined text-[14px]'>schedule</span>
        Pending
      </span>
    ) : (
      <span className='inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-red-100 text-red-600 text-xs font-bold'>
        <span className='material-symbols-outlined text-[14px]'>cancel</span>
        Cancelled
      </span>
    );

  const totalQty = row.cowQty + row.buffaloQty;

  const dayLabel = new Date(`${row.date}T00:00:00`).toLocaleDateString(
    'en-US',
    { weekday: 'long' },
  );

  const dateLabel = new Date(`${row.date}T00:00:00`).toLocaleDateString(
    'en-US',
    { day: '2-digit', month: 'short', year: 'numeric' },
  );

  return (
    <tr className='hover:bg-primary/5 transition-colors'>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex flex-col items-center'>
          <span className='text-sm font-bold text-[#111418]'>{dateLabel}</span>
          <span className='text-xs text-[#637588]'>{dayLabel}</span>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center justify-center gap-2'>
          <span
            className={`material-symbols-outlined text-[18px] ${
              row.shift === 'morning' ? 'text-amber-500' : 'text-indigo-400'
            }`}
          >
            {row.shift === 'morning' ? 'light_mode' : 'dark_mode'}
          </span>
          <span className='text-xs font-semibold text-slate-600 capitalize'>
            {row.shift}
          </span>
        </div>
      </td>
      <td className='px-6 py-4 text-sm text-center font-medium'>
        {row.cowQty} L
      </td>
      <td className='px-6 py-4 text-sm text-center font-medium'>
        {row.buffaloQty} L
      </td>
      <td className='px-6 py-4 text-sm text-center font-medium'>{totalQty} L</td>
      <td className='px-6 py-4 text-sm text-center font-bold text-[#111418]'>
        ₹ {row.totalAmount}
      </td>
      <td className='px-6 py-4 text-center'>{statusBadge}</td>
    </tr>
  );
};

export default DeliveryHistoryRow;
