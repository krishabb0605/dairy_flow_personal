'use client';

import { format } from 'date-fns';
import Button from '../../components/ui/button';

// temporary
export default function DayModal({ day, close }: any) {
  return (
    <div className='fixed inset-0 bg-black/40 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-xl w-87.5'>
        <h2 className='font-semibold mb-2'>{format(day, 'PPP')}</h2>

        <Button variant='primary' className='w-full py-2 rounded mb-3'>
          Add Extra Milk
        </Button>

        <Button
          onClick={close}
          variant='outline-muted'
          className='w-full py-2 rounded'
        >
          Close
        </Button>
      </div>
    </div>
  );
}
