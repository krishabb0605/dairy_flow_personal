export class CreateExtraMilkOrderDto {
  customerOwnerId: number;
  deliveryDate: string;
  slot: 'morning' | 'evening';
  cowQty: number;
  buffaloQty: number;
}
