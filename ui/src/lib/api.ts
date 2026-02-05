import { API_URL } from '../constants';
import { ApiOptions } from '../types';

export const api = async (
  url: string,
  options: ApiOptions = {},
): Promise<any> => {
  const { method = 'GET', body, token } = options;

  const res = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data.data;
};
