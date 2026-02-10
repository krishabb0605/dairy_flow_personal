'use client';

const CustomerDelivery = ({ row, onReport }: any) => {
  return (
    <>
      <tr key={row.id} className='hover:bg-gray-50/50 transition-colors'>
        <td className='px-6 py-4'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-sm'>
              {row.initials}
            </div>

            <div>
              <p className='text-sm font-bold'>{row.name}</p>
              <p className='text-[10px] text-[#637588]'>#{row.customerId}</p>
            </div>
          </div>
        </td>

        <td className='px-6 py-4'>
          <div className='text-sm text-slate-600 max-w-50 truncate'>
            {row.address}
          </div>
        </td>

        <td className='px-6 py-4'>
          <p
            className={`text-sm flex items-center justify-center ${row.confirmed ? 'font-bold bg-primary/10' : ''}`}
          >
            {row.cowMilkQty} L
          </p>
        </td>

        <td className='px-6 py-4'>
          <p
            className={`text-sm flex items-center justify-center ${row.confirmed ? 'font-bold bg-primary/10' : ''}`}
          >
            {row.buffaloMilkQty} L
          </p>
        </td>

        <td className='px-6 py-4 text-right'>
          {row.confirmed ? (
            <div className='text-primary font-bold text-xs flex justify-end gap-1 items-center'>
              <span className='material-symbols-outlined text-lg'>
                check_circle
              </span>
              Confirmed
            </div>
          ) : (
            <div className='flex justify-end gap-2'>
              <button
                className='h-8 w-8 rounded bg-[#f0f2f4] text-red-500 flex items-center justify-center'
                onClick={onReport}
              >
                <span className='material-symbols-outlined text-lg'>flag</span>
              </button>

              <button className='h-8 px-4 rounded bg-primary text-white text-xs font-bold'>
                Confirm
              </button>
            </div>
          )}
        </td>
      </tr>
    </>
  );
};

export default CustomerDelivery;
