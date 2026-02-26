'use client';

import type { OwnerCustomerDeliveryHistoryItem } from '../../types';
import Badge from '../ui/badge';

const DeliveryHistoryRow = ({
  row,
}: {
  row: OwnerCustomerDeliveryHistoryItem;
}) => {
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
      <td className='px-6 py-4 text-sm text-center font-medium'>
        {totalQty} L
      </td>
      <td className='px-6 py-4 text-sm text-center font-bold text-[#111418]'>
        ₹ {row.totalAmount}
      </td>
      <td className='px-6 py-4 text-center'>
        <Badge
          variant={
            row.status === 'delivered'
              ? 'primary'
              : row.status === 'cancelled'
                ? 'danger'
                : 'warning'
          }
          className='capitalize'
          icon
        >
          {row.status}
        </Badge>
      </td>
    </tr>
  );
};

export default DeliveryHistoryRow;
