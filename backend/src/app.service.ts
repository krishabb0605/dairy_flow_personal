import { Injectable } from '@nestjs/common';

import { UserRepository } from './user/user.repository.js';

@Injectable()
export class AppService {
  constructor(private userRepository: UserRepository) {}
  getHello(): string {
    return 'Hello World!';
  }
}
