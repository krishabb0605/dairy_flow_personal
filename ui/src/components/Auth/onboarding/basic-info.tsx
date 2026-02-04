import { useContext } from 'react';
import OnboardingLayout from './layout';
import { toast } from 'react-toastify';
import { OnboardingStepProps } from '../../../types';
import { UserContext } from '../../../app/context/user-context';

const BasicInfo = ({ currentStep, setCurrentStep }: OnboardingStepProps) => {
  const { basicInfo, handleChange } = useContext(UserContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, mobileNumber, email, password, confirmPassword } =
      basicInfo;

    if (!fullName || !mobileNumber || !email || !password || !confirmPassword) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
    if (!phoneRegex.test(mobileNumber)) {
      toast.error('Enter a valid mobile number');
      return;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Enter a valid email address');
        return;
      }
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    toast.success('Basic Information saved successfully!');
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      handleSubmit={handleSubmit}
      title='Basic Information'
    >
      <>
        <div className='flex flex-col gap-2'>
          <label className='text-[#0d141b]  text-sm font-medium leading-normal'>
            Full Name <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <input
              className='form-input flex w-full rounded-lg text-[#0d141b] border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
              placeholder='John Doe'
              type='text'
              name='fullName'
              value={basicInfo.fullName}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* <!-- Mobile Number --> */}
        <div className='flex flex-col gap-2'>
          <label className='text-[#0d141b]  text-sm font-medium leading-normal'>
            Mobile Number <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <input
              className='form-input flex w-full rounded-lg text-[#0d141b] border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
              placeholder='+1 (555) 000-0000'
              type='tel'
              name='mobileNumber'
              value={basicInfo.mobileNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-[#0d141b]  text-sm font-medium leading-normal'>
            Email <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <input
              className='form-input flex w-full rounded-lg text-[#0d141b border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
              placeholder='john@example.com'
              type='email'
              name='email'
              value={basicInfo.email}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* <!-- Password Fields Row --> */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-[#0d141b]  text-sm font-medium leading-normal'>
              Password <span className='text-red-500'>*</span>
            </label>
            <input
              className='form-input flex w-full rounded-lg text-[#0d141b] border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
              placeholder='••••••••'
              type='password'
              name='password'
              value={basicInfo.password}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-[#0d141b]  text-sm font-medium leading-normal'>
              Confirm Password <span className='text-red-500'>*</span>
            </label>
            <input
              className='form-input flex w-full rounded-lg text-[#0d141b] border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
              placeholder='••••••••'
              type='password'
              name='confirmPassword'
              value={basicInfo.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>
      </>
    </OnboardingLayout>
  );
};

export default BasicInfo;
