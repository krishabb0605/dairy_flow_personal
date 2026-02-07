import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { api } from '../lib/api';
import { auth } from '../config/firebase-config';

export const getUser = async (firebaseUid: string) => {
  try {
    return await api(`/auth/user/${firebaseUid}`);
  } catch (error) {
    console.error('Error while fetching user:', error);
    throw error;
  }
};

export const createUser = async (form: {
  fullName: string;
  mobileNumber: string;
  address: string;
  email: string;
  password: string;
  existingFirebaseId?: string | null;
}) => {
  let firebaseUser;
  try {
    if (!form.existingFirebaseId) {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      firebaseUser = cred.user;
    }

    const userInfo = await api('/auth/create', {
      method: 'POST',
      body: {
        fullName: form.fullName,
        mobileNumber: form.mobileNumber,
        email: form.email,
        address: form.address,
        firebaseUid: firebaseUser?.uid || form.existingFirebaseId,
      },
    });

    return userInfo;
  } catch (error) {
    console.error('Error while creating user:', error);
    // Rollback firebase user
    if (firebaseUser) {
      await deleteUser(firebaseUser);
    }

    throw error;
  }
};

export const addRole = async (userId: number, role: 'OWNER' | 'CUSTOMER') => {
  try {
    return await api(`/auth/role/${userId}`, {
      method: 'POST',
      body: { role },
    });
  } catch (error) {
    console.error('Error while selecting role:', error);
    throw error;
  }
};

export const addOwnerConfigInfo = async (
  userId: number,
  data: {
    dairyName: string;
    cowEnabled: boolean;
    cowPrice: number;
    buffaloEnabled: boolean;
    buffaloPrice: number;
  },
) => {
  try {
    return await api(`/auth/owner-config/${userId}`, {
      method: 'POST',
      body: data,
    });
  } catch (error) {
    console.error('Error while configuring owner profile:', error);
    throw error;
  }
};

export const addCustomerConfigInfo = async (
  userId: number,
  data: {
    customerCode: string;
    morningCowQty: number;
    morningBuffaloQty: number;
    eveningCowQty: number;
    eveningBuffaloQty: number;
  },
) => {
  try {
    return await api(`/auth/customer-config/${userId}`, {
      method: 'POST',
      body: data,
    });
  } catch (error) {
    console.error('Error while configuring customer profile:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userInfo = await getUser(cred.user.uid);

    return userInfo;
  } catch (error) {
    console.error('Error during login:', error);
    await signOut(auth);
    localStorage.removeItem('user');
    throw error;
  }
};
