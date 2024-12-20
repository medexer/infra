import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3UploadService } from './services/s3-upload.service';
import { ImageUploadService } from './services/image-upload.service';
import { GoogleLocationService } from './services/google-location.service';

@Module({
  imports: [ConfigModule],
  exports: [ImageUploadService, S3UploadService, GoogleLocationService],
  providers: [ImageUploadService, S3UploadService, GoogleLocationService],
})
export class HelperServiceModule {}

