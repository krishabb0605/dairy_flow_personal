'use client';

import Modal from '../../../components/modal';
import React, { useEffect, useState } from 'react';

type Slot = 'morning' | 'evening';

const ScheduleVacation = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const isAfter6PM = now.getHours() >= 18;

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // START
  const initialStartDate = isAfter6PM ? tomorrowStr : today;
  const initialStartSlot: Slot = isAfter6PM ? 'morning' : 'evening';

  // END (always next slot)
  const initialEndDate =
    initialStartSlot === 'evening' ? tomorrowStr : initialStartDate;

  const initialEndSlot: Slot =
    initialStartSlot === 'evening' ? 'morning' : 'evening';

  const [startDate, setStartDate] = useState(initialStartDate);
  const [startSlot, setStartSlot] = useState<Slot>(initialStartSlot);

  const [endDate, setEndDate] = useState(initialEndDate);
  const [endSlot, setEndSlot] = useState<Slot>(initialEndSlot);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Same day logic
    if (startDate === endDate) {
      if (startSlot === 'evening') {
        // evening → must end next day morning
        const next = new Date(startDate);
        next.setDate(next.getDate() + 1);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEndDate(next.toISOString().split('T')[0]);
        setEndSlot('morning');
      } else {
        // morning → evening same day
        setEndSlot('evening');
      }
    }
  }, [endDate, startDate, startSlot]);

  // Auto adjust slot when start date changes
  useEffect(() => {
    if (startDate === today && isAfter6PM) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStartSlot('evening');
    }
  }, [isAfter6PM, startDate, today]);

  const handleRangeChange = (start: string, end: string) => {
    // auto fix reversed ranges
    if (end && start > end) {
      setStartDate(end);
      setEndDate(start);
    } else {
      setStartDate(start);
      setEndDate(end);
    }
  };

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
            min={initialStartDate}
            value={startDate}
            onChange={(e) => handleRangeChange(e.target.value, endDate)}
            className='border rounded-lg px-3 py-2'
          />

          <select
            value={startSlot}
            disabled={startDate === today}
            onChange={(e) => setStartSlot(e.target.value as Slot)}
            className={`border rounded-lg px-3 py-2 capitalize disabled:bg-gray-100 ${startDate === today ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <option value='morning'>Morning</option>
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
            onChange={(e) => handleRangeChange(startDate, e.target.value)}
            className='border rounded-lg px-3 py-2'
          />

          <select
            value={endSlot}
            onChange={(e) => setEndSlot(e.target.value as Slot)}
            className='border rounded-lg px-3 py-2 capitalize cursor-pointer'
          >
            <option value='morning'>Morning</option>
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
