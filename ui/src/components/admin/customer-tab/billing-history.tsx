'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

import Pagination from '../../../components/pagination';
import Button from '../../../components/ui/button';
import { Table, TableBody, TableHead } from '../../../components/ui/table';

import type {
  BillingStatusFilter,
  CustomerBillingResponse,
  OwnerBillingApiStatus,
} from '../../../types';
import { getCustomerBilling } from '../../../lib/invoice';
import CustomerBillingHistoryRow from './billing-history-row';

const ITEMS_PER_PAGE = 4;

const CustomerBillingHistory = () => {
  const params = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BillingStatusFilter>('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [rows, setRows] = useState<
    {
      id: string;
      month: string;
      range: string;
      qty: string;
      amount: string;
      status: OwnerBillingApiStatus;
    }[]
  >([]);
  const [years, setYears] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const fetchBillingRef = useRef(false);

  const availableYears = useMemo(
    () => [...years].sort((a, b) => Number(b) - Number(a)),
    [years],
  );

  const formatMonthLabel = (billYear: number, billMonth: number) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(Date.UTC(billYear, billMonth - 1, 1)));

  const formatMonthRange = (billYear: number, billMonth: number) => {
    const start = new Date(Date.UTC(billYear, billMonth - 1, 1));
    const end = new Date(Date.UTC(billYear, billMonth, 0));
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
    });
    return `${formatter.format(start)} - ${formatter.format(end)}`;
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);

  const mapInvoice = (
    invoice: CustomerBillingResponse['invoices'][number],
  ) => ({
    id: `INV-${invoice.id}`,
    month: formatMonthLabel(invoice.billYear, invoice.billMonth),
    range: formatMonthRange(invoice.billYear, invoice.billMonth),
    qty: `${invoice.cowMilkQtyTotal + invoice.buffaloMilkQtyTotal} L`,
    amount: formatCurrency(invoice.totalAmount),
    status: invoice.status,
  });

  const fetchBilling = useCallback(async () => {
    const customerOwnerId = Number(params.id);

    if (!Number.isFinite(customerOwnerId)) {
      setRows([]);
      setYears([]);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    if (fetchBillingRef.current) return;
    fetchBillingRef.current = true;

    try {
      setLoading(true);
      const data = await getCustomerBilling({
        customerOwnerId,
        page,
        limit: ITEMS_PER_PAGE,
        search,
        status: statusFilter,
        year: yearFilter,
      });
      setRows(data.invoices.map(mapInvoice));
      setYears(data.years.map((item) => String(item)));
      setTotalPages(data.totalPages);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch billing.';
      toast.error(message);
      setRows([]);
      setYears([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
      fetchBillingRef.current = false;
    }
  }, [page, params.id, search, statusFilter, yearFilter]);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

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
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>

              <div className='w-full sm:w-44'>
                <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2'>
                  Year
                </label>
                <select
                  value={yearFilter}
                  onChange={(e) => {
                    setYearFilter(e.target.value);
                    setPage(1);
                  }}
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
                    {
                      setStatusFilter(e.target.value as BillingStatusFilter);
                      setPage(1);
                    }
                  }
                  className='w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-700'
                >
                  <option value='all'>All Statuses</option>
                  <option value='UNPAID'>Unpaid</option>
                  <option value='PENDING_COD'>Pending COD</option>
                  <option value='PAID'>Paid</option>
                  <option value='FAILED'>Failed</option>
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
          <Table className='text-sm'>
            <TableHead className='bg-primary/5 text-xs font-bold uppercase tracking-wider text-slate-500'>
              <tr className='border-b border-slate-200'>
                <th className='px-6 py-4'>Month</th>
                <th className='px-6 py-4'>Range</th>
                <th className='px-6 py-4'>Qty</th>
                <th className='px-6 py-4'>Amount</th>
                <th className='px-6 py-4 text-center'>Status</th>
              </tr>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-10 text-center text-sm text-slate-500'
                  >
                    Loading billing records...
                  </td>
                </tr>
              ) : rows.length > 0 ? (
                rows.map((item) => (
                  <CustomerBillingHistoryRow item={item} key={item.id} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-10 text-center text-sm text-slate-500'
                  >
                    No billing records found for selected filters.
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>

        {rows.length > 0 && (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        )}
      </div>
    </div>
  );
};

export default CustomerBillingHistory;
