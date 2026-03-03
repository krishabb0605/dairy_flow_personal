import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { UpdateDailyMilkDto } from './dto/update-daily-milk.dto.js';

import { CustomerOwnerRepository } from '../customer-owner/customer-owner.repositary.js';
import { ExtraMilkOrderRepository } from '../extra-milk-order/extra-milk-order.repositary.js';
import { VacationScheduleRepository } from '../vacation-schedule/vacation-schedule.repository.js';
import { DailyMilkRepository } from './daily-milk.repository.js';

const TIME_ZONE = process.env.CRON_TIMEZONE ?? process.env.TZ;
const CRON_OPTIONS = TIME_ZONE ? { timeZone: TIME_ZONE } : undefined;

const SLOT_RANK = { MORNING: 0, EVENING: 1 } as const;

@Injectable()
export class DailyMilkService {
  private readonly logger = new Logger('DailyMilk');

  constructor(
    private dailyMilkRepository: DailyMilkRepository,
    private customerOwnerRepository: CustomerOwnerRepository,
    private extraMilkOrderRepository: ExtraMilkOrderRepository,
    private vacationScheduleRepository: VacationScheduleRepository,
  ) {}

  @Cron(CronExpression.EVERY_HOUR, CRON_OPTIONS)
  runEveryFiveMinite() {
    this.logger.log('Milk entry cron placeholder is running at every hour');
  }

  @Cron(CronExpression.EVERY_DAY_AT_5AM, CRON_OPTIONS)
  async handleMorningCron(): Promise<void> {
    this.logger.log('Milk entry cron placeholder is running at 5 am');
    await this.generateDailyMilk('MORNING');
  }

  @Cron(CronExpression.EVERY_DAY_AT_5PM, CRON_OPTIONS)
  async handleEveningCron(): Promise<void> {
    this.logger.log('Milk entry cron placeholder is running at 5 pm');
    await this.generateDailyMilk('EVENING');
  }

  private async generateDailyMilk(slot: 'MORNING' | 'EVENING'): Promise<void> {
    const deliveryDate = this.getTodayDateOnly();

    const customerOwners =
      await this.customerOwnerRepository.findActiveCustomerOwners();

    if (customerOwners.length === 0) return;

    const customerOwnerIds = customerOwners.map((item) => item.id);

    const [extras, vacations] = await Promise.all([
      this.extraMilkOrderRepository.findByCustomerOwnerIdsAndDateSlot({
        customerOwnerIds,
        deliveryDate,
        slot,
      }),
      this.vacationScheduleRepository.findActiveByCustomerOwnerIds({
        customerOwnerIds,
        deliveryDate,
      }),
    ]);

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
      this.logger.log(`>>> Milk entry for customer: ${customerOwner.id} `);
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
    if (!TIME_ZONE) {
      return new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
      );
    }
    return this.getDateOnlyInTimeZone(now, TIME_ZONE);
  }

  private getDateOnlyInTimeZone(date: Date, timeZone: string): Date {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);

    const year = Number(parts.find((part) => part.type === 'year')?.value);
    const month =
      Number(parts.find((part) => part.type === 'month')?.value) - 1;
    const day = Number(parts.find((part) => part.type === 'day')?.value);

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
      throw new BadRequestException('Invalid timezone date conversion');
    }

    return new Date(Date.UTC(year, month, day));
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

  private normalizeSlot(slot?: string): 'MORNING' | 'EVENING' | undefined {
    if (!slot) return undefined;
    const upper = slot.toUpperCase();
    if (upper === 'MORNING' || upper === 'EVENING') return upper;
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

  async getOwnerDeliveryHistory(
    ownerId: number,
    params: {
      page: number;
      limit: number;
      search?: string;
      slot?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const slot = this.normalizeSlot(params.slot);
    const status = this.normalizeStatus(params.status);
    const startDate = params.startDate
      ? this.parseDateOnly(params.startDate, 'startDate')
      : undefined;
    const endDate = params.endDate
      ? this.parseDateOnly(params.endDate, 'endDate')
      : undefined;

    return this.dailyMilkRepository.getOwnerDeliveryHistory(ownerId, {
      page,
      limit,
      search: params.search,
      slot,
      status,
      startDate,
      endDate,
    });
  }

  private normalizeStatus(
    status?: string,
  ): 'PENDING' | 'DELIVERED' | 'CANCELLED' | undefined {
    if (!status) return undefined;
    const upper = status.toUpperCase();
    if (upper === 'PENDING' || upper === 'DELIVERED' || upper === 'CANCELLED') {
      return upper;
    }
    throw new BadRequestException('Invalid status value');
  }

  private parseDateOnly(value: string, label: string): Date {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`Invalid ${label} format`);
    }

    return new Date(
      Date.UTC(
        parsed.getUTCFullYear(),
        parsed.getUTCMonth(),
        parsed.getUTCDate(),
      ),
    );
  }

  async getCustomerMonthlyCalendar(
    customerOwnerId: number,
    params: {
      month?: string;
      status?: string;
    },
  ) {
    const { month, status: rawStatus } = params;
    const baseDate = this.resolveCalendarMonth(month);
    const status = this.normalizeStatus(rawStatus);

    const customerOwner =
      await this.customerOwnerRepository.findCustomerOwnerWithCustomer(
        customerOwnerId,
      );

    if (!customerOwner) {
      throw new NotFoundException(
        `Customer-owner relation not found with id: ${customerOwnerId}`,
      );
    }

    const year = baseDate.getUTCFullYear();
    const monthIndex = baseDate.getUTCMonth();
    const start = new Date(Date.UTC(year, monthIndex, 1));
    const end = new Date(Date.UTC(year, monthIndex + 1, 0));

    const deliveries = await this.dailyMilkRepository.listMonthlyDeliveries({
      customerOwnerId,
      start,
      end,
      status,
    });

    const daysInMonth = end.getUTCDate();
    const records = Array.from({ length: daysInMonth }, (_, index) => ({
      day: index + 1,
      morningCow: 0,
      morningBuffalo: 0,
      eveningCow: 0,
      eveningBuffalo: 0,
      morningStatus: null as 'PENDING' | 'DELIVERED' | 'CANCELLED' | null,
      eveningStatus: null as 'PENDING' | 'DELIVERED' | 'CANCELLED' | null,
    }));

    for (const item of deliveries) {
      const day = item.deliveryDate.getUTCDate();
      const record = records[day - 1];
      if (!record) continue;

      if (item.slot === 'MORNING') {
        record.morningCow = Number(item.cowQty);
        record.morningBuffalo = Number(item.buffaloQty);
        record.morningStatus = item.status;
      } else {
        record.eveningCow = Number(item.cowQty);
        record.eveningBuffalo = Number(item.buffaloQty);
        record.eveningStatus = item.status;
      }
    }

    return {
      month: start.toISOString().slice(0, 10),
      base: {
        morningCow: Number(customerOwner.customer.morningCowQty ?? 0),
        morningBuffalo: Number(customerOwner.customer.morningBuffaloQty ?? 0),
        eveningCow: Number(customerOwner.customer.eveningCowQty ?? 0),
        eveningBuffalo: Number(customerOwner.customer.eveningBuffaloQty ?? 0),
      },
      records,
    };
  }

  async getCustomerMonthlySummary(
    customerOwnerId: number,
    params: {
      month?: string;
    },
  ) {
    const { month } = params;
    const baseDate = this.resolveCalendarMonth(month);

    const customerOwner =
      await this.customerOwnerRepository.findCustomerOwnerById(customerOwnerId);

    if (!customerOwner) {
      throw new NotFoundException(
        `Customer-owner relation not found with id: ${customerOwnerId}`,
      );
    }

    const year = baseDate.getUTCFullYear();
    const monthIndex = baseDate.getUTCMonth();
    const start = new Date(Date.UTC(year, monthIndex, 1));
    const end = new Date(Date.UTC(year, monthIndex + 1, 0));

    const totalsAll = await this.dailyMilkRepository.aggregateMonthlyTotals({
      customerOwnerId,
      start,
      end,
    });

    const totalsDelivered =
      await this.dailyMilkRepository.aggregateMonthlyTotals({
        customerOwnerId,
        start,
        end,
        status: 'DELIVERED',
      });

    const totalCowQty = Number(totalsAll._sum.cowQty ?? 0);
    const totalBuffaloQty = Number(totalsAll._sum.buffaloQty ?? 0);
    const deliveredCowQty = Number(totalsDelivered._sum.cowQty ?? 0);
    const deliveredBuffaloQty = Number(totalsDelivered._sum.buffaloQty ?? 0);
    const totalAmount = Number(totalsDelivered._sum.totalAmount ?? 0);

    return {
      month: start.toISOString().slice(0, 10),
      totalCowQty,
      totalBuffaloQty,
      totalLiters: totalCowQty + totalBuffaloQty,
      deliveredCowQty,
      deliveredBuffaloQty,
      deliveredLiters: deliveredCowQty + deliveredBuffaloQty,
      totalAmount,
    };
  }

  private resolveCalendarMonth(value?: string): Date {
    if (!value) return this.getTodayDateOnly();

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('Invalid month format');
    }

    return new Date(
      Date.UTC(
        parsed.getUTCFullYear(),
        parsed.getUTCMonth(),
        parsed.getUTCDate(),
      ),
    );
  }
}
