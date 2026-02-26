'use client';

import Link from 'next/link';
import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { UserContext } from '../../context/user-context';

import ContentLayout from '../../../components/layout';
import Pagination from '../../../components/pagination';
import Loader from '../../../components/loader';
import Button from '../../../components/ui/button';
import { Table, TableBody, TableHead } from '../../../components/ui/table';

import { FALLBACK_CUSTOMER_PROFILE_IMAGE } from '../../../utils/constants';
import type { OwnerCustomer, OwnerCustomerStatusFilter } from '../../../utils/types';

import {
  createCustomerOwner,
  getOwnerCustomers,
} from '../../../lib/customerOwner';
import Badge from '../../../components/ui/badge';

const ITEMS_PER_PAGE = 3;

const formatQtyPair = (cowQty: number, buffaloQty: number) =>
  `${cowQty}L / ${buffaloQty}L`;

const OwnerCustomersPage = () => {
  const { user } = useContext(UserContext);
  const [mobileNumber, setMobileNumber] = useState('');
  const [page, setPage] = useState(1);
  const [customers, setCustomers] = useState<OwnerCustomer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [addCustomerLoading, setAddCustomerLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalMorningLiters, setTotalMorningLiters] = useState(0);
  const [totalEveningLiters, setTotalEveningLiters] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<OwnerCustomerStatusFilter>('all');

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(searchInput.trim());
  };

  const fetchCustomers = useCallback(async () => {
    const ownerId = user?.ownerSettings?.id;

    if (!ownerId) {
      setCustomers([]);
      setTotalPages(1);
      setTotalCustomers(0);
      setTotalMorningLiters(0);
      setTotalEveningLiters(0);
      setCustomersLoading(false);
      return;
    }

    try {
      setCustomersLoading(true);
      const data = await getOwnerCustomers({
        ownerId,
        page,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        status: statusFilter,
      });
      const formatted = data.customers.map((item) => ({
        ...item,
        phone: `+91 ${item.phone}`,
        avatar: item.avatar || FALLBACK_CUSTOMER_PROFILE_IMAGE,
      }));
      setCustomers(formatted);
      setTotalPages(data.totalPages);
      setTotalCustomers(data.totalCustomers);
      setTotalMorningLiters(data.totalMorningLiters);
      setTotalEveningLiters(data.totalEveningLiters);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch customers.';
      toast.error(message);
      setCustomers([]);
      setTotalPages(1);
      setTotalCustomers(0);
      setTotalMorningLiters(0);
      setTotalEveningLiters(0);
    } finally {
      setCustomersLoading(false);
    }
  }, [page, searchQuery, statusFilter, user?.ownerSettings?.id]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleAddCustomer = async () => {
    const ownerId = user?.ownerSettings?.id;

    if (!ownerId) {
      toast.error('Owner profile not found.');
      return;
    }

    const normalizedMobile = mobileNumber.trim();

    if (!/^\d{10}$/.test(normalizedMobile)) {
      toast.error('Enter a valid 10 digit mobile number.');
      return;
    }

    try {
      setAddCustomerLoading(true);
      await createCustomerOwner({
        ownerId,
        mobileNumber: normalizedMobile,
      });
      toast.success('Customer added successfully.');
      setMobileNumber('');
      if (page === 1) {
        await fetchCustomers();
      } else {
        setPage(1);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to add customer.';
      toast.error(message);
    } finally {
      setAddCustomerLoading(false);
    }
  };

  return (
    <ContentLayout
      title='Quick Customer Add'
      description='Enter a mobile number to add a new customer instantly.'
    >
      <div className='flex-1 space-y-6'>
        <div className='rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#f0f2f4] p-2 bg-white'>
          <h3 className='text-lg font-bold mb-4 flex items-center gap-2'>
            Recently Added Customers
          </h3>
          <div className='flex gap-5 flex-row items-center'>
            <div className='flex flex-col gap-2 flex-1'>
              <div className='relative'>
                <span className='absolute left-4 top-1/2 -translate-y-1/2 text-[#637588] font-medium'>
                  +91
                </span>
                <input
                  className='w-full pl-12 pr-4 py-3 rounded-lg border-[#f0f2f4] bg-slate-50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all'
                  placeholder='Mobile Number (e.g. 98765 43210)'
                  maxLength={10}
                  minLength={10}
                  type='tel'
                  name='mobileNumber'
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(e.target.value.replace(/\D/g, ''))
                  }
                  required
                />
              </div>
            </div>
            <Button
              variant='gradient'
              className='font-bold py-3 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 w-auto px-8 disabled:opacity-60 disabled:cursor-not-allowed min-w-51.25'
              onClick={handleAddCustomer}
            >
              {!addCustomerLoading ? (
                <>
                  <span className='material-symbols-outlined'>person_add</span>{' '}
                  Add Customer
                </>
              ) : (
                <Loader color='white' size={24} />
              )}
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white p-6 rounded-xl border border-primary/10 shadow-sm'>
            <p className='text-sm text-gray-500 font-medium'>Total Customers</p>
            <div className='flex items-end justify-between mt-1'>
              <h3 className='text-3xl font-black'>{totalCustomers}</h3>
            </div>
          </div>
          <div className='bg-white p-6 rounded-xl border border-primary/10 shadow-sm'>
            <p className='text-sm text-gray-500 font-medium'>
              Total Morning Liters
            </p>
            <div className='flex items-end justify-between mt-1'>
              <h3 className='text-3xl font-black'>
                {totalMorningLiters.toFixed(1)}
                <span className='text-lg font-normal'>L</span>
              </h3>
              <span className='material-symbols-outlined text-primary/60'>
                light_mode
              </span>
            </div>
          </div>
          <div className='bg-white p-6 rounded-xl border border-primary/10 shadow-sm'>
            <p className='text-sm text-gray-500 font-medium'>
              Total Evening Liters
            </p>
            <div className='flex items-end justify-between mt-1'>
              <h3 className='text-3xl font-black'>
                {totalEveningLiters.toFixed(1)}
                <span className='text-lg font-normal'>L</span>
              </h3>
              <span className='material-symbols-outlined text-primary/60'>
                dark_mode
              </span>
            </div>
          </div>
        </div>

        <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
          <div className='flex-1 w-full lg:w-auto rounded-full bg-white border border-[#d7e9ff] p-1 flex items-center overflow-hidden shadow-sm'>
            <div className='pl-3 pr-2 text-[#6a97c8] flex items-center justify-center'>
              <span className='material-symbols-outlined text-[22px] leading-none'>
                search
              </span>
            </div>
            <input
              className='flex-1 bg-transparent py-2.5 pr-2 text-sm text-slate-700 placeholder:text-[#84a8ce] outline-none'
              placeholder='Search by name or phone number...'
              type='text'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button
              variant='gradient'
              className='px-6 py-2.5 rounded-full text-sm font-medium transition-opacity shadow-[0_6px_14px_rgba(33,116,230,0.32)]'
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>

          <div className='flex flex-wrap items-center gap-2 w-full lg:w-auto'>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(
                  e.target.value as 'all' | OwnerCustomer['status'],
                );
                setPage(1);
              }}
              className='px-3 py-2.5 bg-white border border-primary/20 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus-visible:outline-primary/50 cursor-pointer hover:opacity-90'
            >
              <option value='all'>All Status</option>
              <option value='active'>Active</option>
              <option value='paused'>Paused</option>
            </select>

            <Button
              variant='outline'
              className='flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-colors'
              onClick={() => {
                setSearchInput('');
                setSearchQuery('');
                setStatusFilter('all');
                setPage(1);
              }}
            >
              <span className='material-symbols-outlined text-sm'>
                restart_alt
              </span>
              Reset
            </Button>
          </div>
        </div>

        {customersLoading ? (
          <div className='flex justify-center'>
            <Loader />
          </div>
        ) : (
          <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHead>
                  <tr className='border-b border-slate-200 bg-slate-50'>
                    <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                      Phone
                    </th>
                    <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center'>
                      <div className='flex flex-col gap-0.5'>
                        <p>Morning Qty</p>
                        <p className='font-semibold text-[9px]'>
                          (Cow / Buffalo)
                        </p>
                      </div>
                    </th>
                    <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center'>
                      <div className='flex flex-col gap-0.5'>
                        <p>Evening Qty</p>
                        <p className='font-semibold text-[9px]'>
                          (Cow / Buffalo)
                        </p>
                      </div>
                    </th>
                    <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center'>
                      Actions
                    </th>
                  </tr>
                </TableHead>
                <TableBody>
                  {!customersLoading &&
                    customers.map((customer) => (
                      <tr
                        key={customer.id}
                        className='hover:bg-primary/5 transition-colors group'
                      >
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-3'>
                            <div
                              className='size-8 rounded-full bg-cover bg-center'
                              aria-label={`${customer.name} avatar`}
                              style={{
                                backgroundImage: `url("${customer.avatar}")`,
                              }}
                            />
                            <span className='text-sm font-bold'>
                              {customer.name}
                            </span>
                          </div>
                        </td>
                        <td className='px-6 py-4 text-sm font-medium text-gray-600'>
                          {customer.phone}
                        </td>
                        <td className='px-6 py-4 text-center'>
                          <span className='inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs font-semibold'>
                            {formatQtyPair(
                              customer.morningCowQty,
                              customer.morningBuffaloQty,
                            )}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-center'>
                          <span className='inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs font-semibold'>
                            {formatQtyPair(
                              customer.eveningCowQty,
                              customer.eveningBuffaloQty,
                            )}
                          </span>
                        </td>

                        <td className='px-6 py-4'>
                          <Badge
                            variant={
                              customer.status === 'active'
                                ? 'primary'
                                : 'warning'
                            }
                            className='capitalize'
                          >
                            {customer.status}
                          </Badge>
                        </td>
                        <td className='px-6 py-4 text-right'>
                          <Link
                            href={`/owner/customers/${customer.id}`}
                            className='px-3 py-2 bg-green-100 text-green-700 hover:bg-green-800 hover:text-white text-xs font-bold rounded hover:opacity-80 transition-opacity'
                          >
                            {`View Profile >`}
                          </Link>
                        </td>
                      </tr>
                    ))}

                  {customers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className='px-6 py-8 text-center text-sm text-gray-500'
                      >
                        {customersLoading
                          ? 'Loading customers...'
                          : 'No customers found for the selected filters.'}
                      </td>
                    </tr>
                  )}
                </TableBody>
              </Table>
            </div>

            {customers.length > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            )}
          </div>
        )}
      </div>
    </ContentLayout>
  );
};

export default OwnerCustomersPage;
