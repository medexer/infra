import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import {
  DaysOfWork,
  OpeningHours,
  DonationCenter,
  DonationCenterConfig,
  DonationCenterCompliance,
} from 'libs/common/src/models/donation.center.model';
import { GetSystemJWTModule } from '../../common/src/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthServiceEventHandlers } from './events/handlers';
import { AuthController } from './controllers/auth.controller';
import { Account } from 'libs/common/src/models/account.model';
import { setupSwaggerDocument } from '../../common/src/swagger';
import { AuthServiceCommandHandlers } from './commands/handlers';
import { AppLogger } from '../../common/src/logger/logger.service';
import { AuthHelperController } from './controllers/auth.helper.controller';
import { BloodInventory } from 'libs/common/src/models/blood.inventory.model';
import { EmailSenderService } from 'libs/helper-service/src/services/email-sender.service';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';

@Module({
  imports: [
    ConfigModule,
    CqrsModule,
    GetSystemJWTModule(),
    TypeOrmModule.forFeature([
      Account,
      DaysOfWork,
      OpeningHours,
      DonationCenter,
      BloodInventory,
      DonationCenterConfig,
      DonationCenterCompliance,
    ]),
  ],
  providers: [
    AuthService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    EmailSenderService,
    EmailNotificationService,
    ...AuthServiceEventHandlers,
    ...AuthServiceCommandHandlers,
  ],
  exports: [AuthService],
  controllers: [
    AuthController,
    AuthHelperController,
  ],
})
export class AuthServiceModule {
  constructor(private configService: ConfigService) {
    setupSwaggerDocument(
      'auth-service',
      new DocumentBuilder()
        .addBearerAuth()
        .addServer(this.configService.get<string>('API_HOST'))
        .setTitle('Auth Docs')
        .setDescription('Authentication endpoints...')
        .setVersion('1.0')
        .build(),
    )(AuthServiceModule);
  }
}
