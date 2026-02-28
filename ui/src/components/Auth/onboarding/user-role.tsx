import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { UserContext } from '../../../app/context/user-context';

import { OnboardingStepProps } from '../../../utils/types';

import { addRole } from '../../../lib/users';

import ownerOnboarding from '../../../assets/images/owner-onboarding.png';
import customerOnboarding from '../../../assets/images/customer-onboarding.png';

import OnboardingLayout from './layout';

const UserRole = ({ currentStep, setCurrentStep }: OnboardingStepProps) => {
  const [saveLoading, setSaveLoading] = useState(false);

  const { selectedRole, setSelectedRole, user, setUser } =
    useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('User not found !!');
      return;
    }

    try {
      setSaveLoading(true);

      const userInfo = await addRole(user.id, selectedRole);
      setUser(userInfo);

      localStorage.setItem('user', JSON.stringify(userInfo));
      toast.success('Role selected successfully');
      setSaveLoading(false);
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      toast.error('Error while adding role');
      setSaveLoading(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      handleSubmit={handleSubmit}
      title='Choose Your Role'
      submitLoading={saveLoading}
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* OWNER */}
        <div
          onClick={() => setSelectedRole('OWNER')}
          className={`flex flex-col gap-3 pb-3 p-6 rounded-xl border-2 cursor-pointer transition-all
            ${
              selectedRole === 'OWNER'
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-gray-200 bg-white hover:border-primary/50'
            }
          `}
        >
          <div
            className='w-full h-48 bg-center bg-no-repeat bg-cover rounded-lg mb-2 relative'
            style={{
              backgroundImage: `url(${ownerOnboarding.src})`,
            }}
          >
            {selectedRole === 'OWNER' && (
              <div className='absolute top-4 right-4 bg-primary text-white rounded-full p-1 flex items-center justify-center'>
                <span className='material-symbols-outlined text-xl'>check</span>
              </div>
            )}
          </div>

          <div>
            <div className='flex items-center gap-2 mb-1'>
              <span
                className={`material-symbols-outlined ${
                  selectedRole === 'OWNER' ? 'text-primary' : 'text-gray-400'
                }`}
              >
                local_shipping
              </span>
              <p className='text-xl font-bold text-gray-900'>
                Dairy Owner / Milkman
              </p>
            </div>
            <p className='text-gray-600 text-sm mb-2'>
              I want to manage my dairy business and deliveries
            </p>
            <p className='text-gray-500 text-xs uppercase tracking-wider'>
              Select this if you sell milk
            </p>
          </div>
        </div>

        {/* CUSTOMER */}
        <div
          onClick={() => setSelectedRole('CUSTOMER')}
          className={`flex flex-col gap-3 pb-3 p-6 rounded-xl border-2 cursor-pointer transition-all
            ${
              selectedRole === 'CUSTOMER'
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-gray-200 bg-white hover:border-primary/50'
            }
          `}
        >
          <div
            className='w-full h-48 bg-center bg-no-repeat bg-cover rounded-lg mb-2 relative'
            style={{
              backgroundImage: `url(${customerOnboarding.src})`,
            }}
          >
            {selectedRole === 'CUSTOMER' && (
              <div className='absolute top-4 right-4 bg-primary text-white rounded-full p-1 flex items-center justify-center'>
                <span className='material-symbols-outlined text-xl'>check</span>
              </div>
            )}
          </div>

          <div>
            <div className='flex items-center gap-2 mb-1'>
              <span
                className={`material-symbols-outlined ${
                  selectedRole === 'CUSTOMER' ? 'text-primary' : 'text-gray-400'
                }`}
              >
                shopping_basket
              </span>
              <p className='text-xl font-bold text-gray-900'>Customer</p>
            </div>
            <p className='text-gray-600 text-sm mb-2'>
              I want to order fresh milk and dairy products
            </p>
            <p className='text-gray-500 text-xs uppercase tracking-wider'>
              Select this if you buy milk
            </p>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default UserRole;
