'use client';
import { useState } from 'react';
import ContentLayout from '../../../components/layout';
import { ownerDeliveries } from '@/constants';
import Pagination from '@/components/pagination';
import { Slot } from '@/types';
import CustomerDelivery from '@/components/admin/customer-delivery';
import DeliveryIssueModal from '@/components/modal/admin/delivery-issue';
const ITEMS_PER_PAGE = 3;

const Deliveries = () => {
  const [page, setPage] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<Slot>('morning');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const totalPages = Math.ceil(ownerDeliveries.length / ITEMS_PER_PAGE);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentRows = ownerDeliveries.slice(start, start + ITEMS_PER_PAGE);

  return (
    <ContentLayout title='Daily Deliveries Log'>
      <div className='flex-1 flex flex-col gap-6'>
        {/* <!-- Page Heading --> */}
        <div className='flex flex-wrap justify-between items-start gap-3'>
          <p className='text-[#637588] text-base'>
            {`Manage and confirm today's milk distribution — Oct 24, 2023`}
          </p>
          <div className='flex gap-3'>
            <button className='flex items-center gap-2 px-4 h-10 bg-white border border-[#dce0e5] rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors'>
              <span className='material-symbols-outlined text-lg'>
                download
              </span>
              Download Report
            </button>
            <button className='flex items-center gap-2 px-6 h-10 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all'>
              <span className='material-symbols-outlined text-lg'>
                check_circle
              </span>
              Confirm All Standard
            </button>
          </div>
        </div>
        {/* <!-- Stats Overview --> */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='flex flex-col gap-2 rounded-xl p-5 bg-white border border-[#dce0e5] shadow-sm'>
            <p className='text-[#637588] text-xs font-bold uppercase tracking-wider'>
              Total Liters
            </p>
            <div className='flex items-baseline gap-2'>
              <p className='text-2xl font-black text-[#111418]'>450L</p>
              <span className='text-[#078838] text-xs font-bold bg-[#e7f6ed] px-1.5 py-0.5 rounded'>
                +5%
              </span>
            </div>
          </div>
          <div className='flex flex-col gap-2 rounded-xl p-5 bg-white border border-[#dce0e5] shadow-sm'>
            <p className='text-[#637588] text-xs font-bold uppercase tracking-wider'>
              Pending
            </p>
            <p className='text-2xl font-black text-primary'>24 Orders</p>
          </div>
          <div className='flex flex-col gap-2 rounded-xl p-5 bg-white border border-[#dce0e5] shadow-sm'>
            <p className='text-[#637588] text-xs font-bold uppercase tracking-wider'>
              Morning Slot
            </p>
            <p className='text-2xl font-black text-[#111418]'>280L</p>
          </div>
          <div className='flex flex-col gap-2 rounded-xl p-5 bg-white border border-[#dce0e5] shadow-sm'>
            <p className='text-[#637588] text-xs font-bold uppercase tracking-wider'>
              Evening Slot
            </p>
            <p className='text-2xl font-black text-[#111418]'>170L</p>
          </div>
        </div>

        {/* <!-- Filters & Slot Toggle --> */}
        <div className='flex items-center justify-between bg-white p-2'>
          <button
            // className='flex-1 px-6 py-1.5 text-sm font-bold bg-white text-primary shadow-sm'
            className={`flex-1 py-3 font-medium capitalize transition
                ${
                  selectedSlot === 'morning'
                    ? 'border-b-2 border-primary bg-primary/5'
                    : 'border-b border-[#e7f3e9] text-gray-500'
                }
              `}
            onClick={() => setSelectedSlot('morning')}
          >
            Morning Slot (5AM-9AM)
          </button>
          <button
            className={`flex-1 py-3 font-medium capitalize transition
                ${
                  selectedSlot === 'evening'
                    ? 'border-b-2 border-primary bg-primary/5'
                    : 'border-b border-[#e7f3e9] text-gray-500'
                }
              `}
            onClick={() => setSelectedSlot('evening')}
          >
            Evening Slot (5PM-8PM)
          </button>
        </div>

        {/* <!-- Data Table --> */}
        <div className='bg-white border border-[#dce0e5] rounded-xl overflow-hidden shadow-sm'>
          <table className='w-full text-left border-collapse'>
            <thead className='bg-[#f8f9fa]'>
              <tr>
                <th className='px-6 py-4 text-xs font-bold text-[#637588] uppercase tracking-wider'>
                  Customer
                </th>
                <th className='px-6 py-4 text-xs font-bold text-[#637588] uppercase tracking-wider'>
                  Address
                </th>
                <th className='px-6 py-4 text-xs font-bold text-[#637588] uppercase tracking-wider'>
                  Cow Milk Qty
                </th>
                <th className='px-6 py-4 text-xs font-bold text-[#637588] uppercase tracking-wider'>
                  Buffalo milk Qty
                </th>
                <th className='px-6 py-4 text-xs font-bold text-[#637588] uppercase tracking-wider text-right'>
                  Action
                </th>
              </tr>
            </thead>

            <tbody className='divide-y divide-[#dce0e5]'>
              {currentRows.map((row) => (
                <CustomerDelivery
                  row={row}
                  key={row.id}
                  onReport={() => setSelectedCustomer(row)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* <!-- Pagination/Load More --> */}
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        {selectedCustomer && (
          <DeliveryIssueModal
            open={true}
            setOpen={() => setSelectedCustomer(null)}
            customerInfo={selectedCustomer}
          />
        )}
      </div>
    </ContentLayout>
  );
};

export default Deliveries;
