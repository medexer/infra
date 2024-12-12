import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { CreateAccountEvent } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import newAccountNotifications from 'libs/notification-service/src/bases/account/create.account.notification';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';

@EventsHandler(CreateAccountEvent)
export class CreateAccountEventHandler
  implements IEventHandler<CreateAccountEvent>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    private readonly commandBus: CommandBus,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly emailNotificationService: EmailNotificationService,
  ) {}

  async handle(event: CreateAccountEvent) {
    try {
      this.logger.log(
        `[CREATE-ACCOUNT-EVENT-HANDLER-PROCESSING]: ${JSON.stringify(event)}`,
      );

      const { account } = event;

      // newAccountNotifications(account).newAccount();

      this.emailNotificationService.newAccountNotifications(account);

      this.logger.log(`[CREATE-ACCOUNT-EVENT-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[CREATE-ACCOUNT-EVENT-HANDLER]: ${error}`);

      throw error;
    }
  }
}
