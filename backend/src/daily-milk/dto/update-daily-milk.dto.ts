export class UpdateDailyMilkDto {
  cowQty?: number;
  buffaloQty?: number;
  notes?: string | null;
  status?: 'PENDING' | 'DELIVERED' | 'CANCELLED';
}
