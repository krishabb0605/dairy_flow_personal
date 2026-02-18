import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVacationScheduleDto } from './dto/create-vacation-schedule.dto.js';

const slotRank = { morning: 0, evening: 1 } as const;

@Injectable()
export class ScheduleVacationRepository {
  constructor(private prisma: PrismaService) {}

  async createVacationSchedule(dto: CreateVacationScheduleDto): Promise<any> {
    try {
      const customerOwner = await this.prisma.customerOwner.findUnique({
        where: { id: dto.customerOwnerId },
      });

      if (!customerOwner) {
        throw new NotFoundException(
          `Customer-owner relation not found with id: ${dto.customerOwnerId}`,
        );
      }

      if (!customerOwner.isActivated) {
        throw new BadRequestException(
          'Customer-owner relation is not active. Please activate first.',
        );
      }

      const startDate = this.parseDateOnly(dto.startDate);
      const startSlot = this.parseSlot(dto.startSlot);
      const endDate = this.parseDateOnly(dto.endDate);
      const endSlot = this.parseSlot(dto.endSlot);

      if (this.isEndBeforeStart(startDate, startSlot, endDate, endSlot)) {
        throw new BadRequestException('End date/slot must be after start.');
      }

      return await this.prisma.vacationSchedule.create({
        data: {
          customerOwnerId: customerOwner.id,
          startDate,
          startSlot,
          endDate,
          endSlot,
        },
        include: {
          customerOwner: {
            include: {
              customer: true,
              owner: true,
            },
          },
        },
      });
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Error) {
        throw new InternalServerErrorException({
          success: false,
          message: 'Error while creating vacation schedule',
          error: error.message,
        });
      }

      throw new InternalServerErrorException('Unexpected error');
    }
  }

  private parseDateOnly(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  private parseSlot(value: 'morning' | 'evening'): 'MORNING' | 'EVENING' {
    return value === 'evening' ? 'EVENING' : 'MORNING';
  }

  private isEndBeforeStart(
    startDate: Date,
    startSlot: 'MORNING' | 'EVENING',
    endDate: Date,
    endSlot: 'MORNING' | 'EVENING',
  ): boolean {
    const sDate = startDate.getTime();
    const eDate = endDate.getTime();

    if (eDate < sDate) return true;
    if (eDate > sDate) return false;

    const start = startSlot === 'MORNING' ? slotRank.morning : slotRank.evening;
    const end = endSlot === 'MORNING' ? slotRank.morning : slotRank.evening;
    return end < start;
  }
}
