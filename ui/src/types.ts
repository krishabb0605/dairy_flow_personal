export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type Slot = 'morning' | 'evening';
export type MilkType = 'cow' | 'buffalo';
export type deliveryFilter = 'All Deliveries' | 'Confirmed' | 'Pending';

export interface ApiOptions {
  method?: HttpMethod;
  body?: any;
  token?: string;
}

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
  address: string;
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
  submitLoading: boolean;
};

export type MilkConfig = {
  enabled: boolean;
  price: number;
};

export type UserContextType = {
  basicInfo: BasicInfoState;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
  ) => void;
  selectedRole: UserRoleType;
  setSelectedRole: React.Dispatch<React.SetStateAction<UserRoleType>>;
  loading: boolean;
  handleLogout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  user: User | null;
};

export type UserInfo = {
  id: number;
  firebaseUid: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  address: string;
  role: UserRoleType | null;
  onboarded: boolean;
  onboardingStep: number;
  createdAt: string;
  updatedAt: string;
};

export type OwnerProfileConfig = {
  id: number;
  userId: number;
  dairyName: string;
  cowEnabled: boolean;
  cowPrice: string;
  buffaloEnabled: boolean;
  buffaloPrice: string;
  createdAt: string;
  updatedAt: string;
};

export type CustomerProfileConfig = {
  id: number;
  userId: number;
  ownerId: number;
  registeredCustomerId: string;
  customerCode: string;
  morningCowQty: number;
  morningBuffaloQty: number;
  eveningCowQty: number;
  eveningBuffaloQty: number;
  createdAt: string;
  updatedAt: string;
  ownerUser?: {
    fullName: string;
    mobileNumber: string;
  };
};

export type User = UserInfo & {
  ownerProfile: OwnerProfileConfig | null;
  customerProfile: CustomerProfileConfig | null;
};

export type ModalProps = {
  open: boolean;
  title: string;
  description?: string;

  submitText?: string;
  cancelText?: string;

  loading?: boolean;

  onSubmit?: () => void;
  onClose: () => void;
  onCancel?: () => void;

  children: React.ReactNode;
};

export type PaginationProps = {
  page: number;
  totalPages: number;
  setPage: (value: React.SetStateAction<number>) => void;
};

export type DeliveryStatus = 'pending' | 'delivered' | 'skipped';

export type OwnerDelivery = {
  id: number;
  name: string;
  address: string;
  cowQty: number;
  buffaloQty: number;
  slot: Slot;
  status: DeliveryStatus;
};
