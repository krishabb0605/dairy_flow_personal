'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { UserContext } from '../../context/user-context';

import ContentLayout from '../../../components/layout';
import Pagination from '../../../components/pagination';
import Button from '../../../components/ui/button';
import Loader from '../../../components/loader';
import { Table, TableBody, TableHead } from '../../../components/ui/table';
import OwnerDeliveryRow from './owner-delivery-row';

import type {
  OwnerDeliveryHistoryItem,
  OwnerDeliveryHistoryResponse,
} from '../../../utils/types';

import { getOwnerDeliveryHistory } from '../../../lib/daily-milk';

const ITEMS_PER_PAGE = 5;

const Deliveries = () => {
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const [shift, setShift] = useState('all');
  const [status, setStatus] = useState('all');

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [deliveries, setDeliveries] = useState<OwnerDeliveryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const ownerId = user?.ownerSettings?.id;

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(searchInput.trim());
  };

  const fetchDeliveries = useCallback(async () => {
    if (!ownerId) {
      setDeliveries([]);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data: OwnerDeliveryHistoryResponse = await getOwnerDeliveryHistory(
        ownerId,
        {
          page,
          limit: ITEMS_PER_PAGE,
          search: searchQuery || undefined,
          slot: shift as 'morning' | 'evening' | 'all',
          status: status as 'pending' | 'delivered' | 'cancelled' | 'all',
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      );
      setDeliveries(data.deliveries);
      setTotalPages(data.totalPages);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch deliveries.';
      toast.error(message);
      setDeliveries([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [ownerId, page, searchQuery, shift, status, startDate, endDate]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return (
    <ContentLayout
      title='Delivery History'
      description={`Manage and track past milk distribution records`}
    >
      <div className='flex-1 flex flex-col gap-6'>
        {/* <!-- Filters --> */}
        <div className='bg-white rounded-xl border border-primary/5 shadow-sm overflow-hidden'>
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
              <div className='flex-1 w-full lg:w-auto rounded-full bg-white border border-[#d7e9ff] p-1 flex items-center overflow-hidden shadow-sm mb-4'>
                <div className='pl-3 pr-2 text-[#6a97c8] flex items-center justify-center'>
                  <span className='material-symbols-outlined text-[22px] leading-none'>
                    search
                  </span>
                </div>
                <input
                  className='flex-1 bg-transparent py-2.5 pr-2 text-sm text-slate-700 placeholder:text-[#84a8ce] outline-none'
                  placeholder='Search by name ...'
                  type='text'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                <Button
                  variant='gradient'
                  className='px-6 py-2.5 rounded-full text-sm font-medium transition-opacity shadow-[0_6px_14px_rgba(33,116,230,0.32)]'
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
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
                      value={shift}
                      onChange={(e) => {
                        setShift(e.target.value);
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

                <div className='flex-1 '>
                  <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>
                    Status
                  </label>
                  <div className='relative'>
                    <select
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
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

                <div className='flex-1 '>
                  <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>
                    Reset
                  </label>
                  <Button
                    variant='unstyled'
                    className='px-4 py-2 flex items-center gap-2 transition-colors w-fit bg-slate-50 border-none rounded-lg text-sm font-medium '
                    onClick={() => {
                      setSearchInput('');
                      setSearchQuery('');
                      setShift('all');
                      setStatus('all');
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

        {/* Table */}
        <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHead className=''>
                <tr className='border-b border-slate-200'>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                    Customer
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                    Shift
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                    Cow Qty
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                    Buffalo Qty
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                    Notes
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </TableHead>
              <TableBody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className='px-6 py-8 text-center text-slate-500 text-sm'
                    >
                      <div className='flex justify-center'>
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : deliveries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className='px-6 py-8 text-center text-slate-500 text-sm'
                    >
                      No deliveries found.
                    </td>
                  </tr>
                ) : (
                  deliveries.map((currentRow) => (
                    <OwnerDeliveryRow
                      key={currentRow.id}
                      delivery={currentRow}
                      onUpdated={(updated) => {
                        setDeliveries((prev) =>
                          prev.map((d) => (d.id === updated.id ? updated : d)),
                        );
                      }}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {deliveries.length > 0 && (
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          )}
        </div>
      </div>
    </ContentLayout>
  );
};

export default Deliveries;
