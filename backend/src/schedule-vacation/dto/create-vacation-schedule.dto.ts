export class CreateVacationScheduleDto {
  customerOwnerId: number;
  startDate: string;
  startSlot: 'morning' | 'evening';
  endDate: string;
  endSlot: 'morning' | 'evening';
}
