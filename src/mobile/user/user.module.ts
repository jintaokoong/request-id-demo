import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'user' })],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
