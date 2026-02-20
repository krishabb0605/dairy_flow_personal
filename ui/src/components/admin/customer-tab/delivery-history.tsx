'use client';

import Pagination from '../../../components/pagination';
import { useCallback, useEffect, useState } from 'react';
import Button from '../../../components/ui/button';
import Loader from '../../../components/loader';
import type {
  DeliveryShiftFilter,
  DeliveryStatusFilter,
  OwnerCustomerDeliveryHistoryItem,
} from '../../../types';
import { getCustomerDeliveryHistory } from '../../../lib/customerSettings';
import DeliveryHistoryRow from './delivery-history-row';

const ITEMS_PER_PAGE = 2;

type CustomerDeliveryHistoryProps = {
  customerOwnerId: number;
};

const CustomerDeliveryHistory = ({
  customerOwnerId,
}: CustomerDeliveryHistoryProps) => {
  const [page, setPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeliveryStatusFilter>('all');
  const [shiftFilter, setShiftFilter] = useState<DeliveryShiftFilter>('all');
  const [rows, setRows] = useState<OwnerCustomerDeliveryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = useCallback(async () => {
    if (!customerOwnerId) {
      setRows([]);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getCustomerDeliveryHistory(customerOwnerId, {
        page,
        limit: ITEMS_PER_PAGE,
        slot: shiftFilter,
        status: statusFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setRows(data.deliveries);
      setTotalPages(data.totalPages);
      setLoadError(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load delivery history.';
      setLoadError(message);
      setRows([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [customerOwnerId, page, shiftFilter, statusFilter, startDate, endDate]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleRowUpdated = (updated: OwnerCustomerDeliveryHistoryItem) => {
    setRows((prev) =>
      prev.map((row) => (row.id === updated.id ? updated : row)),
    );
  };

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm mt-8'>
      <div className='p-3 sm:p-4 border-b border-slate-200'>
        <Button
          type='button'
          onClick={() => setIsFiltersOpen((prev) => !prev)}
          aria-expanded={isFiltersOpen}
          aria-controls='delivery-filters-panel'
          variant='ghost-list'
          className='w-full p-4 flex items-center justify-between transition-colors border-b border-gray-200'
        >
          <div className='flex items-center gap-2'>
            <span className='material-symbols-outlined text-slate-500'>
              tune
            </span>
            <span className='text-sm font-bold text-slate-700'>Filters</span>
          </div>
          <span className='material-symbols-outlined text-slate-500'>
            {isFiltersOpen ? 'expand_less' : 'expand_more'}
          </span>
        </Button>

        {isFiltersOpen && (
          <div id='delivery-filters-panel' className='p-4'>
            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3'>
              <div className='flex-1 col-span-2'>
                <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>
                  Date Range
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  <div className='relative'>
                    <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
                      calendar_today
                    </span>
                    <input
                      type='date'
                      value={startDate}
                      max={endDate || undefined}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setPage(1);
                      }}
                      className='w-full h-10 bg-slate-50 border-slate-200 rounded-lg text-sm font-medium pl-10 pr-2 focus:ring-primary focus:border-primary focus-visible:outline-primary/50'
                      aria-label='Start date'
                    />
                  </div>
                  <div className='relative'>
                    <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
                      event
                    </span>
                    <input
                      type='date'
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setPage(1);
                      }}
                      className='w-full h-10 bg-slate-50 border-slate-200 rounded-lg text-sm font-medium pl-10 pr-2 focus:ring-primary focus:border-primary focus-visible:outline-primary/50'
                      aria-label='End date'
                    />
                  </div>
                </div>
              </div>

              <div className='flex-1'>
                <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>
                  Shift
                </label>
                <div className='relative'>
                  <select
                    value={shiftFilter}
                    onChange={(e) => {
                      setShiftFilter(e.target.value as DeliveryShiftFilter);
                      setPage(1);
                    }}
                    className='w-full bg-slate-50 border-none rounded-lg text-sm font-medium py-2.5 pl-10 pr-4 appearance-none focus:ring-2 focus:ring-primary/20 focus-visible:outline-primary/50'
                  >
                    <option value='all'>All Shifts</option>
                    <option value='morning'>Morning</option>
                    <option value='evening'>Evening</option>
                  </select>

                  <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
                    schedule
                  </span>
                </div>
              </div>

              <div className='flex-1'>
                <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>
                  Status
                </label>
                <div className='relative'>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as DeliveryStatusFilter);
                      setPage(1);
                    }}
                    className='w-full bg-slate-50 border-none rounded-lg text-sm font-medium py-2.5 pl-10 pr-4 appearance-none focus:ring-2 focus:ring-primary/20 focus-visible:outline-primary/50'
                  >
                    <option value='all'>All Status</option>
                    <option value='delivered'>Delivered</option>
                    <option value='pending'>Pending</option>
                    <option value='cancelled'>Cancelled</option>
                  </select>

                  <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
                    filter_list
                  </span>
                </div>
              </div>

              <div className='flex-1'>
                <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>
                  Reset
                </label>
                <Button
                  variant='unstyled'
                  className='px-4 py-2 flex items-center gap-2 transition-colors w-fit bg-slate-50 border-none rounded-lg text-sm font-medium'
                  onClick={() => {
                    setShiftFilter('all');
                    setStatusFilter('all');
                    setStartDate('');
                    setEndDate('');
                    setPage(1);
                  }}
                >
                  <span className='material-symbols-outlined text-[20px]'>
                    reset_settings
                  </span>
                  Reset Filters
                </Button>
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
              <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500'>
                Notes
              </th>
              <th className='px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-slate-500'>
                Actions
              </th>
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-100'>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className='px-6 py-10 text-center text-sm text-slate-500'
                >
                  <div className='flex justify-center'>
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : loadError ? (
              <tr>
                <td
                  colSpan={6}
                  className='px-6 py-10 text-center text-sm text-rose-500'
                >
                  {loadError}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className='px-6 py-10 text-center text-sm text-slate-500'
                >
                  No delivery records match the selected filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <DeliveryHistoryRow
                  key={row.id}
                  row={row}
                  onRowUpdated={handleRowUpdated}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default CustomerDeliveryHistory;
