'use client';

import ContentLayout from '@/components/layout';
import Pagination from '@/components/pagination';
import { useMemo, useState } from 'react';

type BillStatus = 'paid' | 'pending';

type OwnerBillingRecord = {
  id: string;
  customerName: string;
  mobile: string;
  month: string;
  qty: number;
  amount: number;
  status: BillStatus;
};

const OWNER_BILLING_DATA: OwnerBillingRecord[] = [
  {
    id: 'INV-1001',
    customerName: 'John Doe',
    mobile: '+91 98765 43210',
    month: 'January 2024',
    qty: 42,
    amount: 2180,
    status: 'paid',
  },
  {
    id: 'INV-1002',
    customerName: 'Sarah Smith',
    mobile: '+91 98765 43211',
    month: 'January 2024',
    qty: 35.5,
    amount: 1960,
    status: 'pending',
  },
  {
    id: 'INV-1003',
    customerName: 'Mike Ross',
    mobile: '+91 98765 43212',
    month: 'January 2024',
    qty: 28,
    amount: 1470,
    status: 'pending',
  },
  {
    id: 'INV-1004',
    customerName: 'Emma Wilson',
    mobile: '+91 98765 43213',
    month: 'December 2023',
    qty: 48,
    amount: 2600,
    status: 'paid',
  },
  {
    id: 'INV-1005',
    customerName: 'Arjun Patel',
    mobile: '+91 98765 43214',
    month: 'December 2023',
    qty: 31,
    amount: 1680,
    status: 'pending',
  },
  {
    id: 'INV-1006',
    customerName: 'Neha Verma',
    mobile: '+91 98765 43215',
    month: 'December 2023',
    qty: 29.5,
    amount: 1590,
    status: 'paid',
  },
  {
    id: 'INV-1007',
    customerName: 'Ravi Kumar',
    mobile: '+91 98765 43216',
    month: 'November 2023',
    qty: 50,
    amount: 2790,
    status: 'pending',
  },
  {
    id: 'INV-1008',
    customerName: 'Priya Nair',
    mobile: '+91 98765 43217',
    month: 'November 2023',
    qty: 22.5,
    amount: 1200,
    status: 'paid',
  },
];

const ITEMS_PER_PAGE = 5;

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const extractYear = (month: string) => month.split(' ').at(-1) ?? '';

const OwnerBillingPage = () => {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<OwnerBillingRecord[]>(OWNER_BILLING_DATA);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | BillStatus>('all');
  const [year, setYear] = useState('all');

  const years = useMemo(() => {
    const unique = new Set(rows.map((item) => extractYear(item.month)));
    return Array.from(unique).sort((a, b) => Number(b) - Number(a));
  }, [rows]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((item) => {
      const matchesSearch =
        !query ||
        item.customerName.toLowerCase().includes(query) ||
        item.mobile.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);

      if (!matchesSearch) return false;
      if (status !== 'all' && item.status !== status) return false;
      if (year !== 'all' && extractYear(item.month) !== year) return false;

      return true;
    });
  }, [rows, search, status, year]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ITEMS_PER_PAGE),
  );
  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentRows = filteredRows.slice(start, start + ITEMS_PER_PAGE);
  const totalPending = filteredRows.reduce(
    (sum, row) => (row.status !== 'paid' ? sum + row.amount : sum),
    0,
  );
  const totalCollected = filteredRows.reduce(
    (sum, row) => (row.status === 'paid' ? sum + row.amount : sum),
    0,
  );
  const totalLitersDelivered = filteredRows.reduce((sum, row) => sum + row.qty, 0);

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
        <div className='bg-white rounded-xl border border-primary/10 shadow-sm p-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3'>
            <div className='xl:col-span-2'>
              <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>
                Search
              </label>
              <div className='relative'>
                <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
                  search
                </span>
                <input
                  type='text'
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder='Search customer, mobile or invoice id...'
                  className='w-full h-10 pl-10 pr-4 bg-background-light border-slate-200 font-medium rounded-lg text-sm focus:ring-primary focus:border-primary focus-visible:outline-primary/50'
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as 'all' | BillStatus);
                  setPage(1);
                }}
                className='w-full h-10 bg-background-light border-slate-200 rounded-lg text-sm font-medium px-3 focus:ring-primary focus:border-primary focus-visible:outline-primary/50'
              >
                <option value='all'>All Status</option>
                <option value='paid'>Paid</option>
                <option value='pending'>Pending</option>
              </select>
            </div>

            <div>
              <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>
                Year
              </label>
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setPage(1);
                }}
                className='w-full h-10 bg-background-light border-slate-200 rounded-lg text-sm font-medium px-3 focus:ring-primary focus:border-primary focus-visible:outline-primary/50'
              >
                <option value='all'>All Years</option>
                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex items-end'>
              <button
                className='h-10 w-full px-4 bg-primary/20 text-slate-700 font-bold rounded-lg hover:bg-primary/30 transition-colors'
                onClick={() => {
                  setSearch('');
                  setStatus('all');
                  setYear('all');
                  setPage(1);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-slate-50 border-b border-primary/10'>
                  <th className='px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest'>
                    Invoice
                  </th>
                  <th className='px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest'>
                    Customer
                  </th>
                  <th className='px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center'>
                    Month
                  </th>
                  <th className='px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center'>
                    Qty
                  </th>
                  <th className='px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center'>
                    Amount
                  </th>
                  <th className='px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center'>
                    Status
                  </th>
                  <th className='px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-primary/5'>
                {currentRows.map((row) => (
                  <tr
                    key={row.id}
                    className='hover:bg-primary/5 transition-colors'
                  >
                    <td className='px-6 py-4 text-sm font-bold text-slate-800'>
                      {row.id}
                    </td>
                    <td className='px-6 py-4 text-sm font-medium text-slate-700'>
                      <div>{row.customerName}</div>
                      <div className='text-xs text-slate-400'>{row.mobile}</div>
                    </td>
                    <td className='px-6 py-4 text-sm text-center text-slate-700'>
                      {row.month}
                    </td>
                    <td className='px-6 py-4 text-sm text-center text-slate-700'>
                      {row.qty.toFixed(1)} L
                    </td>
                    <td className='px-6 py-4 text-sm text-center font-semibold text-slate-800'>
                      {formatCurrency(row.amount)}
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          row.status === 'paid'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-center'>
                      {row.status === 'pending' ? (
                        <button
                          className='px-3 py-1 bg-green-100 text-green-700 hover:bg-primary hover:text-white text-xs font-bold rounded transition-all'
                          onClick={() =>
                            setRows((prev) =>
                              prev.map((item) =>
                                item.id === row.id
                                  ? { ...item, status: 'paid' }
                                  : item,
                              ),
                            )
                          }
                        >
                          Mark as Paid
                        </button>
                      ) : (
                        <span className='text-xs text-slate-400'>-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {currentRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className='px-6 py-10 text-center text-sm text-slate-500'
                    >
                      No billing records found for selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </div>
    </ContentLayout>
  );
};

export default OwnerBillingPage;
