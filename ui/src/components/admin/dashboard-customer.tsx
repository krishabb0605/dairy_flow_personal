'use client';

import { useState } from 'react';

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
                <button
                  onClick={() => setIsEditing(true)}
                  className='h-8 w-8 p-1.5 text-slate-400 hover:text-primary'
                >
                  <span className='material-symbols-outlined text-[20px]'>
                    edit
                  </span>
                </button>

                <button
                  onClick={() =>
                    updateSingleStatus(slotDeliverie.id, 'delivered')
                  }
                  className='bg-primary text-white text-xs px-3 py-1.5 rounded-lg'
                >
                  Mark Delivered
                </button>

                <button
                  onClick={() =>
                    updateSingleStatus(slotDeliverie.id, 'skipped')
                  }
                  className='bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg'
                >
                  Skip
                </button>
              </>
            ) : (
              <>
                {/* Cancel */}
                <button
                  onClick={() => {
                    setCowQty(slotDeliverie.cowQty);
                    setBuffaloQty(slotDeliverie.buffaloQty);
                    setIsEditing(false);
                  }}
                  className='text-xs'
                >
                  Cancel
                </button>

                {/* Save */}
                <button
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
                  className='bg-primary text-white text-xs px-3 py-1.5 rounded-lg'
                >
                  Save
                </button>
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
