'use client';

const getColor = (status: string) => {
  if (status === 'cancelled') {
    return 'bg-red-100 text-red-700';
  }

  if (status === 'skipped') {
    return 'bg-amber-100 text-amber-700';
  }

  return 'bg-primary/20 text-slate-700';
};

const CustomerDelivery = ({ currentRow }: any) => {
  return (
    <>
      <tr className='hover:bg-primary/5 transition-colors group'>
        <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center'>
          {currentRow.date}
        </td>

        <td className='px-6 py-4 whitespace-nowrap text-center'>
          <div className='flex items-center gap-3'>
            <div className='size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold'>
              {currentRow.initials}
            </div>
            <span className='text-sm font-semibold text-slate-700'>
              {currentRow.name}
            </span>
          </div>
        </td>

        <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center'>
          {currentRow.shift === 'morning' ? (
            <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold'>
              <span className='material-symbols-outlined text-[14px]'>
                wb_sunny
              </span>
              Morning
            </span>
          ) : (
            <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold'>
              <span className='material-symbols-outlined text-[14px]'>
                dark_mode
              </span>
              Evening
            </span>
          )}
        </td>

        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-center'>
          {currentRow.cowMilkQty} L
        </td>

        <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 text-center'>
          {currentRow.buffaloMilkQty} L
        </td>

        <td className='px-6 py-4 whitespace-nowrap text-center'>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${getColor(currentRow.status)}`}
          >
            {currentRow.status}
          </span>
        </td>
      </tr>
    </>
  );
};

export default CustomerDelivery;
