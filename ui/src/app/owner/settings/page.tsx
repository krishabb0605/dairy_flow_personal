'use client';

import { type FormEvent, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Mandatory } from '../../../app/page';
import { UserContext } from '../../../app/context/user-context';

import ContentLayout from '../../../components/layout';
import Loader from '../../../components/loader';
import Button from '../../../components/ui/button';

import type {
  OwnerSettingsFormData,
  OwnerSettingsFormErrors,
  OwnerSettingsMilkConfigState,
  User,
} from '../../../utils/types';
import { FALLBACK_OWNER_PROFILE_IMAGE } from '../../../utils/constants';

import { updateOwnerSettings } from '../../../lib/users';

import { useCloudinaryImageUpload } from '../../../hooks/use-cloudinary-image-upload';

const buildInitialFormData = (user: User | null): OwnerSettingsFormData => ({
  fullName: user?.fullName ?? '',
  dairyName: user?.ownerSettings?.dairyName ?? '',
  email: user?.email ?? '',
  mobileNumber: user?.mobileNumber ?? '',
  address: user?.address ?? '',

  morningStartTime: toTimeInputValue(user?.ownerSettings?.morningStart),
  morningEndTime: toTimeInputValue(user?.ownerSettings?.morningEnd),
  eveningStartTime: toTimeInputValue(user?.ownerSettings?.eveningStart),
  eveningEndTime: toTimeInputValue(user?.ownerSettings?.eveningEnd),

  upiId: user?.ownerSettings?.upiId ?? '',
  bankName: user?.ownerSettings?.bankName ?? '',
  accountNumber: user?.ownerSettings?.accountNumber ?? '',
  ifscCode: user?.ownerSettings?.ifscCode ?? '',
});

const buildInitialProfileImage = (user: User | null): string => {
  return user?.profileImageUrl ?? FALLBACK_OWNER_PROFILE_IMAGE;
};

const toTimeInputValue = (value?: string | null): string => {
  if (!value) return '';
  const plainMatch = value.match(/^(\d{2}:\d{2})/);
  if (plainMatch) return plainMatch[1];
  const isoMatch = value.match(/T(\d{2}:\d{2})/);
  if (isoMatch) return isoMatch[1];
  return '';
};

const buildInitialDeliveryData = (
  user: User | null,
): OwnerSettingsMilkConfigState => ({
  cow: {
    enabled: user?.ownerSettings?.cowEnabled ?? false,
    price: Number(user?.ownerSettings?.cowPrice) ?? 0,
  },
  buffalo: {
    enabled: user?.ownerSettings?.buffaloEnabled ?? false,
    price: Number(user?.ownerSettings?.buffaloPrice) ?? 0,
  },
});

const validateForm = (data: OwnerSettingsFormData): OwnerSettingsFormErrors => {
  const errors: OwnerSettingsFormErrors = {};
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
  const accountNumberRegex = /^\d{9,18}$/;
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

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

  if (!data.dairyName.trim() || data.dairyName.trim().length < 2) {
    errors.dairyName = 'Dairy name must have at least 2 characters.';
  }

  if (!data.address.trim() || data.address.trim().length < 5) {
    errors.address = 'Address must have at least 5 characters.';
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
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState(buildInitialFormData(user));
  const [milkConfig, setMilkConfig] = useState<OwnerSettingsMilkConfigState>(
    buildInitialDeliveryData(user),
  );
  const [errors, setErrors] = useState<OwnerSettingsFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const {
    fileInputRef,
    imageUrl: profileImageUrl,
    uploadError,
    isUploading: isUploadingImage,
    openFilePicker: triggerImagePicker,
    onFileInputChange: handleProfileImageSelect,
    uploadPendingImage,
    removeImage: handleRemoveImage,
    resetImage,
  } = useCloudinaryImageUpload({
    initialImageUrl: buildInitialProfileImage(user),
    fallbackImageUrl: FALLBACK_OWNER_PROFILE_IMAGE,
  });

  useEffect(() => {
    setFormData(buildInitialFormData(user));
    setMilkConfig(buildInitialDeliveryData(user));
    resetImage(buildInitialProfileImage(user));
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleChange = (field: keyof OwnerSettingsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (
      (milkConfig.cow.enabled && milkConfig.cow.price <= 0) ||
      (milkConfig.buffalo.enabled && milkConfig.buffalo.price <= 0)
    ) {
      toast.error('Milk price must be greater than 0 for enabled milk type.');
      return;
    }

    if (!user) {
      toast.error('User data not found');
      return;
    }

    const finalProfileImageUrl = await uploadPendingImage();
    if (!finalProfileImageUrl) {
      return;
    }

    try {
      setIsSaving(true);
      const updatedUser = await updateOwnerSettings(user.id, {
        fullName: formData.fullName.trim(),
        address: formData.address.trim(),
        profileImageUrl: finalProfileImageUrl,
        dairyName: formData.dairyName.trim(),
        cowEnabled: milkConfig.cow.enabled,
        cowPrice: milkConfig.cow.enabled ? Number(milkConfig.cow.price) : 0,
        buffaloEnabled: milkConfig.buffalo.enabled,
        buffaloPrice: milkConfig.buffalo.enabled
          ? Number(milkConfig.buffalo.price)
          : 0,
        morningStart: formData.morningStartTime,
        morningEnd: formData.morningEndTime,
        eveningStart: formData.eveningStartTime,
        eveningEnd: formData.eveningEndTime,
        upiId: formData.upiId.trim() || null,
        bankName: formData.bankName.trim() || null,
        accountNumber: formData.accountNumber.trim() || null,
        ifscCode: formData.ifscCode.trim().toUpperCase() || null,
      });

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update owner settings:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update owner settings',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setFormData(buildInitialFormData(user));
    setMilkConfig(buildInitialDeliveryData(user));
    resetImage(buildInitialProfileImage(user));
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
            <input
              ref={fileInputRef}
              type='file'
              accept='image/png,image/jpeg,image/jpg'
              className='hidden'
              onChange={handleProfileImageSelect}
            />
            <div className='relative'>
              <div
                className='size-24 rounded-full border-4 border-[#f0f2f4] bg-center bg-no-repeat bg-cover'
                style={{
                  backgroundImage: `url("${profileImageUrl}")`,
                }}
              ></div>
              <Button
                type='button'
                onClick={triggerImagePicker}
                disabled={isUploadingImage}
                variant='primary'
                className='absolute bottom-0 right-0 size-8 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600'
              >
                <span className='material-symbols-outlined text-sm'>
                  {isUploadingImage ? 'progress_activity' : 'photo_camera'}
                </span>
              </Button>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-sm font-bold'>Profile Picture</p>
              <p className='text-xs text-[#637588]'>PNG or JPG up to 5MB</p>
              {uploadError && (
                <p className='text-xs text-red-600'>{uploadError}</p>
              )}
              <div className='flex gap-2 mt-2'>
                <Button
                  type='button'
                  onClick={triggerImagePicker}
                  disabled={isUploadingImage}
                  variant='link'
                  className='text-xs font-bold'
                >
                  {isUploadingImage ? 'Uploading...' : 'Change'}
                </Button>
                <Button
                  type='button'
                  onClick={handleRemoveImage}
                  disabled={isUploadingImage}
                  variant='link-danger'
                  className='text-xs font-bold'
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <div className='p-6 space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  Dairy Name <Mandatory />
                </label>
                <input
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${
                    errors.dairyName
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                  }`}
                  type='text'
                  value={formData.dairyName}
                  onChange={(event) =>
                    handleChange('dairyName', event.target.value)
                  }
                />
                {errors.dairyName && (
                  <p className='mt-1 text-xs text-red-600'>
                    {errors.dairyName}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#637588]'>
                  Mobile Number <Mandatory />
                </label>
                <input
                  className='form-input flex w-full rounded-lg text-slate-500 border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none cursor-not-allowed'
                  type='email'
                  value={'+91 ' + formData.mobileNumber}
                  disabled
                />
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
                <Button
                  type='button'
                  variant='link'
                  className='text-sm font-bold'
                >
                  Detect Current Location
                </Button>
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

          <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-8'>
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
                  <span className='text-sm text-slate-600'>
                    Price per Liter
                  </span>
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
                  <span className='text-sm text-slate-600'>
                    Price per Liter
                  </span>
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
                  placeholder='johndairy@okaxis'
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
                  Bank Name <Mandatory />
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
                  placeholder='HDFC Bank'
                />
                {errors.bankName && (
                  <p className='mt-1 text-xs text-red-600'>{errors.bankName}</p>
                )}
              </div>
              <div className='md:col-span-1'>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  Account Number <Mandatory />
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
                  placeholder='4242 4242 4242'
                />
                {errors.accountNumber && (
                  <p className='mt-1 text-xs text-red-600'>
                    {errors.accountNumber}
                  </p>
                )}
              </div>
              <div className='md:col-span-1'>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  IFSC Code <Mandatory />
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
                  placeholder='HDFC0001234'
                />
                {errors.ifscCode && (
                  <p className='mt-1 text-xs text-red-600'>{errors.ifscCode}</p>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Sticky Footer Action --> */}
        <div className='fixed bottom-0 left-0 md:left-64 right-0 p-6 bg-blue-50 backdrop-blur-md border-t border-slate-200 flex justify-end items-center gap-4 z-10'>
          <div className='flex items-center gap-4 w-full md:w-[50%]'>
            <Button
              type='button'
              onClick={handleDiscardChanges}
              disabled={isSaving || isUploadingImage}
              variant='outline-muted'
              className='px-6 py-3 rounded-lg text-sm font-semibold transition-colors flex-1'
            >
              Discard Changes
            </Button>
            <Button
              type='submit'
              disabled={isSaving || isUploadingImage}
              variant='primary'
              className='px-10 py-3 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-95 transition-all flex items-center justify-center gap-2 flex-1'
            >
              {isSaving || isUploadingImage ? (
                <Loader color='white' size={22} />
              ) : (
                <>
                  <span className='material-symbols-outlined text-[18px]'>
                    save
                  </span>
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </ContentLayout>
  );
};

export default Settings;
