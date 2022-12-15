import { Module } from '@nestjs/common';
import { UserProcessor } from './user.processor';

@Module({
  providers: [UserProcessor],
})
export class QueueModule {}
