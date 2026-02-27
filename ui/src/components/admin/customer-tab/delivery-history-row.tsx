import { useState } from 'react';

import Button from '../../../components/ui/button';
import Badge from '../../../components/ui/badge';

import type {
  OwnerCustomerDeliveryHistoryItem,
  OwnerCustomerDeliveryStatus,
  OwnerDelivery,
} from '../../../utils/types';
import { isPastMonth } from '../../../utils/constants';

import { updateDailyMilk } from '../../../lib/daily-milk';

import EditDeliveryModal from '../../modal/admin/edit-delivery';

const formatDate = (dateValue: string) => {
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const DeliveryHistoryRow = ({
  row,
  onRowUpdated,
}: {
  row: OwnerCustomerDeliveryHistoryItem;
  onRowUpdated: (updated: OwnerCustomerDeliveryHistoryItem) => void;
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const isStatusLocked = isPastMonth(row.date);

  const mapUpdated = (
    updated: OwnerDelivery,
  ): OwnerCustomerDeliveryHistoryItem => {
    return {
      ...row,
      cowQty: updated.cowQty,
      buffaloQty: updated.buffaloQty,
      status: updated.status.toLowerCase() as OwnerCustomerDeliveryStatus,
      notes: updated.notes ?? null,
      name: updated.name,
      profileImageUrl: updated.profileImageUrl,
      shift:
        updated.slot.toLowerCase() as OwnerCustomerDeliveryHistoryItem['shift'],
    };
  };

  const handleStatusChange = async (
    nextStatus: OwnerCustomerDeliveryStatus,
  ) => {
    if (statusUpdating) return;
    setStatusUpdating(true);
    try {
      const updated = await updateDailyMilk(row.id, {
        status: nextStatus.toUpperCase() as OwnerDelivery['status'],
      });
      onRowUpdated(mapUpdated(updated));
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setStatusUpdating(false);
    }
  };

  const deliveryForEdit: OwnerDelivery = {
    id: row.id,
    name: row.name,
    profileImageUrl: row.profileImageUrl,
    cowQty: row.cowQty,
    buffaloQty: row.buffaloQty,
    slot: row.shift,
    status: row.status.toUpperCase() as OwnerDelivery['status'],
    notes: row.notes ?? null,
  };

  return (
    <>
      <tr className='hover:bg-slate-50/50 transition-colors'>
        <td className='px-6 py-5 text-sm font-bold text-slate-900'>
          {formatDate(row.date)}
        </td>
        <td className='px-6 py-5'>
          <div className='flex items-center gap-2'>
            <span
              className={`material-symbols-outlined text-[20px] ${
                row.shift === 'morning' ? 'text-amber-500' : 'text-indigo-400'
              }`}
            >
              {row.shift === 'morning' ? 'light_mode' : 'dark_mode'}
            </span>
            <span className='text-sm font-medium text-slate-700 capitalize'>
              {row.shift}
            </span>
          </div>
        </td>
        <td className='px-6 py-5 text-sm font-semibold text-slate-700'>
          {row.cowQty > 0 ? `${row.cowQty.toFixed(1)} L` : '-'}
        </td>
        <td className='px-6 py-5 text-sm font-semibold text-slate-700'>
          {row.buffaloQty > 0 ? `${row.buffaloQty.toFixed(1)} L` : '-'}
        </td>
        <td className='px-6 py-5'>
          <Badge
            variant={
              row.status === 'delivered'
                ? 'success'
                : row.status === 'cancelled'
                  ? 'danger'
                  : 'warning'
            }
            className='capitalize'
            icon
          >
            {row.status}
          </Badge>
        </td>
        <td className='px-6 py-4 text-center'>
          {row.notes ? (
            <div className='relative inline-flex group'>
              <span className='max-w-35 truncate text-sm text-slate-600'>
                {row.notes}
              </span>
              <div className='pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-md bg-slate-900 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'>
                {row.notes}
              </div>
            </div>
          ) : (
            <span className='text-sm text-slate-400'>-</span>
          )}
        </td>
        <td className='px-6 py-5 text-right'>
          <div className='flex justify-end gap-2'>
            {row.status === 'pending' && !isEditOpen ? (
              <Button
                type='button'
                variant='link-subtle'
                className='h-8 w-8 p-1.5'
                onClick={() => setIsEditOpen(true)}
                disabled={isStatusLocked}
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
                  value={row.status}
                  onChange={(e) =>
                    handleStatusChange(
                      e.target.value as OwnerCustomerDeliveryStatus,
                    )
                  }
                  className='appearance-none border border-slate-200 bg-white text-slate-700 text-xs font-medium rounded-full pl-3 pr-8 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition disabled:opacity-50'
                  disabled={statusUpdating || isStatusLocked}
                >
                  <option value='pending'>Pending</option>
                  <option value='delivered'>Delivered</option>
                  <option value='cancelled'>Cancelled</option>
                  <option value='skipped'>Skipped</option>
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
        delivery={deliveryForEdit}
        onClose={() => setIsEditOpen(false)}
        onUpdated={(updated) => {
          onRowUpdated(mapUpdated(updated));
          setIsEditOpen(false);
        }}
      />
    </>
  );
};

export default DeliveryHistoryRow;
