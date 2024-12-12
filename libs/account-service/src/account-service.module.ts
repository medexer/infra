import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder } from '@nestjs/swagger';
import { GetSystemJWTModule } from '../../common/src/config';
import { Account } from 'libs/common/src/models/account.model';
import { AccountService } from './services/account.service';
import { setupSwaggerDocument } from '../../common/src/swagger';
import { AppLogger } from '../../common/src/logger/logger.service';
import { AccountServiceEventHandlers } from './events/handlers';
import { AccountServiceCommandHandlers } from './commands/handlers';
import { AccountController } from './controllers/account.controller';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    GetSystemJWTModule(),
    TypeOrmModule.forFeature([Account]),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
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
