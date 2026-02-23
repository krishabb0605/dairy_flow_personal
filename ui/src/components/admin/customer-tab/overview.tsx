'use client';

import { useEffect, useRef, useState } from 'react';

import type {
  OwnerCustomerProfile,
  UpcomingCustomerActivity,
} from '../../../types';

import { getUpcomingCustomerActivity } from '../../../lib/customerOwner';

const formatDate = (dateValue: string) => {
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const CustomerOverView = ({
  profile,
  customerOwnerId,
}: {
  profile: OwnerCustomerProfile | null;
  customerOwnerId: number;
}) => {
  const phone = profile?.phone ? `+91 ${profile.phone}` : '-';
  const email = profile?.email || '-';
  const address = profile?.address || '-';
  const morningCowQty = profile?.morningCowQty ?? 0;
  const morningBuffaloQty = profile?.morningBuffaloQty ?? 0;
  const eveningCowQty = profile?.eveningCowQty ?? 0;
  const eveningBuffaloQty = profile?.eveningBuffaloQty ?? 0;
  const [activity, setActivity] = useState<UpcomingCustomerActivity>({
    extras: [],
    vacations: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const fetchUpcomingRef = useRef(false);

  useEffect(() => {
    const loadActivity = async () => {
      if (!customerOwnerId) {
        setActivity({ extras: [], vacations: [] });
        setLoading(false);
        return;
      }

      if (fetchUpcomingRef.current) return;
      fetchUpcomingRef.current = true;

      try {
        setLoading(true);
        const data = await getUpcomingCustomerActivity(customerOwnerId);
        setActivity({
          extras: Array.isArray(data?.extras) ? data.extras : [],
          vacations: Array.isArray(data?.vacations) ? data.vacations : [],
        });
        setLoadError(null);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to load upcoming activity.';
        setLoadError(message);
        setActivity({ extras: [], vacations: [] });
      } finally {
        setLoading(false);
        fetchUpcomingRef.current = false;
      }
    };

    loadActivity();
  }, [customerOwnerId]);

  return (
    <div className='pt-8  w-full grid grid-cols-1 lg:grid-cols-3 gap-8'>
      {/* <!-- Left Column: Personal Info & Plans --> */}
      <div className='lg:col-span-2 space-y-8'>
        {/* <!-- Section: Personal Information --> */}
        <section>
          <div className='flex items-center gap-2 mb-4'>
            <span className='material-symbols-outlined text-slate-400'>
              person
            </span>
            <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider'>
              Personal Information
            </h3>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='bg-white p-4 rounded-xl border border-slate-100 shadow-sm'>
              <p className='text-[10px] font-bold text-slate-400 uppercase mb-1'>
                Phone Number
              </p>
              <p className='text-sm font-medium text-slate-900'>{phone}</p>
            </div>
            <div className='bg-white p-4 rounded-xl border border-slate-100 shadow-sm'>
              <p className='text-[10px] font-bold text-slate-400 uppercase mb-1'>
                Email Address
              </p>
              <p className='text-sm font-medium text-slate-900'>{email}</p>
            </div>
            <div className='bg-white p-4 rounded-xl border border-slate-100 shadow-sm sm:col-span-2'>
              <p className='text-[10px] font-bold text-slate-400 uppercase mb-1'>
                Service Address
              </p>
              <p className='text-sm font-medium text-slate-900'>{address}</p>
            </div>
          </div>
        </section>
        {/* <!-- Section: Delivery Plan --> */}
        <section>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <span className='material-symbols-outlined text-slate-400'>
                calendar_month
              </span>
              <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider'>
                Default Delivery Plan
              </h3>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* <!-- Morning Shift --> */}
            <div className='bg-white  p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden'>
              <div className='absolute top-0 right-0 p-3 opacity-10'>
                <span className='material-symbols-outlined text-6xl'>
                  wb_sunny
                </span>
              </div>
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-2 bg-orange-50 text-orange-600 rounded-lg'>
                  <span className='material-symbols-outlined'>wb_sunny</span>
                </div>
                <p className='font-bold text-slate-900'>
                  Morning Shift (6:00 AM)
                </p>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between items-center p-3 bg-slate-50  rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='material-symbols-outlined text-primary'>
                      water_drop
                    </span>
                    <span className='text-sm font-medium'>Cow Milk</span>
                  </div>
                  <span className='text-lg font-bold text-primary'>
                    {morningCowQty.toFixed(1)} L
                  </span>
                </div>
                <div className='flex justify-between items-center p-3 bg-slate-50  rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='material-symbols-outlined text-primary'>
                      water_drop
                    </span>
                    <span className='text-sm font-medium'>Buffalo Milk</span>
                  </div>
                  <span className='text-lg font-bold text-primary'>
                    {morningBuffaloQty.toFixed(1)} L
                  </span>
                </div>
              </div>
            </div>
            {/* <!-- Evening Shift --> */}
            <div className='bg-white  p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden'>
              <div className='absolute top-0 right-0 p-3 opacity-10'>
                <span className='material-symbols-outlined text-6xl'>
                  dark_mode
                </span>
              </div>
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-2 bg-indigo-50  text-indigo-600 rounded-lg'>
                  <span className='material-symbols-outlined'>dark_mode</span>
                </div>
                <p className='font-bold text-slate-900'>
                  Evening Shift (6:00 PM)
                </p>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between items-center p-3 bg-slate-50  rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='material-symbols-outlined text-primary'>
                      water_drop
                    </span>
                    <span className='text-sm font-medium'>Cow Milk</span>
                  </div>
                  <span className='text-lg font-bold text-primary'>
                    {eveningCowQty.toFixed(1)} L
                  </span>
                </div>
                <div className='flex justify-between items-center p-3 bg-slate-50  rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='material-symbols-outlined text-primary'>
                      water_drop
                    </span>
                    <span className='text-sm font-medium'>Buffalo Milk</span>
                  </div>
                  <span className='text-lg font-bold text-primary'>
                    {eveningBuffaloQty.toFixed(1)} L
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <!-- Right Column: Extras & Billing --> */}
      <div className='space-y-8'>
        {/* <!-- Section: Upcoming Extras --> */}
        <section>
          <div className='flex items-center gap-2 mb-4'>
            <span className='material-symbols-outlined text-slate-400'>
              star
            </span>
            <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider'>
              Upcoming Extras
            </h3>
          </div>
          <div className='bg-white rounded-xl border border-slate-200 p-4'>
            {loading && (
              <p className='text-sm text-slate-500 text-center py-4'>
                Loading upcoming extras...
              </p>
            )}
            {!loading && loadError && (
              <p className='text-sm text-rose-500 text-center py-4'>
                {loadError}
              </p>
            )}
            {!loading && !loadError && activity.extras.length === 0 && (
              <div className='text-center py-4'>
                <div className='w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <span className='material-symbols-outlined text-slate-300'>
                    add_shopping_cart
                  </span>
                </div>
                <p className='text-sm font-medium text-slate-500'>
                  No extra requests scheduled.
                </p>
              </div>
            )}
            {!loading && !loadError && activity.extras.length > 0 && (
              <div className='space-y-3'>
                {activity.extras.map((extra) => (
                  <div
                    key={extra.id}
                    className='flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2'
                  >
                    <div>
                      <p className='text-xs font-bold text-slate-500 uppercase tracking-wide'>
                        {formatDate(extra.deliveryDate)} • {extra.slot}
                      </p>
                      <p className='text-sm font-semibold text-slate-900'>
                        Cow {extra.cowQty.toFixed(1)} L · Buffalo{' '}
                        {extra.buffaloQty.toFixed(1)} L
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* <!-- Section: Upcoming Vacations --> */}
        <section>
          <div className='flex items-center gap-2 mb-4'>
            <span className='material-symbols-outlined text-slate-400'>
              beach_access
            </span>
            <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider'>
              Upcoming Vacations
            </h3>
          </div>
          <div className='bg-white rounded-xl border border-slate-200 p-4'>
            {loading && (
              <p className='text-sm text-slate-500 text-center py-4'>
                Loading upcoming vacations...
              </p>
            )}
            {!loading && loadError && (
              <p className='text-sm text-rose-500 text-center py-4'>
                {loadError}
              </p>
            )}
            {!loading && !loadError && activity.vacations.length === 0 && (
              <div className='text-center py-4'>
                <div className='w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <span className='material-symbols-outlined text-slate-300'>
                    event_available
                  </span>
                </div>
                <p className='text-sm font-medium text-slate-500'>
                  No upcoming vacations scheduled.
                </p>
              </div>
            )}
            {!loading && !loadError && activity.vacations.length > 0 && (
              <div className='space-y-3'>
                {activity.vacations.map((vacation) => (
                  <div
                    key={vacation.id}
                    className='rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2'
                  >
                    <p className='text-sm text-slate-500 tracking-wide'>
                      • {formatDate(vacation.startDate)}{' '}
                      {`(${vacation.startSlot})`} -{' '}
                      {vacation.endDate
                        ? `${formatDate(vacation.endDate)} (${vacation.endSlot ?? ''})`
                        : 'Open ended'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CustomerOverView;
