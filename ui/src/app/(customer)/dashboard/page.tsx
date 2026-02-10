'use client';
import ContentLayout from '../../../components/Customer/layout';
import DeliveryCalendar from '../../../components/Customer/calender';
import { useContext, useState } from 'react';
import AddExtraMilkModal from '../../../components/modal/customer/add-extra-milk';
import ScheduleVacation from '../../../components/modal/customer/schedule-vacation';
import { UserContext } from '../../../app/context/user-context';

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const [openExtraMilkModal, setOpenExtraMilkModal] = useState<boolean>(false);
  const [openScheduleVacation, setOpenScheduleVacation] =
    useState<boolean>(false);

  return (
    <ContentLayout title='Dashboard Overview'>
      <div className='flex-1 space-y-8 flex flex-col xl:flex-row gap-4'>
        <div className='flex-1'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
            <div className='bg-white p-6 rounded-2xl border border-slate-200  shadow-sm'>
              <div className='flex justify-between items-start mb-4'>
                <span className='text-slate-500 text-sm font-medium uppercase tracking-wider'>
                  Liters This Month
                </span>
                <div className='p-2 bg-blue-50 text-blue-600 rounded-lg'>
                  <span className='material-symbols-outlined leading-none'>
                    opacity
                  </span>
                </div>
              </div>
              <p className='text-4xl font-bold'>48.5L</p>
              <p className='text-sm text-primary font-semibold mt-2 flex items-center gap-1'>
                <span className='material-symbols-outlined text-sm'>
                  trending_up
                </span>{' '}
                +5.2% from last month
              </p>
            </div>

            <div className='bg-white  p-6 rounded-2xl border border-slate-200  shadow-sm'>
              <div className='flex justify-between items-start mb-4'>
                <span className='text-slate-500 text-sm font-medium uppercase tracking-wider'>
                  Current Bill
                </span>
                <div className='p-2 bg-green-50  text-green-600 rounded-lg'>
                  <span className='material-symbols-outlined leading-none'>
                    payments
                  </span>
                </div>
              </div>
              <p className='text-4xl font-bold'>₹2,910</p>
              <p className='text-sm text-slate-500 mt-2'>Unpaid balance: ₹0</p>
            </div>
          </div>

          <DeliveryCalendar />
        </div>

        <aside className='w-full xl:w-90 flex flex-col gap-6 shrink-0'>
          <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-slate-500 mb-4'>
              Quick Actions
            </h3>
            <div className='space-y-3'>
              <button
                className='w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all group'
                onClick={() => setOpenExtraMilkModal(true)}
              >
                <div className='flex items-center gap-3'>
                  <span className='material-symbols-outlined text-xl'>
                    add_circle
                  </span>
                  <span className='text-sm font-semibold'>
                    Add Extra for a Date
                  </span>
                </div>
                <span className='material-symbols-outlined text-sm opacity-0 group-hover:opacity-100'>
                  chevron_right
                </span>
              </button>

              <button
                className='w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all group'
                onClick={() => setOpenScheduleVacation(true)}
              >
                <div className='flex items-center gap-3'>
                  <span className='material-symbols-outlined text-xl'>
                    event_busy
                  </span>
                  <span className='text-sm font-semibold'>
                    Schedule Vacation
                  </span>
                </div>
                <span className='material-symbols-outlined text-sm opacity-0 group-hover:opacity-100'>
                  chevron_right
                </span>
              </button>
            </div>
          </div>
          <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm'>
            <div className='space-y-6'>
              <div className='pt-4 border-t border-slate-100'>
                <h3 className='text-sm font-bold uppercase tracking-wider text-slate-500 mb-3'>
                  Weekly Consumption
                </h3>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-slate-600'>
                    Total this week
                  </span>
                  <span className='text-lg font-bold text-primary'>10.5L</span>
                </div>
              </div>
              <div className='pt-4 border-t border-slate-100'>
                <h3 className='text-xs font-bold uppercase tracking-wider text-slate-400 mb-3'>
                  Your Milkman
                </h3>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
                      <span className='material-symbols-outlined'>person</span>
                    </div>
                    <div>
                      <p className='text-sm font-bold'>
                        {user?.customerProfile?.ownerUser?.fullName}
                      </p>
                      <p className='text-[10px] text-slate-500'>
                        Verified Partner
                      </p>
                    </div>
                  </div>
                  <button className='p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors'>
                    <span className='material-symbols-outlined text-xl'>
                      call
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='bg-primary/5 rounded-2xl p-6 border border-primary/20'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary'>
                <span className='material-symbols-outlined'>support_agent</span>
              </div>
              <div>
                <p className='text-sm font-bold'>Need help?</p>
                <p className='text-xs text-slate-500'>Available 24/7</p>
              </div>
            </div>
            <button className='w-full py-3 bg-primary text-background-dark font-bold rounded-xl text-sm hover:opacity-90 transition-opacity'>
              Get Support
            </button>
          </div>
        </aside>
      </div>
      {openExtraMilkModal && (
        <AddExtraMilkModal
          open={openExtraMilkModal}
          setOpen={setOpenExtraMilkModal}
        />
      )}

      {openScheduleVacation && (
        <ScheduleVacation
          open={openScheduleVacation}
          setOpen={setOpenScheduleVacation}
        />
      )}
    </ContentLayout>
  );
};

export default Dashboard;
