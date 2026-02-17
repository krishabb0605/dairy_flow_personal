export class UpdateOwnerSettingsDto {
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
}
