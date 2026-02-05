'use client';

import { toast } from 'react-toastify';
import { auth } from '../config/firebase-config';
import { signOut } from 'firebase/auth';
import { useContext, useEffect } from 'react';
import { UserContext } from './context/user-context';
import { useRouter } from 'next/navigation';
import Loader from '../components/loader';

export const Mandatory = () => {
  return <span className='text-red-500'>*</span>;
};

export default function Home() {
  const { user, loading, setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!user.onboarded) {
        router.push(`/onboarding`);
      } else if (user.role === 'OWNER') {
        // router.push('/owner/dashboard');
        router.push('/');
      } else {
        // router.push('/customer/dashboard');
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader variant='screen' />;
  }

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

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <button
        onClick={logout}
        className='flex items-center justify-center gap-2 rounded-xl h-12 bg-primary text-white text-base font-bold transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] cursor-pointer p-4'
      >
        Sign out
      </button>
    </div>
  );
}
