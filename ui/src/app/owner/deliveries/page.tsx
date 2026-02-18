'use client';
import { useState } from 'react';
import ContentLayout from '../../../components/layout';
import { ownerDeliveries } from '../../../constants';
import Pagination from '../../../components/pagination';
import CustomerDelivery from '../../../components/admin/customer-delivery';
const ITEMS_PER_PAGE = 3;

const Deliveries = () => {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [shift, setShift] = useState('all');
  const [status, setStatus] = useState('all');

  const start = (page - 1) * ITEMS_PER_PAGE;

  const parseDeliveryDate = (dateValue: string) => {
    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return null;
    return parsedDate;
  };

  const filteredDeliveries = ownerDeliveries.filter((ownerDeliverie) => {
    // customer name search
    if (
      customerSearch &&
      !ownerDeliverie.name.toLowerCase().includes(customerSearch.toLowerCase())
    ) {
      return false;
    }

    // shift
    if (shift !== 'all' && ownerDeliverie.shift !== shift) return false;

    // status
    if (status !== 'all' && ownerDeliverie.status !== status) return false;

    const deliveryDate = parseDeliveryDate(ownerDeliverie.date);

    if ((startDate || endDate) && !deliveryDate) return false;

    if (deliveryDate && startDate) {
      const startBoundary = new Date(startDate);
      startBoundary.setHours(0, 0, 0, 0);
      if (deliveryDate < startBoundary) return false;
    }

    if (deliveryDate && endDate) {
      const endBoundary = new Date(endDate);
      endBoundary.setHours(23, 59, 59, 999);
      if (deliveryDate > endBoundary) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredDeliveries.length / ITEMS_PER_PAGE);
  const currentRows = filteredDeliveries.slice(start, start + ITEMS_PER_PAGE);

  return (
    <ContentLayout
      title='Delivery History'
      description={`Manage and track past milk distribution records`}
    >
      <div className='flex-1 flex flex-col gap-6'>
        {/* <!-- Page Heading --> */}
        <div className='flex flex-wrap justify-end items-start gap-3'>
          <div className='flex gap-3'>
            <button
              className='px-4 bg-primary/20 text-slate-700 font-bold rounded-lg flex items-center gap-2 hover:bg-primary/30 transition-colors'
              onClick={() => {
                setCustomerSearch('');
                setShift('all');
                setStatus('all');
                setStartDate('');
                setEndDate('');
                setPage(1);
              }}
            >
              <span className='material-symbols-outlined text-[20px]'>
                filter_list
              </span>
              Reset Filters
            </button>
            <button className='flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm'>
              <span className='material-symbols-outlined text-xl'>
                download
              </span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* <!-- Filters --> */}
        <div className='bg-white rounded-xl border border-primary/5 shadow-sm overflow-hidden'>
          <button
            type='button'
            onClick={() => setIsFiltersOpen((prev) => !prev)}
            aria-expanded={isFiltersOpen}
            aria-controls='delivery-filters-panel'
            className='w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-gray-200'
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
          </button>

          {isFiltersOpen && (
            <div id='delivery-filters-panel' className='p-4'>
              <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3'>
                <div className='flex-1 col-span-2 lg:col-span-1'>
                  <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>
                    Customer
                  </label>

                  <div className='relative'>
                    <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
                      person_search
                    </span>

                    <input
                      type='text'
                      placeholder='Search customer...'
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setPage(1);
                      }}
                      className='w-full h-10 pl-10 pr-4 bg-background-light border-slate-200 font-medium rounded-lg text-sm focus:ring-primary focus:border-primary focus-visible:outline-primary/50'
                    />
                  </div>
                </div>

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
                        className='w-full h-10 bg-background-light border-slate-200 rounded-lg text-sm font-medium pl-10 pr-2 focus:ring-primary focus:border-primary focus-visible:outline-primary/50'
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
                        className='w-full h-10 bg-background-light border-slate-200 rounded-lg text-sm font-medium pl-10 pr-2 focus:ring-primary focus:border-primary focus-visible:outline-primary/50'
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
                      className='w-full bg-background-light border-none rounded-lg text-sm font-medium py-2.5 pl-10 pr-4 appearance-none focus:ring-2 focus:ring-primary/20 focus-visible:outline-primary/50'
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
                      className='w-full bg-background-light border-none rounded-lg text-sm font-medium py-2.5 pl-10 pr-4 appearance-none focus:ring-2 focus:ring-primary/20 focus-visible:outline-primary/50'
                    >
                      <option value='all'>All Status</option>
                      <option value='delivered'>Delivered</option>
                      <option value='skipped'>Skipped</option>
                      <option value='cancelled'>Cancelled</option>
                    </select>

                    <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
                      filter_list
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className='bg-white rounded-xl border border-primary/10 shadow-sm overflow-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50 border-b border-primary/10'>
                <th className='px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center'>
                  Date
                </th>
                <th className='px-6 ps-17 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest'>
                  Customer
                </th>
                <th className='px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center'>
                  Shift
                </th>
                <th className='px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center'>
                  Cow Qty
                </th>
                <th className='px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center'>
                  Buffalo Qty
                </th>
                <th className='px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-primary/5'>
              {currentRows.map((currentRow, index) => (
                <CustomerDelivery currentRow={currentRow} key={index} />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </ContentLayout>
  );
};

export default Deliveries;
