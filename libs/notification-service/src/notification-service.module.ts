import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { EmailNotificationService } from './services/email.notification.service';
import { Account } from 'libs/common/src/models/account.model';
import { ConfigModule } from '@nestjs/config';
import { EmailSenderService } from 'libs/helper-service/src/services/email-sender.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), ConfigModule],
  providers: [
    EmailSenderService,
    EmailNotificationService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
  ],
  exports: [EmailNotificationService],
})
export class NotificationServiceModule {}
