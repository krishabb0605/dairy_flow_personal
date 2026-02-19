import { api } from '../lib/api';
import type { UpcomingCustomerActivity } from '../types';

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
