'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

import type { OwnerDeliveryHistoryItem } from '../../types';

import { updateDailyMilk } from '../../lib/daily-milk';

import Button from '../ui/button';
import EditDeliveryModal from '../modal/admin/edit-delivery';
import Badge from '../ui/badge';

const OwnerDeliveryRow = ({
  delivery,
  onUpdated,
}: {
  delivery: OwnerDeliveryHistoryItem;
  onUpdated: (updated: OwnerDeliveryHistoryItem) => void;
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const handleStatusChange = async (nextStatus: string) => {
    if (statusUpdating) return;
    setStatusUpdating(true);
    try {
      const updated = await updateDailyMilk(delivery.id, {
        status: nextStatus as 'PENDING' | 'DELIVERED' | 'CANCELLED',
      });
      onUpdated({ ...delivery, ...updated });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <>
      <tr className='hover:bg-primary/5 transition-colors'>
        <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center'>
          {delivery.date}
        </td>

        <td className='px-6 py-4 whitespace-nowrap text-center'>
          <div className='flex items-center gap-3'>
            {delivery.profileImageUrl ? (
              <Image
                src={delivery.profileImageUrl}
                alt={delivery.name}
                className='size-8 rounded-full object-cover'
                width={100}
                height={100}
              />
            ) : (
              <div className='size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold'>
                {delivery.name?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <span className='text-sm font-semibold text-slate-700'>
              {delivery.name}
            </span>
          </div>
        </td>

        <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center'>
          {delivery.slot === 'morning' ? (
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
          {delivery.cowQty} L
        </td>

        <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 text-center'>
          {delivery.buffaloQty} L
        </td>

        <td className='px-6 py-4 whitespace-nowrap text-center'>
          <Badge
            variant={
              delivery.status.toLowerCase() === 'pending'
                ? 'warning'
                : delivery.status.toLowerCase() === 'cancelled'
                  ? 'danger'
                  : 'primary'
            }
            className='capitalize'
          >
            {delivery.status}
          </Badge>
        </td>

        <td className='px-6 py-4 text-center'>
          {delivery.notes ? (
            <div className='relative inline-flex group'>
              <span className='max-w-35 truncate text-sm text-slate-600'>
                {delivery.notes}
              </span>
              <div className='pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-md bg-slate-900 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'>
                {delivery.notes}
              </div>
            </div>
          ) : (
            <span className='text-sm text-slate-400'>-</span>
          )}
        </td>

        <td className='px-6 py-4 text-center'>
          <div
            className={`flex ${delivery.status === 'PENDING' ? 'justify-center' : 'justify-end'} items-center gap-2`}
          >
            {delivery.status === 'PENDING' && (
              <Button
                onClick={() => setIsEditOpen(true)}
                variant='link-subtle'
                className='h-8 w-8 p-1.5'
              >
                <span className='material-symbols-outlined text-[20px]'>
                  edit
                </span>
              </Button>
            )}

            <div className='relative'>
              <select
                value={delivery.status}
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
          </div>
        </td>
      </tr>

      {isEditOpen && (
        <EditDeliveryModal
          open={isEditOpen}
          delivery={delivery}
          onClose={() => setIsEditOpen(false)}
          onUpdated={(updated) => {
            onUpdated({ ...delivery, ...updated });
          }}
        />
      )}
    </>
  );
};

export default OwnerDeliveryRow;
