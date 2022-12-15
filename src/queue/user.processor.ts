import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from 'src/logger/logger.service';

export enum UserQueueProcess {
  SEND_GREETING = 'send-greeting',
}

export class UserQueueData {
  name: string;
  traceId: string;
}

@Processor('user')
export class UserProcessor {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(UserProcessor.name);
  }

  @Process(UserQueueProcess.SEND_GREETING)
  async sendGreeting(job: Job<UserQueueData>) {
    const logger = this.logger.getScoped(job.data.traceId);
    logger.log('Sending greeting...');
    logger.log(`Hello, ${job.data.name}!`);
    logger.log('Changing the context...');
    const clogger = logger.setContext('SentContext');
    this.logger.log('Hello!');
    logger.log('Hello again!');
    clogger.log('Hello from the new context!');
  }
}
