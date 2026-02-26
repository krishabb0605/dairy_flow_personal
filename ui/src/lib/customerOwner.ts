import type {
  CreateCustomerOwnerParams,
  GetOwnerCustomersParams,
  OwnerCustomersResponse,
  UpcomingCustomerActivity,
} from '../utils/types';

import { api } from '../lib/api';

export const createCustomerOwner = async (data: CreateCustomerOwnerParams) => {
  try {
    return await api('/customer-owner/create', {
      method: 'POST',
      body: data,
    });
  } catch (error) {
    console.error('Error while creating customer-owner relation:', error);
    throw error;
  }
};

export const deActivateOwner = async (customerOwnerId: number) => {
  try {
    return await api(`/customer-owner/deactivate/${customerOwnerId}`, {
      method: 'PATCH',
    });
  } catch (error) {
    console.error('Error while deactivate owner profile:', error);
    throw error;
  }
};

export const getUpcomingCustomerActivity = async (
  customerOwnerId: number,
): Promise<UpcomingCustomerActivity> => {
  try {
    return await api(`/customer-owner/upcoming/${customerOwnerId}`);
  } catch (error) {
    console.error('Error while fetching upcoming customer activity:', error);
    throw error;
  }
};

export const getOwnerCustomers = async (
  params: GetOwnerCustomersParams,
): Promise<OwnerCustomersResponse> => {
  try {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
      search: params.search ?? '',
      status: params.status ?? 'all',
    });
    return await api(
      `/customer-owner/customers/${params.ownerId}?${searchParams.toString()}`,
    );
  } catch (error) {
    console.error('Error while fetching owner customers:', error);
    throw error;
  }
};
