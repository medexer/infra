import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3UploadService } from './services/s3-upload.service';
import { ImageUploadService } from './services/image-upload.service';

@Module({
  imports: [ConfigModule],
  providers: [ImageUploadService, S3UploadService],
  exports: [ImageUploadService, S3UploadService],
})
export class HelperServiceModule {}
