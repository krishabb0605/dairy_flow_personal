import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import type {
  AddCustomerConfigInfoParams,
  AddOwnerConfigInfoParams,
  CreateUserParams,
  LoginParams,
  UpdateCustomerSettingsParams,
  UpdateOwnerSettingsParams,
  UserRoleType,
} from '../types';

import { api } from '../lib/api';
import { auth } from '../config/firebase-config';

export const getUser = async (firebaseUid: string) => {
  try {
    return await api(`/auth/user/${firebaseUid}`);
  } catch (error) {
    const isUserNotFoundError =
      error instanceof Error &&
      error.message.toLowerCase().includes('user not found');

    if (!isUserNotFoundError) {
      console.error('Error while fetching user:', error);
    }

    throw error;
  }
};

export const createUser = async (form: CreateUserParams) => {
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
        onboardingStep: 1,
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

export const addRole = async (userId: number, role: UserRoleType) => {
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
  data: AddOwnerConfigInfoParams,
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
  data: AddCustomerConfigInfoParams,
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

export const updateCustomerSettings = async (
  userId: number,
  data: UpdateCustomerSettingsParams,
) => {
  try {
    return await api(`/auth/customer-settings/${userId}`, {
      method: 'POST',
      body: data,
    });
  } catch (error) {
    console.error('Error while updating customer settings:', error);
    throw error;
  }
};

export const updateOwnerSettings = async (
  userId: number,
  data: UpdateOwnerSettingsParams,
) => {
  try {
    return await api(`/auth/owner-settings/${userId}`, {
      method: 'POST',
      body: data,
    });
  } catch (error) {
    console.error('Error while updating owner settings:', error);
    throw error;
  }
};

export const login = async (
  email: LoginParams['email'],
  password: LoginParams['password'],
) => {
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
