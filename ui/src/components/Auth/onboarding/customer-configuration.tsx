import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { UserContext } from '../../../app/context/user-context';
import { Mandatory } from '../../../app/page';

import { OnboardingStepProps } from '../../../utils/types';

import { addCustomerConfigInfo } from '../../../lib/users';

import OnboardingLayout from './layout';

const CustomerConfiguration = ({
  currentStep,
  setCurrentStep,
}: OnboardingStepProps) => {
  const [deliveryPreferences, setDeliveryPreferences] = useState({
    morning: { cow: 0, buffalo: 0 },
    evening: { cow: 0, buffalo: 0 },
  });

  const [saveLoading, setSaveLoading] = useState(false);
  const router = useRouter();

  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('User not found !!');
      return;
    }

    try {
      setSaveLoading(true);

      const userInfo = await addCustomerConfigInfo(user.id, {
        morningCowQty: deliveryPreferences.morning.cow,
        morningBuffaloQty: deliveryPreferences.morning.buffalo,
        eveningCowQty: deliveryPreferences.morning.cow,
        eveningBuffaloQty: deliveryPreferences.evening.buffalo,
      });

      setCurrentStep((prev) => prev + 1);

      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      router.push('/');
      setSaveLoading(false);
    } catch (error: any) {
      toast.error(error.message || 'Error while adding customer config !');
      setSaveLoading(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      handleSubmit={handleSubmit}
      title='Customer Configuration'
      submitLoading={saveLoading}
    >
      <div className='flex flex-col gap-2'>
        {/* <!-- Section: Step 1 --> */}
        <h2 className='text-[22px] font-bold leading-tight tracking-[-0.015em]'>
          1. Link to Dairy
        </h2>

        {/* <!-- Section: Profile Info --> */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pt-4'>
          <label className='flex flex-col'>
            <p className='text-base font-medium leading-normal pb-2'>
              Customer Name
            </p>
            <input
              className='form-input rounded-lg border border-[#cfe7d3] bg-[#e7f3e9] h-12 px-4 text-base font-normal opacity-70 cursor-not-allowed'
              disabled
              value={user?.fullName}
            />
          </label>
          <label className='flex flex-col'>
            <p className='text-base font-medium leading-normal pb-2'>
              Mobile Number
            </p>
            <input
              className='form-input rounded-lg border border-[#cfe7d3] bg-[#e7f3e9] h-12 px-4 text-base font-normal opacity-70 cursor-not-allowed'
              disabled
              value={'+91 ' + user?.mobileNumber}
            />
          </label>
        </div>
        {/* <!-- Section: Delivery Preferences --> */}
        <h2 className='text-[22px] font-bold leading-tight tracking-[-0.015em] pb-0 pt-4'>
          2. Delivery Preferences
        </h2>
        <div className='px-4 pt-4'>
          <p className='text-base font-medium leading-normal'>
            Select Milk Type <Mandatory />
          </p>
        </div>
        {/* <!-- Dynamic Quantities Section (Case: Both Selected) --> */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 px-4'>
          {/* <!-- Morning Slot --> */}
          <div className='pr-2 pl-3 pt-3 pb-2 rounded-2xl bg-white shadow-sm border border-[#cfe7d3]'>
            <div className='flex items-center gap-2 mb-4 text-primary'>
              <span className='material-symbols-outlined'>light_mode</span>
              <h3 className='text-lg font-bold'>Morning Delivery</h3>
            </div>
            <div className='flex justify-between items-center gap-2'>
              <label className='flex flex-col justify-between'>
                <p className='text-sm font-medium pb-1'>Cow Milk (L)</p>
                <input
                  className='w-full pl-7 pr-3 py-2 rounded-lg border font-bold bg-white border-slate-300'
                  placeholder='0.0'
                  step='0.5'
                  type='number'
                  min={0}
                  value={deliveryPreferences.morning.cow}
                  onChange={(e) =>
                    setDeliveryPreferences({
                      ...deliveryPreferences,
                      morning: {
                        ...deliveryPreferences.morning,
                        cow: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </label>
              <label className='flex flex-col items-center justify-between'>
                <p className='text-sm font-medium pb-1'>Buffalo Milk (L)</p>
                <input
                  className='w-full pl-7 pr-3 py-2 rounded-lg border font-bold bg-white border-slate-300'
                  placeholder='0.0'
                  step='0.5'
                  type='number'
                  min={0}
                  value={deliveryPreferences.morning.buffalo}
                  onChange={(e) =>
                    setDeliveryPreferences({
                      ...deliveryPreferences,
                      morning: {
                        ...deliveryPreferences.morning,
                        buffalo: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </label>
            </div>
          </div>
          {/* <!-- Evening Slot --> */}
          <div className='pr-2 pl-3 pt-3 pb-2 rounded-2xl bg-white shadow-sm border border-[#cfe7d3]'>
            <div className='flex items-center gap-2 mb-4 text-[#4c9a59]'>
              <span className='material-symbols-outlined'>dark_mode</span>
              <h3 className='text-lg font-bold'>Evening Delivery</h3>
            </div>
            <div className='flex justify-between items-center gap-2'>
              <label className='flex flex-col justify-between'>
                <p className='text-sm font-medium pb-1'>Cow Milk (L)</p>
                <input
                  className='w-full pl-7 pr-3 py-2 rounded-lg border font-bold bg-white border-slate-300'
                  placeholder='0.0'
                  step='0.5'
                  type='number'
                  min={0}
                  value={deliveryPreferences.evening.cow}
                  onChange={(e) =>
                    setDeliveryPreferences({
                      ...deliveryPreferences,
                      evening: {
                        ...deliveryPreferences.evening,
                        cow: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </label>
              <label className='flex flex-col items-center justify-between'>
                <p className='text-sm font-medium pb-1'>Buffalo Milk (L)</p>
                <input
                  className='w-full pl-7 pr-3 py-2 rounded-lg border font-bold bg-white border-slate-300'
                  placeholder='0.0'
                  step='0.5'
                  type='number'
                  min={0}
                  value={deliveryPreferences.evening.buffalo}
                  onChange={(e) =>
                    setDeliveryPreferences({
                      ...deliveryPreferences,
                      evening: {
                        ...deliveryPreferences.evening,
                        buffalo: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default CustomerConfiguration;
