'use client';

import React, { useState } from 'react';

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex h-screen relative'>
      {/* Mobile Header */}
      <div className='md:hidden fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between z-20'>
        <span className='font-semibold'>My App</span>
        <button onClick={() => setOpen(!open)}>☰</button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64  p-4 z-30
          transform transition-transform duration-300  flex flex-col gap-2 shadow-lg shadow-primary/40 rounded-3xl rounded-l-none
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className='text-2xl font-semibold mb-6 hidden md:block'>
          <div className='flex items-center gap-3 bg-primary/10 p-3 rounded-2xl'>
            <div className='bg-primary/20 p-2 rounded-lg'>
              <span className='material-symbols-outlined text-primary font-bold'>
                water_drop
              </span>
            </div>
            <div className='flex flex-col'>
              <h1 className='text-slate-900 text-base font-bold leading-none'>
                DairyFlow
              </h1>
              <p className='text-slate-500 text-xs font-medium'>
                Customer Portal
              </p>
            </div>
          </div>
        </div>

        {/* <aside className='w-full lg:w-64 flex flex-col gap-2'> */}
        <a
          className='flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors'
          href='#'
        >
          <span className='material-symbols-outlined'>dashboard</span>
          <span className='font-bold'>Overview</span>
        </a>
        <a
          className='flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors'
          href='#'
        >
          <span className='material-symbols-outlined'>calendar_month</span>
          <span className='font-medium'>My Schedule</span>
        </a>
        <a
          className='flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors'
          href='#'
        >
          <span className='material-symbols-outlined'>receipt_long</span>
          <span className='font-medium'>Billing History</span>
        </a>
        <a
          className='flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors'
          href='#'
        >
          <span className='material-symbols-outlined'>settings</span>
          <span className='font-medium'>Preferences</span>
        </a>
        <div className='mt-auto pt-8'>
          <div className='bg-primary/10 rounded-2xl p-5 border border-primary/20 flex flex-col gap-3'>
            <div>
              <p className='text-sm font-bold'>Need help?</p>
              <p className='text-xs text-slate-500'>
                Our support team is available 24/7 for you.
              </p>
            </div>
            <button className='w-full py-2 bg-primary text-background-[#102213] font-bold rounded-lg text-sm hover:opacity-90 transition-opacity'>
              Get Support
            </button>
          </div>
        </div>
        {/* </aside> */}
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className='fixed inset-0 bg-black/50 z-20 md:hidden'
        />
      )}
      {/* Main Content */}
      {children}
    </div>
  );
};

export default CustomerLayout;
