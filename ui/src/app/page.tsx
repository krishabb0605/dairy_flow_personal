'use client';

import { useContext, useEffect } from 'react';
import { UserContext } from './context/user-context';
import { useRouter } from 'next/navigation';
import Loader from '../components/loader';

export const Mandatory = () => {
  return <span className='text-red-500'>*</span>;
};

export default function Home() {
  const { user, loading } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (!user.onboarded) {
        router.push('/onboarding');
        return;
      }

      if (user.role === 'OWNER') {
        router.push('/owner/dashboard');
        return;
      }

      if (user.role === 'CUSTOMER') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  return <Loader variant='screen' />;
}
