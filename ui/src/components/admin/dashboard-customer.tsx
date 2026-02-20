'use client';

import { useState } from 'react';
import Button from '../../components/ui/button';
import EditDeliveryModal from '../modal/admin/edit-delivery';
import { updateDailyMilk } from '../../lib/daily-milk';
import { FALLBACK_CUSTOMER_PROFILE_IMAGE } from '@/constants';
import Image from 'next/image';

const DashboardCustomer = ({ slotDeliverie, setDeliveries }: any) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const handleStatusChange = async (nextStatus: string) => {
    if (statusUpdating) return;
    setStatusUpdating(true);
    try {
      const updated = await updateDailyMilk(slotDeliverie.id, {
        status: nextStatus as 'PENDING' | 'DELIVERED' | 'CANCELLED',
      });
      setDeliveries((prev: any[]) =>
        prev.map((d) => (d.id === updated.id ? updated : d)),
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <>
      <tr key={slotDeliverie.id}>
        <td className='px-6 py-4'>
          <div className='flex items-center gap-3'>
            <Image
              src={
                slotDeliverie.profileImageUrl || FALLBACK_CUSTOMER_PROFILE_IMAGE
              }
              alt={slotDeliverie.name}
              className='h-9 w-9 rounded-full object-cover'
              width={100}
              height={200}
            />
            <p className='font-semibold'>{slotDeliverie.name}</p>
          </div>
        </td>

        <td className='px-6 py-4'>{slotDeliverie.cowQty}</td>
        <td className='px-6 py-4'>{slotDeliverie.buffaloQty}</td>

        <td className='px-6 py-4 font-bold'>
          {slotDeliverie.cowQty + slotDeliverie.buffaloQty}
        </td>

        <td className='px-6 py-4 capitalize font-medium'>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${
        slotDeliverie.status === 'PENDING'
          ? 'bg-amber-50 text-amber-700 border-amber-100'
          : slotDeliverie.status === 'DELIVERED'
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-red-100 text-red-700 border-red-200'
      }
    `}
          >
            {slotDeliverie.status.toLowerCase()}
          </span>
        </td>

        <td className='px-6 py-4 text-sm text-slate-600'>
          {slotDeliverie.notes ? slotDeliverie.notes : '-'}
        </td>

        <td className='px-6 py-4 text-right'>
          <div className='flex justify-end gap-2'>
            {slotDeliverie.status === 'PENDING' && !isEditOpen ? (
              <Button
                onClick={() => setIsEditOpen(true)}
                variant='link-subtle'
                className='h-8 w-8 p-1.5'
              >
                <span className='material-symbols-outlined text-[20px]'>
                  edit
                </span>
              </Button>
            ) : null}

          {isEditOpen ? (
            <span className='text-xs text-slate-500'>Editing…</span>
          ) : (
            <div className='relative'>
              <select
                value={slotDeliverie.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className='appearance-none border border-slate-200 bg-white text-slate-700 text-xs font-medium rounded-full pl-3 pr-8 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition disabled:opacity-50'
                disabled={statusUpdating}
              >
                <option value='PENDING'>Pending</option>
                <option value='DELIVERED'>Delivered</option>
                <option value='CANCELLED'>Cancelled</option>
              </select>
              <span className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-base leading-none'>
                ▾
              </span>
            </div>
          )}
        </div>
      </td>
      </tr>
      <EditDeliveryModal
        open={isEditOpen}
        delivery={slotDeliverie}
        onClose={() => setIsEditOpen(false)}
        onUpdated={(updated) => {
          setDeliveries((prev: any[]) =>
            prev.map((d) => (d.id === updated.id ? updated : d)),
          );
        }}
      />
    </>
  );
};

export default DashboardCustomer;
