'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { UserContext } from '../../../app/context/user-context';

import UserRole from '../../../components/Auth/onboarding/user-role';
import BasicInfo from '../../../components/Auth/onboarding/basic-info';
import OwnerConfiguration from '../../../components/Auth/onboarding/owner-configuration';
import CustomerConfiguration from '../../../components/Auth/onboarding/customer-configuration';
import { Stepper } from '../../../components/Auth/stepper';

const steps = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Your role' },
  { id: 3, title: 'Configuration' },
];

export default function OnboardingPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window === 'undefined') return 1;

    const localUserInfo = localStorage.getItem('user');
    const onboardingStep = localUserInfo
      ? JSON.parse(localUserInfo).onboardingStep
      : 0;
    return onboardingStep + 1;
  });

  const { selectedRole, user } = useContext(UserContext);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && !!user.onboarded) {
      router.push('/');
    }
  }, [user, router]);

  if (!mounted) return null;

  return (
    <div className='mx-auto p-6 pb-0 flex-1'>
      <Stepper steps={steps} currentStep={currentStep} />

      {/* Step Content */}
      <div className='bg-white rounded-lg'>
        {currentStep === 1 && (
          <BasicInfo
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        )}
        {currentStep === 2 && (
          <UserRole currentStep={currentStep} setCurrentStep={setCurrentStep} />
        )}

        {currentStep === 3 &&
          (selectedRole === 'OWNER' ? (
            <OwnerConfiguration
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          ) : (
            <CustomerConfiguration
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          ))}
      </div>
    </div>
  );
}
