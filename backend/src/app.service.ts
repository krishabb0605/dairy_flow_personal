import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async testDatabase(): Promise<string> {
    const testData = await this.prisma.test.findMany();

    console.log({ testData });

    await this.prisma.test.createMany({
      data: [{ name: 'Test 3' }, { name: 'Test 2' }],
      skipDuplicates: true,
    });
    return 'Database test completed successfully!';
  }
}
