'use client';

import { useState } from 'react';
import Button from '../../components/ui/button';

const DashboardCustomer = ({
  slotDeliverie,
  selectedIds,
  toggleSelect,
  updateSingleStatus,
  setDeliveries,
}: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cowQty, setCowQty] = useState(slotDeliverie.cowQty);
  const [buffaloQty, setBuffaloQty] = useState(slotDeliverie.buffaloQty);

  return (
    <tr key={slotDeliverie.id}>
      <td className='px-6 py-4'>
        {slotDeliverie.status === 'pending' && (
          <input
            type='checkbox'
            checked={selectedIds.includes(slotDeliverie.id)}
            onChange={() => toggleSelect(slotDeliverie.id)}
          />
        )}
      </td>

      <td className='px-6 py-4'>
        <p className='font-semibold'>{slotDeliverie.name}</p>
        <p className='text-xs text-slate-500'>{slotDeliverie.address}</p>
      </td>

      <td className='px-6 py-4'>
        {isEditing ? (
          <input
            type='number'
            value={cowQty}
            onChange={(e) => setCowQty(Number(e.target.value))}
            className='border rounded w-20 px-2 py-1 text-sm'
          />
        ) : (
          slotDeliverie.cowQty
        )}
      </td>
      <td className='px-6 py-4'>
        {isEditing ? (
          <input
            type='number'
            value={buffaloQty}
            onChange={(e) => setBuffaloQty(Number(e.target.value))}
            className='border rounded w-20 px-2 py-1 text-sm'
          />
        ) : (
          slotDeliverie.buffaloQty
        )}
      </td>

      <td className='px-6 py-4 font-bold'>
        {slotDeliverie.cowQty + slotDeliverie.buffaloQty}
      </td>

      <td className='px-6 py-4 capitalize font-medium'>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${
        slotDeliverie.status === 'pending'
          ? 'bg-amber-50 text-amber-700 border-amber-100'
          : slotDeliverie.status === 'delivered'
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-red-100 text-red-700 border-red-200'
      }
    `}
        >
          {slotDeliverie.status}
        </span>
      </td>

      <td className='px-6 py-4 text-right'>
        {slotDeliverie.status === 'pending' ? (
          <div className='flex justify-end gap-2'>
            {!isEditing ? (
              <>
                {/* Edit */}
                <Button
                  onClick={() => setIsEditing(true)}
                  variant='link-subtle'
                  className='h-8 w-8 p-1.5'
                >
                  <span className='material-symbols-outlined text-[20px]'>
                    edit
                  </span>
                </Button>

                <Button
                  onClick={() =>
                    updateSingleStatus(slotDeliverie.id, 'delivered')
                  }
                  variant='primary'
                  className='text-xs px-3 py-1.5 rounded-lg'
                >
                  Mark Delivered
                </Button>

                <Button
                  onClick={() =>
                    updateSingleStatus(slotDeliverie.id, 'skipped')
                  }
                  variant='danger'
                  className='text-xs px-3 py-1.5 rounded-lg'
                >
                  Skip
                </Button>
              </>
            ) : (
              <>
                {/* Cancel */}
                <Button
                  onClick={() => {
                    setCowQty(slotDeliverie.cowQty);
                    setBuffaloQty(slotDeliverie.buffaloQty);
                    setIsEditing(false);
                  }}
                  variant='link-muted'
                  className='text-xs'
                >
                  Cancel
                </Button>

                {/* Save */}
                <Button
                  onClick={() => {
                    setDeliveries((prev: any[]) =>
                      prev.map((d) =>
                        d.id === slotDeliverie.id
                          ? { ...d, cowQty, buffaloQty }
                          : d,
                      ),
                    );

                    setIsEditing(false);
                  }}
                  variant='primary'
                  className='text-xs px-3 py-1.5 rounded-lg'
                >
                  Save
                </Button>
              </>
            )}
          </div>
        ) : (
          <span
            className={`text-xs font-medium capitalize ${slotDeliverie.status === 'skipped' ? 'text-red-700' : 'text-emerald-600'}`}
          >
            {slotDeliverie.status}
          </span>
        )}
      </td>
    </tr>
  );
};

export default DashboardCustomer;
