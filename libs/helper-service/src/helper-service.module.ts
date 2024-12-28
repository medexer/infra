import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupportService } from '../../notification-service/src/services/support.service';
import { S3UploadService } from './services/s3-upload.service';
import { ImageUploadService } from './services/image-upload.service';
import { EmailSenderService } from './services/email-sender.service';
import { GoogleLocationService } from './services/google-location.service';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { SeederService } from './services/seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'libs/common/src/models/account.model';
import { DonationCenter, DonationCenterCompliance } from 'libs/common/src/models/donation.center.model';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Account, DonationCenter, DonationCenterCompliance]),
  ],
  exports: [
    ImageUploadService,
    S3UploadService,
    GoogleLocationService,
    EmailSenderService,
    SupportService,
    SeederService,
  ],
  providers: [
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    ImageUploadService,
    S3UploadService,
    GoogleLocationService,
    EmailSenderService,
    SupportService,
    SeederService,
  ],
})
export class HelperServiceModule {}
