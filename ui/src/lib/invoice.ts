import type {
  CustomerBillingResponse,
  GetCustomerBillingParams,
  GetOwnerBillingParams,
  OwnerBillingResponse,
} from '../types';

import { api } from '../lib/api';

export const getOwnerBilling = async (
  params: GetOwnerBillingParams,
): Promise<OwnerBillingResponse> => {
  try {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
      search: params.search ?? '',
      status: params.status ?? 'all',
      year: params.year ?? 'all',
    });
    return await api(
      `/invoice/owner/${params.ownerId}?${searchParams.toString()}`,
    );
  } catch (error) {
    console.error('Error while fetching owner billing:', error);
    throw error;
  }
};

export const updateInvoice = async (
  invoiceId: number,
  body: { status?: string; paymentMethod?: string; notes?: string | null },
) => {
  try {
    return await api(`/invoice/${invoiceId}`, {
      method: 'PATCH',
      body,
    });
  } catch (error) {
    console.error('Error while updating invoice:', error);
    throw error;
  }
};

export const getCustomerBilling = async (
  params: GetCustomerBillingParams,
): Promise<CustomerBillingResponse> => {
  try {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
      year: params.year ?? 'all',
    });
    return await api(
      `/invoice/customer/${params.customerOwnerId}?${searchParams.toString()}`,
    );
  } catch (error) {
    console.error('Error while fetching customer billing:', error);
    throw error;
  }
};
