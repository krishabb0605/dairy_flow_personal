'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import CustomerBillingHistory from '../../../../components/admin/customer-tab/billing-history';
import CustomerDeliveryHistory from '../../../../components/admin/customer-tab/delivery-history';
import CustomerOverView from '../../../../components/admin/customer-tab/overview';
import ContentLayout from '../../../../components/layout';
import Button from '../../../../components/ui/button';
import Loader from '../../../../components/loader';

import { FALLBACK_CUSTOMER_PROFILE_IMAGE } from '../../../../utils/constants';
import type { OwnerCustomerProfile, OwnerCustomerTab } from '../../../../utils/types';

import { getCustomerProfile } from '../../../../lib/customerSettings';

const OwnerCustomerProfilePage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<OwnerCustomerTab>('overview');
  const [customer, setCustomer] = useState<OwnerCustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomer = async () => {
      const customerOwnerId = Number(params.id);

      if (!Number.isFinite(customerOwnerId)) {
        setLoadError('Invalid customer id.');
        setCustomer(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getCustomerProfile(customerOwnerId);
        setCustomer(data ?? null);
        setLoadError(null);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Failed to load customer.';
        setLoadError(message);
        toast.error(message);
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [params.id]);

  if (loading) {
    return <Loader variant='screen' />;
  }

  if (!customer) {
    return (
      <ContentLayout title='Customer Profile'>
        <div className='bg-white rounded-xl border border-primary/10 p-6 shadow-sm space-y-4'>
          <p className='text-sm text-slate-600'>
            {loadError || 'Customer not found.'}
          </p>
          <Link
            href='/owner/customers'
            className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90'
          >
            <span className='material-symbols-outlined text-base'>
              arrow_back
            </span>
            Back to Customers
          </Link>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title='Customer Profile'
      description={`Customers > ${customer.name} > ${activeTab}`}
    >
      <div className='space-y-4'>
        <main className='flex-1 flex flex-col overflow-y-auto'>
          {/* <!-- Header Profile Section --> */}
          <header className='bg-white border-b border-slate-200 p-4'>
            <div className='flex justify-between items-start lg:items-center flex-col-reverse lg:flex-row'>
              <div className='flex flex-col @[520px]:flex-row justify-between items-start @[520px]:items-center gap-6'>
                <div className='flex items-center gap-6'>
                  <div className='relative'>
                    <div
                      className='w-24 h-24 rounded-2xl bg-slate-100 border-4 border-white shadow-sm bg-cover bg-center'
                      style={{
                        backgroundImage: `url("${customer.avatar || FALLBACK_CUSTOMER_PROFILE_IMAGE}")`,
                      }}
                    ></div>
                    <div className='absolute -bottom-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white uppercase'>
                      {customer.status}
                    </div>
                  </div>
                  <div>
                    <div className='flex items-center gap-3 mb-1'>
                      <h2 className='text-2xl font-bold text-slate-900'>
                        {customer.name}
                      </h2>
                    </div>
                    <div className='flex items-center gap-4 text-sm text-slate-500'>
                      <span className='flex items-center gap-1.5'>
                        <span className='material-symbols-outlined text-lg'>
                          calendar_today
                        </span>{' '}
                        Joined Oct 12, 2023
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant='primary'
                className='flex lg:items-center self-end lg:self-auto gap-2 rounded-xl px-5 py-2 text-sm font-bold transition-all shadow-md'
                onClick={() => router.push('/owner/customers')}
              >
                <span className='material-symbols-outlined text-[18px]'>
                  arrow_back
                </span>
                Back to Profile
              </Button>
            </div>

            {/* <!-- Tabs --> */}
          </header>
          <div className=' mt-8 flex border-b border-slate-100'>
            <Button
              type='button'
              onClick={() => setActiveTab('overview')}
              variant='ghost-list'
              className={`px-6 py-3 text-sm transition-colors flex-1 ${
                activeTab === 'overview'
                  ? 'font-bold text-slate-900 border-b-2 border-primary'
                  : 'font-medium text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview
            </Button>
            <Button
              type='button'
              onClick={() => setActiveTab('delivery-history')}
              variant='ghost-list'
              className={`px-6 py-3 text-sm transition-colors flex-1 ${
                activeTab === 'delivery-history'
                  ? 'font-bold text-slate-900 border-b-2 border-primary'
                  : 'font-medium text-slate-500 hover:text-slate-800'
              }`}
            >
              Delivery History
            </Button>
            <Button
              type='button'
              onClick={() => setActiveTab('billing-history')}
              variant='ghost-list'
              className={`px-6 py-3 text-sm transition-colors flex-1 ${
                activeTab === 'billing-history'
                  ? 'font-bold text-slate-900 border-b-2 border-primary'
                  : 'font-medium text-slate-500 hover:text-slate-800'
              }`}
            >
              Billing History
            </Button>
          </div>

          {activeTab === 'overview' && (
            <CustomerOverView
              profile={customer}
              customerOwnerId={customer.id}
            />
          )}
          {activeTab === 'delivery-history' && (
            <CustomerDeliveryHistory customerOwnerId={customer.id} />
          )}
          {activeTab === 'billing-history' && <CustomerBillingHistory />}
        </main>
      </div>
    </ContentLayout>
  );
};

export default OwnerCustomerProfilePage;
