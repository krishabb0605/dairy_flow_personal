'use client';

import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { UserContext } from '../../../app/context/user-context';

import Pagination from '../../../components/pagination';
import ContentLayout from '../../../components/layout';
import DeliveryHistoryRow from '../../../components/Customer/DeliveryHistoryRow';
import Loader from '../../../components/loader';
import Button from '../../../components/ui/button';

import { deliveryFilters } from '../../../constants';
import {
  deliveryFilter,
  OwnerCustomerDeliveryHistoryItem,
} from '../../../types';

import { getCustomerDeliveryHistory } from '../../../lib/customerSettings';

const PAGE_SIZE = 3;

const DeliveriesHistory = () => {
  const { user } = useContext(UserContext);
  const [tab, setTab] = useState<deliveryFilter>('All Deliveries');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [rows, setRows] = useState<OwnerCustomerDeliveryHistoryItem[]>([]);
  const [statusCounts, setStatusCounts] = useState({
    delivered: 0,
    pending: 0,
    cancelled: 0,
  });
  const fetchDeliveriesRef = useRef(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${month}`;
  });

  const customerOwnerId = user?.currentActiveOwner?.id ?? null;

  const statusFilter =
    tab === 'All Deliveries'
      ? 'all'
      : tab === 'Confirmed'
        ? 'delivered'
        : tab === 'Pending'
          ? 'pending'
          : 'cancelled';

  const monthRange = useMemo(() => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = Number(yearStr);
    const monthIndex = Number(monthStr) - 1;
    if (!Number.isFinite(year) || !Number.isFinite(monthIndex)) {
      return { startDate: undefined, endDate: undefined };
    }
    const start = new Date(Date.UTC(year, monthIndex, 1));
    const end = new Date(Date.UTC(year, monthIndex + 1, 0));

    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    };
  }, [selectedMonth]);

  const monthLabel = useMemo(() => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = Number(yearStr);
    const monthIndex = Number(monthStr) - 1;
    if (!Number.isFinite(year) || !Number.isFinite(monthIndex)) {
      return 'Selected Month';
    }
    return new Date(Date.UTC(year, monthIndex, 1)).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [selectedMonth]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!customerOwnerId) {
        setRows([]);
        setTotalPages(1);
        setStatusCounts({ delivered: 0, pending: 0, cancelled: 0 });
        return;
      }

      if (fetchDeliveriesRef.current) return;
      fetchDeliveriesRef.current = true;
      setLoading(true);
      try {
        const data = await getCustomerDeliveryHistory(customerOwnerId, {
          page,
          limit: PAGE_SIZE,
          status: statusFilter,
          slot: 'all',
          startDate: monthRange.startDate,
          endDate: monthRange.endDate,
        });

        setTotalPages(data.totalPages);
        setStatusCounts(
          data.statusCounts ?? { delivered: 0, pending: 0, cancelled: 0 },
        );
        setRows(data.deliveries);
      } catch (error) {
        console.error('Failed to fetch delivery history:', error);
        setRows([]);
        setTotalPages(1);
        setStatusCounts({ delivered: 0, pending: 0, cancelled: 0 });
      } finally {
        setLoading(false);
        fetchDeliveriesRef.current = false;
      }
    };

    fetchDeliveries();
  }, [
    customerOwnerId,
    page,
    statusFilter,
    monthRange.startDate,
    monthRange.endDate,
  ]);

  const deliveriesTotalShiftQty = useMemo(() => {
    let morningShift = 0;
    let eveningShift = 0;
    let morningQty = 0;
    let eveningQty = 0;

    rows.forEach((row) => {
      if (row.shift === 'morning') {
        morningShift++;
        morningQty += row.cowQty + row.buffaloQty;
      }
      if (row.shift === 'evening') {
        eveningShift++;
        eveningQty += row.cowQty + row.buffaloQty;
      }
    });

    return {
      morningShift,
      eveningShift,
      morningQty,
      eveningQty,
    };
  }, [rows]);

  const totalBill = useMemo(() => {
    const total = rows.reduce(
      (acc, deliverie) => acc + deliverie.totalAmount,
      0,
    );
    return total;
  }, [rows]);

  const totalVolume =
    deliveriesTotalShiftQty.morningQty + deliveriesTotalShiftQty.eveningQty;

  const milkTypeRatio = useMemo(() => {
    const totalCow = rows.reduce((sum, row) => sum + row.cowQty, 0);
    const totalBuffalo = rows.reduce((sum, row) => sum + row.buffaloQty, 0);
    const total = totalCow + totalBuffalo;
    const cowPercent = total > 0 ? Math.round((totalCow / total) * 100) : 0;
    const buffaloPercent = total > 0 ? 100 - cowPercent : 0;

    return {
      cowPercent,
      buffaloPercent,
    };
  }, [rows]);

  const totalDeliveries: Record<'Confirmed' | 'Pending' | 'Cancelled', number> =
    useMemo(
      () => ({
        Confirmed: statusCounts.delivered,
        Pending: statusCounts.pending,
        Cancelled: statusCounts.cancelled,
      }),
      [statusCounts],
    );
  return (
    <ContentLayout title='Delivery History'>
      <main className='flex-1 flex flex-col gap-6'>
        <div className='flex flex-wrap justify-between items-end gap-4 bg-white  p-6 rounded-xl border border-[#dce0e5]  shadow-sm'>
          <div className='flex flex-col gap-1'>
            <p className='text-[#111418]  text-3xl font-black leading-tight tracking-tight'>
              Delivery History
            </p>
            <p className='text-[#637588] text-sm font-normal'>
              Shift-based delivery records for{' '}
              <span className='font-bold text-[#111418] '>{monthLabel}</span>
            </p>
          </div>

          <div className='flex gap-2'>
            <div className='relative'>
              <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-500'>
                calendar_month
              </span>
              <input
                type='month'
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setPage(1);
                }}
                className='h-10 rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm font-bold text-slate-700 shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
              />
            </div>
            <Button
              variant='primary'
              size='md'
              className='flex items-center justify-center rounded-lg font-bold gap-2 shadow-md shadow-primary/20'
            >
              <span className='material-symbols-outlined text-[20px]'>
                download
              </span>
              <span>Export PDF</span>
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='flex flex-col gap-2 rounded-xl p-6 bg-white border border-[#dce0e5] shadow-sm'>
            <div className='flex justify-between items-start'>
              <p className='text-[#637588] text-sm font-medium'>Total Volume</p>
              <span className='material-symbols-outlined text-primary'>
                water_drop
              </span>
            </div>
            <p className='text-[#111418] text-2xl font-bold'>
              {totalVolume} Liters
            </p>
          </div>

          <div className='flex flex-col gap-2 rounded-xl p-6 bg-white border border-[#dce0e5] shadow-sm'>
            <div className='flex justify-between items-start'>
              <p className='text-[#637588] text-sm font-medium'>
                Milk Type Ratio
              </p>
              <span className='material-symbols-outlined text-primary'>
                pie_chart
              </span>
            </div>
            <div className='flex flex-col gap-2 mt-2'>
              <div className='flex justify-between text-xs font-bold'>
                <span className='text-blue-500'>
                  {milkTypeRatio.cowPercent}% Cow
                </span>
                <span className='text-purple-500'>
                  {milkTypeRatio.buffaloPercent}% Buffalo
                </span>
              </div>
              <div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden flex'>
                <div
                  className='h-full bg-blue-500'
                  style={{ width: `${milkTypeRatio.cowPercent}%` }}
                ></div>
                <div
                  className='h-full bg-purple-500'
                  style={{ width: `${milkTypeRatio.buffaloPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2 rounded-xl p-6 bg-white  border border-[#dce0e5]  shadow-sm'>
            <div className='flex justify-between items-start'>
              <p className='text-[#637588] text-sm font-medium'>
                Monthly Bill Estimate
              </p>
              <span className='material-symbols-outlined text-primary'>
                payments
              </span>
            </div>
            <p className='text-[#111418]  text-2xl font-bold'>₹{totalBill}</p>
          </div>
        </div>

        {/* Table Title */}
        <div className='bg-white rounded-t-xl border-x border-t border-[#dce0e5] mt-2'>
          <div className='flex border-b border-[#dce0e5] px-6 gap-8 overflow-x-auto'>
            {deliveryFilters.map((deliveryFilter) => (
              <Button
                key={deliveryFilter}
                onClick={() => {
                  setTab(deliveryFilter as deliveryFilter);
                  setPage(1);
                }}
                variant='ghost-list'
                className={`flex items-center justify-center border-b-2 pb-3 pt-4 px-1 ${
                  tab === deliveryFilter
                    ? 'border-primary text-primary'
                    : 'border-transparent text-[#637588] hover:text-[#111418]'
                }`}
              >
                <p className='text-sm font-bold whitespace-nowrap'>
                  {deliveryFilter === 'All Deliveries'
                    ? deliveryFilter
                    : `${deliveryFilter} (${
                        totalDeliveries[
                          deliveryFilter as
                            | 'Confirmed'
                            | 'Pending'
                            | 'Cancelled'
                        ]
                      })`}
                </p>
              </Button>
            ))}
          </div>
        </div>

        {/* Table Info */}
        <div className='bg-white border border-[#dce0e5]  rounded-b-xl shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-gray-50 '>
                  <th className='px-6 py-4 text-[#637588] text-xs font-bold uppercase tracking-wider text-center'>
                    Date &amp; Day
                  </th>
                  <th className='px-6 py-4 text-[#637588] text-xs font-bold uppercase tracking-wider text-center'>
                    Shift
                  </th>
                  <th className='px-6 py-4 text-[#637588] text-xs font-bold uppercase tracking-wider text-center'>
                    Cow Qty
                  </th>
                  <th className='px-6 py-4 text-[#637588] text-xs font-bold uppercase tracking-wider text-center'>
                    Buffalo Qty
                  </th>
                  <th className='px-6 py-4 text-[#637588] text-xs font-bold uppercase tracking-wider text-center'>
                    Total Qty
                  </th>
                  <th className='px-6 py-4 text-[#637588] text-xs font-bold uppercase tracking-wider text-center'>
                    Total Price
                  </th>
                  <th className='px-6 py-4 text-[#637588] text-xs font-bold uppercase tracking-wider text-center'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#dce0e5] '>
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
                      No deliveries found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <DeliveryHistoryRow key={row.id} row={row} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {rows.length > 0 && (
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          )}
        </div>

        <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4 items-start'>
          <span className='material-symbols-outlined text-blue-600'>info</span>
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-bold text-blue-800'>
              New: Nested Row View
            </p>
            <p className='text-xs text-blue-700 leading-relaxed'>
              Showing delivery history as individual shifts for easier tracking
              and filtering.
            </p>
          </div>
        </div>
      </main>
    </ContentLayout>
  );
};

export default DeliveriesHistory;
