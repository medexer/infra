import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder } from '@nestjs/swagger';
import { GetSystemJWTModule } from 'libs/common/src/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { setupSwaggerDocument } from 'libs/common/src/swagger';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Appointment } from 'libs/common/src/models/appointment.model';
import { DonationCenterService } from './services/donation.center.service';
import { DonationCenterServiceCommandHandlers } from './commands/handlers';
import { DonationCenterController } from './controllers/donation.center.controller';
import { EmailSenderService } from 'libs/helper-service/src/services/email-sender.service';
import { GoogleLocationService } from 'libs/helper-service/src/services/google-location.service';
import { DonationCenterAppointmentService } from './services/donation.center.appointment.service';
import { AddressHelperController } from 'libs/helper-service/src/controllers/address.helper.controller';
import { DonationCenter, DonationCenterCompliance } from 'libs/common/src/models/donation.center.model';
import { DonationCenterAppointmentController } from './controllers/donation.center..appointment.controller';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    GetSystemJWTModule(),
    TypeOrmModule.forFeature([
      Account,
      Appointment,
      DonationCenter,
      DonationCenterCompliance,
    ]),
  ],
  providers: [
    DonationCenterService,
    GoogleLocationService,
    DonationCenterAppointmentService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    EmailSenderService,
    EmailNotificationService,
    ...DonationCenterServiceCommandHandlers,
  ],
  exports: [DonationCenterService, ],
  controllers: [DonationCenterController, DonationCenterAppointmentController, AddressHelperController],
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
