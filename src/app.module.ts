import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from 'nestjs-pino';
import { AppService } from './app.service';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtStrategy } from '../libs/common/src/auth';
import { AuthServiceModule } from '@app/auth-service';
import { HealthModule } from './health/health.module';
import { DonorServiceModule } from '@app/donor-service';
import { AdminServiceModule } from '@app/admin-service';
import { AccountServiceModule } from '@app/account-service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CommonModule } from 'libs/common/src/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SuccessResponseMiddleware } from './success.middleware';
import { AppLogger } from '../libs/common/src/logger/logger.service';
import { DonationCenterServiceModule } from '@app/donation-center-service';
import { DatabaseSource } from '../libs/common/src/database/database-source';
import { DeviceInfoMiddleware } from 'libs/common/src/middlewares/device.info.middleware';

@Module({
  imports: [
    CqrsModule,
    CommonModule,
    TypeOrmModule.forRoot(DatabaseSource),
    CacheModule.register({ isGlobal: true }),
    ScheduleModule.forRoot(),
    HealthModule,
    TerminusModule,
    AdminServiceModule,
    LoggerModule.forRoot(),
    AuthServiceModule,
    AccountServiceModule,
    DonorServiceModule,
    DonationCenterServiceModule,
    ConfigModule.forRoot(),
    RouterModule.register([
      {
        path: 'v1/auth',
        module: AuthServiceModule,
      },
      {
        path: 'v1/admin',
        module: AdminServiceModule,
      },
      {
        path: 'v1/account',
        module: AccountServiceModule,
      },
      {
        path: 'v1/donor',
        module: DonorServiceModule,
      },
      {
        path: 'v1/donation-center',
        module: DonationCenterServiceModule,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DeviceInfoMiddleware).forRoutes('*');
    consumer.apply(SuccessResponseMiddleware).forRoutes('*');
  }
}
