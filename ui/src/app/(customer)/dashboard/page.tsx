'use client';
import ContentLayout from '../../../components/layout';
import DeliveryCalendar from '../../../components/Customer/calender';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import AddExtraMilkModal from '../../../components/modal/customer/add-extra-milk';
import ScheduleVacation from '../../../components/modal/customer/schedule-vacation';
import { UserContext } from '../../../app/context/user-context';
import DeActivateOwnerModal from '../../../components/modal/customer/deactivate-owner';
import { getUpcomingCustomerActivity } from '../../../lib/customerOwner';
import { getCustomerMonthlySummary } from '../../../lib/daily-milk';
import type { UpcomingCustomerActivity } from '../../../types';
import Loader from '../../../components/loader';
import Button from '../../../components/ui/button';

const defaultMilkSummary = {
  totalCowQty: 0,
  totalBuffaloQty: 0,
  totalLiters: 0,
  totalAmount: 0,
};

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [upcoming, setUpcoming] = useState<UpcomingCustomerActivity>({
    extras: [],
    vacations: [],
  });
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [dailyMilkSummary, setDailyMilkSummary] = useState<{
    totalCowQty: number;
    totalBuffaloQty: number;
    totalLiters: number;
    totalAmount: number;
  }>(defaultMilkSummary);

  const [openExtraMilkModal, setOpenExtraMilkModal] = useState<boolean>(false);
  const [openScheduleVacation, setOpenScheduleVacation] =
    useState<boolean>(false);

  const [customerOwnerId, setCustomerOwnerId] = useState<number | null>(null);
  const lastAutoFetchedOwnerIdRef = useRef<number | null>(null);

  const fetchUpcoming = useCallback(async () => {
    if (!user?.currentActiveOwner?.id) {
      setUpcoming({ extras: [], vacations: [] });
      return;
    }

    setUpcomingLoading(true);
    try {
      const data = await getUpcomingCustomerActivity(
        user.currentActiveOwner.id,
      );
      setUpcoming(data);
    } catch (error) {
      console.error('Failed to fetch upcoming customer activity:', error);
    } finally {
      setUpcomingLoading(false);
    }
  }, [user?.currentActiveOwner?.id]);

  const fetchMonthlySummary = useCallback(async () => {
    if (!user?.currentActiveOwner?.id) {
      setDailyMilkSummary(defaultMilkSummary);
      return;
    }

    setSummaryLoading(true);
    try {
      const now = new Date();
      const monthValue = new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), 1),
      )
        .toISOString()
        .slice(0, 10);

      const data = await getCustomerMonthlySummary(user.currentActiveOwner.id, {
        month: monthValue,
      });

      setDailyMilkSummary({
        totalAmount: data.totalAmount ?? 0,
        totalBuffaloQty: data.totalBuffaloQty ?? 0,
        totalCowQty: data.totalCowQty ?? 0,
        totalLiters: data.totalLiters ?? 0,
      });
    } catch (error) {
      console.error('Failed to fetch monthly summary:', error);
      setDailyMilkSummary(defaultMilkSummary);
    } finally {
      setSummaryLoading(false);
    }
  }, [user?.currentActiveOwner?.id]);

  useEffect(() => {
    const ownerId = user?.currentActiveOwner?.id ?? null;

    if (!ownerId) {
      lastAutoFetchedOwnerIdRef.current = null;
      setUpcoming({ extras: [], vacations: [] });
      setDailyMilkSummary(defaultMilkSummary);

      return;
    }

    if (lastAutoFetchedOwnerIdRef.current === ownerId) {
      return;
    }

    lastAutoFetchedOwnerIdRef.current = ownerId;
    fetchUpcoming();
    fetchMonthlySummary();
  }, [fetchMonthlySummary, fetchUpcoming, user?.currentActiveOwner?.id]);

  const formatDate = (value: string) =>
    new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const formatSlot = (slot: string | null) =>
    slot ? slot[0].toUpperCase() + slot.slice(1) : '-';

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);

  const formatLiters = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
    }).format(value);

  if (summaryLoading) {
    return <Loader variant='screen' />;
  }

  return (
    <ContentLayout title='Dashboard Overview'>
      <div className='flex-1 space-y-8 flex flex-col xl:flex-row gap-4'>
        <div className='flex-1'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
            <div className='bg-white p-6 rounded-2xl border border-slate-200  shadow-sm'>
              <div className='flex justify-between items-start mb-4'>
                <span className='text-slate-500 text-sm font-medium uppercase tracking-wider'>
                  Liters This Month
                </span>
                <div className='p-2 bg-blue-50 text-blue-600 rounded-lg'>
                  <span className='material-symbols-outlined leading-none'>
                    opacity
                  </span>
                </div>
              </div>
              <div className='flex  justify-between items-center'>
                <p className='text-4xl font-bold'>
                  {`${formatLiters(dailyMilkSummary.totalLiters)}L`}
                </p>
                <div>
                  <p className='text-sm text-slate-500'>
                    Total cow qty:{' '}
                    {`${formatLiters(dailyMilkSummary.totalCowQty)}L`}
                  </p>
                  <p className='text-sm text-slate-500'>
                    Total buffalo qty:{' '}
                    {`${formatLiters(dailyMilkSummary.totalBuffaloQty)}L`}
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-white  p-6 rounded-2xl border border-slate-200  shadow-sm'>
              <div className='flex justify-between items-start mb-4'>
                <span className='text-slate-500 text-sm font-medium uppercase tracking-wider'>
                  Current Bill
                </span>
                <div className='p-2 bg-green-50  text-green-600 rounded-lg'>
                  <span className='material-symbols-outlined leading-none'>
                    payments
                  </span>
                </div>
              </div>
              <p className='text-4xl font-bold'>
                {formatCurrency(dailyMilkSummary.totalAmount)}
              </p>
            </div>
          </div>

          <DeliveryCalendar
            customerSetting={user?.customerSettings}
            customerOwnerId={user?.currentActiveOwner?.id}
          />
        </div>

        <aside className='w-full xl:w-90 flex flex-col gap-6 shrink-0'>
          <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-slate-500 mb-4'>
              Quick Actions
            </h3>
            <div className='space-y-3'>
              <Button
                variant='ghost-primary'
                className='w-full flex items-center justify-between p-3 rounded-xl transition-all group'
                onClick={() => setOpenExtraMilkModal(true)}
              >
                <div className='flex items-center gap-3'>
                  <span className='material-symbols-outlined text-xl'>
                    add_circle
                  </span>
                  <span className='text-sm font-semibold'>
                    Add Extra for a Date
                  </span>
                </div>
                <span className='material-symbols-outlined text-sm opacity-0 group-hover:opacity-100'>
                  chevron_right
                </span>
              </Button>

              <Button
                variant='ghost-primary'
                className='w-full flex items-center justify-between p-3 rounded-xl transition-all group'
                onClick={() => setOpenScheduleVacation(true)}
              >
                <div className='flex items-center gap-3'>
                  <span className='material-symbols-outlined text-xl'>
                    event_busy
                  </span>
                  <span className='text-sm font-semibold'>
                    Schedule Vacation
                  </span>
                </div>
                <span className='material-symbols-outlined text-sm opacity-0 group-hover:opacity-100'>
                  chevron_right
                </span>
              </Button>
            </div>
          </div>
          <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm'>
            <div className='space-y-6'>
              <h3 className='text-sm font-bold uppercase tracking-wider text-slate-500 mb-4'>
                Your Milkman
              </h3>

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
                    <span className='material-symbols-outlined'>person</span>
                  </div>
                  <div>
                    <p className='text-sm font-bold'>
                      {user?.currentActiveOwner?.ownerFullName}
                    </p>
                    <p className='text-[10px] text-slate-500'>
                      +91 {user?.currentActiveOwner?.ownerMobileNumber}
                    </p>
                  </div>
                </div>
                <Button
                  variant='soft-primary'
                  className='p-2 rounded-full transition-colors h-10 w-10'
                >
                  <span className='material-symbols-outlined text-xl'>
                    call
                  </span>
                </Button>
              </div>

              <Button
                variant='danger-outline'
                className='w-full mt-4 py-2 px-4 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2'
                onClick={() =>
                  setCustomerOwnerId(user?.currentActiveOwner?.id || null)
                }
              >
                <span className='material-symbols-outlined text-sm'>
                  person_remove
                </span>
                Deactivate Owner
              </Button>
            </div>
          </div>
          <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-slate-500 mb-4'>
              Upcoming Plans
            </h3>

            {upcomingLoading ? (
              <div className='flex items-center justify-center'>
                <Loader />
              </div>
            ) : (
              <div className='space-y-5'>
                <div>
                  <p className='text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2'>
                    Upcoming Extras
                  </p>

                  {upcoming.extras.length === 0 ? (
                    <p className='text-xs text-slate-400'>
                      No upcoming extra milk requests.
                    </p>
                  ) : (
                    <div className='space-y-2'>
                      {upcoming.extras.map((item) => (
                        <div className='flex items-center gap-3' key={item.id}>
                          <div className='size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary'>
                            <span className='material-symbols-outlined text-lg'>
                              add_circle
                            </span>
                          </div>
                          <div>
                            <p className='text-sm font-semibold'>
                              {item.cowQty ? `+ ${item.cowQty}L Cow ` : ''}
                              {item.buffaloQty
                                ? `+ ${item.buffaloQty}L Buffalo`
                                : ''}
                            </p>
                            <p className='text-[10px] text-slate-500'>
                              {formatDate(item.deliveryDate)} •{' '}
                              {formatSlot(item.slot)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className='text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2'>
                    Upcoming Vacations
                  </p>

                  {upcoming.vacations.length === 0 ? (
                    <p className='text-xs text-slate-400'>
                      No upcoming vacations.
                    </p>
                  ) : (
                    <div className='space-y-2'>
                      {upcoming.vacations.map((item) => (
                        <div className='flex items-center gap-3' key={item.id}>
                          <div className='size-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600'>
                            <span className='material-symbols-outlined text-lg'>
                              event_busy
                            </span>
                          </div>
                          <div>
                            <p className='text-sm font-semibold'>
                              Vacation Pause
                            </p>
                            <p className='text-[10px] text-slate-500'>
                              {formatDate(item.startDate)}{' '}
                              {formatSlot(item.startSlot)} -{' '}
                              {item.endDate ? formatDate(item.endDate) : '-'}{' '}
                              {formatSlot(item.endSlot)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
      {openExtraMilkModal && (
        <AddExtraMilkModal
          open={openExtraMilkModal}
          onClose={() => setOpenExtraMilkModal(false)}
          onSuccess={fetchUpcoming}
        />
      )}

      {openScheduleVacation && (
        <ScheduleVacation
          open={openScheduleVacation}
          onClose={() => setOpenScheduleVacation(false)}
          onSuccess={fetchUpcoming}
        />
      )}

      {customerOwnerId && (
        <DeActivateOwnerModal
          open={!!customerOwnerId}
          onClose={() => setCustomerOwnerId(null)}
          customerOwnerId={customerOwnerId}
        />
      )}
    </ContentLayout>
  );
};

export default Dashboard;
