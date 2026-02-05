import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async testDatabase(): Promise<string> {
    const testData = await this.prisma.user.findMany();

    return `Database test completed successfully! ${JSON.stringify(testData)}`;
  }
}
