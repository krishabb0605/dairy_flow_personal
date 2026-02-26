import { API_URL } from '../utils/constants';
import { ApiOptions } from '../utils/types';
import { auth } from '../config/firebase-config';

export const api = async (
  url: string,
  options: ApiOptions = {},
): Promise<any> => {
  const { method = 'GET', body, token } = options;

  const idToken =
    token ??
    (typeof window !== 'undefined'
      ? await auth.currentUser?.getIdToken()
      : undefined);

  const res = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data.data;
};
