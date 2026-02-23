import { Injectable } from '@nestjs/common';

import { UserRepository } from './user/user.repository.js';

@Injectable()
export class AppService {
  constructor(private userRepository: UserRepository) {}
  getHello(): string {
    return 'Hello World!';
  }

  async testDatabase(): Promise<string> {
    const testData = await this.userRepository.listAll();

    return `Database test completed successfully! ${JSON.stringify(testData)}`;
  }
}
