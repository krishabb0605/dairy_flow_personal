'use client';
import Modal from '../../../components/modal';
import { milkPrices } from '../../../constants';
import { MilkType, Slot } from '../../../types';
import React, { useMemo, useState } from 'react';

const defaultState = {
  morning: {
    cow: 0,
    buffalo: 0,
  },
  evening: {
    cow: 0,
    buffalo: 0,
  },
};

const AddExtraMilkModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const now = new Date();
  const isAfter6PM = now.getHours() >= 18;

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const today = formatDate(now);

  const tomorrow = formatDate(new Date(now.setDate(now.getDate() + 1)));

  const defaultDate = isAfter6PM ? tomorrow : today;
  const defaultSlot: Slot = isAfter6PM ? 'morning' : 'evening';

  const [date, setDate] = useState(defaultDate);
  const [selectedSlot, setSelectedSlot] = useState<Slot>(defaultSlot);

  const [loading, setLoading] = useState<boolean>(false);
  const [delivery, setDelivery] = useState(defaultState);

  const updateQty = (milk: MilkType, delta: number) => {
    setDelivery((prev) => {
      const current = prev[selectedSlot][milk];

      const next = Math.max(0, +(current + delta).toFixed(1));

      return {
        ...prev,
        [selectedSlot]: {
          ...prev[selectedSlot],
          [milk]: next,
        },
      };
    });
  };

  const total = useMemo(() => {
    const cowPrice = delivery[selectedSlot].cow * milkPrices.cow;
    const buffaloPrice = delivery[selectedSlot].buffalo * milkPrices.buffalo;
    return cowPrice + buffaloPrice;
  }, [delivery, selectedSlot]);

  const handleSubmit = async () => {
    setLoading(true);

    console.log({
      date,
      selectedSlot,
      delivery,
      total,
    });

    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  const isTodaySelected = date === today;

  // if today + before 6pm → morning disabled
  const disableMorning = isTodaySelected && !isAfter6PM;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title='Request Extra Milk'
      description='Need a little extra tomorrow?'
      submitText={`Confirm ${selectedSlot} Order`}
      cancelText='Maybe Later'
      onSubmit={handleSubmit}
      loading={loading}
    >
      {/* <!-- Date Selection --> */}
      <div className='space-y-2'>
        <label className='text-sm font-bold text-[#0d1b10] flex items-center gap-2'>
          <span className='material-symbols-outlined text-primary text-lg'>
            calendar_today
          </span>
          Delivery Date
        </label>
        <div className='relative'>
          <input
            className='w-full border border-[#e7f3e9] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none'
            type='date'
            min={today}
            value={date}
            onChange={(e) => {
              const selected = e.target.value;
              setDate(selected);

              if (selected === today) {
                setSelectedSlot('evening');
              }
            }}
          />
        </div>
      </div>

      {/* Shift selection */}
      <div className='space-y-4'>
        <div className='flex gap-2 p-1 rounded-xl'>
          {(['morning', 'evening'] as Slot[]).map((slot) => {
            const disabled = slot === 'morning' && disableMorning;

            return (
              <button
                key={slot}
                disabled={disabled}
                onClick={() => setSelectedSlot(slot)}
                className={`flex-1 py-3 font-medium capitalize transition
                ${
                  selectedSlot === slot
                    ? 'border-b-2 border-primary bg-primary/5'
                    : 'border-b border-[#e7f3e9] text-gray-500'
                }
                ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
              `}
              >
                {slot}
              </button>
            );
          })}
        </div>

        <div className='space-y-3'>
          {/* <!-- Cow Milk Row --> */}
          <div className='flex items-center justify-between p-3 bg-white border border-[#e7f3e9] rounded-xl'>
            <div className='flex items-center gap-3'>
              <div className='size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <span className='material-symbols-outlined'>pets</span>
              </div>
              <div>
                <p className='text-sm font-bold text-[#0d1b10]'>Cow Milk</p>
                <p className='text-[10px] text-gray-500 uppercase font-bold'>
                  ₹{milkPrices.cow}/L
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3 p-1'>
              <button
                onClick={() => updateQty('cow', -0.5)}
                className='size-8 flex items-center justify-center rounded-md bg-white border'
              >
                -
              </button>

              <span className='text-sm font-bold min-w-8 text-center'>
                {delivery[selectedSlot].cow}L
              </span>

              <button
                onClick={() => updateQty('cow', 0.5)}
                className='size-8 flex items-center justify-center rounded-md bg-primary text-white'
              >
                +
              </button>
            </div>
          </div>
          {/* <!-- Buffalo Milk Row --> */}
          <div className='flex items-center justify-between p-3 bg-white border border-[#e7f3e9] rounded-xl'>
            <div className='flex items-center gap-3'>
              <div className='size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <span className='material-symbols-outlined'>grass</span>
              </div>
              <div>
                <p className='text-sm font-bold text-[#0d1b10]'>Buffalo Milk</p>
                <p className='text-[10px] text-gray-500 uppercase font-bold'>
                  ₹{milkPrices.buffalo}/L
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => updateQty('buffalo', -0.5)}
                className='size-8 flex items-center justify-center rounded-md bg-white border'
              >
                -
              </button>

              <span className='text-sm font-bold min-w-8 text-center'>
                {delivery[selectedSlot].buffalo}L
              </span>

              <button
                onClick={() => updateQty('buffalo', 0.5)}
                className='size-8 flex items-center justify-center rounded-md bg-primary text-white'
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Price Summary Card --> */}
      <div className='bg-primary/5 border border-blue-100 rounded-lg p-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-blue-500 text-white rounded-full size-8 flex items-center justify-center'>
            <span className='material-symbols-outlined text-sm'>info</span>
          </div>
          <div>
            <p className='text-xs text-blue-600 font-medium'>Estimated Total</p>
            <p className='text-lg font-bold text-blue-900'>
              ₹{total.toFixed(2)}
            </p>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-[10px] text-blue-500 uppercase tracking-wider font-bold'>
            Standard Rate
          </p>
          <p className='text-xs text-blue-700'>
            {' '}
            Cow ₹{milkPrices.cow}/L · Buffalo ₹{milkPrices.buffalo}/L
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default AddExtraMilkModal;
