import { useContext, useState } from 'react';
import OnboardingLayout from './layout';
import { toast } from 'react-toastify';
import { OnboardingStepProps } from '../../../types';
import { UserContext } from '../../../app/context/user-context';
import { createUser } from '../../../lib/users';
import { Mandatory } from '../../../app/page';

const BasicInfo = ({ currentStep, setCurrentStep }: OnboardingStepProps) => {
  const { basicInfo, handleChange, setUser, user } = useContext(UserContext);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, mobileNumber, email, password, confirmPassword, address } =
      basicInfo;

    if (!fullName || !mobileNumber || !email || !address) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(mobileNumber)) {
      toast.error('Enter a valid 10 digit mobile number');
      return;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Enter a valid email address');
        return;
      }
    }

    if (!user?.firebaseUid) {
      if (password?.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
    }

    try {
      setSaveLoading(true);
      const userInfo = await createUser({
        fullName,
        email,
        address,
        mobileNumber,
        password,
        existingFirebaseId: user?.firebaseUid,
      });

      setUser(userInfo);
      toast.success('Basic Information saved successfully!');
      setCurrentStep((prev) => prev + 1);
      setSaveLoading(false);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message || 'Error while creating user');
      setSaveLoading(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      handleSubmit={handleSubmit}
      title='Basic Information'
      submitLoading={saveLoading}
    >
      <>
        <div className='flex flex-col gap-2'>
          <label className='text-[#0d141b]  text-sm font-medium leading-normal'>
            Full Name <Mandatory />
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
            Mobile Number <Mandatory />
          </label>
          <div className='relative'>
            <input
              className='form-input flex w-full rounded-lg text-[#0d141b] border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
              placeholder='78787 87878'
              type='tel'
              name='mobileNumber'
              value={basicInfo.mobileNumber}
              onChange={handleChange}
              maxLength={10}
              required
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-[#0d141b]  text-sm font-medium leading-normal'>
            Home Address <Mandatory />
          </label>
          <textarea
            className='form-input flex w-full rounded-lg text-[#0d141b] border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
            rows={4}
            name='address'
            value={basicInfo.address}
            placeholder='4522 Oakwood Drive, Maple Heights, Apartment 4B, Seattle, WA 98101'
            onChange={handleChange}
          >
            4522 Oakwood Drive, Maple Heights, Apartment 4B, Seattle, WA 98101
          </textarea>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-[#0d141b]  text-sm font-medium leading-normal'>
            Email <Mandatory />
          </label>
          <div className='relative'>
            <input
              className={`form-input flex w-full rounded-lg text-[#0d141b border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none ${user?.email ? 'cursor-not-allowed' : ''}`}
              placeholder='john@example.com'
              type='email'
              name='email'
              value={basicInfo.email}
              onChange={handleChange}
              disabled={!!user?.email}
            />
          </div>
        </div>
        {/* <!-- Password Fields Row --> */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-[#0d141b]  text-sm font-medium leading-normal'>
              Password <Mandatory />
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
              Confirm Password <Mandatory />
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
