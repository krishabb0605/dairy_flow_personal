import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

const TIME_ZONE = process.env.CRON_TIMEZONE ?? process.env.TZ;
const CRON_OPTIONS = TIME_ZONE ? { timeZone: TIME_ZONE } : undefined;

const SLOT_RANK = { MORNING: 0, EVENING: 1 } as const;

@Injectable()
export class DailyMilkService {
  private readonly logger = new Logger('DailyMilk');

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_5_MINUTES, CRON_OPTIONS)
  runEveryFiveMinite() {
    this.logger.log('Milk entry cron placeholder is running at 5 minute');
  }

  // @Cron(CronExpression.EVERY_DAY_AT_5AM, CRON_OPTIONS)
  // async handleMorningCron(): Promise<void> {
  //   this.logger.log('Milk entry cron placeholder is running at 5 am');
  //   await this.generateDailyMilk('MORNING');
  // }

  // @Cron(CronExpression.EVERY_5_MINUTES, CRON_OPTIONS)
  // async handleEveningCron(): Promise<void> {
  //   this.logger.log('Milk entry cron placeholder is running at 5 pm');
  //   await this.generateDailyMilk('EVENING');
  // }

  private async generateDailyMilk(slot: 'MORNING' | 'EVENING'): Promise<void> {
    const deliveryDate = this.getTodayDateOnly();

    const customerOwners = await this.prisma.customerOwner.findMany({
      where: { isActivated: true },
      include: {
        customer: true,
        owner: true,
      },
    });

    if (customerOwners.length === 0) return;

    const customerOwnerIds = customerOwners.map((item) => item.id);

    const [extras, vacations] = await this.prisma.$transaction([
      this.prisma.extraMilkOrder.findMany({
        where: {
          customerOwnerId: { in: customerOwnerIds },
          deliveryDate,
          slot,
        },
      }),
      this.prisma.vacationSchedule.findMany({
        where: {
          customerOwnerId: { in: customerOwnerIds },
          startDate: { lte: deliveryDate },
          endDate: { gte: deliveryDate },
        },
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

    const upserts: Prisma.PrismaPromise<unknown>[] = [];

    for (const customerOwner of customerOwners) {
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

      upserts.push(
        this.prisma.dailyMilk.upsert({
          where: {
            customerOwnerId_deliveryDate_slot: {
              customerOwnerId: customerOwner.id,
              deliveryDate,
              slot,
            },
          },
          create: {
            customerOwnerId: customerOwner.id,
            deliveryDate,
            slot,
            cowQty,
            buffaloQty,
            cowPrice,
            buffaloPrice,
            totalAmount,
            notes,
          },
          update: {
            cowQty,
            buffaloQty,
            cowPrice,
            buffaloPrice,
            totalAmount,
            notes,
          },
        }),
      );
    }

    await this.prisma.$transaction(upserts);
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
}
