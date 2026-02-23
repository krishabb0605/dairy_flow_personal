'use client';

import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import {
  BasicInfoState,
  User,
  UserContextType,
  UserRoleType,
} from '../../types';

import { getUser } from '../../lib/users';

import { auth } from '../../config/firebase-config';

export const UserContext = createContext<UserContextType>(
  {} as UserContextType,
);

const defaultBasicInfo = {
  fullName: '',
  mobileNumber: '',
  address: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [basicInfo, setBasicInfo] = useState<BasicInfoState>(defaultBasicInfo);

  const [selectedRole, setSelectedRole] = useState<UserRoleType>('CUSTOMER');

  const isUserNotFoundError = (error: unknown) =>
    error instanceof Error &&
    error.message.toLowerCase().includes('user not found');

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  const getUserWithRetry = async (firebaseUid: string) => {
    const maxAttempts = 6;
    const retryDelayMs = 500;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await getUser(firebaseUid);
      } catch (error) {
        const shouldRetry = isUserNotFoundError(error) && attempt < maxAttempts;

        if (!shouldRetry) {
          throw error;
        }

        await sleep(retryDelayMs);
      }
    }

    throw new Error('User not found');
  };
  useEffect(() => {
    const localUserInfo = localStorage.getItem('user');

    if (localUserInfo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedRole(JSON.parse(localUserInfo).role || 'CUSTOMER');
    }
  }, []);

  console.log('user', auth.currentUser?.uid, user, loading);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        localStorage.removeItem('user');
        setLoading(false);
        return;
      }

      try {
        const userInfo = await getUserWithRetry(firebaseUser.uid);

        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);

        const { fullName, email, mobileNumber, password, role, address } =
          userInfo;

        setBasicInfo({
          fullName,
          mobileNumber,
          email,
          password,
          confirmPassword: password,
          address,
        });

        setSelectedRole(role || 'CUSTOMER');
        setLoading(false);
      } catch (error: any) {
        if (isUserNotFoundError(error)) {
          setLoading(false);
          return;
        }

        toast.error('Error while fetching user');
        console.error(error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setBasicInfo(defaultBasicInfo);
      router.push('/login');
      localStorage.removeItem('user');
      toast.success('User sign out successfully !!');
    } catch (error) {
      console.error(error);
      toast.error('Error while log out !!');
    }
  };

  return (
    <UserContext.Provider
      value={{
        loading,
        handleLogout,
        basicInfo,
        handleChange,
        selectedRole,
        setSelectedRole,
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
