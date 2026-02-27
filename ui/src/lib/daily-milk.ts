import type {
  CustomerCalendarResponse,
  CustomerMonthlySummaryResponse,
  OwnerDashboardResponse,
  OwnerDelivery,
  OwnerDeliveryHistoryResponse,
} from '../utils/types';

import { api } from '../lib/api';

export const getOwnerDashboard = async (
  ownerId: number,
  params?: {
    date?: string;
    page?: number;
    limit?: number;
    search?: string;
    slot?: 'morning' | 'evening';
  },
): Promise<OwnerDashboardResponse> => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.date) searchParams.set('date', params.date);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.slot) searchParams.set('slot', params.slot);

    const query = searchParams.toString();
    const suffix = query ? `?${query}` : '';

    return await api(`/daily-milk/owner/${ownerId}${suffix}`);
  } catch (error) {
    console.error('Error while fetching owner dashboard:', error);
    throw error;
  }
};

export const updateDailyMilk = async (
  id: number,
  data: {
    cowQty?: number;
    buffaloQty?: number;
    notes?: string | null;
    status?: 'PENDING' | 'DELIVERED' | 'CANCELLED';
  },
): Promise<OwnerDelivery> => {
  try {
    return await api(`/daily-milk/${id}`, {
      method: 'PATCH',
      body: data,
    });
  } catch (error) {
    console.error('Error while updating daily milk:', error);
    throw error;
  }
};

export const getOwnerDeliveryHistory = async (
  ownerId: number,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    slot?: 'morning' | 'evening' | 'all';
    status?: 'pending' | 'delivered' | 'cancelled' | 'all';
    startDate?: string;
    endDate?: string;
  },
): Promise<OwnerDeliveryHistoryResponse> => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.slot && params.slot !== 'all')
      searchParams.set('slot', params.slot);
    if (params?.status && params.status !== 'all')
      searchParams.set('status', params.status);
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);

    const query = searchParams.toString();
    const suffix = query ? `?${query}` : '';

    return await api(`/daily-milk/owner/${ownerId}/history${suffix}`);
  } catch (error) {
    console.error('Error while fetching delivery history:', error);
    throw error;
  }
};

export const getCustomerMonthlyCalendar = async (
  customerOwnerId: number,
  params?: {
    month?: string;
    status?: string;
  },
): Promise<CustomerCalendarResponse> => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.month) searchParams.set('month', params.month);
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    const suffix = query ? `?${query}` : '';

    return await api(
      `/daily-milk/customer/${customerOwnerId}/calendar${suffix}`,
    );
  } catch (error) {
    console.error('Error while fetching customer monthly calendar:', error);
    throw error;
  }
};

export const getCustomerMonthlySummary = async (
  customerOwnerId: number,
  params?: {
    month?: string;
  },
): Promise<CustomerMonthlySummaryResponse> => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.month) searchParams.set('month', params.month);

    const query = searchParams.toString();
    const suffix = query ? `?${query}` : '';

    return await api(
      `/daily-milk/customer/${customerOwnerId}/summary${suffix}`,
    );
  } catch (error) {
    console.error('Error while fetching customer monthly summary:', error);
    throw error;
  }
};
