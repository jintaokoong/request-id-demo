import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import { RequestContextModule } from 'nestjs-request-context';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './mobile/user/user.module';
import { TraceIdMiddleware } from './trace-id/trace-id.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule,
    UserModule,
    RequestContextModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transports: [
          new winston.transports.DailyRotateFile({
            level: 'debug',
            filename: 'log/info-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: 10,
            maxSize: '10m',
            createSymlink: true,
            symlinkName: 'info.log',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              utilities.format.nestLike('LogApp', {
                colors: false,
              }),
              winston.format.uncolorize(),
            ),
          }),
          new winston.transports.Console({
            level: 'info',
            silent: configService.get('NODE_ENV') === 'development', // disable console log in development
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              utilities.format.nestLike('LogApp', { colors: false }),
              winston.format.uncolorize(),
            ),
          }),
          new winston.transports.Console({
            level: 'debug',
            silent: configService.get('NODE_ENV') === 'production', // disable colored console log in production
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              utilities.format.nestLike('LogApp'),
            ),
          }),
        ],
      }),
    }),
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}
