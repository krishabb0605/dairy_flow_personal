'use client';

import Image from 'next/image';
import { useState } from 'react';

import ContentLayout from '../../../components/layout';
import Pagination from '../../../components/pagination';
import Button from '../../../components/ui/button';
import { Table, TableBody, TableHead } from '../../../components/ui/table';
import BillingDetailsAside from './billing-details-aside';

import { billingHistory, dailyDeliveriesHistory } from '../../../constants';

import pieChart from '../../../assets/images/pie-chart.png';
import { BillingHistoryRow } from './billing-history-row';

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
    <ContentLayout
      title='Monthly Statements'
      description='Track your daily milk consumption history and manage recurring payments.'
    >
      <main className='flex-1 flex flex-col overflow-y-auto'>
        <div className='mx-auto w-full flex flex-col gap-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='flex flex-col gap-2 md:col-span-2'>
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
                    <Button
                      variant='primary'
                      className='flex-1 md:flex-none min-w-30 font-bold py-2.5 px-6 rounded-lg transition shadow-lg shadow-primary/20'
                    >
                      Pay Now
                    </Button>
                    <Button
                      variant='outline-neutral'
                      className='flex items-center justify-center gap-2 font-semibold py-2.5 px-6 rounded-lg transition'
                    >
                      <span
                        className='material-symbols-outlined text-lg'
                        data-icon='download'
                      >
                        download
                      </span>
                      Invoice
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white  border border-[#f0f2f4]  p-6 rounded-xl shadow-sm flex flex-col justify-between'>
              <div>
                <h3 className='text-[#111418] text-sm font-bold uppercase tracking-wider mb-6'>
                  Consumption Insights
                </h3>
                <p className='text-xs font-medium text-[#637588] mb-3'>
                  Monthly Trend (Qty)
                </p>
              </div>

              <div className='bg-white flex flex-col justify-between mt-4'>
                <div className='flex flex-col gap-4 mt-4'>
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
                <Button
                  variant='secondary-muted'
                  className='flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg'
                >
                  <span
                    className='material-symbols-outlined text-lg'
                    data-icon='filter_list'
                  >
                    filter_list
                  </span>
                  2023
                </Button>
              </div>
            </div>
            <div className='bg-white  border border-[#f0f2f4]  rounded-xl shadow-sm overflow-hidden'>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHead>
                    <tr className='bg-slate-50 text-[#637588]  text-xs font-semibold uppercase tracking-wider'>
                      <th className='px-6 py-4'>Billing Month</th>
                      <th className='px-6 py-4'>Total Qty</th>
                      <th className='px-6 py-4'>Amount</th>
                      <th className='px-6 py-4'>Status</th>
                      <th className='px-6 py-4 text-right'>Actions</th>
                    </tr>
                  </TableHead>
                  <TableBody className='divide-[#f0f2f4]'>
                    {paginatedBills.map((bill, index) => (
                      <BillingHistoryRow
                        key={`${bill.month}-${index}`}
                        bill={bill}
                        onOpenPanel={() => setOpenPanel(true)}
                      />
                    ))}
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
