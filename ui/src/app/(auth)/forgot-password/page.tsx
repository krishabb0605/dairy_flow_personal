'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';

import { Mandatory } from '../../../app/page';

import Loader from '../../../components/loader';
import Button from '../../../components/ui/button';

import { auth } from '../../../config/firebase-config';

import logo from '../../../assets/logo/logo.png'
import Image from 'next/image';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }

    try {
      setSubmitLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent.');
      setSubmitLoading(false);
    } catch (error: any) {
      console.error('Error sending reset email', error);
      toast.error(error?.message || 'Failed to send reset email.');
      setSubmitLoading(false);
    } finally {
      setEmail('');
    }
  };

  return (
    <div className='flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-24 bg-[#f6f7f8]'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center lg:text-left'>
          <div className='lg:hidden flex justify-center mb-6 fixed left-0 top-6 w-screen items-center'>
            <div className='flex items-center gap-2 text-primary flex-col'>
              <Image src={logo} alt='logo' height={60} width={60} />

              <span className='text-2xl font-bold text-primary'>
                DairyFlow
              </span>
            </div>
          </div>

          <h2 className='text-3xl font-bold tracking-tight text-slate-900'>
            Forgot password
          </h2>

          <p className='mt-2 text-slate-600'>
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        <div className='flex flex-col w-full bg-white rounded-xl shadow-sm border border-[#cfdbe7] p-8'>
          <form onSubmit={handleSubmit} className='space-y-5'>
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

            <Button
              type='submit'
              variant='primary'
              className='flex w-full items-center justify-center rounded-xl h-14 font-bold cursor-pointer'
            >
              {submitLoading ? <Loader color='white' /> : 'Send reset link'}
            </Button>
          </form>

          <p className='mt-10 text-center text-sm text-slate-600'>
            Remembered your password?{' '}
            <Link className='font-bold text-primary' href='/login'>
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
