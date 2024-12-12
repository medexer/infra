import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { EmailNotificationService } from './services/email.notification.service';
import { Account } from 'libs/common/src/models/account.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), ConfigModule],
  providers: [
    EmailNotificationService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
  ],
  exports: [EmailNotificationService],
})
export class NotificationServiceModule {}
