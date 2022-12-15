import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Logger } from 'src/logger/logger.service';
import { UserQueueData } from 'src/queue/user.processor';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: Logger,
    @InjectQueue('user') private readonly queue: Queue<UserQueueData>,
  ) {
    this.logger.setContext(UserService.name);
  }

  getUsers(): {
    id: number;
    email: string;
  }[] {
    this.logger.log('Logging from UserService!');
    return [{ id: 1, email: 'mailer@mail.net' }];
  }

  createUser() {
    this.logger.log('It is I, who triggered the queue!');
    this.queue.add('send-greeting', {
      name: 'John',
      traceId: this.logger.getTraceId(),
    });
  }
}
