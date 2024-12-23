import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder } from '@nestjs/swagger';
import { AccountService } from './services/account.service';
import { GetSystemJWTModule } from '../../common/src/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ListItemService } from './services/list.item.service';
import { Account } from 'libs/common/src/models/account.model';
import { setupSwaggerDocument } from '../../common/src/swagger';
import { AccountServiceEventHandlers } from './events/handlers';
import { ListItem } from 'libs/common/src/models/list.item.model';
import { AppLogger } from '../../common/src/logger/logger.service';
import { AccountServiceCommandHandlers } from './commands/handlers';
import { AccountController } from './controllers/account.controller';
import { ListItemController } from './controllers/list.item.controller';
import { Notification } from 'libs/common/src/models/notification.model';
import { MedicalHistory } from 'libs/common/src/models/medical.history.model';
import { HelperServiceModule } from 'libs/helper-service/src/helper-service.module';
import { SupportController } from 'libs/notification-service/src/controllers/support.controller';
import { ImageUploadController } from 'libs/helper-service/src/controllers/image-upload.controller';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    HelperServiceModule,
    GetSystemJWTModule(),
    TypeOrmModule.forFeature([Account, MedicalHistory, ListItem, Notification]),
  ],
  controllers: [
    AccountController,
    SupportController,
    ListItemController,
    ImageUploadController,
  ],
  providers: [
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    AccountService,
    ListItemService,
    EmailNotificationService,
    ...AccountServiceEventHandlers,
    ...AccountServiceCommandHandlers,
  ],
  exports: [AccountService],
})
export class AccountServiceModule {
  constructor(private configService: ConfigService) {
    setupSwaggerDocument(
      'account-service',
      new DocumentBuilder()
        .addBearerAuth()
        .addServer(this.configService.get<string>('API_HOST'))
        .setTitle('Account Docs')
        .setDescription('Account endpoints...')
        .setVersion('1.0')
        .build(),
    )(AccountServiceModule);
  }
}
