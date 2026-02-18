'use client';
import { useState } from 'react';
import ContentLayout from '../../../components/layout';
import { DeliveryStatus, Slot } from '../../../types';
import { ownerDashboardDeliveriesData } from '../../../constants';
import DashboardCustomer from '../../../components/admin/dashboard-customer';
import Pagination from '../../../components/pagination';

const Dashboard = () => {
  const [selectedSlot, setSelectedSlot] = useState<Slot>('morning');
  const [deliveries, setDeliveries] = useState(ownerDashboardDeliveriesData);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const ITEMS_PER_PAGE = 3;
  const [page, setPage] = useState(1);

  const slotDeliveries = deliveries.filter((d) => d.slot === selectedSlot);

  const totalPages = Math.ceil(slotDeliveries.length / ITEMS_PER_PAGE);

  const paginatedDeliveries = slotDeliveries.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const pendingIds = slotDeliveries
    .filter((d) => d.status === 'pending')
    .map((d) => d.id);

  const toggleSelectAll = () => {
    if (selectedIds.length === pendingIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingIds);
    }
  };

  const updateSingleStatus = (id: number, status: DeliveryStatus) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d)),
    );
  };

  return (
    <ContentLayout title={`Today's Overview`}>
      <main className='flex-1'>
        {/* <!-- Header --> */}
        <header className='flex flex-col md:flex-row justify-between gap-4 mb-8'>
          <p className='text-slate-500'>Monday, Oct 23, 2023</p>
          <div className='flex items-center gap-4'>
            <div className='relative'>
              <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
                search
              </span>
              <input
                className='pl-10 pr-4 py-2 border bg-white border-slate-200 rounded-lg w-64 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm'
                placeholder='Search customer...'
                type='text'
              />
            </div>
            <button className='bg-white p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 relative h-10 w-10'>
              <span className='material-symbols-outlined'>notifications</span>
              <span className='absolute top-1 right-1 size-2 bg-red-500 rounded-full border-2 border-white'></span>
            </button>
          </div>
        </header>
        {/* <!-- Summary Cards --> */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white p-6 rounded-xl border border-slate-200 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <div className='size-10 rounded-lg bg-blue-50 flex items-center justify-center'>
                <span className='material-symbols-outlined text-blue-600'>
                  cruelty_free
                </span>
              </div>
              <span className='text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full'>
                +4.2%
              </span>
            </div>
            <p className='text-slate-500 text-sm font-medium'>Total Cow Milk</p>
            <p className='text-2xl font-bold text-slate-900 mt-1'>
              450 <span className='text-sm font-normal text-slate-400'>L</span>
            </p>
          </div>
          <div className='bg-white p-6 rounded-xl border border-slate-200 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <div className='size-10 rounded-lg bg-orange-50 flex items-center justify-center'>
                <span className='material-symbols-outlined text-orange-600'>
                  egg_alt
                </span>
              </div>
              <span className='text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full'>
                +2.8%
              </span>
            </div>
            <p className='text-slate-500 text-sm font-medium'>
              Total Buffalo Milk
            </p>
            <p className='text-2xl font-bold text-slate-900 mt-1'>
              320 <span className='text-sm font-normal text-slate-400'>L</span>
            </p>
          </div>
          <div className='bg-white p-6 rounded-xl border border-slate-200 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <div className='size-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                <span className='material-symbols-outlined text-primary'>
                  analytics
                </span>
              </div>
              <span className='text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full'>
                Overall
              </span>
            </div>
            <p className='text-slate-500 text-sm font-medium'>Total Liters</p>
            <p className='text-2xl font-bold text-slate-900 mt-1'>
              770 <span className='text-sm font-normal text-slate-400'>L</span>
            </p>
          </div>
        </div>
        {/* <!-- Delivery Sections --> */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white pr-2'>
          <div className='flex border-b border-slate-200 w-full md:w-auto flex-1'>
            {(['morning', 'evening'] as Slot[]).map((shift, index) => (
              <button
                key={index}
                // className='flex-1 px-6 py-1.5 text-sm font-bold bg-white text-primary shadow-sm'
                className={`flex-1 px-6 py-2.5 text-sm font-semibold border-b-2 capitalize
                ${
                  selectedSlot === shift
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }
              `}
                onClick={() => {
                  setSelectedSlot(shift);
                  setPage(1);
                }}
              >
                {shift} Slot
              </button>
            ))}
          </div>
          <div className='flex items-center justify-center gap-3'>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className='border rounded-lg px-3 py-2 text-sm bg-white'
            >
              <option value=''>Bulk Action</option>
              <option value='delivered'>Mark Confirmed</option>
              <option value='skipped'>Mark Skipped</option>
            </select>

            <button
              disabled={!(selectedIds.length && bulkAction)}
              onClick={() => {
                if (!bulkAction) return;

                setDeliveries((prev) =>
                  prev.map((d) =>
                    selectedIds.includes(d.id)
                      ? { ...d, status: bulkAction as DeliveryStatus }
                      : d,
                  ),
                );

                setSelectedIds([]);
                setBulkAction('');
              }}
              className='bg-primary text-white px-4 py-2 rounded-lg text-sm disabled:opacity-40'
            >
              Apply
            </button>
          </div>
        </div>
        <div className='space-y-8'>
          <section className='bg-white border border-slate-200 rounded-xl  shadow-sm overflow-hidden'>
            <div className='overflow-auto'>
              <table className='w-full text-left'>
                <thead className='bg-slate-50 border-b border-slate-200'>
                  <tr>
                    <th className='px-6 py-4 w-10'>
                      <input
                        type='checkbox'
                        checked={
                          selectedIds.length === pendingIds.length &&
                          pendingIds.length > 0
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                      Customer Name
                    </th>
                    <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                      Cow Qty (L)
                    </th>
                    <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                      Buffalo Qty (L)
                    </th>
                    <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                      Total (L)
                    </th>
                    <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100'>
                  {paginatedDeliveries.map((slotDeliverie, index) => (
                    <DashboardCustomer
                      key={index}
                      slotDeliverie={slotDeliverie}
                      selectedIds={selectedIds}
                      toggleSelect={toggleSelect}
                      updateSingleStatus={updateSingleStatus}
                      setDeliveries={setDeliveries}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </section>
        </div>
      </main>
    </ContentLayout>
  );
};

export default Dashboard;
