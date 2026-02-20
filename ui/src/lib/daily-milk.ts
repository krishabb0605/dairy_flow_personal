import { api } from '../lib/api';
import type { OwnerDashboardResponse, OwnerDelivery } from '../types';

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
