'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { pdf } from '@react-pdf/renderer';

import ContentLayout from '../../../components/layout';
import Pagination from '../../../components/pagination';
import Loader from '../../../components/loader';
import { Table, TableBody, TableHead } from '../../../components/ui/table';
import CustomerInvoicePdfDocument from '../../../components/pdf/CustomerInvoicePdfDocument';

import { dailyDeliveriesHistory } from '../../../constants';
import BillingDetailsAside from './billing-details-aside';

import { BillingHistoryRow } from './billing-history-row';
import { UserContext } from '../../context/user-context';
import {
  createCustomerCheckoutSession,
  getCustomerBilling,
  updateInvoice,
} from '../../../lib/invoice';
import { getCustomerMonthlyCalendar } from '../../../lib/daily-milk';
import type {
  CustomerBillingRecord,
  CustomerBillingResponse,
  OwnerBillingApiStatus,
} from '../../../types';

const ITEMS_PER_PAGE = 3;

const MonthlyBiling = () => {
  const { user } = useContext(UserContext);
  const [openPanel, setOpenPanel] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<CustomerBillingRecord[]>([]);
  const [alertInvoices, setAlertInvoices] = useState<CustomerBillingRecord[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [years, setYears] = useState<string[]>([]);
  const [year, setYear] = useState('all');
  const [status, setStatus] = useState<'all' | OwnerBillingApiStatus>('all');
  const [payingInvoiceId, setPayingInvoiceId] = useState<number | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<
    number | null
  >(null);

  const customerOwnerId = user?.currentActiveOwner?.id;

  const formatMonthLabel = (billYear: number, billMonth: number) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(Date.UTC(billYear, billMonth - 1, 1)));

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);

  const formatMonthRange = (billYear: number, billMonth: number) => {
    const start = new Date(Date.UTC(billYear, billMonth - 1, 1));
    const end = new Date(Date.UTC(billYear, billMonth, 0));
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
    });
    return `${formatter.format(start)} - ${formatter.format(end)}`;
  };

  const mapInvoice = (
    invoice: CustomerBillingResponse['invoices'][number],
  ) => ({
    invoiceId: invoice.id,
    id: `INV-${invoice.id}`,
    billYear: invoice.billYear,
    billMonth: invoice.billMonth,
    month: formatMonthLabel(invoice.billYear, invoice.billMonth),
    range: formatMonthRange(invoice.billYear, invoice.billMonth),
    qty: invoice.cowMilkQtyTotal + invoice.buffaloMilkQtyTotal,
    amount: invoice.totalAmount,
    status: invoice.status,
    paymentMethod: invoice.paymentMethod,
  });

  const fetchBilling = useCallback(async () => {
    if (!customerOwnerId) {
      setRows([]);
      setAlertInvoices([]);
      setTotalPages(1);
      setYears([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data: CustomerBillingResponse = await getCustomerBilling({
        customerOwnerId,
        page,
        limit: ITEMS_PER_PAGE,
        status,
        year,
      });

      setRows(data.invoices.map(mapInvoice));
      setAlertInvoices(data.alertInvoices.map(mapInvoice));
      setTotalPages(data.totalPages);
      setYears(data.years.map((item) => String(item)));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch billing.';
      toast.error(message);
      setRows([]);
      setAlertInvoices([]);
      setTotalPages(1);
      setYears([]);
    } finally {
      setLoading(false);
    }
  }, [customerOwnerId, page, status, year]);

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

  const handleStripePay = async (bill: CustomerBillingRecord) => {
    if (!customerOwnerId || payingInvoiceId === bill.invoiceId) return;
    try {
      setPayingInvoiceId(bill.invoiceId);
      const session = await createCustomerCheckoutSession({
        customerOwnerId,
        invoiceId: bill.invoiceId,
      });
      if (session.url) {
        window.location.href = session.url;
      } else {
        toast.error('Stripe session URL not found.');
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to start Stripe checkout.';
      toast.error(message);
    } finally {
      setPayingInvoiceId(null);
    }
  };

  const handleAlertPay = async (bill: CustomerBillingRecord) => {
    try {
      if (bill.paymentMethod !== 'STRIPE') {
        await handlePaymentMethodChange(bill, 'STRIPE');
      }
      await handleStripePay(bill);
    } catch {
      // Errors are surfaced in the called handlers.
    }
  };

  const handleDownloadInvoice = async (bill: CustomerBillingRecord) => {
    if (!customerOwnerId || !user || bill.status !== 'PAID') return;
    if (downloadingInvoiceId === bill.invoiceId) return;

    try {
      setDownloadingInvoiceId(bill.invoiceId);
      const month = `${bill.billYear}-${String(bill.billMonth).padStart(
        2,
        '0',
      )}-01`;
      const calendar = await getCustomerMonthlyCalendar(customerOwnerId, {
        month,
      });

      const pdfDoc = (
        <CustomerInvoicePdfDocument
          dairyName={user.currentActiveOwner?.dairyName ?? 'Dairy'}
          customerName={user.fullName}
          customerPhone={user.mobileNumber}
          customerAddress={user.address}
          invoiceId={bill.id}
          customerId={String(user.customerSettings?.id ?? '—')}
          billYear={bill.billYear}
          billMonth={bill.billMonth}
          monthYear={bill.month}
          totalPaid={bill.amount}
          records={calendar.records}
        />
      );

      const blob = await pdf(pdfDoc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${bill.id}-${bill.month.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to download invoice.';
      toast.error(message);
    } finally {
      setDownloadingInvoiceId(null);
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
          {alertInvoices.length > 0 ? (
            <div className='flex flex-col gap-4'>
              <div className='flex items-center justify-between px-2'>
                <h3 className='text-[#111418] text-lg font-bold tracking-tight'>
                  Payment Alerts
                </h3>
                <button
                  type='button'
                  onClick={() => {
                    setStatus('UNPAID');
                    setPage(1);
                  }}
                  className='inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors'
                >
                  <span className='material-symbols-outlined text-base leading-none'>
                    visibility
                  </span>
                  View all Unpaid
                </button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {alertInvoices.map((bill) => {
                  const statusLabel =
                    bill.status === 'FAILED' ? 'Payment Failed' : 'Overdue';
                  const description =
                    bill.status === 'FAILED'
                      ? `Invoice #${bill.id} for ${formatCurrency(
                          bill.amount,
                        )} has a failed payment.`
                      : `Invoice #${bill.id} for ${formatCurrency(
                          bill.amount,
                        )} is overdue.`;

                  return (
                    <div
                      key={bill.invoiceId}
                      className='bg-white p-5 rounded-xl border-l-4 border-l-red-500 border-y border-r border-slate-200 shadow-sm flex items-start gap-4'
                    >
                      <div className='bg-red-50 p-2.5 rounded-lg text-red-600'>
                        <span className='material-symbols-outlined'>
                          priority_high
                        </span>
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-bold text-slate-900 leading-tight'>
                          {statusLabel} {bill.month} Bill
                        </h4>
                        <p className='text-xs text-slate-500 mt-1 mb-4 leading-relaxed'>
                          {description}
                        </p>
                        <button
                          onClick={() => handleAlertPay(bill)}
                          className='w-full sm:w-auto px-6 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-60'
                          disabled={payingInvoiceId === bill.invoiceId}
                        >
                          {payingInvoiceId === bill.invoiceId
                            ? 'Processing...'
                            : `Pay ${formatCurrency(bill.amount)} Now`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className='bg-emerald-50 border border-emerald-200 rounded-2xl overflow-hidden shadow-sm'>
              <div className='p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10'>
                <div className='w-20 h-20 shrink-0 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600'>
                  <span className='material-symbols-outlined text-5xl'>
                    verified
                  </span>
                </div>
                <div className='flex-1 text-center md:text-left'>
                  <h3 className='text-2xl md:text-3xl font-bold text-slate-900 mb-2'>
                    Payment Status: All Clear!
                  </h3>
                  <p className='text-slate-600 text-sm md:text-base leading-relaxed'>
                    {`You're all caught up on your payments. Your accounts are in perfect standing, and your financial wellness score is improving.`}
                  </p>
                </div>
              </div>
            </div>
          )}

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
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as 'all' | OwnerBillingApiStatus);
                    setPage(1);
                  }}
                  className='border border-slate-200 bg-white text-slate-700 text-sm font-medium rounded-lg px-3 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition'
                >
                  <option value='all'>All Status</option>
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
                      <th className='px-6 py-4'>Invoice</th>
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
                          onPayStripe={handleStripePay}
                          onDownloadInvoice={handleDownloadInvoice}
                          isPaying={payingInvoiceId === bill.invoiceId}
                          isDownloading={
                            downloadingInvoiceId === bill.invoiceId
                          }
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
