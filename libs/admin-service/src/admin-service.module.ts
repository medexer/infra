import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DocumentBuilder } from '@nestjs/swagger';
import { GetSystemJWTModule } from '../../common/src/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { setupSwaggerDocument } from '../../common/src/swagger';
import { AppLogger } from '../../common/src/logger/logger.service';
import { SeederController } from 'libs/helper-service/src/controllers/seeder.controller';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { SeederService } from 'libs/helper-service/src/services/seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'libs/common/src/models/account.model';
import { DonationCenter, DonationCenterCompliance } from 'libs/common/src/models/donation.center.model';
import { GoogleLocationService } from 'libs/helper-service/src/services/google-location.service';

@Module({
  imports: [
    ConfigModule,
    CqrsModule,
    GetSystemJWTModule(),
    TypeOrmModule.forFeature([Account, DonationCenter, DonationCenterCompliance]),
  ],
  providers: [
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    AdminService,
    SeederService,
    GoogleLocationService,
  ],
  exports: [],
  controllers: [AdminController, SeederController],
})
export class AdminServiceModule {
  constructor(private configService: ConfigService) {
    setupSwaggerDocument(
      'admin-service',
      new DocumentBuilder()
        .addBearerAuth()
        .addServer(this.configService.get<string>('API_HOST'))
        .setTitle('Admin Docs')
        .setDescription('Admin endpoints...')
        .setVersion('1.0')
        .build(),
    )(AdminServiceModule);
  }
}
