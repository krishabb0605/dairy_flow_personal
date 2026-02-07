'use client';

import { auth } from '../../config/firebase-config';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { UserContext } from '../context/user-context';
import { toast } from 'react-toastify';
import Loader from '../../components/loader';

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, setUser } = useContext(UserContext);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const pathName = usePathname();

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push('/login');
      localStorage.removeItem('user');
    } catch (error) {
      console.error(error);
      toast.error('Error while log out !!');
    }
  };
  console.log(pathName);

  if (loading) {
    return <Loader variant='screen' />;
  }

  const active = 'bg-primary/10 text-primary';

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

        <Link
          className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors ${pathName === '/dashboard' ? active : 'text-slate-600'}`}
          href='/dashboard'
        >
          <span className='material-symbols-outlined'>dashboard</span>
          <span className='font-bold'>Dashboard</span>
        </Link>

        <Link
          className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors ${pathName === '/deliveries' ? active : 'text-slate-600'}`}
          href='/deliveries'
        >
          <span className='material-symbols-outlined'>local_shipping</span>
          <span className='font-bold'>Deliveries</span>
        </Link>

        <Link
          className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors ${pathName === '/deliveries-history' ? active : 'text-slate-600'}`}
          href='/deliveries-history'
        >
          <span className='material-symbols-outlined'>history</span>
          <span className='font-bold'>Delivery History</span>
        </Link>

        <Link
          className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors ${pathName === '/billing' ? active : 'text-slate-600'}`}
          href='/billing'
        >
          <span className='material-symbols-outlined'>receipt_long</span>
          <span className='font-bold'>Monthly Billing</span>
        </Link>

        <Link
          className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors ${pathName === '/settings' ? active : 'text-slate-600'}`}
          href='/settings'
        >
          <span className='material-symbols-outlined'>settings</span>
          <span className='font-bold'>Settings</span>
        </Link>

        <div className='mt-auto pt-8'>
          <div className='bg-primary/10 rounded-2xl p-5 border border-primary/20 flex flex-col gap-3'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-3'>
                <div
                  className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border border-[#dce0e5]'
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCPeeZBwp-3az7dkbzgurfj_-mhwl88izbLFJ0tK5VRhx7OhHJ5qbuq909LIHErHO8M6EthW4qFLHiryKM2wAniDhnfyn5OIf-zpCHD9C9jtkQGqJc17sqAPnzoDX3xV39ow4Ymi5O-nQ9yaAjmnyCd8Umsz-FybMjpp8Me3rHsA_SXyW8umHt5ZhYjPjoOw1baqACiW4vtXXrJ6DKidP06YbdWGGQ1J1qEDzNGxLbmqrJpcwsklZYt6Mc29hsXIR6CZGrEc-SbIE8")',
                  }}
                ></div>

                <div className='text-left block'>
                  <p className='text-xs font-bold leading-none'>
                    {user?.fullName}
                  </p>
                  <p className='text-[10px] text-slate-500 mt-1'>
                    {user?.mobileNumber}
                  </p>
                </div>
              </div>
            </div>

            <button
              className='w-full h-10 py-2 bg-primary text-white font-bold rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-[16px]'
              onClick={logout}
            >
              <div>Sign out</div>
              <span className='material-symbols-outlined'>logout</span>
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
      <main
        className='flex-1 overflow-y-auto md:pt-0'
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
