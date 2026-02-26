import type { CreateVacationScheduleParams } from '../utils/types';

import { api } from './api';

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
