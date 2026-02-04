'use client';

import React, { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { BasicInfoState, UserContextType, UserRoleType } from '../../types';

export const UserContext = createContext<UserContextType>(
  {} as UserContextType,
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [basicInfo, setBasicInfo] = useState<BasicInfoState>({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedRole, setSelectedRole] = useState<UserRoleType>('CUSTOMER');

  useEffect(() => {
    console.log(basicInfo);
  }, [basicInfo]);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      toast.success('Logout successfully!');
      localStorage.clear();

      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error during logout. Please try again.');
      return;
    } finally {
      setLoading(false);
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
