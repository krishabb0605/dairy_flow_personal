'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import ContentLayout from '../../../components/layout';
import Pagination from '../../../components/pagination';
import Loader from '../../../components/loader';
import { Table, TableBody, TableHead } from '../../../components/ui/table';

import { dailyDeliveriesHistory } from '../../../constants';
import BillingDetailsAside from './billing-details-aside';

import { BillingHistoryRow } from './billing-history-row';
import { UserContext } from '../../context/user-context';
import { getCustomerBilling, updateInvoice } from '../../../lib/invoice';
import type {
  CustomerBillingRecord,
  CustomerBillingResponse,
} from '../../../types';

const ITEMS_PER_PAGE = 3;

const MonthlyBiling = () => {
  const { user } = useContext(UserContext);
  const [openPanel, setOpenPanel] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<CustomerBillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [years, setYears] = useState<string[]>([]);
  const [year, setYear] = useState('all');

  const fetchBillingRef = useRef(false);

  const customerOwnerId = user?.currentActiveOwner?.id;

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

  const fetchBilling = useCallback(async () => {
    if (!customerOwnerId) {
      setRows([]);
      setTotalPages(1);
      setYears([]);
      setLoading(false);
      return;
    }

    if (fetchBillingRef.current) return;
    fetchBillingRef.current = true;

    try {
      setLoading(true);
      const data: CustomerBillingResponse = await getCustomerBilling({
        customerOwnerId,
        page,
        limit: ITEMS_PER_PAGE,
        year,
      });

      const mapped = data.invoices.map((invoice) => ({
        invoiceId: invoice.id,
        month: formatMonthLabel(invoice.billYear, invoice.billMonth),
        range: formatMonthRange(invoice.billYear, invoice.billMonth),
        qty: invoice.cowMilkQtyTotal + invoice.buffaloMilkQtyTotal,
        amount: invoice.totalAmount,
        status: invoice.status,
        paymentMethod: invoice.paymentMethod,
      }));

      setRows(mapped);
      setTotalPages(data.totalPages);
      setYears(data.years.map((item) => String(item)));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch billing.';
      toast.error(message);
      setRows([]);
      setTotalPages(1);
      setYears([]);
    } finally {
      setLoading(false);
      fetchBillingRef.current = false;
    }
  }, [customerOwnerId, page, year]);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  const handlePaymentMethodChange = async (
    bill: CustomerBillingRecord,
    method: 'STRIPE' | 'COD',
  ) => {
    if (bill.status === 'PAID') return;
    try {
      const payload =
        method === 'COD'
          ? { paymentMethod: method, status: 'PENDING_COD' }
          : { paymentMethod: method, status: 'UNPAID' };
      await updateInvoice(bill.invoiceId, payload);
      fetchBilling();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update payment method.';
      toast.error(message);
    }
  };

  const visibleDays = showAllDays
    ? dailyDeliveriesHistory
    : dailyDeliveriesHistory.slice(0, 3);

  return (
    <ContentLayout
      title='Monthly Statements'
      description='Track your daily milk consumption history and manage recurring payments.'
    >
      <main className='flex-1 flex flex-col overflow-y-auto'>
        <div className='mx-auto w-full flex flex-col gap-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='col-span-1 md:col-span-2 bg-linear-to-br from-red-50 to-white p-6 rounded-2xl border border-red-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 text-red-600 mb-2'>
                  <span className='material-symbols-outlined font-bold'>
                    error_outline
                  </span>
                  <span className='text-sm font-bold uppercase tracking-tight'>
                    Action Required
                  </span>
                </div>
                <h3 className='text-3xl font-black text-slate-900'>
                  ₹4,530.00{' '}
                  <span className='text-sm font-normal text-slate-500'>
                    Overdue
                  </span>
                </h3>
                <p className='text-sm text-slate-600 mt-1'>
                  Outstanding balance from June and July cycles.
                </p>
              </div>
              <button className='w-full md:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2'>
                <span className='material-symbols-outlined'>payments</span>
                Pay All Overdue
              </button>
            </div>
            <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between'>
              <div>
                <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
                  August Cycle
                </span>
                <h3 className='text-2xl font-bold text-slate-900 mt-1'>
                  ₹2,360.00
                </h3>
              </div>
              <div className='flex items-center justify-between mt-4'>
                <span className='px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase'>
                  PAID
                </span>
                <span className='text-[10px] text-slate-400'>Aug 01</span>
              </div>
            </div>
            <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between'>
              <div>
                <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
                  Projected Sept
                </span>
                <h3 className='text-2xl font-bold text-slate-900 mt-1'>
                  $1320.00
                </h3>
              </div>
              <div className='flex items-center justify-between mt-4'>
                <span className='text-[10px] text-slate-500'>
                  Due in 22 days
                </span>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between px-2'>
              <h2 className='text-[#111418] text-xl font-bold tracking-tight'>
                Billing History
              </h2>
              <div className='flex items-center gap-2'>
                <span className='material-symbols-outlined text-lg text-[#637588]'>
                  filter_list
                </span>
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setPage(1);
                  }}
                  className='border border-slate-200 bg-white text-slate-700 text-sm font-medium rounded-lg px-3 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition'
                >
                  <option value='all'>All Years</option>
                  {years.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='bg-white  border border-[#f0f2f4]  rounded-xl shadow-sm overflow-hidden'>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHead>
                    <tr className='bg-slate-50 text-[#637588]  text-xs font-semibold uppercase tracking-wider'>
                      <th className='pl-6 pr-2 py-3 w-10'>
                        <input
                          className='rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 bg-transparent'
                          type='checkbox'
                        />
                      </th>
                      <th className='px-6 py-4'>Billing Month</th>
                      <th className='px-6 py-4'>Total Qty</th>
                      <th className='px-6 py-4'>Amount</th>
                      <th className='px-6 py-4'>Status</th>
                      <th className='px-6 py-4 text-right'>Actions</th>
                    </tr>
                  </TableHead>
                  <TableBody className='divide-[#f0f2f4]'>
                    {loading ? (
                      <tr>
                        <td className='px-6 py-10 text-center' colSpan={6}>
                          <div className='flex justify-center'>
                            <Loader />
                          </div>
                        </td>
                      </tr>
                    ) : rows.length === 0 ? (
                      <tr>
                        <td
                          className='px-6 py-10 text-center text-sm text-[#637588]'
                          colSpan={6}
                        >
                          No billing records found.
                        </td>
                      </tr>
                    ) : (
                      rows.map((bill) => (
                        <BillingHistoryRow
                          key={bill.invoiceId}
                          bill={bill}
                          onOpenPanel={() => setOpenPanel(true)}
                          onPaymentMethodChange={handlePaymentMethodChange}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <BillingDetailsAside
                open={openPanel}
                onClose={() => setOpenPanel(false)}
                visibleDays={visibleDays}
                totalDays={dailyDeliveriesHistory.length}
                showAllDays={showAllDays}
                onToggleShowAllDays={() => setShowAllDays((prev) => !prev)}
              />

              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </div>
          </div>
        </div>
      </main>
    </ContentLayout>
  );
};

export default MonthlyBiling;
