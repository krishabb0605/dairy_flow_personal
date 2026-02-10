'use client';
import ContentLayout from '../../../components/layout';
import Image from 'next/image';
import { useState } from 'react';
import pieChart from '../../../assets/images/pie-chart.png';
import { billingHistory, dailyDeliveriesHistory } from '../../../constants';
import Pagination from '../../../components/pagination';

const ITEMS_PER_PAGE = 3;

const MonthlyBiling = () => {
  const [openPanel, setOpenPanel] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(billingHistory.length / ITEMS_PER_PAGE);

  const paginatedBills = billingHistory.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const visibleDays = showAllDays
    ? dailyDeliveriesHistory
    : dailyDeliveriesHistory.slice(0, 3);

  return (
    <ContentLayout title='Monthly Statements'>
      <main className='flex-1 flex flex-col overflow-y-auto'>
        <div className='mx-auto w-full flex flex-col gap-6'>
          <p className='text-[#637588]  text-base'>
            Track your daily milk consumption history and manage recurring
            payments.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='flex flex-col gap-2 md:col-span-2'>
              <h3 className='text-primary font-bold text-xs uppercase tracking-widest mb-1'>
                September 2023 Outstanding Balance
              </h3>
              <div className='md:col-span-2 bg-white border border-[#f0f2f4]  p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-6 items-center flex-1 h-full'>
                <div className='w-full md:w-1/3 aspect-4/3 bg-primary/5 rounded-lg flex items-center justify-center relative overflow-hidden group'>
                  <span
                    className='material-symbols-outlined text-6xl text-primary/40 group-hover:scale-110 transition duration-500'
                    data-icon='account_balance_wallet'
                  >
                    account_balance_wallet
                  </span>
                  <div className='absolute inset-0 bg-linear-to-br from-primary/10 to-transparent'></div>
                </div>
                <div className='flex-1 flex flex-col gap-4'>
                  <div>
                    <h3 className='text-[#637588]  text-sm font-medium uppercase tracking-wider'>
                      Current Outstanding
                    </h3>
                    <p className='text-[#111418] text-4xl font-black mt-1'>
                      ₹1,842.50
                    </p>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-[#637588]  text-sm flex items-center gap-1'>
                      <span
                        className='material-symbols-outlined text-base'
                        data-icon='event'
                      >
                        event
                      </span>
                      Due by Oct 05, 2023
                    </p>
                    <p className='text-[#637588]  text-sm flex items-center gap-1'>
                      <span
                        className='material-symbols-outlined text-base text-green-500'
                        data-icon='check_circle'
                      >
                        check_circle
                      </span>
                      Last payment of ₹1,420.00 made on Sep 02
                    </p>
                  </div>
                  <div className='flex gap-3'>
                    <button className='flex-1 md:flex-none min-w-30 bg-primary text-white font-bold py-2.5 px-6 rounded-lg hover:bg-primary/90 transition shadow-lg shadow-primary/20'>
                      Pay Now
                    </button>
                    <button className='flex items-center justify-center gap-2 border border-[#f0f2f4]  text-[#111418] font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-50  transition'>
                      <span
                        className='material-symbols-outlined text-lg'
                        data-icon='download'
                      >
                        download
                      </span>
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white  border border-[#f0f2f4]  p-6 rounded-xl shadow-sm flex flex-col justify-between'>
              <div>
                <h3 className='text-[#637588]  text-sm font-medium mb-4'>
                  Current Month Usage
                </h3>
                <div className='space-y-4'>
                  <div className='flex justify-between items-end'>
                    <span className='text-[#637588]  text-sm'>Total Milk</span>
                    <span className='text-[#111418] font-bold text-lg'>
                      34.5 L
                    </span>
                  </div>
                  <div className='w-full bg-gray-100  h-2 rounded-full'>
                    <div className='bg-primary h-2 rounded-full w-[70%]'></div>
                  </div>
                </div>
              </div>

              <div className='bg-white flex flex-col justify-between mt-4'>
                <div className='flex flex-col gap-4 mt-4'>
                  <div className='flex items-end gap-6'>
                    <div className='flex flex-col items-center flex-1'>
                      <div
                        className='chart-bar bg-slate-200  w-full h-[85%]'
                        data-value='42.0L'
                      ></div>
                      <span className='text-[14px] text-[#637588] mt-2 font-bold'>
                        August
                      </span>
                    </div>
                    <div className='flex flex-col items-center flex-1'>
                      <div
                        className='chart-bar bg-primary w-full h-[95%]'
                        data-value='45.5L'
                      ></div>
                      <span className='text-[14px] font-bold text-primary mt-2'>
                        September
                      </span>
                    </div>
                  </div>

                  <div className='flex items-center gap-6 border-t border-[#f0f2f4] '>
                    <Image
                      src={pieChart}
                      alt='restaurant-image'
                      width={100}
                      height={200}
                      className='h-25 w-25'
                    />
                    <div className='space-y-2'>
                      <p className='text-xs font-medium text-[#637588] '>
                        Milk Preference
                      </p>
                      <div className='flex items-center gap-2'>
                        <span className='size-2 rounded-full bg-primary'></span>
                        <span className='text-[11px] font-semibold text-[#111418] '>
                          65% Cow Milk
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='size-2 rounded-full bg-slate-300'></span>
                        <span className='text-[11px] font-medium text-[#637588]'>
                          35% Buffalo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-8 pt-4 border-t border-[#f0f2f4]  flex flex-col gap-3'>
                  <a
                    className='flex items-center gap-2 text-primary text-xs font-bold hover:underline'
                    href='#'
                  >
                    <span className='material-symbols-outlined text-sm'>
                      download
                    </span>
                    Download Full Statement
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between px-2'>
              <h2 className='text-[#111418] text-xl font-bold tracking-tight'>
                Billing History
              </h2>
              <div className='flex items-center gap-2'>
                <button className='flex items-center gap-1 text-sm text-[#637588]  border border-solid border-[#f0f2f4]  px-3 py-1.5 rounded-lg hover:bg-white '>
                  <span
                    className='material-symbols-outlined text-lg'
                    data-icon='filter_list'
                  >
                    filter_list
                  </span>
                  2023
                </button>
              </div>
            </div>
            <div className='bg-white  border border-[#f0f2f4]  rounded-xl shadow-sm overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                  <thead>
                    <tr className='bg-background-light/50 text-[#637588]  text-xs font-semibold uppercase tracking-wider'>
                      <th className='px-6 py-4'>Billing Month</th>
                      <th className='px-6 py-4'>Total Qty</th>
                      <th className='px-6 py-4'>Amount</th>
                      <th className='px-6 py-4'>Status</th>
                      <th className='px-6 py-4 text-right'>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-[#f0f2f4]'>
                    {paginatedBills.map((bill, index) => (
                      <tr
                        key={index}
                        className='hover:bg-background-light/30 transition'
                      >
                        <td className='px-6 py-5'>
                          <div className='flex flex-col'>
                            <span className='text-[#111418] font-semibold'>
                              {bill.month}
                            </span>
                            <span className='text-xs text-[#637588]'>
                              {bill.range}
                            </span>
                          </div>
                        </td>

                        <td className='px-6 py-5 text-[#111418] font-medium'>
                          {bill.qty}
                        </td>

                        <td className='px-6 py-5 text-[#111418] font-bold'>
                          {bill.amount}
                        </td>

                        <td className='px-6 py-5'>
                          <span
                            className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold
                            ${
                              bill.status === 'Paid'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                bill.status === 'Paid'
                                  ? 'bg-green-600'
                                  : 'bg-red-600'
                              }`}
                            />
                            {bill.status}
                          </span>
                        </td>

                        <td className='px-6 py-5 text-right'>
                          <div className='flex justify-end gap-2'>
                            <button
                              onClick={() => setOpenPanel(true)}
                              className='text-primary p-2 rounded-lg hover:bg-primary/5 transition cursor-pointer'
                            >
                              <span className='material-symbols-outlined'>
                                visibility
                              </span>
                            </button>

                            <button
                              className='text-[#637588]  hover:bg-gray-100  p-2 rounded-lg transition'
                              title='Download'
                            >
                              <span
                                className='material-symbols-outlined'
                                data-icon='download'
                              >
                                download
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {openPanel && (
                <div
                  onClick={() => setOpenPanel(false)}
                  className='fixed inset-0 bg-black/40 z-50'
                />
              )}

              <aside
                className={`fixed top-0 right-0 h-screen w-full max-w-md bg-white z-60 shadow-2xl transition-transform duration-300 rounded-2xl rounded-r-none
                ${openPanel ? 'translate-x-0' : 'translate-x-full'}`}
              >
                <div className='flex flex-col h-full'>
                  {/* HEADER (fixed) */}
                  <div className='p-6 border-b border-[#f0f2f4] flex items-center justify-between'>
                    <div>
                      <h2 className='text-xl font-bold'>Detailed Breakdown</h2>
                      <p className='text-sm text-[#637588]'>
                        September 2023 Statement
                      </p>
                    </div>

                    <button
                      onClick={() => setOpenPanel(false)}
                      className='p-2 hover:bg-gray-100 rounded-full'
                    >
                      <span className='material-symbols-outlined'>close</span>
                    </button>
                  </div>

                  {/* DAILY DELIVERIES (scrollable only this) */}
                  <div
                    className='flex-1 overflow-y-auto p-6 space-y-4'
                    style={{ scrollbarWidth: 'none' }}
                  >
                    <h3 className='text-xs font-bold uppercase tracking-wider text-[#637588]'>
                      Daily Deliveries
                    </h3>

                    {visibleDays.map((day, index) => (
                      <div
                        key={index}
                        className='border-b border-[#f0f2f4] pb-4'
                      >
                        <div className='flex justify-between items-start mb-2'>
                          <span className='font-bold text-sm'>{day.date}</span>
                          <span className='text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded'>
                            {day.status}
                          </span>
                        </div>

                        <div className='grid grid-cols-2 gap-4 text-xs'>
                          <div>
                            <p className='text-[#637588] mb-1'>Morning</p>
                            <p className='font-medium'>{day.morning}</p>
                          </div>

                          <div>
                            <p className='text-[#637588] mb-1'>Evening</p>
                            <p className='font-medium'>{day.evening}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className='text-center py-4'>
                      <button
                        onClick={() => setShowAllDays((prev) => !prev)}
                        className='text-primary text-sm font-semibold hover:underline'
                      >
                        {!showAllDays
                          ? `View remaining ${dailyDeliveriesHistory.length - 3} days`
                          : 'View less'}
                      </button>
                    </div>
                  </div>

                  {/* SUMMARY (fixed bottom) */}
                  <div className='p-6 border-t border-[#f0f2f4] bg-background-light space-y-3'>
                    <h3 className='text-xs font-bold uppercase tracking-wider text-[#637588]'>
                      Statement Summary
                    </h3>

                    <div className='flex justify-between text-sm'>
                      <span className='text-[#637588]'>Cow Milk (30L)</span>
                      <span className='font-semibold'>₹1,500.00</span>
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-[#637588]'>Buffalo Milk (12L)</span>
                      <span className='font-semibold'>₹680.00</span>
                    </div>

                    <div className='border-t border-[#e5e7eb] pt-3 flex justify-between text-base font-bold'>
                      <span>Grand Total</span>
                      <span>₹2,180.00</span>
                    </div>
                  </div>
                </div>
              </aside>

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
