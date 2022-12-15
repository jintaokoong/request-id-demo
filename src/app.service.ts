import { Injectable } from '@nestjs/common';
import { Logger } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(AppService.name);
  }

  getHello(): string {
    this.logger.log('Hello World from AppService!');
    return 'Hello World!';
  }
}
