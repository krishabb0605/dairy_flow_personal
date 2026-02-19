'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/user-context';
import Loader from '../../components/loader';
import { FALLBACK_CUSTOMER_PROFILE_IMAGE } from '../../constants';
import Button from '../../components/ui/button';

const customerMenu = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
  },
  {
    label: 'Delivery History',
    href: '/deliveries-history',
    icon: 'history',
  },
  {
    label: 'Monthly Billing',
    href: '/billing',
    icon: 'receipt_long',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: 'settings',
  },
];

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, handleLogout } = useContext(UserContext);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
        return;
      }

      if (!user.onboarded) {
        router.replace('/onboarding');
        return;
      }

      if (user.role === 'OWNER') {
        router.replace('/owner/dashboard');
        return;
      }

      if (!user.currentActiveOwner) {
        router.replace('/customer-pending');
        return;
      }
    }
  }, [loading, router, user]);

  const canRenderCustomerContent =
    !!user &&
    user.onboarded &&
    user.role === 'CUSTOMER' &&
    !!user.currentActiveOwner;

  if (loading || !canRenderCustomerContent) {
    return <Loader variant='screen' />;
  }

  const active = 'bg-primary/10 text-primary';

  return (
    <div className='flex h-screen relative'>
      {/* Mobile Header */}
      <div className='md:hidden fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between z-20'>
        <span className='font-semibold'>My App</span>
        <Button
          onClick={() => setOpen(!open)}
          variant='ghost'
          className='text-white'
        >
          ☰
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky inset-y-0 left-0 w-64 p-4 z-30 
          transform transition-transform duration-300 flex flex-col gap-2 shadow-lg shadow-primary/20 bg-white rounded-3xl rounded-l-none
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 pt-4
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

        {customerMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors ${
              pathName === item.href ? active : 'text-slate-600'
            }`}
          >
            <span className='material-symbols-outlined'>{item.icon}</span>
            <span className='font-bold'>{item.label}</span>
          </Link>
        ))}

        <div className='mt-auto pt-8'>
          <div className='bg-primary/10 rounded-2xl p-5 border border-primary/20 flex flex-col gap-3'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-3'>
                <div
                  className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border border-[#dce0e5]'
                  style={{
                    backgroundImage: `url(${user?.profileImageUrl ?? FALLBACK_CUSTOMER_PROFILE_IMAGE})`,
                  }}
                ></div>

                <div className='text-left block'>
                  <p className='text-xs font-bold leading-none'>
                    {user?.fullName}
                  </p>
                  <p className='text-[10px] text-slate-500 mt-1'>
                    +91 {user?.mobileNumber}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant='primary'
              className='w-full h-10 py-2 font-bold rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-[16px]'
              onClick={handleLogout}
            >
              <div>Sign out</div>
              <span className='material-symbols-outlined'>logout</span>
            </Button>
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
      <main
        className='flex-1 overflow-y-auto md:pt-0 bg-blue-50/60'
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
