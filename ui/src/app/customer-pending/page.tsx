'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

import { UserContext } from '../context/user-context';

import Loader from '../../components/loader';
import Button from '../../components/ui/button';

import { FALLBACK_CUSTOMER_PROFILE_IMAGE } from '../../utils/constants';

const CustomerPending = () => {
  const { user, loading, handleLogout } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

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

    if (user.role === 'CUSTOMER' && user.currentActiveOwner) {
      router.replace('/dashboard');
      return;
    }

    if (user.role !== 'CUSTOMER') {
      router.replace('/');
    }
  }, [loading, router, user]);

  if (
    loading ||
    !user ||
    user.role !== 'CUSTOMER' ||
    !!user.currentActiveOwner
  ) {
    return <Loader variant='screen' />;
  }

  return (
    <div className='bg-background-light min-h-screen font-display'>
      <div className='relative flex min-h-screen w-full flex-col overflow-x-hidden'>
        <div className='layout-container flex h-full grow flex-col'>
          {/* <!-- Top Navigation Bar --> */}
          <header className='flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 bg-white px-6 md:px-10 py-3 sticky top-0 z-50'>
            <div className='flex items-center gap-3 text-[#102213]'>
              <div className='flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary'>
                <span className='material-symbols-outlined text-3xl'>
                  water_drop
                </span>
              </div>
              <h2 className='text-[#102213] text-xl font-bold leading-tight tracking-tight'>
                DairyFlow
              </h2>
            </div>
            <div className='flex flex-1 justify-end gap-4 items-center'>
              <div className='h-8 w-px bg-primary/10 mx-2'></div>
              <div className='flex items-center gap-3'>
                <div className='hidden md:block text-right'>
                  <p className='text-sm font-semibold text-[#102213] leading-none'>
                    {user.fullName}
                  </p>
                  <p className='text-xs text-[#102213]/60/60 mt-1'>Customer</p>
                </div>
                <div
                  className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20'
                  data-alt='User profile picture showing a friendly man'
                  style={{
                    backgroundImage: `url(${FALLBACK_CUSTOMER_PROFILE_IMAGE})`,
                  }}
                ></div>
              </div>
            </div>
          </header>
          {/* <!-- Main Content Area --> */}
          <main className='flex flex-1 items-center justify-center p-6 md:p-10 md:pb-0'>
            <div className='layout-content-container flex flex-col max-w-140 w-full bg-white/50 rounded-2xl shadow-xl shadow-primary/5 border border-primary/5 p-8 md:p-12 text-center'>
              {/* <!-- Illustration Area --> */}
              <div className='relative mb-8 flex justify-center'>
                <div className='absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-110'></div>
                <div className='relative z-10 flex items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full'>
                  <div className='relative flex items-center justify-center w-24 h-24 md:w-28 md:h-28 bg-white rounded-full shadow-lg'>
                    <span className='material-symbols-outlined text-primary text-6xl md:text-7xl'>
                      search_check
                    </span>
                    {/* <!-- Small accent icon --> */}
                    <div className='absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full border-4 border-white'>
                      <span className='material-symbols-outlined text-sm block'>
                        link_off
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Header & Description --> */}
              <div className='flex flex-col items-center gap-4'>
                <h1 className='text-[#102213] text-2xl md:text-3xl font-extrabold leading-tight tracking-tight'>
                  No Dairy Linked Yet
                </h1>
                <p className='text-[#102213]/70/70 text-base md:text-lg font-normal leading-relaxed max-w-105'>
                  {` It looks like your account isn't connected to a dairy owner.
                  Please ask your milkman to add your mobile number to their
                  system.`}
                </p>
              </div>
              {/* <!-- User Information Highlight --> */}
              <div className='mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 inline-flex items-center gap-3 mx-auto'>
                <span className='material-symbols-outlined text-primary'>
                  smartphone
                </span>
                <div className='text-left'>
                  <p className='text-xs uppercase tracking-wider font-bold text-primary/70'>
                    Your Registered Number
                  </p>
                  <p className='text-lg font-bold text-[#102213] tracking-wide'>
                    +91 {user.mobileNumber}
                  </p>
                </div>
              </div>
              {/* <!-- Primary Actions --> */}
              <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full'>
                <Button
                  variant='primary'
                  className='flex flex-1 min-w-50 w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-6 py-3.5 active:scale-[0.98] transition-all gap-2 text-base font-bold shadow-lg shadow-primary/20'
                  onClick={() => window.location.reload()}
                >
                  <span className='material-symbols-outlined'>sync</span>
                  <span className='truncate'>Refresh Status</span>
                </Button>
                <Button
                  variant='outline'
                  className='flex flex-1 min-w-50 w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-6 py-3.5 bg-background-light text-[#102213] hover:bg-primary/10 transition-all gap-2 text-base font-bold'
                  onClick={handleLogout}
                >
                  <span className='material-symbols-outlined text-lg'>
                    logout
                  </span>
                  Sign Out
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerPending;
