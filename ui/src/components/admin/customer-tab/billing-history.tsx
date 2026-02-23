'use client';

import { useMemo, useState } from 'react';

import Pagination from '../../../components/pagination';
import Button from '../../../components/ui/button';

import { billingHistory } from '../../../constants';
import type { BillingStatusFilter } from '../../../types';

const ITEMS_PER_PAGE = 4;

const normalizeStatus = (status: string) => status.trim().toLowerCase();

const extractYear = (month: string) => {
  const parts = month.split(' ');
  return parts[parts.length - 1];
};

const CustomerBillingHistory = () => {
  const [page, setPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BillingStatusFilter>('all');
  const [yearFilter, setYearFilter] = useState('all');

  const availableYears = useMemo(() => {
    const years = new Set(
      billingHistory.map((item) => extractYear(item.month)),
    );
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, []);

  const filteredRows = useMemo(() => {
    return billingHistory.filter((item) => {
      const matchesSearch =
        !search ||
        item.month.toLowerCase().includes(search) ||
        item.range.toLowerCase().includes(search);

      if (!matchesSearch) return false;
      if (yearFilter !== 'all' && extractYear(item.month) !== yearFilter)
        return false;
      if (
        statusFilter !== 'all' &&
        normalizeStatus(item.status) !== statusFilter
      ) {
        return false;
      }

      return true;
    });
  }, [search, statusFilter, yearFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ITEMS_PER_PAGE),
  );
  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentRows = filteredRows.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm mt-8'>
      <div className='p-3 sm:p-4 border-b border-slate-200'>
        <Button
          type='button'
          onClick={() => setIsFiltersOpen((prev) => !prev)}
          aria-expanded={isFiltersOpen}
          aria-controls='billing-filters-panel'
          variant='outline-muted'
          className='w-full rounded-xl px-4 py-3 flex items-center justify-between text-left transition-colors'
        >
          <span className='flex items-center gap-2 text-slate-700 font-semibold'>
            <span className='material-symbols-outlined text-[20px]'>tune</span>
            Filters
          </span>
          <span className='material-symbols-outlined text-slate-500'>
            {isFiltersOpen ? 'expand_less' : 'expand_more'}
          </span>
        </Button>

        {isFiltersOpen && (
          <div id='billing-filters-panel' className='pt-4'>
            <div className='flex flex-wrap items-end gap-4'>
              <div className='flex-1 min-w-56'>
                <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2'>
                  Search
                </label>
                <div className='relative'>
                  <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]'>
                    search
                  </span>
                  <input
                    className='w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-700'
                    placeholder='Search month or range...'
                    type='text'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className='w-full sm:w-44'>
                <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2'>
                  Year
                </label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className='w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-700'
                >
                  <option value='all'>All Years</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className='w-full sm:w-44'>
                <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2'>
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as BillingStatusFilter)
                  }
                  className='w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-700'
                >
                  <option value='all'>All Statuses</option>
                  <option value='paid'>Paid</option>
                  <option value='pending'>Pending</option>
                </select>
              </div>

              <Button
                variant='secondary'
                className='w-full sm:w-32 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors'
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setYearFilter('all');
                  setPage(1);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className='overflow-hidden rounded-xl bg-white'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='bg-primary/5 text-xs font-bold uppercase tracking-wider text-slate-500 '>
              <tr className='border-b border-slate-200'>
                <th className='px-6 py-4'>Month</th>
                <th className='px-6 py-4'>Range</th>
                <th className='px-6 py-4'>Qty</th>
                <th className='px-6 py-4'>Amount</th>
                <th className='px-6 py-4 text-center'>Status</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-primary/5'>
              {currentRows.map((item, index) => (
                <tr
                  className='group hover:bg-primary/5 transition-colors'
                  key={`${item.month}-${index}`}
                >
                  <td className='whitespace-nowrap px-6 py-4 font-medium'>
                    {item.month}
                  </td>
                  <td className='px-6 py-4'>{item.range}</td>
                  <td className='px-6 py-4 font-mono text-xs text-slate-500'>
                    {item.qty}
                  </td>
                  <td className='px-6 py-4 font-bold text-slate-900 '>
                    {item.amount}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider capitalize ${
                        normalizeStatus(item.status) === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          normalizeStatus(item.status) === 'paid'
                            ? 'bg-green-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      {item.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <div className='flex justify-end items-center gap-2'>
                      {normalizeStatus(item.status) === 'paid' && (
                        <Button
                          variant='ghost-primary'
                          className='flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 transition-all'
                          title='Download PDF'
                        >
                          <span className='material-symbols-outlined text-[20px]'>
                            download
                          </span>
                        </Button>
                      )}
                      {normalizeStatus(item.status) !== 'paid' && (
                        <Button
                          variant='success-soft'
                          className='px-3 py-1 text-xs font-bold rounded transition-all'
                        >
                          Mark Paid
                        </Button>
                      )}

                      <Button
                        variant='ghost-primary'
                        className='flex items-center justify-center h-8 w-8 text-primary p-2 rounded-lg transition cursor-pointer'
                      >
                        <span className='material-symbols-outlined'>
                          visibility
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentRows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-10 text-center text-sm text-slate-500'
                  >
                    No billing records found for selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {currentRows.length > 0 && (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        )}
      </div>
    </div>
  );
};

export default CustomerBillingHistory;
