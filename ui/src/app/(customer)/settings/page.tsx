'use client';
import { UserContext } from '../../../app/context/user-context';
import { Mandatory } from '../../../app/page';
import ContentLayout from '../../../components/layout';
import { type FormEvent, useContext, useEffect, useState } from 'react';
import { type User } from '../../../types';

type FormData = {
  fullName: string;
  customerId: string;
  mobileNumber: string;
  email: string;
  address: string;
  morningCowQty: string;
  morningBuffaloQty: string;
  eveningCowQty: string;
  eveningBuffaloQty: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const buildInitialFormData = (user: User | null): FormData => ({
  fullName: user?.fullName ?? '',
  customerId: user?.customerProfile?.customerCode ?? '',
  mobileNumber: user?.mobileNumber ?? '',
  email: user?.email ?? '',
  address: user?.address ?? '',
  morningCowQty: String(user?.customerProfile?.morningCowQty ?? '0'),
  morningBuffaloQty: String(user?.customerProfile?.morningBuffaloQty ?? '0'),
  eveningCowQty: String(user?.customerProfile?.eveningCowQty ?? '0'),
  eveningBuffaloQty: String(user?.customerProfile?.eveningBuffaloQty ?? '0'),
});

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  if (!data.fullName.trim() || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must have at least 2 characters.';
  }

  if (!data.customerId.trim()) {
    errors.customerId = 'Customer ID is required.';
  }

  if (!phoneRegex.test(data.mobileNumber)) {
    errors.mobileNumber = 'Mobile number must be exactly 10 digits.';
  }

  if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!data.address.trim() || data.address.trim().length < 5) {
    errors.address = 'Address must have at least 5 characters.';
  }

  const quantityFields: Array<keyof FormData> = [
    'morningCowQty',
    'morningBuffaloQty',
    'eveningCowQty',
    'eveningBuffaloQty',
  ];

  quantityFields.forEach((field) => {
    const raw = data[field];
    const qty = Number(raw);
    if (raw === '' || Number.isNaN(qty) || qty < 0) {
      errors[field] = 'Quantity must be 0 or greater.';
    }
  });

  const totalQty =
    Number(data.morningCowQty || 0) +
    Number(data.morningBuffaloQty || 0) +
    Number(data.eveningCowQty || 0) +
    Number(data.eveningBuffaloQty || 0);

  if (totalQty <= 0) {
    errors.morningCowQty = 'At least one quantity must be greater than 0.';
  }

  return errors;
};

const Settings = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState<FormData>(
    buildInitialFormData(user),
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(buildInitialFormData(user));
    setErrors({});
  }, [user]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('Customer settings validation errors:', validationErrors);
      return;
    }

    console.log('Customer settings form data:', formData);
  };

  const handleCancel = () => {
    setFormData(buildInitialFormData(user));
    setErrors({});
  };

  const handleQuantityChange = (field: keyof FormData, value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      handleChange(field, value);
    }
  };

  return (
    <ContentLayout title='Settings & Profile'>
      <form className='flex-1 space-y-6 pb-24' onSubmit={handleSubmit}>
        <section className='bg-white rounded-xl border border-[#dce0e5] shadow-sm'>
          <div className='px-6 py-5 border-b border-[#dce0e5]'>
            <h2 className='text-lg font-bold'>Public Profile</h2>
          </div>
          <div className='p-6 space-y-6'>
            <div className='flex items-center gap-6'>
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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#637588]'>
                  Full Name <Mandatory />
                </label>
                <input
                  className={`form-input flex w-full rounded-lg text-[#0d141b] border bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 outline-none ${
                    errors.fullName
                      ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500'
                      : 'border-[#cfdbe7] focus:ring-primary/50 focus:border-primary'
                  }`}
                  type='text'
                  value={formData.fullName}
                  onChange={(event) =>
                    handleChange('fullName', event.target.value)
                  }
                />
                {errors.fullName && (
                  <p className='text-xs text-red-600'>{errors.fullName}</p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#637588]'>
                  Customer ID <Mandatory />
                </label>
                <input
                  className='form-input flex w-full rounded-lg text-slate-500 border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none cursor-not-allowed'
                  type='text'
                  value={formData.customerId}
                  disabled
                />
                {errors.customerId && (
                  <p className='text-xs text-red-600'>{errors.customerId}</p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#637588]'>
                  Mobile Number <Mandatory />
                </label>
                <input
                  className={`form-input flex w-full rounded-lg text-[#0d141b] border bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 outline-none ${
                    errors.mobileNumber
                      ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500'
                      : 'border-[#cfdbe7] focus:ring-primary/50 focus:border-primary'
                  }`}
                  type='tel'
                  maxLength={10}
                  value={formData.mobileNumber}
                  onChange={(event) =>
                    handleChange(
                      'mobileNumber',
                      event.target.value.replace(/\D/g, ''),
                    )
                  }
                />
                {errors.mobileNumber && (
                  <p className='text-xs text-red-600'>{errors.mobileNumber}</p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#637588]'>
                  Email <Mandatory />
                </label>
                <input
                  className='form-input flex w-full rounded-lg text-slate-500 border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none cursor-not-allowed'
                  type='email'
                  value={formData.email}
                  disabled
                />
                {errors.email && (
                  <p className='text-xs text-red-600'>{errors.email}</p>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className='bg-white rounded-xl border border-[#dce0e5] shadow-sm'>
          <div className='px-6 py-5 border-b border-[#dce0e5]'>
            <h2 className='text-lg font-bold'>Delivery Address</h2>
          </div>
          <div className='p-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#637588]'>
                  Home Address <Mandatory />
                </label>
                <textarea
                  className={`form-input flex w-full rounded-lg text-[#0d141b] border bg-slate-50 placeholder:text-blue-placeholder p-4 text-sm font-normal focus:ring-2 outline-none ${
                    errors.address
                      ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500'
                      : 'border-[#cfdbe7] focus:ring-primary/50 focus:border-primary'
                  }`}
                  rows={3}
                  value={formData.address}
                  onChange={(event) =>
                    handleChange('address', event.target.value)
                  }
                />
                {errors.address && (
                  <p className='text-xs text-red-600'>{errors.address}</p>
                )}
              </div>
              <div className='flex items-center gap-2'>
                <span className='material-symbols-outlined text-primary text-sm'>
                  location_on
                </span>
                <button
                  type='button'
                  className='text-sm text-primary font-bold hover:underline'
                >
                  Detect Current Location
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className='bg-white rounded-xl border border-[#dce0e5] shadow-sm'>
          <div className='px-6 py-5 border-b border-[#dce0e5]'>
            <h2 className='text-lg font-bold'>
              Product Preferences (Default Quantities)
            </h2>
          </div>
          <div className='p-6 space-y-8'>
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <span className='material-symbols-outlined text-primary'>
                  light_mode
                </span>
                <h3 className='text-md font-bold text-[#111418]'>
                  Morning Delivery <Mandatory />
                </h3>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <label className='text-sm font-medium text-[#637588]'>
                      Cow Milk (Liters)
                    </label>
                  </div>
                  <div className='flex items-center'>
                    <input
                      className={`w-full pl-7 pr-3 py-2 rounded-lg border font-bold bg-white focus-visible:outline-primary/70 ${
                        errors.morningCowQty
                          ? 'border-red-500'
                          : 'border-slate-300'
                      }`}
                      placeholder='0.0'
                      step='0.5'
                      type='number'
                      min={0}
                      value={formData.morningCowQty}
                      onChange={(event) =>
                        handleQuantityChange(
                          'morningCowQty',
                          event.target.value,
                        )
                      }
                    />
                  </div>
                  {errors.morningCowQty && (
                    <p className='text-xs text-red-600'>
                      {errors.morningCowQty}
                    </p>
                  )}
                </div>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <label className='text-sm font-medium text-[#637588]'>
                      Buffalo Milk (Liters)
                    </label>
                  </div>
                  <div className='flex items-center'>
                    <input
                      className={`w-full pl-7 pr-3 py-2 rounded-lg border font-bold bg-white focus-visible:outline-primary/70 ${
                        errors.morningBuffaloQty
                          ? 'border-red-500'
                          : 'border-slate-300'
                      }`}
                      placeholder='0.0'
                      min='0'
                      step='0.5'
                      type='number'
                      value={formData.morningBuffaloQty}
                      onChange={(event) =>
                        handleQuantityChange(
                          'morningBuffaloQty',
                          event.target.value,
                        )
                      }
                    />
                  </div>
                  {errors.morningBuffaloQty && (
                    <p className='text-xs text-red-600'>
                      {errors.morningBuffaloQty}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <hr className='border-[#dce0e5]' />
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <span className='material-symbols-outlined text-primary'>
                  dark_mode
                </span>
                <h3 className='text-md font-bold text-[#111418]'>
                  Evening Delivery <Mandatory />
                </h3>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <label className='text-sm font-medium text-[#637588]'>
                      Cow Milk (Liters)
                    </label>
                  </div>
                  <div className='flex items-center'>
                    <input
                      className={`w-full pl-7 pr-3 py-2 rounded-lg border font-bold bg-white focus-visible:outline-primary/70 ${
                        errors.eveningCowQty
                          ? 'border-red-500'
                          : 'border-slate-300'
                      }`}
                      min='0'
                      step='0.5'
                      type='number'
                      value={formData.eveningCowQty}
                      onChange={(event) =>
                        handleQuantityChange(
                          'eveningCowQty',
                          event.target.value,
                        )
                      }
                    />
                  </div>
                  {errors.eveningCowQty && (
                    <p className='text-xs text-red-600'>
                      {errors.eveningCowQty}
                    </p>
                  )}
                </div>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <label className='text-sm font-medium text-[#637588]'>
                      Buffalo Milk (Liters)
                    </label>
                  </div>
                  <div className='flex items-center'>
                    <input
                      className={`w-full pl-7 pr-3 py-2 rounded-lg border font-bold bg-white focus-visible:outline-primary/70 ${
                        errors.eveningBuffaloQty
                          ? 'border-red-500'
                          : 'border-slate-300'
                      }`}
                      min='0'
                      step='0.5'
                      type='number'
                      value={formData.eveningBuffaloQty}
                      onChange={(event) =>
                        handleQuantityChange(
                          'eveningBuffaloQty',
                          event.target.value,
                        )
                      }
                    />
                  </div>
                  {errors.eveningBuffaloQty && (
                    <p className='text-xs text-red-600'>
                      {errors.eveningBuffaloQty}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
       
        <div className='fixed bottom-0 left-0 md:left-64 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-end items-center gap-4 z-10'>
          <button
            type='button'
            onClick={handleCancel}
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
