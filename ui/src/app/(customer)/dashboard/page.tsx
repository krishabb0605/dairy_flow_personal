import React from 'react';
import ContentLayout from '@/components/Customer/layout';

const Dashboard = () => {
  return (
    <ContentLayout title='Dashboard Overview'>
      <div className='flex-1 space-y-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
        <div className='bg-white  rounded-2xl border border-slate-200  shadow-sm overflow-hidden'>
          <div className='px-6 py-5 border-b border-slate-200  flex flex-wrap items-center justify-between gap-4'>
            <div>
              <h2 className='text-lg font-bold'>Delivery Calendar</h2>
              <p className='text-sm text-slate-500'>
                Track and manage your daily milk supply
              </p>
            </div>
            <div className='flex items-center gap-2 bg-slate-100  p-1 rounded-xl'>
              <button className='p-2 hover:bg-white rounded-lg transition-all'>
                <span className='material-symbols-outlined'>chevron_left</span>
              </button>
              <span className='px-4 font-bold text-sm'>October 2023</span>
              <button className='p-2 hover:bg-white rounded-lg transition-all'>
                <span className='material-symbols-outlined'>chevron_right</span>
              </button>
            </div>
          </div>
          <div className='p-6'>
            <div className='grid grid-cols-7 mb-2'>
              <div className='text-center text-xs font-bold text-slate-400 uppercase py-2'>
                Sun
              </div>
              <div className='text-center text-xs font-bold text-slate-400 uppercase py-2'>
                Mon
              </div>
              <div className='text-center text-xs font-bold text-slate-400 uppercase py-2'>
                Tue
              </div>
              <div className='text-center text-xs font-bold text-slate-400 uppercase py-2'>
                Wed
              </div>
              <div className='text-center text-xs font-bold text-slate-400 uppercase py-2'>
                Thu
              </div>
              <div className='text-center text-xs font-bold text-slate-400 uppercase py-2'>
                Fri
              </div>
              <div className='text-center text-xs font-bold text-slate-400 uppercase py-2'>
                Sat
              </div>
            </div>
            <div className='grid grid-cols-7 gap-px bg-slate-200 border border-slate-200  rounded-xl overflow-hidden'>
              <div className='aspect-square bg-slate-50 /50 p-3 opacity-30'>
                <span className='text-sm font-medium'>28</span>
              </div>
              <div className='aspect-square bg-slate-50 /50 p-3 opacity-30'>
                <span className='text-sm font-medium'>29</span>
              </div>
              <div className='aspect-square bg-slate-50 /50 p-3 opacity-30'>
                <span className='text-sm font-medium'>30</span>
              </div>
              <div className='aspect-square bg-white  p-3 hover:bg-slate-50  cursor-pointer group transition-colors'>
                <span className='text-sm font-bold block mb-1'>1</span>
                <div className='flex flex-col items-center justify-center h-full -mt-4'>
                  <div className='text-xs font-bold text-slate-400 uppercase'>
                    1.5L
                  </div>
                  <div className='size-1.5 bg-primary rounded-full mt-1'></div>
                </div>
              </div>
              <div className='aspect-square bg-white  p-3 hover:bg-slate-50  cursor-pointer group transition-colors'>
                <span className='text-sm font-bold block mb-1'>2</span>
                <div className='flex flex-col items-center justify-center h-full -mt-4'>
                  <div className='text-xs font-bold text-slate-400 uppercase'>
                    1.5L
                  </div>
                  <div className='size-1.5 bg-primary rounded-full mt-1'></div>
                </div>
              </div>
              <div className='aspect-square bg-white  p-3 hover:bg-slate-50  cursor-pointer group transition-colors border-2 border-primary/20 bg-primary/5'>
                <span className='text-sm font-bold block mb-1'>3</span>
                <div className='flex flex-col items-center justify-center h-full -mt-4'>
                  <div className='text-xs font-bold text-primary uppercase'>
                    3.0L
                  </div>
                  <div className='text-[10px] text-primary font-bold uppercase'>
                    Extra Added
                  </div>
                </div>
              </div>
              <div className='aspect-square bg-white  p-3 hover:bg-slate-50  cursor-pointer group transition-colors'>
                <span className='text-sm font-bold block mb-1'>4</span>
                <div className='flex flex-col items-center justify-center h-full -mt-4'>
                  <div className='text-xs font-bold text-slate-400 uppercase'>
                    1.5L
                  </div>
                  <div className='size-1.5 bg-primary rounded-full mt-1'></div>
                </div>
              </div>
              <div className='aspect-square bg-primary/20 p-3 border-2 border-primary cursor-pointer transition-colors relative'>
                <span className='text-sm font-bold block mb-1'>5</span>
                <div className='flex flex-col items-center justify-center h-full -mt-4'>
                  <div className='text-xs font-bold text-primary uppercase'>
                    1.5L
                  </div>
                  <div className='size-1.5 bg-primary rounded-full mt-1'></div>
                </div>
                <span className='absolute top-1 right-1 text-[8px] font-black bg-primary text-background-[#102213] px-1 rounded uppercase'>
                  Today
                </span>
              </div>
              <div className='aspect-square bg-slate-50 p-3 hover:bg-slate-100  cursor-pointer group transition-colors'>
                <span className='text-sm font-bold block mb-1 text-slate-400'>
                  6
                </span>
                <div className='flex flex-col items-center justify-center h-full -mt-4 opacity-50'>
                  <div className='text-xs font-bold text-slate-400 uppercase'>
                    0L
                  </div>
                  <span className='material-symbols-outlined text-sm text-slate-400'>
                    pause_circle
                  </span>
                </div>
              </div>
              <div className='aspect-square bg-white  p-3 hover:bg-slate-50  cursor-pointer transition-colors'>
                <span className='text-sm font-bold block mb-1'>7</span>
                <div className='flex flex-col items-center justify-center h-full -mt-4'>
                  <div className='text-xs font-bold text-slate-400 uppercase'>
                    1.5L
                  </div>
                  <div className='size-1.5 bg-primary rounded-full mt-1'></div>
                </div>
              </div>
              <div className='aspect-square bg-white  p-3 hover:bg-slate-50  cursor-pointer transition-colors'>
                <span className='text-sm font-bold block mb-1'>8</span>
                <div className='flex flex-col items-center justify-center h-full -mt-4'>
                  <div className='text-xs font-bold text-slate-400 uppercase'>
                    1.5L
                  </div>
                  <div className='size-1.5 bg-primary rounded-full mt-1'></div>
                </div>
              </div>
              <div className='aspect-square bg-white  p-3 hover:bg-slate-50  cursor-pointer transition-colors'>
                <span className='text-sm font-bold block mb-1'>9</span>
                <div className='flex flex-col items-center justify-center h-full -mt-4'>
                  <div className='text-xs font-bold text-slate-400 uppercase'>
                    1.5L
                  </div>
                  <div className='size-1.5 bg-primary rounded-full mt-1'></div>
                </div>
              </div>
              <div className='aspect-square bg-white  p-3 hover:bg-slate-50  cursor-pointer transition-colors'>
                <span className='text-sm font-bold block mb-1'>10</span>
                <div className='flex flex-col items-center justify-center h-full -mt-4'>
                  <div className='text-xs font-bold text-slate-400 uppercase'>
                    1.5L
                  </div>
                  <div className='size-1.5 bg-primary rounded-full mt-1'></div>
                </div>
              </div>
              <div className='aspect-square bg-white  p-3'></div>
              <div className='aspect-square bg-white  p-3'></div>
              <div className='aspect-square bg-white  p-3'></div>
              <div className='aspect-square bg-white  p-3'></div>
              <div className='aspect-square bg-white  p-3'></div>
              <div className='aspect-square bg-white  p-3'></div>
              <div className='aspect-square bg-white  p-3'></div>
              <div className='aspect-square bg-white  p-3'></div>
              <div className='aspect-square bg-white  p-3'></div>
              <div className='aspect-square bg-white  p-3'></div>
              <div className='aspect-square bg-white  p-3'></div>
            </div>
            <div className='mt-6 flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <div className='size-2.5 bg-primary rounded-full'></div>
                <span className='text-xs text-slate-500 font-medium'>
                  Standard Delivery
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='size-2.5 bg-primary/20 border border-primary rounded-full'></div>
                <span className='text-xs text-slate-500 font-medium'>
                  Extra Delivery
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='material-symbols-outlined text-xs text-slate-400'>
                  pause_circle
                </span>
                <span className='text-xs text-slate-500 font-medium'>
                  Paused Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default Dashboard;
