export class UpdateCustomerSettingsDto {
  fullName: string;
  address: string;
  profileImageUrl?: string | null;

  morningCowQty: number;
  morningBuffaloQty: number;
  eveningCowQty: number;
  eveningBuffaloQty: number;
}
