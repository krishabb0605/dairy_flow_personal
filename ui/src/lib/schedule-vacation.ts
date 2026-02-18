import { api } from './api';
import type { CreateVacationScheduleParams } from '../types';

export const createVacationSchedule = async (
  data: CreateVacationScheduleParams,
) => {
  try {
    return await api('/schedule-vacation/create', {
      method: 'POST',
      body: data,
    });
  } catch (error) {
    console.error('Error while creating vacation schedule:', error);
    throw error;
  }
};
