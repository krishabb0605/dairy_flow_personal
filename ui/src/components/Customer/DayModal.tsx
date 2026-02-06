'use client';

import { format } from 'date-fns';

// temporary
export default function DayModal({ day, close }: any) {
  return (
    <div className='fixed inset-0 bg-black/40 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-xl w-[350px]'>
        <h2 className='font-semibold mb-2'>{format(day, 'PPP')}</h2>

        <button className='bg-blue-500 text-white w-full py-2 rounded mb-3'>
          Add Extra Milk
        </button>

        <button onClick={close} className='border w-full py-2 rounded'>
          Close
        </button>
      </div>
    </div>
  );
}
