'use client';
import { UserContext } from '../../../app/context/user-context';
import { Mandatory } from '../../../app/page';
import ContentLayout from '../../../components/layout';
import { useContext } from 'react';

const Settings = () => {
  const { user } = useContext(UserContext);

  return (
    <ContentLayout title='Settings & Profile'>
      <div className='flex-1 space-y-6'>
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
                <button className='absolute bottom-0 right-0 size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600'>
                  <span className='material-symbols-outlined text-sm'>
                    photo_camera
                  </span>
                </button>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='text-sm font-bold'>Profile Picture</p>
                <p className='text-xs text-[#637588]'>PNG or JPG up to 5MB</p>
                <div className='flex gap-2 mt-2'>
                  <button className='text-xs font-bold text-primary hover:underline'>
                    Change
                  </button>
                  <button className='text-xs font-bold text-red-500 hover:underline'>
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
                  className='form-input flex w-full rounded-lg text-[#0d141b] border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                  type='text'
                  value={user?.fullName}
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#637588]'>
                  Customer ID <Mandatory />
                </label>
                <input
                  className='form-input flex w-full rounded-lg text-slate-500 border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none cursor-not-allowed'
                  type='text'
                  value={user?.customerProfile?.customerCode}
                  disabled
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#637588]'>
                  Mobile Number <Mandatory />
                </label>
                <input
                  className='form-input flex w-full rounded-lg text-[#0d141b] border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                  type='tel'
                  value={user?.mobileNumber}
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#637588]'>
                  Email <Mandatory />
                </label>
                <input
                  className='form-input flex w-full rounded-lg text-slate-500 border border-[#cfdbe7] bg-slate-50 h-12 placeholder:text-blue-placeholder px-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none cursor-not-allowed'
                  type='tel'
                  value={user?.email}
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
                  className='form-input flex w-full rounded-lg text-[#0d141b] border border-[#cfdbe7] bg-slate-50 placeholder:text-blue-placeholder p-4 text-sm font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                  rows={3}
                >
                  {user?.address}
                </textarea>
              </div>
              <div className='flex items-center gap-2'>
                <span className='material-symbols-outlined text-primary text-sm'>
                  location_on
                </span>
                <button className='text-sm text-primary font-bold hover:underline'>
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
                      className='w-full pl-7 pr-3 py-2 rounded-lg border font-bold bg-white border-slate-300 focus-visible:outline-primary/70'
                      placeholder='0.0'
                      step='0.5'
                      type='number'
                      min={0}
                      value={user?.customerProfile?.morningCowQty}
                    />
                  </div>
                </div>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <label className='text-sm font-medium text-[#637588]'>
                      Buffalo Milk (Liters)
                    </label>
                  </div>
                  <div className='flex items-center'>
                    <input
                      className='w-full pl-7 pr-3 py-2 rounded-lg border font-bold bg-white border-slate-300 focus-visible:outline-primary/70'
                      placeholder='0.0'
                      min='0'
                      step='0.5'
                      type='number'
                      value={user?.customerProfile?.eveningCowQty}
                    />
                  </div>
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
                      className='w-full pl-7 pr-3 py-2 rounded-lg border font-bold bg-white border-slate-300 focus-visible:outline-primary/70'
                      min='0'
                      step='0.5'
                      type='number'
                      value={user?.customerProfile?.morningBuffaloQty}
                    />
                  </div>
                </div>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <label className='text-sm font-medium text-[#637588]'>
                      Buffalo Milk (Liters)
                    </label>
                  </div>
                  <div className='flex items-center'>
                    <input
                      className='w-full pl-7 pr-3 py-2 rounded-lg border font-bold bg-white border-slate-300 focus-visible:outline-primary/70'
                      min='0'
                      step='0.5'
                      type='number'
                      value={user?.customerProfile?.eveningBuffaloQty}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className='flex justify-end pt-4 pb-12'>
          <div className='flex gap-3'>
            <button className='px-6 py-2.5 rounded-lg text-sm font-bold text-[#637588] hover:bg-gray-100  transition-colors'>
              Cancel
            </button>
            <button className='bg-primary text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-blue-600 transition-all'>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default Settings;
