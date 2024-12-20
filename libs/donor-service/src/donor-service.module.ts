import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder } from '@nestjs/swagger';
import {
  DaysOfWork,
  OpeningHours,
  DonationCenter,
} from 'libs/common/src/models/donation.center.model';
import { DonorService } from './services/donor.service';
import { GetSystemJWTModule } from 'libs/common/src/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { setupSwaggerDocument } from 'libs/common/src/swagger';
import { Account } from 'libs/common/src/models/account.model';
import { DonorController } from './controllers/donor.controller';
import { DonorServiceCommandHandlers } from './commands/handlers';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { DonorCompliance } from 'libs/common/src/models/donor.compliance.model';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    GetSystemJWTModule(),
    TypeOrmModule.forFeature([
      Account,
      DonorCompliance,
      DonationCenter,
      DaysOfWork,
      OpeningHours,
    ]),
  ],
  providers: [
    DonorService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    EmailNotificationService,
    ...DonorServiceCommandHandlers,
  ],
  exports: [DonorService],
  controllers: [DonorController],
})
export class DonorServiceModule {
  constructor(private configService: ConfigService) {
    setupSwaggerDocument(
      'donor-service',
      new DocumentBuilder()
        .addBearerAuth()
        .addServer(this.configService.get<string>('API_HOST'))
        .setTitle('Donor Service Docs')
        .setDescription('Donor service endpoints...')
        .setVersion('1.0')
        .build(),
    )(DonorServiceModule);
  }
}
