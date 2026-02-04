import OnboardingLayout from './layout';
import { OnboardingStepProps } from '../../../types';
import { UserContext } from '../../../app/context/user-context';
import { useContext } from 'react';

const UserRole = ({ currentStep, setCurrentStep }: OnboardingStepProps) => {
  const { selectedRole, setSelectedRole } = useContext(UserContext);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can add validation logic here before proceeding to the next step
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      handleSubmit={handleSubmit}
      title='Choose Your Role'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4'>
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
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCegAp3W-99JwrKXCFes5mQgUMeDjBeZy5wd1qoaB19QxGGJKDz8BC1Z5MeJ8TxMng0j0Y30-y04m6Do4S7U2qOa6h8GvxY7ULLO-JvwEg7caDGRpy_TA1xYf5yA-vGYxMWHIuWgQMtu_W2-ctyWHXt4K7VWoInrKRbb0q4xUyMl4Q-A74xkERsa-ffoe5NgSgJG97c8LgHsEnPsaixbywi68wtxXuafHpn6A3EkZ1y_Pfb1LXEcNyJAavvU1Vcog0oB1caQk0zYu8")',
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
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzqZqh0kSuCTlNsUTuMyfg3qqK5O5Ka9xRqnkt2dVs2rfSVsR_QFAr35UfiTRuDfVd6ChPi4FOhFtuSB2KHXv11VS-JChaYeqI53x-YpcnqzB31tN-cKbQNxJGyGCol4XBuIQMM22s_q9PvLb7-0S3FKPrYpTFQdo2ZTP5TLTKyJHVNJjyioMzOpKHa0EbOcbvS0512QFle648zfwSQ5P9aU5dmATQ7nBLzea7_3DxkjH2t0s5EU27IgqdtKjUj0nYl2Ere1d7iIA")',
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
