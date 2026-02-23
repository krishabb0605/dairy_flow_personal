'use client';

import { ReactNode, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { UserContext } from '../context/user-context';
import background from '../../assets/images/background.png';

import Loader from '../../components/loader';

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (user && !!user.onboarded && !loading) {
      router.push('/');
    }
  }, [user, router, loading]);

  if (loading) {
    return <Loader variant='screen' />;
  }

  return (
    <div className='flex min-h-screen flex-col lg:flex-row'>
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary/10'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          data-alt='Fresh glass milk bottles on a wooden table'
          style={{
            backgroundImage: `url(${background.src})`,
          }}
        >
          <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent'></div>
        </div>
        <div className='relative z-10 flex flex-col justify-end p-20 text-white'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='bg-white rounded-lg p-2 text-primary'>
              <span className='material-symbols-outlined text-4xl'>
                water_drop
              </span>
            </div>
            <h1 className='text-4xl font-black tracking-tight'>DairyFlow</h1>
          </div>
          <h2 className='text-3xl font-bold mb-4 leading-tight'>
            Fresh daily milk delivered right to your doorstep.
          </h2>
          <p className='text-lg text-white/80 max-w-md'>
            Manage your deliveries, subscriptions, and accounts with our
            easy-to-use platform designed for both families and dairy farm
            owners.
          </p>
        </div>
      </div>

      {children}
    </div>
  );
};

export default Layout;
