import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder } from '@nestjs/swagger';
import { GetSystemJWTModule } from 'libs/common/src/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { setupSwaggerDocument } from 'libs/common/src/swagger';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { DonationCenterService } from './services/donation.center.service';
import { DonationCenterServiceCommandHandlers } from './commands/handlers';
import { DonationCenterController } from './controllers/donation.center.controller';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';
import { DonationCenter, DonationCenterCompliance } from 'libs/common/src/models/donation.center.model';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    GetSystemJWTModule(),
    TypeOrmModule.forFeature([
      Account,
      DonationCenter,
      DonationCenterCompliance,
    ]),
  ],
  providers: [
    DonationCenterService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    EmailNotificationService,
    ...DonationCenterServiceCommandHandlers,
  ],
  exports: [DonationCenterService],
  controllers: [DonationCenterController],
})
export class DonationCenterServiceModule {
  constructor(private configService: ConfigService) {
    setupSwaggerDocument(
      'donation-center-service',
      new DocumentBuilder()
        .addBearerAuth()
        .addServer(this.configService.get<string>('API_HOST'))
        .setTitle('Donation Center Service Docs')
        .setDescription('Donation center service endpoints...')
        .setVersion('1.0')
        .build(),
    )(DonationCenterServiceModule);
  }
}
