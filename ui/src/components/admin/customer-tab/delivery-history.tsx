'use client';

import Pagination from '@/components/pagination';
import {
  ownerCustomerDeliveryHistory,
  type OwnerCustomerDeliveryHistoryItem,
  type OwnerCustomerDeliveryStatus,
} from '@/constants';
import { useMemo, useRef, useState } from 'react';

type DeliveryShiftFilter = 'all' | 'morning' | 'evening';
type DeliveryStatusFilter = 'all' | OwnerCustomerDeliveryStatus;

const ITEMS_PER_PAGE = 5;

const statusClasses: Record<OwnerCustomerDeliveryStatus, string> = {
  delivered: 'bg-emerald-100 text-emerald-700',
  skipped: 'bg-amber-100 text-amber-700',
  pending: 'bg-sky-100 text-sky-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

const formatDate = (dateValue: string) => {
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const CustomerDeliveryHistory = () => {
  const [page, setPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeliveryStatusFilter>('all');
  const [shiftFilter, setShiftFilter] = useState<DeliveryShiftFilter>('all');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [rows, setRows] = useState<OwnerCustomerDeliveryHistoryItem[]>(
    ownerCustomerDeliveryHistory,
  );
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const search = searchQuery.trim().toLowerCase();
      const formattedDate = formatDate(row.date).toLowerCase();

      if (
        search &&
        !formattedDate.includes(search) &&
        !row.shift.includes(search) &&
        !row.status.includes(search)
      ) {
        return false;
      }

      if (statusFilter !== 'all' && row.status !== statusFilter) return false;
      if (shiftFilter !== 'all' && row.shift !== shiftFilter) return false;
      if (startDate && row.date < startDate) return false;
      if (endDate && row.date > endDate) return false;

      return true;
    });
  }, [rows, searchQuery, statusFilter, shiftFilter, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentRows = filteredRows.slice(start, start + ITEMS_PER_PAGE);

  const updateStatus = (id: number, status: OwnerCustomerDeliveryStatus) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
    setOpenMenuId(null);
  };

  return (
    <div
      className='bg-white rounded-xl border border-slate-200 shadow-sm mt-8'
      ref={menuContainerRef}
      onClick={(event) => {
        if (
          menuContainerRef.current &&
          event.target instanceof Node &&
          !menuContainerRef.current.contains(event.target)
        ) {
          setOpenMenuId(null);
        }
      }}
    >
      <div className='p-3 sm:p-4 border-b border-slate-200'>
        <button
          type='button'
          onClick={() => setIsFiltersOpen((prev) => !prev)}
          aria-expanded={isFiltersOpen}
          aria-controls='delivery-filters-panel'
          className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between text-left hover:bg-slate-100 transition-colors'
        >
          <span className='flex items-center gap-2 text-slate-700 font-semibold'>
            <span className='material-symbols-outlined text-[20px]'>
              tune
            </span>
            Filters
          </span>
          <span className='material-symbols-outlined text-slate-500'>
            {isFiltersOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {isFiltersOpen && (
          <div id='delivery-filters-panel' className='pt-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4'>
              <div className='xl:col-span-2'>
                <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2'>
                  Search
                </label>
                <div className='relative'>
                  <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]'>
                    search
                  </span>
                  <input
                    className='w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-700'
                    placeholder='Search by date, shift or status...'
                    type='text'
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>

              <div>
                <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2'>
                  Start Date
                </label>
                <input
                  type='date'
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className='w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-700'
                />
              </div>

              <div>
                <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2'>
                  End Date
                </label>
                <input
                  type='date'
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className='w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-700'
                />
              </div>

              <div className='xl:col-span-2'>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                  <div>
                    <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2'>
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value as DeliveryStatusFilter);
                        setPage(1);
                      }}
                      className='w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-700'
                    >
                      <option value='all'>All Statuses</option>
                      <option value='pending'>Pending</option>
                      <option value='delivered'>Delivered</option>
                      <option value='skipped'>Skipped</option>
                      <option value='cancelled'>Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2'>
                      Shift
                    </label>
                    <select
                      value={shiftFilter}
                      onChange={(e) => {
                        setShiftFilter(e.target.value as DeliveryShiftFilter);
                        setPage(1);
                      }}
                      className='w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-700'
                    >
                      <option value='all'>All Shifts</option>
                      <option value='morning'>Morning</option>
                      <option value='evening'>Evening</option>
                    </select>
                  </div>

                  <div className='flex items-end'>
                    <button
                      className='w-full bg-primary/10 hover:bg-primary/20 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors'
                      onClick={() => {
                        setSearchQuery('');
                        setStartDate('');
                        setEndDate('');
                        setStatusFilter('all');
                        setShiftFilter('all');
                        setPage(1);
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-slate-50 border-y border-slate-200'>
              <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500'>
                Date
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500'>
                Shift
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500'>
                Cow Qty
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500'>
                Buffalo Qty
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500'>
                Status
              </th>
              <th className='px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-slate-500'>
                Actions
              </th>
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-100'>
            {currentRows.map((row) => (
              <tr key={row.id} className='hover:bg-slate-50/50 transition-colors'>
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
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${statusClasses[row.status]}`}
                  >
                    <span className='size-1.5 rounded-full bg-current'></span>
                    {row.status}
                  </span>
                </td>
                <td className='px-6 py-5 text-right relative'>
                  <button
                    type='button'
                    className='text-slate-400 hover:text-primary transition-colors rounded-md'
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId((prev) => (prev === row.id ? null : row.id));
                    }}
                  >
                    <span className='material-symbols-outlined text-[22px]'>
                      more_vert
                    </span>
                  </button>

                  {openMenuId === row.id && (
                    <div className='absolute right-6 top-12 z-20 w-48 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden'>
                      <button
                        type='button'
                        className='w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2'
                        onClick={() => setOpenMenuId(null)}
                      >
                        <span className='material-symbols-outlined text-[18px]'>
                          edit_square
                        </span>
                        Edit Quantity
                      </button>
                      <button
                        type='button'
                        className='w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2'
                        onClick={() => updateStatus(row.id, 'skipped')}
                      >
                        <span className='material-symbols-outlined text-[18px]'>
                          do_not_disturb_on
                        </span>
                        Mark as Skipped
                      </button>
                      <button
                        type='button'
                        className='w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2'
                        onClick={() => updateStatus(row.id, 'delivered')}
                      >
                        <span className='material-symbols-outlined text-[18px]'>
                          check_circle
                        </span>
                        Mark as Delivered
                      </button>
                      <button
                        type='button'
                        className='w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2'
                        onClick={() => updateStatus(row.id, 'cancelled')}
                      >
                        <span className='material-symbols-outlined text-[18px]'>
                          cancel
                        </span>
                        Mark as Cancelled
                      </button>
                      <button
                        type='button'
                        className='w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2'
                        onClick={() => setOpenMenuId(null)}
                      >
                        <span className='material-symbols-outlined text-[18px]'>
                          note_add
                        </span>
                        Add Note
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {currentRows.length === 0 && (
              <tr>
                <td colSpan={6} className='px-6 py-10 text-center text-sm text-slate-500'>
                  No delivery records match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default CustomerDeliveryHistory;
