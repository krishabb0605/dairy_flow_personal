import { api } from '../lib/api';

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
