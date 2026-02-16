'use client';
import { type FormEvent, useState } from 'react';
import { Mandatory } from '@/app/page';
import ContentLayout from '../../../components/layout';

const defaultFormData = {
  cowMilkPrice: '62',
  buffaloMilkPrice: '85',
  morningStartTime: '06:00',
  morningEndTime: '09:00',
  eveningStartTime: '18:00',
  eveningEndTime: '21:00',
  fullName: 'John Dairy',
  phoneNumber: '9876543210',
  email: 'contact@freshmilk.com',
  upiId: 'johndairy@okaxis',
  bankName: 'HDFC Bank',
  accountNumber: '987654321012',
  ifscCode: 'HDFC0001234',
};

type FormData = typeof defaultFormData;
type FormErrors = Partial<Record<keyof FormData, string>>;

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};
  const phoneRegex = /^\d{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
  const accountNumberRegex = /^\d{9,18}$/;
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

  if (!data.cowMilkPrice || Number(data.cowMilkPrice) <= 0) {
    errors.cowMilkPrice = 'Cow milk price must be greater than 0.';
  }

  if (!data.buffaloMilkPrice || Number(data.buffaloMilkPrice) <= 0) {
    errors.buffaloMilkPrice = 'Buffalo milk price must be greater than 0.';
  }

  if (!data.morningStartTime) {
    errors.morningStartTime = 'Morning start time is required.';
  }

  if (!data.morningEndTime) {
    errors.morningEndTime = 'Morning end time is required.';
  }

  if (
    data.morningStartTime &&
    data.morningEndTime &&
    data.morningStartTime >= data.morningEndTime
  ) {
    errors.morningEndTime = 'Morning end time must be after start time.';
  }

  if (!data.eveningStartTime) {
    errors.eveningStartTime = 'Evening start time is required.';
  }

  if (!data.eveningEndTime) {
    errors.eveningEndTime = 'Evening end time is required.';
  }

  if (
    data.eveningStartTime &&
    data.eveningEndTime &&
    data.eveningStartTime >= data.eveningEndTime
  ) {
    errors.eveningEndTime = 'Evening end time must be after start time.';
  }

  if (!data.fullName.trim() || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must have at least 2 characters.';
  }

  if (!phoneRegex.test(data.phoneNumber)) {
    errors.phoneNumber = 'Phone number must be exactly 10 digits.';
  }

  if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!upiRegex.test(data.upiId.trim())) {
    errors.upiId = 'Enter a valid UPI ID (example: name@bank).';
  }

  if (!data.bankName.trim()) {
    errors.bankName = 'Bank name is required.';
  }

  if (!accountNumberRegex.test(data.accountNumber.trim())) {
    errors.accountNumber = 'Account number must be 9 to 18 digits.';
  }

  if (!ifscRegex.test(data.ifscCode.trim().toUpperCase())) {
    errors.ifscCode = 'Enter a valid IFSC code (example: HDFC0001234).';
  }

  return errors;
};

const Settings = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('Owner settings validation errors:', validationErrors);
      return;
    }

    console.log('Owner settings form data:', formData);
  };

  const handleDiscardChanges = () => {
    setFormData(defaultFormData);
    setErrors({});
  };

  return (
    <ContentLayout
      title='Owner Settings'
      description='Manage your business operations, pricing, and profile details.'
    >
      <form className='space-y-8 pb-24' onSubmit={handleSubmit}>
        {/* <!-- Owner Profile Section --> */}
        <section className='bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'>
          <div className='px-6 py-4 border-b border-slate-100 bg-slate-50/50'>
            <h3 className='font-bold text-slate-800 flex items-center gap-2'>
              <span className='material-symbols-outlined text-primary'>
                person
              </span>
              Owner Profile
            </h3>
          </div>

          <div className='flex items-center gap-6 px-6'>
            <div className='relative'>
              <div
                className='size-24 rounded-full border-4 border-[#f0f2f4] bg-center bg-no-repeat bg-cover'
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDN2u-3mU6mmls0TZnnkiW-REP7B2vB0ub6z83m0yBUgaAGlPbhHoKSb7ujqng0kNBc1Tv87noGjx3jXL7BnE0_2n0PYE7lZNBphK0JPZ9mF2tamoOvLLyZ8yeibaRb-qbsJm8FKibgU89Lj-XfbdGEbX_2wn8ODNARm3rZQf_BZWQwnIW5vt3WvAM-vZPlwbOrIEPXsJBrWL6x8EGy5MnCnIs4PzPEs5hPBBG4_Td_bfd2vf0BuUC4FL8YIiJBGOZLAigyMSRyBVk")',
                }}
              ></div>
              <button
                type='button'
                className='absolute bottom-0 right-0 size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600'
              >
                <span className='material-symbols-outlined text-sm'>
                  photo_camera
                </span>
              </button>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-sm font-bold'>Profile Picture</p>
              <p className='text-xs text-[#637588]'>PNG or JPG up to 5MB</p>
              <div className='flex gap-2 mt-2'>
                <button
                  type='button'
                  className='text-xs font-bold text-primary hover:underline'
                >
                  Change
                </button>
                <button
                  type='button'
                  className='text-xs font-bold text-red-500 hover:underline'
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div className='p-6 space-y-4'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                Full Name <Mandatory />
              </label>
              <input
                className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${
                  errors.fullName
                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                }`}
                type='text'
                value={formData.fullName}
                onChange={(event) =>
                  handleChange('fullName', event.target.value)
                }
              />
              {errors.fullName && (
                <p className='mt-1 text-xs text-red-600'>{errors.fullName}</p>
              )}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  Phone Number <Mandatory />
                </label>
                <div className='relative'>
                  <span className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 font-medium'>
                    +91
                  </span>
                  <input
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border bg-slate-50 focus:ring-2 outline-none transition-all ${
                      errors.phoneNumber
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                    }`}
                    placeholder='98765 43210'
                    type='tel'
                    maxLength={10}
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleChange(
                        'phoneNumber',
                        e.target.value.replace(/\D/g, ''),
                      )
                    }
                  />
                </div>
                {errors.phoneNumber && (
                  <p className='mt-1 text-xs text-red-600'>
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  Email Address <Mandatory />
                </label>
                <input
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                  }`}
                  type='email'
                  value={formData.email}
                  onChange={(event) =>
                    handleChange('email', event.target.value)
                  }
                />
                {errors.email && (
                  <p className='mt-1 text-xs text-red-600'>{errors.email}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* <!-- Milk Prices Section --> */}
        <section className='bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'>
          <div className='px-6 py-4 border-b border-slate-100 bg-slate-50/50'>
            <h3 className='font-bold text-slate-800 flex items-center gap-2'>
              <span className='material-symbols-outlined text-primary'>
                sell
              </span>
              Milk Prices
            </h3>
          </div>
          <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                Cow Milk Price (per liter) <Mandatory />
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium'>
                  ₹
                </span>
                <input
                  className={`w-full pl-8 pr-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${
                    errors.cowMilkPrice
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                  }`}
                  placeholder='0.00'
                  type='number'
                  value={formData.cowMilkPrice}
                  onChange={(event) =>
                    handleChange('cowMilkPrice', event.target.value)
                  }
                />
              </div>
              {errors.cowMilkPrice && (
                <p className='mt-1 text-xs text-red-600'>
                  {errors.cowMilkPrice}
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                Buffalo Milk Price (per liter) <Mandatory />
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium'>
                  ₹
                </span>
                <input
                  className={`w-full pl-8 pr-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${
                    errors.buffaloMilkPrice
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                  }`}
                  placeholder='0.00'
                  type='number'
                  value={formData.buffaloMilkPrice}
                  onChange={(event) =>
                    handleChange('buffaloMilkPrice', event.target.value)
                  }
                />
              </div>
              {errors.buffaloMilkPrice && (
                <p className='mt-1 text-xs text-red-600'>
                  {errors.buffaloMilkPrice}
                </p>
              )}
            </div>
          </div>
        </section>
        {/* <!-- Shift Timings Section --> */}
        <section className='bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'>
          <div className='px-6 py-4 border-b border-slate-100 bg-slate-50/50'>
            <h3 className='font-bold text-slate-800 flex items-center gap-2'>
              <span className='material-symbols-outlined text-primary'>
                schedule
              </span>
              Shift Timings
            </h3>
          </div>

          <div className='p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <p className='text-sm font-bold text-primary mb-4 uppercase tracking-wider'>
                Morning Slot <Mandatory />
              </p>
              <div className='grid grid-cols-2 gap-4'>
                <label className='flex flex-col gap-2'>
                  <span className='text-xs font-medium text-[#637588]'>
                    Start Time
                  </span>
                  <input
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-1 outline-none ${
                      errors.morningStartTime
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#dce0e5] focus:border-primary focus:ring-primary'
                    }`}
                    type='time'
                    value={formData.morningStartTime}
                    onChange={(event) =>
                      handleChange('morningStartTime', event.target.value)
                    }
                  />
                  {errors.morningStartTime && (
                    <p className='text-xs text-red-600'>
                      {errors.morningStartTime}
                    </p>
                  )}
                </label>
                <label className='flex flex-col gap-2'>
                  <span className='text-xs font-medium text-[#637588]'>
                    End Time
                  </span>
                  <input
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-1 outline-none ${
                      errors.morningEndTime
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#dce0e5] focus:border-primary focus:ring-primary'
                    }`}
                    type='time'
                    value={formData.morningEndTime}
                    onChange={(event) =>
                      handleChange('morningEndTime', event.target.value)
                    }
                  />
                  {errors.morningEndTime && (
                    <p className='text-xs text-red-600'>
                      {errors.morningEndTime}
                    </p>
                  )}
                </label>
              </div>
            </div>
            <div>
              <p className='text-sm font-bold text-primary mb-4 uppercase tracking-wider'>
                Evening Slot <Mandatory />
              </p>
              <div className='grid grid-cols-2 gap-4'>
                <label className='flex flex-col gap-2'>
                  <span className='text-xs font-medium text-[#637588]'>
                    Start Time
                  </span>
                  <input
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-1 outline-none ${
                      errors.eveningStartTime
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#dce0e5] focus:border-primary focus:ring-primary'
                    }`}
                    type='time'
                    value={formData.eveningStartTime}
                    onChange={(event) =>
                      handleChange('eveningStartTime', event.target.value)
                    }
                  />
                  {errors.eveningStartTime && (
                    <p className='text-xs text-red-600'>
                      {errors.eveningStartTime}
                    </p>
                  )}
                </label>
                <label className='flex flex-col gap-2'>
                  <span className='text-xs font-medium text-[#637588]'>
                    End Time
                  </span>
                  <input
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-1 outline-none ${
                      errors.eveningEndTime
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#dce0e5] focus:border-primary focus:ring-primary'
                    }`}
                    type='time'
                    value={formData.eveningEndTime}
                    onChange={(event) =>
                      handleChange('eveningEndTime', event.target.value)
                    }
                  />
                  {errors.eveningEndTime && (
                    <p className='text-xs text-red-600'>
                      {errors.eveningEndTime}
                    </p>
                  )}
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- Payment Info Section --> */}
        <section className='bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'>
          <div className='px-6 py-4 border-b border-slate-100 bg-slate-50/50'>
            <h3 className='font-bold text-slate-800 flex items-center gap-2'>
              <span className='material-symbols-outlined text-primary'>
                account_balance
              </span>
              Payment Info
            </h3>
          </div>
          <div className='p-6 space-y-6'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                UPI ID <Mandatory />
              </label>
              <div className='relative'>
                <input
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${
                    errors.upiId
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                  }`}
                  placeholder='username@upi'
                  type='text'
                  value={formData.upiId}
                  onChange={(event) =>
                    handleChange('upiId', event.target.value)
                  }
                />
                <span className='absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold text-xs uppercase tracking-wider'>
                  Verified
                </span>
              </div>
              {errors.upiId && (
                <p className='mt-1 text-xs text-red-600'>{errors.upiId}</p>
              )}
            </div>
            <div className='h-px bg-slate-100 w-full'></div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='md:col-span-1'>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  Bank Name
                </label>
                <input
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${
                    errors.bankName
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                  }`}
                  type='text'
                  value={formData.bankName}
                  onChange={(event) =>
                    handleChange('bankName', event.target.value)
                  }
                />
                {errors.bankName && (
                  <p className='mt-1 text-xs text-red-600'>{errors.bankName}</p>
                )}
              </div>
              <div className='md:col-span-1'>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  Account Number
                </label>
                <input
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${
                    errors.accountNumber
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                  }`}
                  type='password'
                  value={formData.accountNumber}
                  onChange={(event) =>
                    handleChange(
                      'accountNumber',
                      event.target.value.replace(/\D/g, ''),
                    )
                  }
                />
                {errors.accountNumber && (
                  <p className='mt-1 text-xs text-red-600'>
                    {errors.accountNumber}
                  </p>
                )}
              </div>
              <div className='md:col-span-1'>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  IFSC Code
                </label>
                <input
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${
                    errors.ifscCode
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                  }`}
                  type='text'
                  value={formData.ifscCode}
                  onChange={(event) =>
                    handleChange('ifscCode', event.target.value.toUpperCase())
                  }
                />
                {errors.ifscCode && (
                  <p className='mt-1 text-xs text-red-600'>{errors.ifscCode}</p>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Sticky Footer Action --> */}
        <div className='fixed bottom-0 left-0 md:left-64 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-end items-center gap-4 z-10'>
          <button
            type='button'
            onClick={handleDiscardChanges}
            className='px-6 py-3 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors'
          >
            Discard Changes
          </button>
          <button
            type='submit'
            className='px-10 py-3 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-95 transition-all flex items-center gap-2'
          >
            <span className='material-symbols-outlined text-[18px]'>save</span>
            Save Changes
          </button>
        </div>
      </form>
    </ContentLayout>
  );
};

export default Settings;
