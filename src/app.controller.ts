import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from './logger/logger.service';
import { UserService } from './mobile/user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(AppController.name);
  }

  @Get()
  getHello(): string {
    this.logger.log('Hello World from AppController!');
    return this.appService.getHello();
  }

  @Get('users')
  getUsers() {
    this.logger.log('Logging from AppController!');
    return this.userService.getUsers();
  }

  @Post('users')
  createUser() {
    return this.userService.createUser();
  }
}
