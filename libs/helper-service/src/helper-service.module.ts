import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupportService } from '../../notification-service/src/services/support.service';
import { S3UploadService } from './services/s3-upload.service';
import { ImageUploadService } from './services/image-upload.service';
import { EmailSenderService } from './services/email-sender.service';
import { GoogleLocationService } from './services/google-location.service';
import { AppLogger } from 'libs/common/src/logger/logger.service';

@Module({
  imports: [ConfigModule],
  exports: [
    ImageUploadService,
    S3UploadService,
    GoogleLocationService,
    EmailSenderService,
    SupportService,
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
  ],
})
export class HelperServiceModule {}
