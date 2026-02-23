import type {
  CustomerDeliveryHistoryResponse,
  OwnerCustomerProfile,
} from '../types';

import { api } from '../lib/api';

export const getCustomerProfile = async (
  customerOwnerId: number,
): Promise<OwnerCustomerProfile> => {
  try {
    return await api(`/customer-settings/profile/${customerOwnerId}`);
  } catch (error) {
    console.error('Error while fetching customer profile:', error);
    throw error;
  }
};

export const getCustomerDeliveryHistory = async (
  customerOwnerId: number,
  params: {
    page: number;
    limit: number;
    slot?: 'morning' | 'evening' | 'all';
    status?: 'pending' | 'delivered' | 'cancelled' | 'all';
    startDate?: string;
    endDate?: string;
  },
): Promise<CustomerDeliveryHistoryResponse> => {
  try {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
      slot: params.slot ?? 'all',
      status: params.status ?? 'all',
      startDate: params.startDate ?? '',
      endDate: params.endDate ?? '',
    });
    return await api(
      `/customer-settings/delivery-history/${customerOwnerId}?${searchParams.toString()}`,
    );
  } catch (error) {
    console.error('Error while fetching customer delivery history:', error);
    throw error;
  }
};
