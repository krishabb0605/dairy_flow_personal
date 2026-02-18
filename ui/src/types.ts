export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type Slot = 'morning' | 'evening';
export type MilkType = 'cow' | 'buffalo';
export type deliveryFilter = 'All Deliveries' | 'Confirmed' | 'Pending';

export interface ApiOptions {
  method?: HttpMethod;
  body?: unknown;
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
  profileImageUrl?: string;
};

export type OwnerSettingConfig = {
  id: number;
  userId: number;
  dairyName: string;
  cowEnabled: boolean;
  cowPrice: string;
  buffaloEnabled: boolean;
  buffaloPrice: string;
  createdAt: string;
  updatedAt: string;
  morningStart: string;
  morningEnd: string;
  eveningStart: string;
  eveningEnd: string;
  upiId: string | null;
  bankName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
};

export type CustomerSettingConfig = {
  id: number;
  userId: number;
  ownerId: number;
  registeredCustomerId: string;
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

export type CustomerOwner = {
  id: number;
  ownerId: number;
  ownerUserId: number;
  ownerFullName: string;
  ownerMobileNumber: string;
  ownerEmail: string;
  ownerAddress: string;
  dairyName: string;
  cowEnabled: boolean;
  cowPrice: string;
  buffaloEnabled: boolean;
  buffaloPrice: string;
  morningStart: string;
  morningEnd: string;
  eveningStart: string;
  eveningEnd: string;
  upiId: string | null;
  bankName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
};

export type User = UserInfo & {
  ownerSettings: OwnerSettingConfig | null;
  customerSettings: CustomerSettingConfig | null;
  currentActiveOwner: CustomerOwner | null;
};

export type ModalProps = {
  open: boolean;
  title: string;
  description?: string;

  submitText?: string;
  cancelText?: string;

  loading?: boolean;
  variant?: string;
  icon?: string;

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

export type CreateUserParams = {
  fullName: string;
  mobileNumber: string;
  address: string;
  email: string;
  password: string;
  existingFirebaseId?: string | null;
};

export type AddOwnerConfigInfoParams = {
  dairyName: string;
  cowEnabled: boolean;
  cowPrice: number;
  buffaloEnabled: boolean;
  buffaloPrice: number;
};

export type AddCustomerConfigInfoParams = {
  morningCowQty: number;
  morningBuffaloQty: number;
  eveningCowQty: number;
  eveningBuffaloQty: number;
};

export type UpdateCustomerSettingsParams = {
  fullName: string;
  address: string;
  profileImageUrl?: string | null;
  morningCowQty: number;
  morningBuffaloQty: number;
  eveningCowQty: number;
  eveningBuffaloQty: number;
};

export type UpdateOwnerSettingsParams = {
  fullName: string;
  address: string;
  profileImageUrl?: string | null;
  dairyName: string;
  cowEnabled: boolean;
  cowPrice: number;
  buffaloEnabled: boolean;
  buffaloPrice: number;
  morningStart: string;
  morningEnd: string;
  eveningStart: string;
  eveningEnd: string;
  upiId?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  ifscCode?: string | null;
};

export type LoginParams = {
  email: string;
  password: string;
};

export type UploadImageConfig = {
  cloudName?: string;
  folder?: string;
  uploadPreset?: string;
};

export type ValidateImageFileOptions = {
  maxSize?: number;
  allowedTypes?: string[];
};

export type UseCloudinaryImageUploadOptions = {
  initialImageUrl: string;
  fallbackImageUrl: string;
};

export type DeliverySession = {
  type: 'Morning' | 'Evening';
  time: string;
  cow: number;
  buffalo: number;
  subtotal: number;
};

export type Delivery = {
  id: number;
  date: string;
  day: string;
  totalQty: number;
  totalPrice: number;
  status: 'Confirmed' | 'Pending';
  sessions: DeliverySession[];
};

export type OwnerCustomer = {
  id: number;
  name: string;
  phone: string;
  morningCowQty: number;
  morningBuffaloQty: number;
  eveningCowQty: number;
  eveningBuffaloQty: number;
  status: 'active' | 'paused';
  avatar: string;
};

export type OwnerCustomerDeliveryStatus =
  | 'delivered'
  | 'pending'
  | 'skipped'
  | 'cancelled';

export type OwnerCustomerDeliveryShift = 'morning' | 'evening';

export type OwnerCustomerDeliveryHistoryItem = {
  id: number;
  date: string;
  shift: OwnerCustomerDeliveryShift;
  cowQty: number;
  buffaloQty: number;
  status: OwnerCustomerDeliveryStatus;
};

export type OwnerCustomerTab =
  | 'overview'
  | 'delivery-history'
  | 'billing-history';

export type OwnerGenerateBillDailyRecord = {
  day: number;
  morningCow: number;
  morningBuffalo: number;
  eveningCow: number;
  eveningBuffalo: number;
};

export type OwnerBillingStatus = 'paid' | 'pending';

export type OwnerBillingRecord = {
  id: string;
  customerName: string;
  mobile: string;
  month: string;
  qty: number;
  amount: number;
  status: OwnerBillingStatus;
};

export type OwnerSettingsFormData = {
  fullName: string;
  email: string;
  mobileNumber: string;
  address: string;
  morningStartTime: string;
  morningEndTime: string;
  eveningStartTime: string;
  eveningEndTime: string;
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
};

export type OwnerSettingsFormErrors = Partial<
  Record<keyof OwnerSettingsFormData, string>
>;

export type OwnerSettingsMilkConfigState = {
  cow: MilkConfig;
  buffalo: MilkConfig;
};

export type CustomerSettingsFormData = {
  fullName: string;
  mobileNumber: string;
  email: string;
  address: string;
  morningCowQty: string;
  morningBuffaloQty: string;
  eveningCowQty: string;
  eveningBuffaloQty: string;
};

export type CustomerSettingsFormErrors = Partial<
  Record<keyof CustomerSettingsFormData, string>
>;

export type DeliveryShiftFilter = 'all' | 'morning' | 'evening';
export type DeliveryStatusFilter = 'all' | OwnerCustomerDeliveryStatus;
export type BillingStatusFilter = 'all' | 'paid' | 'pending';

export type DeliveryCalendarProps = {
  customerSetting?: CustomerSettingConfig | null;
};

export type BillPdfDailyRecord = {
  day: number;
  morningCow: number;
  morningBuffalo: number;
  eveningCow: number;
  eveningBuffalo: number;
};

export type BillPdfProps = {
  customerName: string;
  customerPhone: string;
  customerId: string;
  monthYear: string;
  records: BillPdfDailyRecord[];
  cowRate: number;
  buffaloRate: number;
  totalMorningCow: number;
  totalMorningBuffalo: number;
  totalEveningCow: number;
  totalEveningBuffalo: number;
  grandTotal: number;
};

export type ScheduleVacationProps = {
  open: boolean;
  onClose: () => void;
};
