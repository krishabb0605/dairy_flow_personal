'use client';

import Modal from '../../../components/modal';
import React, { useCallback, useEffect, useState } from 'react';

type Slot = 'morning' | 'evening';
const slotRank = { morning: 0, evening: 1 } as const;

const ScheduleVacation = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(today);
  const [startSlot, setStartSlot] = useState<Slot>('evening');

  const [endDate, setEndDate] = useState(today);
  const [endSlot, setEndSlot] = useState<Slot>('evening');
  const [loading, setLoading] = useState<boolean>(false);

  const isEndBeforeStart = useCallback(
    (sDate: string, sSlot: Slot, eDate: string, eSlot: Slot) => {
      if (eDate < sDate) return true;
      if (eDate > sDate) return false;
      return slotRank[eSlot] < slotRank[sSlot];
    },
    [],
  );

  useEffect(() => {
    if (startDate === today && startSlot !== 'evening') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStartSlot('evening');
    }
  }, [startDate, startSlot, today]);

  useEffect(() => {
    if (endDate === today && endSlot !== 'evening') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEndSlot('evening');
      return;
    }

    if (isEndBeforeStart(startDate, startSlot, endDate, endSlot)) {
      setEndDate(startDate);
      setEndSlot(startSlot);
    }
  }, [startDate, startSlot, endDate, endSlot, today, isEndBeforeStart]);

  const handleSubmit = async () => {
    console.log({
      startDate,
      startSlot,
      endDate,
      endSlot,
    });

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1000);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title='Schedule Vacation'
      description='Select when your vacation starts and ends.'
      submitText='Confirm vacation'
      cancelText='Keep my deliveries'
      onSubmit={handleSubmit}
      loading={loading}
    >
      {/* Start */}
      <div className='space-y-2'>
        <label className='text-xs font-semibold'>Vacation Starts</label>

        <div className='grid grid-cols-2 gap-3'>
          <input
            type='date'
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='border rounded-lg px-3 py-2'
          />

          <select
            value={startSlot}
            disabled={startDate === today}
            onChange={(e) => setStartSlot(e.target.value as Slot)}
            className={`border rounded-lg px-3 py-2 capitalize disabled:bg-gray-100 ${startDate === today ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <option value='morning' disabled={startDate === today}>
              Morning
            </option>
            <option value='evening'>Evening</option>
          </select>
        </div>

        {startDate === today && (
          <p className='text-[11px] text-amber-600'>
            Morning delivery already passed — starting from evening.
          </p>
        )}
      </div>

      {/* End */}
      <div className='space-y-2'>
        <label className='text-xs font-semibold'>Vacation Ends</label>

        <div className='grid grid-cols-2 gap-3'>
          <input
            type='date'
            min={startDate}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className='border rounded-lg px-3 py-2'
          />

          <select
            value={endSlot}
            onChange={(e) => setEndSlot(e.target.value as Slot)}
            className='border rounded-lg px-3 py-2 capitalize cursor-pointer'
          >
            <option value='morning' disabled={endDate === today}>
              Morning
            </option>
            <option value='evening'>Evening</option>
          </select>
        </div>
      </div>

      {/* Info */}
      <div className='flex gap-3 bg-amber-50 border border-amber-100 p-4 rounded-lg'>
        <span className='material-symbols-outlined text-amber-600 shrink-0'>
          info
        </span>
        <p className='text-xs text-amber-800 leading-normal'>
          <strong>Note:</strong> Deliveries will resume automatically on the day
          after your end date. Please ensure you make changes at least 24 hours
          in advance.
        </p>
      </div>
    </Modal>
  );
};

export default ScheduleVacation;
