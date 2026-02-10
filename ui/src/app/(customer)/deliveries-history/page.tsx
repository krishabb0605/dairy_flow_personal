'use client';
import Pagination from '../../../components/pagination';
import ContentLayout from '../../../components/layout';
import { deliveries, deliveryFilters } from '../../../constants';
import { deliveryFilter } from '../../../types';
import { Fragment, useMemo, useState } from 'react';
const PAGE_SIZE = 5;

const DeliveriesHistory = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [tab, setTab] = useState<deliveryFilter>('All Deliveries');
  const [page, setPage] = useState(1);

  // Filter
  const filtered =
    tab === 'All Deliveries'
      ? deliveries
      : deliveries.filter((d) => d.status === tab);

  const deliveriesTotalShiftQty = useMemo(() => {
    let morningShift = 0;
    let eveningShift = 0;
    let morningQty = 0;
    let eveningQty = 0;

    deliveries.forEach((delivery) => {
      delivery.sessions.forEach((session) => {
        if (session.type === 'Morning') {
          morningShift++;
          morningQty += session.cow + session.buffalo;
        }
        if (session.type === 'Evening') {
          eveningShift++;
          eveningQty += session.cow + session.buffalo;
        }
      });
    });

    return {
      morningShift,
      eveningShift,
      morningQty,
      eveningQty,
    };
  }, []);

  const totalBill = useMemo(() => {
    const total = deliveries.reduce(
      (acc, deliverie) => acc + deliverie.totalPrice,
      0,
    );
    return total;
  }, []);

  const totalDeliveries: Record<'Confirmed' | 'Pending', number> =
    useMemo(() => {
      const confirmed = deliveries.filter(
        (deliverie) => deliverie.status === 'Confirmed',
      );
      const pending = deliveries.filter(
        (deliverie) => deliverie.status === 'Pending',
      );
      return {
        Confirmed: confirmed.length,
        Pending: pending.length,
      };
    }, []);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
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
              <span className='font-bold text-[#111418] '>October 2023</span>
            </p>
          </div>

          <div className='flex gap-2'>
            <button className='flex items-center justify-center rounded-lg h-10 px-4 bg-gray-100  text-[#111418]  text-sm font-bold gap-2 border border-transparent hover:border-gray-300'>
              <span className='material-symbols-outlined text-[20px]'>
                calendar_month
              </span>
              <span>October 2023</span>
            </button>
            <button className='flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold gap-2 shadow-md shadow-primary/20 hover:bg-primary/90'>
              <span className='material-symbols-outlined text-[20px]'>
                download
              </span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='flex flex-col gap-2 rounded-xl p-6 bg-white  border border-[#dce0e5]  shadow-sm'>
            <div className='flex justify-between items-start'>
              <p className='text-[#637588] text-sm font-medium'>
                Morning Deliveries
              </p>
              <span className='material-symbols-outlined text-amber-500'>
                wb_sunny
              </span>
            </div>
            <p className='text-[#111418]  text-2xl font-bold'>
              {deliveriesTotalShiftQty.morningShift} Shifts
            </p>
            <p className='text-[#078838] text-xs font-bold bg-[#078838]/10 px-2 py-0.5 rounded-full self-start'>
              {deliveriesTotalShiftQty.morningQty}L Total This Week
            </p>
          </div>

          <div className='flex flex-col gap-2 rounded-xl p-6 bg-white  border border-[#dce0e5]  shadow-sm'>
            <div className='flex justify-between items-start'>
              <p className='text-[#637588] text-sm font-medium'>
                Evening Deliveries
              </p>
              <span className='material-symbols-outlined text-indigo-400'>
                dark_mode
              </span>
            </div>
            <p className='text-[#111418]  text-2xl font-bold'>
              {deliveriesTotalShiftQty.eveningShift} Shifts
            </p>
            <p className='text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-full self-start'>
              {deliveriesTotalShiftQty.eveningQty}L Total This Week
            </p>
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
            <p className='text-[#111418]  text-2xl font-bold'>${totalBill}</p>
            <p className='text-[#637588] text-xs font-medium'>
              Current Total for{' '}
              {deliveriesTotalShiftQty.morningShift +
                deliveriesTotalShiftQty.eveningShift}{' '}
              shifts
            </p>
          </div>
        </div>

        {/* Table Title */}
        <div className='bg-white rounded-t-xl border-x border-t border-[#dce0e5] mt-2'>
          <div className='flex border-b border-[#dce0e5] px-6 gap-8 overflow-x-auto'>
            {deliveryFilters.map((deliveryFilter) => (
              <button
                key={deliveryFilter}
                onClick={() => {
                  setTab(deliveryFilter as deliveryFilter);
                  setPage(1);
                }}
                className={`flex items-center justify-center border-b-2 pb-3 pt-4 px-1 ${
                  tab === deliveryFilter
                    ? 'border-primary text-primary'
                    : 'border-transparent text-[#637588] hover:text-[#111418]'
                }`}
              >
                <p className='text-sm font-bold whitespace-nowrap'>
                  {deliveryFilter === 'All Deliveries'
                    ? deliveryFilter
                    : `${deliveryFilter} (${totalDeliveries[deliveryFilter as 'Confirmed' | 'Pending']})`}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Table Info */}
        <div className='bg-white border border-[#dce0e5]  rounded-b-xl shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-gray-50 '>
                  <th className='px-6 py-4 text-[#637588] text-xs font-bold uppercase tracking-wider w-8'></th>
                  <th className='px-6 py-4 text-[#637588] text-xs font-bold uppercase tracking-wider'>
                    Date &amp; Day
                  </th>
                  <th className='px-6 py-4 text-[#637588] text-xs font-bold uppercase tracking-wider text-right'>
                    Total Qty
                  </th>
                  <th className='px-6 py-4 text-[#637588] text-xs font-bold uppercase tracking-wider text-right'>
                    Total Price
                  </th>
                  <th className='px-6 py-4 text-[#637588] text-xs font-bold uppercase tracking-wider text-center'>
                    Status
                  </th>
                  <th className='px-6 py-4'></th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#dce0e5] '>
                {paginated.map((delivery, index) => (
                  <Fragment key={index}>
                    <tr
                      className='hover:bg-primary/5 transition-colors cursor-pointer group'
                      key={index}
                      onClick={() =>
                        setOpenId(openId === delivery.id ? null : delivery.id)
                      }
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`material-symbols-outlined text-primary text-[20px]  transition-transform select-none ${
                            openId === delivery.id ? 'rotate-90' : ''
                          }`}
                        >
                          chevron_right
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex flex-col'>
                          <span className='text-sm font-bold text-[#111418]'>
                            {delivery.date}
                          </span>
                          <span className='text-xs text-[#637588]'>
                            {delivery.day}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-sm text-right font-medium'>
                        {delivery.totalQty} L
                      </td>
                      <td className='px-6 py-4 text-sm text-right font-bold text-[#111418]'>
                        $ {delivery.totalPrice}
                      </td>
                      <td className='px-6 py-4 text-center'>
                        {delivery.status === 'Confirmed' ? (
                          <span className='inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold'>
                            <span className='material-symbols-outlined text-[14px]'>
                              check_circle
                            </span>
                            Confirmed
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-amber-100 text-amber-600 text-xs font-bold'>
                            <span className='material-symbols-outlined text-[14px]'>
                              schedule
                            </span>
                            Pending
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <button className='text-[#637588] hover:text-primary'>
                          <span className='material-symbols-outlined'>
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                    {/* ACCORDION */}
                    {openId === delivery.id && (
                      <tr className='bg-gray-50/50 border-b border-gray-100'>
                        <td className='px-0 py-0' colSpan={6}>
                          <div className='px-20 py-4 flex flex-col gap-4'>
                            {delivery.sessions.map((session, i) => (
                              <div
                                className={`flex items-center justify-between pb-3 ${delivery.sessions.length - 1 === i ? '' : 'border-b border-gray-200'}`}
                                key={i}
                              >
                                <div className='flex items-center gap-4'>
                                  {session.type === 'Morning' ? (
                                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 text-amber-600'>
                                      <span className='material-symbols-outlined text-[20px]'>
                                        light_mode
                                      </span>
                                    </div>
                                  ) : (
                                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600'>
                                      <span className='material-symbols-outlined text-[20px]'>
                                        dark_mode
                                      </span>
                                    </div>
                                  )}
                                  <div>
                                    <p className='text-sm font-bold'>
                                      {session.type} Delivery
                                    </p>
                                    <p className='text-xs text-[#637588]'>
                                      Delivered at {session.time}
                                    </p>
                                  </div>
                                </div>
                                <div className='flex flex-col items-end'>
                                  <p className='text-xs text-[#637588] uppercase font-bold tracking-tight'>
                                    Cow Milk
                                  </p>
                                  <p className='text-sm font-medium'>
                                    {session.cow} L
                                  </p>
                                </div>
                                <div className='flex flex-col items-end'>
                                  <p className='text-xs text-[#637588] uppercase font-bold tracking-tight'>
                                    Buffalo Milk
                                  </p>
                                  <p className='text-sm font-medium'>
                                    {session.buffalo} L
                                  </p>
                                </div>
                                <div className='flex flex-col items-end min-w-[60px]'>
                                  <p className='text-xs text-[#637588] uppercase font-bold tracking-tight'>
                                    Subtotal
                                  </p>
                                  <p className='text-sm font-bold text-primary'>
                                    ${session.subtotal}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>

        <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4 items-start'>
          <span className='material-symbols-outlined text-blue-600'>info</span>
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-bold text-blue-800'>
              New: Nested Row View
            </p>
            <p className='text-xs text-blue-700 leading-relaxed'>
              {` We've updated our view to group deliveries by date. Click the`}
              arrow{' '}
              <span className='material-symbols-outlined text-[14px] align-middle'>
                chevron_right
              </span>{' '}
              to see a detailed breakdown of morning and evening sessions.
            </p>
          </div>
        </div>
      </main>
    </ContentLayout>
  );
};

export default DeliveriesHistory;
