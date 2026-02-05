'use client';

import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  BasicInfoState,
  User,
  UserContextType,
  UserRoleType,
} from '../../types';
import { auth } from '../../config/firebase-config';
import { getUser } from '../../lib/users';
import { onAuthStateChanged } from 'firebase/auth';

export const UserContext = createContext<UserContextType>(
  {} as UserContextType,
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [basicInfo, setBasicInfo] = useState<BasicInfoState>({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [selectedRole, setSelectedRole] = useState<UserRoleType>('CUSTOMER');
  useEffect(() => {
    const localUserInfo = localStorage.getItem('user');

    if (localUserInfo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedRole(JSON.parse(localUserInfo).role || 'CUSTOMER');
    }
  }, []);

  console.log('user', user, loading);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setLoading(false);
        return;
      }

      try {
        const userInfo = await getUser(firebaseUser.uid);

        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);

        const { fullName, email, mobileNumber, password, role } = userInfo;

        setBasicInfo({
          fullName,
          mobileNumber,
          email,
          password,
          confirmPassword: password,
        });

        setSelectedRole(role || 'CUSTOMER');
        setLoading(false);
      } catch (error: any) {
        if (error?.message === 'User not found') {
          setUser(null);
          setLoading(false);
          console.log('Error while fetching user', error);
          return;
        }

        toast.error('Error while fetching user');
        console.error(error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    console.log('log out');
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
