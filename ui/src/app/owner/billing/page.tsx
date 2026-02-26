'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { UserContext } from '../../context/user-context';

import ContentLayout from '../../../components/layout';
import Pagination from '../../../components/pagination';
import Button from '../../../components/ui/button';
import Loader from '../../../components/loader';
import BillingTableRow from './billing-table-row';
import { Table, TableBody, TableHead } from '../../../components/ui/table';

import type {
  OwnerBillingApiStatus,
  OwnerBillingRecord,
  OwnerBillingResponse,
} from '../../../utils/types';

import { getOwnerBilling, updateInvoice } from '../../../lib/invoice';

const ITEMS_PER_PAGE = 5;

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const OwnerBillingPage = () => {
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<OwnerBillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPending, setTotalPending] = useState(0);
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalLitersDelivered, setTotalLitersDelivered] = useState(0);
  const [years, setYears] = useState<string[]>([]);

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [status, setStatus] = useState<'all' | OwnerBillingApiStatus>('all');
  const [year, setYear] = useState('all');

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(searchInput.trim());
  };

  const ownerId = user?.ownerSettings?.id;

  const formatMonthLabel = (billYear: number, billMonth: number) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(Date.UTC(billYear, billMonth - 1, 1)));

  const fetchBilling = useCallback(async () => {
    if (!ownerId) {
      setRows([]);
      setTotalPages(1);
      setTotalPending(0);
      setTotalCollected(0);
      setTotalLitersDelivered(0);
      setYears([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data: OwnerBillingResponse = await getOwnerBilling({
        ownerId,
        page,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        status,
        year,
      });

      const mapped = data.invoices.map((invoice) => ({
        invoiceId: invoice.id,
        id: `INV-${invoice.id}`,
        customerName: invoice.customerName,
        mobile: invoice.customerMobile,
        month: formatMonthLabel(invoice.billYear, invoice.billMonth),
        qty: invoice.cowMilkQtyTotal + invoice.buffaloMilkQtyTotal,
        amount: invoice.totalAmount,
        status: invoice.status,
        notes: invoice.notes ?? null,
      }));

      setRows(mapped);
      setTotalPages(data.totalPages);
      setTotalPending(data.totalPending);
      setTotalCollected(data.totalCollected);
      setTotalLitersDelivered(data.totalLitersDelivered);
      setYears(data.years.map((item) => String(item)));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch billing.';
      toast.error(message);
      setRows([]);
      setTotalPages(1);
      setTotalPending(0);
      setTotalCollected(0);
      setTotalLitersDelivered(0);
      setYears([]);
    } finally {
      setLoading(false);
    }
  }, [ownerId, page, searchQuery, status, year]);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  const handleSaveNotes = async (row: OwnerBillingRecord, notes: string) => {
    const payload = notes.trim();
    try {
      await updateInvoice(row.invoiceId, {
        notes: payload.length > 0 ? payload : null,
      });
      fetchBilling();
      toast.success('Notes updated.');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to update notes.';
      toast.error(message);
    }
  };

  const handleStatusChange = async (
    row: OwnerBillingRecord,
    nextStatus: OwnerBillingApiStatus,
  ) => {
    if (row.status === nextStatus) return;
    try {
      await updateInvoice(row.invoiceId, { status: nextStatus });
      fetchBilling();
      toast.success('Invoice status updated.');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to update status.';
      toast.error(message);
    }
  };

  return (
    <ContentLayout title='Billing Management'>
      <div className='flex-1 flex flex-col gap-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col'>
            <span className='text-zinc-500 text-sm font-medium mb-1 uppercase tracking-wider'>
              Total Pending
            </span>
            <div className='flex items-end justify-between'>
              <h3 className='text-3xl font-bold text-zinc-900'>
                {formatCurrency(totalPending)}
              </h3>
            </div>
          </div>
          <div className='bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col'>
            <span className='text-zinc-500 text-sm font-medium mb-1 uppercase tracking-wider'>
              Total Collected
            </span>
            <div className='flex items-end justify-between'>
              <h3 className='text-3xl font-bold text-zinc-900'>
                {formatCurrency(totalCollected)}
              </h3>
            </div>
          </div>
          <div className='bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col'>
            <span className='text-zinc-500 text-sm font-medium mb-1 uppercase tracking-wider'>
              Total Liters Delivered
            </span>
            <div className='flex items-end justify-between'>
              <h3 className='text-3xl font-bold text-zinc-900'>
                {totalLitersDelivered.toFixed(1)} L
              </h3>
            </div>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
          <div className='flex-1 w-full lg:w-auto rounded-full bg-white border border-[#d7e9ff] p-1 flex items-center overflow-hidden shadow-sm'>
            <div className='pl-3 pr-2 text-[#6a97c8] flex items-center justify-center'>
              <span className='material-symbols-outlined text-[22px] leading-none'>
                search
              </span>
            </div>
            <input
              className='flex-1 bg-transparent py-2.5 pr-2 text-sm text-slate-700 placeholder:text-[#84a8ce] outline-none'
              placeholder='Search by name or phone number...'
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

          <div className='flex flex-wrap items-center gap-2 justify-between w-full lg:w-auto'>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as 'all' | OwnerBillingApiStatus);
                setPage(1);
              }}
              className='px-3 py-2.5 bg-white border border-primary/20 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus-visible:outline-primary/50 cursor-pointer hover:opacity-90'
            >
              <option value='all'>All status</option>
              <option value='UNPAID'>Unpaid</option>
              <option value='PENDING_COD'>Pending COD</option>
              <option value='PAID'>Paid</option>
              <option value='FAILED'>Failed</option>
            </select>

            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setPage(1);
              }}
              className='px-3 py-2.5 bg-white border border-primary/20 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus-visible:outline-primary/50 cursor-pointer hover:opacity-90'
            >
              <option value='all'>All Years</option>
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <Button
              variant='outline'
              className='flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-colors h-10'
              onClick={() => {
                setSearchInput('');
                setSearchQuery('');
                setStatus('all');
                setYear('all');
                setPage(1);
              }}
            >
              <span className='material-symbols-outlined text-sm'>
                restart_alt
              </span>
              Reset
            </Button>
          </div>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHead>
                <tr className='border-b border-slate-200'>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                    Invoice
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                    Customer
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center'>
                    Month
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center'>
                    Qty
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center'>
                    Amount
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center'>
                    Notes
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center'>
                    Status
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center'>
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
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      className='px-6 py-8 text-center text-sm text-slate-500'
                      colSpan={6}
                    >
                      No billing records found for selected filters.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <BillingTableRow
                      key={row.id}
                      row={row}
                      onSaveNotes={handleSaveNotes}
                      onStatusChange={handleStatusChange}
                      formatCurrency={formatCurrency}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {rows.length > 0 && (
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          )}
        </div>
      </div>
    </ContentLayout>
  );
};

export default OwnerBillingPage;
