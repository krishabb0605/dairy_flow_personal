'use client';
import { UserContext } from '../../../app/context/user-context';
import { Mandatory } from '../../../app/page';
import ContentLayout from '../../../components/layout';
import { type FormEvent, useContext, useEffect, useState } from 'react';
import {
  type CustomerSettingsFormData,
  type CustomerSettingsFormErrors,
  type User,
} from '../../../types';
import { useCloudinaryImageUpload } from '../../../hooks/use-cloudinary-image-upload';
import { FALLBACK_CUSTOMER_PROFILE_IMAGE } from '../../../constants';
import { updateCustomerSettings } from '../../../lib/users';
import { toast } from 'react-toastify';
import Loader from '../../../components/loader';

const buildInitialFormData = (user: User | null): CustomerSettingsFormData => ({
  fullName: user?.fullName ?? '',
  mobileNumber: user?.mobileNumber ?? '',
  email: user?.email ?? '',
  address: user?.address ?? '',
  morningCowQty: String(user?.customerSettings?.morningCowQty ?? '0'),
  morningBuffaloQty: String(user?.customerSettings?.morningBuffaloQty ?? '0'),
  eveningCowQty: String(user?.customerSettings?.eveningCowQty ?? '0'),
  eveningBuffaloQty: String(user?.customerSettings?.eveningBuffaloQty ?? '0'),
});

const buildInitialProfileImage = (user: User | null): string => {
  return user?.profileImageUrl ?? FALLBACK_CUSTOMER_PROFILE_IMAGE;
};

const validateForm = (
  data: CustomerSettingsFormData,
): CustomerSettingsFormErrors => {
  const errors: CustomerSettingsFormErrors = {};

  if (!data.fullName.trim() || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must have at least 2 characters.';
  }

  if (!data.address.trim() || data.address.trim().length < 5) {
    errors.address = 'Address must have at least 5 characters.';
  }

  const quantityFields: Array<keyof CustomerSettingsFormData> = [
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
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState<CustomerSettingsFormData>(
    buildInitialFormData(user),
  );
  const [errors, setErrors] = useState<CustomerSettingsFormErrors>({});
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
    fallbackImageUrl: FALLBACK_CUSTOMER_PROFILE_IMAGE,
  });

  useEffect(() => {
    setFormData(buildInitialFormData(user));
    resetImage(buildInitialProfileImage(user));
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleChange = (field: keyof CustomerSettingsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('Customer settings validation errors:', validationErrors);
      return;
    }

    const finalProfileImageUrl = await uploadPendingImage();
    if (!finalProfileImageUrl) {
      return;
    }

    if (!user) {
      toast.error('User data not found');
      return;
    }

    try {
      setIsSaving(true);
      const updatedUser = await updateCustomerSettings(user.id, {
        fullName: formData.fullName.trim(),
        address: formData.address.trim(),
        profileImageUrl: finalProfileImageUrl,
        morningCowQty: Number(formData.morningCowQty || 0),
        morningBuffaloQty: Number(formData.morningBuffaloQty || 0),
        eveningCowQty: Number(formData.eveningCowQty || 0),
        eveningBuffaloQty: Number(formData.eveningBuffaloQty || 0),
      });

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update customer settings:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update customer settings',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(buildInitialFormData(user));
    resetImage(buildInitialProfileImage(user));
    setErrors({});
  };

  const handleQuantityChange = (
    field: keyof CustomerSettingsFormData,
    value: string,
  ) => {
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
                <button
                  type='button'
                  onClick={triggerImagePicker}
                  disabled={isUploadingImage}
                  className='absolute bottom-0 right-0 size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600'
                >
                  <span className='material-symbols-outlined text-sm'>
                    {isUploadingImage ? 'progress_activity' : 'photo_camera'}
                  </span>
                </button>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='text-sm font-bold'>Profile Picture</p>
                <p className='text-xs text-[#637588]'>PNG or JPG up to 5MB</p>
                {uploadError && (
                  <p className='text-xs text-red-600'>{uploadError}</p>
                )}
                <div className='flex gap-2 mt-2'>
                  <button
                    type='button'
                    onClick={triggerImagePicker}
                    disabled={isUploadingImage}
                    className='text-xs font-bold text-primary hover:underline'
                  >
                    {isUploadingImage ? 'Uploading...' : 'Change'}
                  </button>
                  <button
                    type='button'
                    onClick={handleRemoveImage}
                    disabled={isUploadingImage}
                    className='text-xs font-bold text-red-500 hover:underline'
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2 col-span-1 md:col-span-2'>
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

        <div className='fixed bottom-0 left-0 md:left-64 right-0 p-6 bg-blue-50 backdrop-blur-md flex justify-end items-center gap-4 z-10'>
          <div className='flex items-center gap-4 w-full md:w-[50%]'>
            <button
              type='button'
              onClick={handleCancel}
              disabled={isSaving || isUploadingImage}
              className='px-6 py-3 border border-slate-200 bg-white rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex-1'
            >
              Discard Changes
            </button>
            <button
              type='submit'
              disabled={isSaving || isUploadingImage}
              className='px-10 py-3 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-95 transition-all flex items-center justify-center gap-2 flex-1'
            >
              {(isSaving || isUploadingImage) ? (
                <Loader color='white' size={22} />
              ) : (
                <>
                  <span className='material-symbols-outlined text-[18px]'>
                    save
                  </span>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </ContentLayout>
  );
};

export default Settings;
