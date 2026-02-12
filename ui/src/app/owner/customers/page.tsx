'use client';

import ContentLayout from '@/components/layout';
import Pagination from '@/components/pagination';
import { ownerCustomers, type OwnerCustomer } from '@/constants';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 4;

const formatQtyPair = (cowQty: number, buffaloQty: number) =>
  `${cowQty}L / ${buffaloQty}L`;

const OwnerCustomersPage = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OwnerCustomer['status']>(
    'all',
  );

  const filteredCustomers = useMemo(() => {
    return ownerCustomers.filter((customer) => {
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        !search ||
        customer.name.toLowerCase().includes(search) ||
        customer.phone.toLowerCase().includes(search);

      if (!matchesSearch) return false;
      if (statusFilter !== 'all' && customer.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE),
  );

  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentRows = filteredCustomers.slice(start, start + ITEMS_PER_PAGE);

  const totalMorningLiters = filteredCustomers.reduce(
    (sum, customer) => sum + customer.morningCowQty + customer.morningBuffaloQty,
    0,
  );
  const totalEveningLiters = filteredCustomers.reduce(
    (sum, customer) => sum + customer.eveningCowQty + customer.eveningBuffaloQty,
    0,
  );

  return (
    <ContentLayout title='Customer management'>
      <div className='flex-1 overflow-y-auto space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white/30 p-6 rounded-xl border border-primary/10 shadow-sm'>
            <p className='text-sm text-gray-500 font-medium'>Total Customers</p>
            <div className='flex items-end justify-between mt-1'>
              <h3 className='text-3xl font-black'>{filteredCustomers.length}</h3>
              <span className='text-primary text-xs font-bold'>Filtered</span>
            </div>
          </div>
          <div className='bg-white/30 p-6 rounded-xl border border-primary/10 shadow-sm'>
            <p className='text-sm text-gray-500 font-medium'>
              Total Morning Liters
            </p>
            <div className='flex items-end justify-between mt-1'>
              <h3 className='text-3xl font-black'>
                {totalMorningLiters.toFixed(1)}
                <span className='text-lg font-normal'>L</span>
              </h3>
              <span className='material-symbols-outlined text-primary/60'>
                light_mode
              </span>
            </div>
          </div>
          <div className='bg-white/30 p-6 rounded-xl border border-primary/10 shadow-sm'>
            <p className='text-sm text-gray-500 font-medium'>
              Total Evening Liters
            </p>
            <div className='flex items-end justify-between mt-1'>
              <h3 className='text-3xl font-black'>
                {totalEveningLiters.toFixed(1)}
                <span className='text-lg font-normal'>L</span>
              </h3>
              <span className='material-symbols-outlined text-primary/60'>
                dark_mode
              </span>
            </div>
          </div>
        </div>

        <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
          <div className='relative w-full max-w-md'>
            <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
              search
            </span>
            <input
              className='w-full pl-10 pr-4 py-2.5 bg-white border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm'
              placeholder='Search by name or phone number...'
              type='text'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className='flex flex-wrap items-center gap-2 w-full lg:w-auto'>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | OwnerCustomer['status']);
                setPage(1);
              }}
              className='px-3 py-2.5 bg-white border border-primary/20 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus-visible:outline-primary/50'
            >
              <option value='all'>All Status</option>
              <option value='active'>Active</option>
              <option value='paused'>Paused</option>
            </select>

            <button
              className='flex items-center gap-2 px-4 py-2.5 bg-white border border-primary/20 rounded-xl text-sm font-medium hover:bg-primary/5 transition-colors'
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPage(1);
              }}
            >
              <span className='material-symbols-outlined text-sm'>restart_alt</span>
              Reset
            </button>
          </div>
        </div>

        <div className='bg-white/30 rounded-xl border border-primary/10 shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='border-b border-primary/10 bg-primary/5'>
                  <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500'>
                    Name
                  </th>
                  <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500'>
                    Phone
                  </th>
                  <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center'>
                    <div className='flex flex-col gap-0.5'>
                      <p>Morning Qty</p>
                      <p className='font-semibold text-[9px]'>(Cow / Buffalo)</p>
                    </div>
                  </th>
                  <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center'>
                    <div className='flex flex-col gap-0.5'>
                      <p>Evening Qty</p>
                      <p className='font-semibold text-[9px]'>(Cow / Buffalo)</p>
                    </div>
                  </th>
                  <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500'>
                    Status
                  </th>
                  <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-primary/5'>
                {currentRows.map((customer) => (
                  <tr
                    key={customer.id}
                    className='hover:bg-primary/5 transition-colors group'
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div
                          className='size-8 rounded-full bg-cover bg-center'
                          aria-label={`${customer.name} avatar`}
                          style={{
                            backgroundImage: `url("${customer.avatar}")`,
                          }}
                        />
                        <span className='text-sm font-bold'>{customer.name}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm font-medium text-gray-600'>
                      {customer.phone}
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <span className='inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs font-semibold'>
                        {formatQtyPair(
                          customer.morningCowQty,
                          customer.morningBuffaloQty,
                        )}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <span className='inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs font-semibold'>
                        {formatQtyPair(
                          customer.eveningCowQty,
                          customer.eveningBuffaloQty,
                        )}
                      </span>
                    </td>

                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          customer.status === 'active'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-orange-100 text-orange-600'
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <Link
                        href={`/owner/customers/${customer.id}`}
                        className='px-3 py-2 bg-green-100 text-green-700 hover:bg-green-800 hover:text-white text-xs font-bold rounded hover:opacity-80 transition-opacity'
                      >
                        {`View Profile >`}
                      </Link>
                    </td>
                  </tr>
                ))}

                {currentRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-6 py-8 text-center text-sm text-gray-500'
                    >
                      No customers found for the selected filters.
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

export default OwnerCustomersPage;
