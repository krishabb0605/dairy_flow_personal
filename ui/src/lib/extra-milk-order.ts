import { api } from './api';
import type { CreateExtraMilkOrderParams } from '../types';

export const createExtraMilkOrder = async (data: CreateExtraMilkOrderParams) => {
  try {
    return await api('/extra-milk-order/create', {
      method: 'POST',
      body: data,
    });
  } catch (error) {
    console.error('Error while creating extra milk order:', error);
    throw error;
  }
};
