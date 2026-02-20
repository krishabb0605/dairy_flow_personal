import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DailyMilkRepository } from './daily-milk.repository.js';
import { UpdateDailyMilkDto } from './dto/update-daily-milk.dto.js';

const TIME_ZONE = process.env.CRON_TIMEZONE ?? process.env.TZ;
const CRON_OPTIONS = TIME_ZONE ? { timeZone: TIME_ZONE } : undefined;

const SLOT_RANK = { MORNING: 0, EVENING: 1 } as const;

@Injectable()
export class DailyMilkService {
  private readonly logger = new Logger('DailyMilk');

  constructor(private dailyMilkRepository: DailyMilkRepository) {}

  @Cron(CronExpression.EVERY_HOUR, CRON_OPTIONS)
  runEveryFiveMinite() {
    this.logger.log('Milk entry cron placeholder is running at every hour');
  }

  // @Cron(CronExpression.EVERY_DAY_AT_5AM, CRON_OPTIONS)
  // async handleMorningCron(): Promise<void> {
  //   this.logger.log('Milk entry cron placeholder is running at 5 am');
  //   await this.generateDailyMilk('MORNING');
  // }

  // @Cron(CronExpression.EVERY_DAY_AT_5PM, CRON_OPTIONS)
  // async handleEveningCron(): Promise<void> {
  //   this.logger.log('Milk entry cron placeholder is running at 5 pm');
  //   await this.generateDailyMilk('EVENING');
  // }

  private async generateDailyMilk(slot: 'MORNING' | 'EVENING'): Promise<void> {
    const deliveryDate = this.getTodayDateOnly();

    const customerOwners =
      await this.dailyMilkRepository.getActiveCustomerOwners();

    if (customerOwners.length === 0) return;

    const customerOwnerIds = customerOwners.map((item) => item.id);

    const [extras, vacations] =
      await this.dailyMilkRepository.getExtrasAndVacations({
        customerOwnerIds,
        deliveryDate,
        slot,
      });

    const extrasByCustomer = new Map<number, (typeof extras)[number]>();
    for (const extra of extras) {
      extrasByCustomer.set(extra.customerOwnerId, extra);
    }

    const vacationsByCustomer = new Map<number, (typeof vacations)[number][]>();
    for (const vacation of vacations) {
      const list = vacationsByCustomer.get(vacation.customerOwnerId) ?? [];
      list.push(vacation);
      vacationsByCustomer.set(vacation.customerOwnerId, list);
    }

    const entries: Array<{
      customerOwnerId: number;
      deliveryDate: Date;
      slot: 'MORNING' | 'EVENING';
      cowQty: number;
      buffaloQty: number;
      cowPrice: number;
      buffaloPrice: number;
      totalAmount: number;
      notes: string | null;
    }> = [];

    for (const customerOwner of customerOwners) {
      this.logger.log('Milk entry for customer ', customerOwner.id);
      const baseCowQty =
        slot === 'MORNING'
          ? Number(customerOwner.customer.morningCowQty)
          : Number(customerOwner.customer.eveningCowQty);
      const baseBuffaloQty =
        slot === 'MORNING'
          ? Number(customerOwner.customer.morningBuffaloQty)
          : Number(customerOwner.customer.eveningBuffaloQty);

      const isOnVacation = this.isOnVacation(
        vacationsByCustomer.get(customerOwner.id) ?? [],
        deliveryDate,
        slot,
      );

      const extra = extrasByCustomer.get(customerOwner.id);
      const extraCowQty = extra ? Number(extra.cowQty) : 0;
      const extraBuffaloQty = extra ? Number(extra.buffaloQty) : 0;

      const cowQty = isOnVacation ? 0 : baseCowQty + extraCowQty;
      const buffaloQty = isOnVacation ? 0 : baseBuffaloQty + extraBuffaloQty;

      const notes = this.buildNotes(isOnVacation, extraCowQty, extraBuffaloQty);

      const cowPrice = Number(customerOwner.owner.cowPrice);
      const buffaloPrice = Number(customerOwner.owner.buffaloPrice);
      const totalAmount = cowQty * cowPrice + buffaloQty * buffaloPrice;

      entries.push({
        customerOwnerId: customerOwner.id,
        deliveryDate,
        slot,
        cowQty,
        buffaloQty,
        cowPrice,
        buffaloPrice,
        totalAmount,
        notes,
      });
    }

    await this.dailyMilkRepository.upsertDailyMilkEntries(entries);
    this.logger.log(
      `Daily milk generated for ${slot} on ${deliveryDate.toISOString().slice(0, 10)}`,
    );
  }

  private buildNotes(
    isOnVacation: boolean,
    extraCowQty: number,
    extraBuffaloQty: number,
  ): string | null {
    if (isOnVacation) return 'Customer is on vacation';
    if (extraCowQty <= 0 && extraBuffaloQty <= 0) return null;
    return `Customer added (${extraCowQty} cow and ${extraBuffaloQty} buffalo) extra milk`;
  }

  private isOnVacation(
    vacations: Array<{
      startDate: Date;
      startSlot: 'MORNING' | 'EVENING';
      endDate: Date;
      endSlot: 'MORNING' | 'EVENING';
    }>,
    deliveryDate: Date,
    slot: 'MORNING' | 'EVENING',
  ): boolean {
    const slotValue = SLOT_RANK[slot];
    const target = deliveryDate.getTime();

    return vacations.some((vacation) => {
      const start = vacation.startDate.getTime();
      const end = vacation.endDate.getTime();

      if (target < start || target > end) return false;
      if (target > start && target < end) return true;

      if (target === start && target === end) {
        return (
          slotValue >= SLOT_RANK[vacation.startSlot] &&
          slotValue <= SLOT_RANK[vacation.endSlot]
        );
      }

      if (target === start) {
        return slotValue >= SLOT_RANK[vacation.startSlot];
      }

      return slotValue <= SLOT_RANK[vacation.endSlot];
    });
  }

  private getTodayDateOnly(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  async getOwnerDashboard(
    ownerId: number,
    params: {
      date?: string;
      page: number;
      limit: number;
      search?: string;
      slot?: 'MORNING' | 'EVENING';
    },
  ) {
    const deliveryDate = this.resolveDeliveryDate(params.date);
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const slot = this.normalizeSlot(params.slot);

    return this.dailyMilkRepository.getOwnerDashboard(ownerId, {
      deliveryDate,
      page,
      limit,
      search: params.search,
      slot,
    });
  }

  private normalizeSlot(
    slot?: 'MORNING' | 'EVENING',
  ): 'MORNING' | 'EVENING' | undefined {
    if (!slot) return undefined;
    if (slot === 'MORNING' || slot === 'EVENING') return slot;
    throw new BadRequestException('Invalid slot value');
  }

  private resolveDeliveryDate(value?: string): Date {
    if (!value) return this.getTodayDateOnly();

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return new Date(
      Date.UTC(
        parsed.getUTCFullYear(),
        parsed.getUTCMonth(),
        parsed.getUTCDate(),
      ),
    );
  }

  async updateDailyMilk(dailyMilkId: number, dto: UpdateDailyMilkDto) {
    const existing =
      await this.dailyMilkRepository.getDailyMilkWithCustomer(dailyMilkId);

    if (!existing) {
      throw new BadRequestException('Daily milk entry not found');
    }

    const status = dto.status ?? existing.status;

    const cowQty =
      dto.cowQty !== undefined ? Number(dto.cowQty) : Number(existing.cowQty);
    const buffaloQty =
      dto.buffaloQty !== undefined
        ? Number(dto.buffaloQty)
        : Number(existing.buffaloQty);
    const notes = dto.notes !== undefined ? dto.notes : existing.notes;

    const totalAmount =
      cowQty * Number(existing.cowPrice) +
      buffaloQty * Number(existing.buffaloPrice);

    const updated = await this.dailyMilkRepository.updateDailyMilk({
      dailyMilkId,
      cowQty,
      buffaloQty,
      notes,
      status,
      totalAmount,
    });

    return {
      id: updated.id,
      name: updated.customerOwner.customer.user.fullName,
      profileImageUrl: updated.customerOwner.customer.user.profileImageUrl,
      cowQty: Number(updated.cowQty),
      buffaloQty: Number(updated.buffaloQty),
      slot: updated.slot.toLowerCase(),
      status: updated.status,
      notes: updated.notes,
    };
  }
}
