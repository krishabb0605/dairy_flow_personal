export type OnboardingStepProps = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

export type BasicInfoState = {
  fullName: string;
  mobileNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type Step = {
  id: number;
  title: string;
};

export type StepperProps = {
  steps: Step[];
  currentStep: number;
};

export type UserRoleType = 'OWNER' | 'CUSTOMER';

export type OnboardingLayoutProps = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleSubmit: (e: React.FormEvent) => void;
  title: string;
  children: React.ReactNode;
};

export type MilkConfig = {
  enabled: boolean;
  price: number;
};

export type UserContextType = {
  basicInfo: BasicInfoState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedRole: UserRoleType;
  setSelectedRole: React.Dispatch<React.SetStateAction<UserRoleType>>;
  loading: boolean;
  handleLogout: () => Promise<void>;
};
