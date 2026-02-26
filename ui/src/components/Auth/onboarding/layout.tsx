'use client';

import { useContext, useState } from 'react';

import { UserContext } from '../../../app/context/user-context';

import Loader from '../../../components/loader';
import Modal from '../../../components/modal';
import Button from '../../../components/ui/button';

import { OnboardingLayoutProps } from '../../../utils/types';

const OnboardingLayout = ({
  currentStep,
  setCurrentStep,
  handleSubmit,
  title,
  children,
  submitLoading,
}: OnboardingLayoutProps) => {
  const { loading, handleLogout } = useContext(UserContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleConfirmLogout = async () => {
    setLogoutLoading(true);
    await handleLogout();
    setLogoutLoading(false);
    setShowLogoutConfirm(false);
  };

  if (loading) {
    return <Loader variant='screen' />;
  }

  return (
    <div className='layout-container flex grow flex-col'>
      <main className='flex flex-1 justify-center px-4'>
        <div
          className='layout-content-container flex flex-col w-full bg-white  rounded-xl shadow-sm border border-[#cfdbe7] p-8 pb-1 max-h-[calc(100vh-144px)] overflow-y-auto'
          style={{ scrollbarWidth: 'none' }}
        >
          {/* <!-- Page Heading --> */}
          <div className='flex flex-wrap justify-between gap-3 mb-6'>
            <div className='flex flex-col gap-1'>
              <h1 className='text-[#0d141b]  text-3xl font-black leading-tight tracking-[-0.033em]'>
                {title}
              </h1>
            </div>
          </div>

          {/* <!-- Registration Form --> */}
          <div className='flex flex-col gap-5'>
            {children}
            {/* <!-- Action Button --> */}
            <div
              className={`pt-2 grid gap-4 ${currentStep === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}
            >
              {currentStep !== 1 && (
                <Button
                  variant='primary'
                  className='flex items-center justify-center gap-2 rounded-xl h-12 text-base font-bold transition-all hover:shadow-lg active:scale-[0.98] px-8 cursor-pointer'
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                  <span className='material-symbols-outlined'>arrow_back</span>
                  <span>Back</span>
                </Button>
              )}

              <Button
                variant='primary'
                className='flex items-center justify-center gap-2 rounded-xl h-12 text-base font-bold transition-all hover:shadow-lg active:scale-[0.98] cursor-pointer'
                onClick={handleSubmit}
              >
                {submitLoading ? (
                  <Loader color='white' />
                ) : (
                  <>
                    <span>{currentStep !== 3 ? 'Next' : 'Complete'}</span>
                    <span className='material-symbols-outlined'>
                      arrow_forward
                    </span>
                  </>
                )}
              </Button>
            </div>

            {/* <!-- Login Redirect --> */}
            <p className='text-center text-blue-placeholder text-sm mt-4'>
              Already have an account?{' '}
              <Button
                variant='link'
                className='font-bold'
                onClick={() => {
                  setShowLogoutConfirm(true);
                }}
              >
                Log in
              </Button>
            </p>
          </div>
        </div>
      </main>

      <Modal
        open={showLogoutConfirm}
        title='Log out?'
        description='You will be signed out and taken to the login page.'
        submitText='Log out'
        cancelText='Stay here'
        loading={logoutLoading}
        variant='warning'
        icon='warning'
        onSubmit={handleConfirmLogout}
        onClose={() => setShowLogoutConfirm(false)}
      >
        <p className='text-sm text-gray-600'>
          If you still need to finish onboarding, click “Stay here.”
        </p>
      </Modal>

      {/* <!-- Footer Footer (Minimal) --> */}
      <footer className='pt-8 text-center'>
        <p className='text-blue-placeholder text-xs'>
          © 2026 DairyFlow Delivery Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default OnboardingLayout;
