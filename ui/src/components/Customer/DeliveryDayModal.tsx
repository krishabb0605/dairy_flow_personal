'use client';

import type { DeliveryDayModalProps } from '../../types';

import Modal from '../modal';

const DeliveryDayModal = ({
  open,
  onClose,
  selectedDate,
  record,
  loading = false,
}: DeliveryDayModalProps) => {
  const deliveryData = {
    morningCow: record?.morningCow ?? 0,
    morningBuffalo: record?.morningBuffalo ?? 0,
    eveningCow: record?.eveningCow ?? 0,
    eveningBuffalo: record?.eveningBuffalo ?? 0,
  };

  const totalMorning = deliveryData.morningCow + deliveryData.morningBuffalo;
  const totalEvening = deliveryData.eveningCow + deliveryData.eveningBuffalo;
  const totalDay = totalMorning + totalEvening;

  return (
    <Modal
      open={open}
      onClose={onClose}
      cancelText='Close'
      title={
        selectedDate
          ? selectedDate.toLocaleDateString('default', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'Day Details'
      }
      description='Delivery quantity breakdown'
    >
      <div className='space-y-4'>
        {loading ? (
          <p className='text-sm text-slate-500'>Loading delivery data...</p>
        ) : null}
        <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
          <p className='text-xs font-bold uppercase tracking-wider text-primary mb-3'>
            Morning
          </p>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Cow Milk</span>
              <span className='font-semibold'>{deliveryData.morningCow} L</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Buffalo Milk</span>
              <span className='font-semibold'>
                {deliveryData.morningBuffalo} L
              </span>
            </div>
            <div className='flex justify-between border-t border-slate-200 pt-2'>
              <span className='text-slate-700 font-medium'>Morning Total</span>
              <span className='font-bold text-primary'>{totalMorning} L</span>
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
          <p className='text-xs font-bold uppercase tracking-wider text-primary mb-3'>
            Evening
          </p>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Cow Milk</span>
              <span className='font-semibold'>{deliveryData.eveningCow} L</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Buffalo Milk</span>
              <span className='font-semibold'>
                {deliveryData.eveningBuffalo} L
              </span>
            </div>
            <div className='flex justify-between border-t border-slate-200 pt-2'>
              <span className='text-slate-700 font-medium'>Evening Total</span>
              <span className='font-bold text-primary'>{totalEvening} L</span>
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-primary/20 bg-primary/5 p-4 flex justify-between items-center'>
          <span className='text-sm font-semibold text-slate-700'>
            Total for this day
          </span>
          <span className='text-lg font-bold text-primary'>{totalDay} L</span>
        </div>
      </div>
    </Modal>
  );
};

export default DeliveryDayModal;
