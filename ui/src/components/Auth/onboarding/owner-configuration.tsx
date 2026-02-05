import { useContext, useState } from 'react';
import OnboardingLayout from './layout';
import { MilkConfig, OnboardingStepProps } from '../../../types';
import { UserContext } from '../../../app/context/user-context';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { addOwnerConfigInfo } from '../../../lib/users';
import { Mandatory } from '../../../app/page';

const OwnerConfiguration = ({
  currentStep,
  setCurrentStep,
}: OnboardingStepProps) => {
  const [dairyName, setDairyName] = useState('');
  const [milkConfig, setMilkConfig] = useState<{
    cow: MilkConfig;
    buffalo: MilkConfig;
  }>({
    cow: { enabled: true, price: 70 },
    buffalo: { enabled: true, price: 70 },
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dairyName) {
      toast.error('Enter a valid Dairy name');
      return;
    }

    const data = {
      dairyName,
      cowEnabled: milkConfig.cow.enabled,
      cowPrice: milkConfig.cow.price,
      buffaloEnabled: milkConfig.buffalo.enabled,
      buffaloPrice: milkConfig.buffalo.price,
    };

    if (!user) {
      toast.error('User not found !!');
      return;
    }

    try {
      setSaveLoading(true);

      const userInfo = await addOwnerConfigInfo(user.id, data);

      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      router.push('/');
      setSaveLoading(false);
    } catch (error) {
      toast.error('Error while adding owner configuran');
      setSaveLoading(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      handleSubmit={handleSubmit}
      title='Owner Configuration'
      submitLoading={saveLoading}
    >
      <div className='space-y-6'>
        <div className='flex flex-col gap-2'>
          <label className='flex flex-col w-full'>
            <p className='text-sm font-semibold leading-normal pb-2'>
              Dairy Name <Mandatory />
            </p>
            <input
              className='form-input flex w-full rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white h-14 p-3.75 text-base font-normal transition-all'
              placeholder='Enter your business name'
              value={dairyName}
              onChange={(e) => setDairyName(e.target.value)}
            />
          </label>
        </div>
        {/* <!-- Dual TextFields: Owner & Mobile --> */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <label className='flex flex-col flex-1'>
            <p className='text-sm font-semibold leading-normal pb-2'>
              Owner Name
            </p>
            <input
              className='form-input flex w-full rounded-lg text-slate-500 border border-slate-200 bg-slate-50 h-14 p-3.75 text-base font-normal cursor-not-allowed'
              placeholder={user?.fullName}
              readOnly
              disabled
            />
          </label>
          <label className='flex flex-col flex-1'>
            <p className='text-sm font-semibold leading-normal pb-2'>
              Mobile Number
            </p>
            <input
              className='form-input flex w-full rounded-lg text-slate-500 border border-slate-200 bg-slate-50 h-14 p-3.75 text-base font-normal cursor-not-allowed'
              readOnly
              placeholder={'+91 ' + user?.mobileNumber}
              disabled
            />
          </label>
        </div>
      </div>
      {/* <!-- SectionHeader: Milk Configuration --> */}
      <div className='bg-slate-50 border-t border-b border-slate-200'>
        <h2 className='text-[22px] font-bold leading-tight tracking-[-0.015em] px-6 py-4 flex items-center gap-2'>
          <span className='material-symbols-outlined text-primary'>
            water_drop
          </span>
          Milk Configuration <Mandatory />
        </h2>
      </div>
      <div className='space-y-8'>
        {/* <!-- Milk Types Selection --> */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* <!-- Cow Milk Section --> */}
          <div className='p-5 border border-slate-200 rounded-xl bg-white'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <input
                  checked={milkConfig.cow.enabled}
                  className='w-5 h-5 rounded text-primary focus:ring-primary border-slate-300 bg-white'
                  type='checkbox'
                  onChange={(e) => {
                    setMilkConfig({
                      ...milkConfig,
                      cow: { ...milkConfig.cow, enabled: e.target.checked },
                    });
                  }}
                  id='cow-milk'
                />
                <label
                  className='text-lg font-bold select-none'
                  htmlFor='cow-milk'
                >
                  Cow Milk
                </label>
              </div>
              <span className='material-symbols-outlined text-slate-400'>
                pets
              </span>
            </div>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-slate-600'>Price per Liter</span>
                <div className='relative w-32'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500'>
                    ₹
                  </span>
                  <input
                    type='number'
                    value={milkConfig.cow.price}
                    onChange={(e) =>
                      setMilkConfig({
                        ...milkConfig,
                        cow: {
                          ...milkConfig.cow,
                          price: Number(e.target.value),
                        },
                      })
                    }
                    disabled={!milkConfig.cow.enabled}
                    className={`w-full pl-7 pr-3 py-2 rounded-lg border text-right font-bold
                      ${
                        milkConfig.cow.enabled
                          ? 'bg-white border-slate-300'
                          : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Buffalo Milk Section --> */}
          <div className='p-5 border border-slate-200 rounded-xl bg-white'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <input
                  checked={milkConfig.buffalo.enabled}
                  className='w-5 h-5 rounded text-primary focus:ring-primary border-slate-300 bg-white'
                  type='checkbox'
                  onChange={(e) => {
                    setMilkConfig({
                      ...milkConfig,
                      buffalo: {
                        ...milkConfig.buffalo,
                        enabled: e.target.checked,
                      },
                    });
                  }}
                  id='buffalo-milk'
                />
                <label
                  className='text-lg font-bold select-none'
                  htmlFor='buffalo-milk'
                >
                  Buffalo Milk
                </label>
              </div>
              <span className='material-symbols-outlined text-slate-400'>
                pets
              </span>
            </div>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-slate-600'>Price per Liter</span>
                <div className='relative w-32'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500'>
                    ₹
                  </span>
                  <input
                    type='number'
                    value={milkConfig.buffalo.price}
                    onChange={(e) =>
                      setMilkConfig({
                        ...milkConfig,
                        buffalo: {
                          ...milkConfig.buffalo,
                          price: Number(e.target.value),
                        },
                      })
                    }
                    disabled={!milkConfig.buffalo.enabled}
                    className={`w-full pl-7 pr-3 py-2 rounded-lg border text-right font-bold
                    ${
                      milkConfig.buffalo.enabled
                        ? 'bg-white border-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OwnerConfiguration;
