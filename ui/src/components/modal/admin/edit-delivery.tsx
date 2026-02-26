'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import type { EditDeliveryModalProps, OwnerDelivery } from '../../../utils/types';

import { updateDailyMilk } from '../../../lib/daily-milk';

import Modal from '../../modal';

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const;

const EditDeliveryModal = ({
  open,
  delivery,
  onClose,
  onUpdated,
}: EditDeliveryModalProps) => {
  const [cowQty, setCowQty] = useState(delivery.cowQty);
  const [buffaloQty, setBuffaloQty] = useState(delivery.buffaloQty);
  const [notes, setNotes] = useState(delivery.notes ?? '');
  const [status, setStatus] = useState(delivery.status);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCowQty(delivery.cowQty);
    setBuffaloQty(delivery.buffaloQty);
    setNotes(delivery.notes ?? '');
    setStatus(delivery.status);
  }, [open, delivery]);

  const totalLiters = useMemo(
    () => Number(cowQty) + Number(buffaloQty),
    [cowQty, buffaloQty],
  );

  const handleSubmit = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const updated = await updateDailyMilk(delivery.id, {
        cowQty,
        buffaloQty,
        notes,
        status,
      });
      onUpdated(updated);
      onClose();
    } catch (error) {
      console.error('Failed to update delivery:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <Modal
      open={open}
      title='Edit Delivery'
      description='Update quantities, notes, or status.'
      submitText='Save Changes'
      cancelText='Cancel'
      onSubmit={handleSubmit}
      onClose={onClose}
      onCancel={onClose}
      loading={saving}
    >
      <div className='space-y-5'>
        <div className='grid grid-cols-2 gap-4 text-sm text-slate-600'>
          <div>
            <p className='text-xs uppercase tracking-wide text-slate-400'>
              Customer
            </p>
            <p className='font-medium text-slate-800'>{delivery.name}</p>
          </div>
          <div>
            <p className='text-xs uppercase tracking-wide text-slate-400'>
              Slot
            </p>
            <p className='font-medium text-slate-800 capitalize'>
              {delivery.slot}
            </p>
          </div>
          <div>
            <p className='text-xs uppercase tracking-wide text-slate-400'>
              Total Liters
            </p>
            <p className='font-medium text-slate-800'>{totalLiters}</p>
          </div>
          <div>
            <p className='text-xs uppercase tracking-wide text-slate-400'>
              Current Status
            </p>
            <p className='font-medium text-slate-800'>
              {delivery.status.toLowerCase()}
            </p>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Cow Qty
          </label>
          <input
            type='number'
            value={cowQty}
            onChange={(e) => setCowQty(Number(e.target.value))}
            className='mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition'
            min={0}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Buffalo Qty
          </label>
          <input
            type='number'
            value={buffaloQty}
            onChange={(e) => setBuffaloQty(Number(e.target.value))}
            className='mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition'
            min={0}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Notes
          </label>
          <input
            type='text'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className='mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition'
            placeholder='Add a note'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Status
          </label>
          <div className='relative'>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as OwnerDelivery['status'])
              }
              className='mt-1 w-full appearance-none border border-slate-200 bg-white text-slate-700 text-sm font-medium rounded-lg pl-3 pr-9 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition'
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-base leading-none'>
              ▾
            </span>
          </div>
        </div>
      </div>
    </Modal>,
    document.body,
  );
};

export default EditDeliveryModal;
