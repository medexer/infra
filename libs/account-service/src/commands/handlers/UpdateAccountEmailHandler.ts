import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAccountEmailCommand } from '../impl';
import authUtils from 'libs/common/src/security/auth.utils';
import { Account } from 'libs/common/src/models/account.model';
import { ForbiddenException, Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { UserNotFoundException } from 'libs/common/src/constants/exceptions';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';

@CommandHandler(UpdateAccountEmailCommand)
export class UpdateAccountEmailHandler
  implements ICommandHandler<UpdateAccountEmailCommand>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly emailNotificationService: EmailNotificationService,
  ) {}

  async execute(command: UpdateAccountEmailCommand) {
    try {
      this.logger.log(`[UPDATE-ACCOUNT-EMAIL-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const accountExists = await this.accountRepository.findOne({
        where: {
          email: payload.newEmail,
        },
      });

      if (accountExists) {
        throw new ForbiddenException('Email already exists.');
      }

      const account = await this.accountRepository.findOne({
        where: {
          id: secureUser.id,
        },
      });

      const activationCode = authUtils.generateRandomPin();
      const activationCodeExpiration = authUtils.generateFutureDate(1, 'hours');
     

      Object.assign(account, {
        newEmail: payload.newEmail,
        activationCode: activationCode,
        activationCodeExpires: activationCodeExpiration,
      });

      await this.accountRepository.save(account);

      this.emailNotificationService.verifyNewAccountEmailNotification(account);

      this.logger.log(`[UPDATE-ACCOUNT-EMAIL-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[UPDATE-ACCOUNT-EMAIL-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
