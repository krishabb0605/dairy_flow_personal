'use client';

import UserRole from '../../../components/Auth/onboarding/user-role';
import BasicInfo from '../../../components/Auth/onboarding/basic-info';
import { Stepper } from '../../../components/Auth/stepper';
import { useContext, useState } from 'react';
import OwnerConfiguration from '../../../components/Auth/onboarding/owner-configuration';
import CustomerConfiguration from '../../../components/Auth/onboarding/customer-configuration';
import { UserContext } from '../../../app/context/user-context';

const steps = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Your role' },
  { id: 3, title: 'Configuration' },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(3);
  const { selectedRole } = useContext(UserContext);

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
