'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { Mandatory } from '../../../app/page';
import { UserContext } from '../../../app/context/user-context';

import Loader from '../../../components/loader';
import Button from '../../../components/ui/button';

import { login } from '../../../lib/users';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const router = useRouter();
  const { user, setUser, loading } = useContext(UserContext);

  useEffect(() => {
    if (!loading && user) {
      if (!user.onboarded) {
        router.push('/onboarding');
        return;
      }

      if (user.role === 'OWNER') {
        router.push('/owner/dashboard');
        return;
      }

      if (user.role === 'CUSTOMER' && !user.currentActiveOwner) {
        router.push('/customer-pending');
        return;
      }

      if (user.role === 'CUSTOMER') {
        router.push('/dashboard');
        return;
      }
    }
  }, [loading, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitLoading(true);
      const user = await login(email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('User login successfully');
      setSubmitLoading(false);
    } catch (error: any) {
      console.log('Error while sign up user', error);
      toast.error(error.message || 'Error while sign up user');
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <Loader variant='screen' />;
  }

  return (
    <div className='flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-24 bg-[#f6f7f8]'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center lg:text-left'>
          <div className='lg:hidden flex justify-center mb-6'>
            <div className='flex items-center gap-2 text-primary'>
              <span className='material-symbols-outlined text-4xl'>
                water_drop
              </span>
              <span className='text-2xl font-bold text-slate-90'>
                DairyFlow
              </span>
            </div>
          </div>

          <h2 className='text-3xl font-bold tracking-tight text-slate-900'>
            Welcome back
          </h2>

          <p className='mt-2 text-slate-600'>
            Please enter your details to sign in.
          </p>
        </div>

        <div className='flex flex-col w-full bg-white rounded-xl shadow-sm border border-[#cfdbe7] p-8'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Email */}
            <div className='flex flex-col gap-2'>
              <label className='text-slate-700 text-sm font-semibold'>
                Email <Mandatory />
              </label>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='form-input flex w-full rounded-lg text-[#0d141b] border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                placeholder='name@example.com'
                type='email'
                required
              />
            </div>

            {/* Password */}
            <div className='flex flex-col gap-2'>
              <label className='text-slate-700 text-sm font-semibold'>
                Password <Mandatory />
              </label>
              <div className='relative flex w-full items-stretch'>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='form-input flex w-full rounded-lg text-[#0d141b] border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                  placeholder='••••••••'
                  type={showPassword ? 'text' : 'password'}
                  required
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className='material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-primary select-none'
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
            </div>

            <Button
              type='submit'
              variant='primary'
              className='flex w-full items-center justify-center rounded-xl h-14 font-bold cursor-pointer'
            >
              {submitLoading ? <Loader color='white' /> : 'Sign In'}
            </Button>
          </form>

          <p className='mt-10 text-center text-sm text-slate-600'>
            Don&apos;t have an account?{' '}
            <Link className='font-bold text-primary' href='/onboarding'>
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
