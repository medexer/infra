import { Repository } from 'typeorm';
import { SignInAsCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { SigninResponsePayload } from '../../interface';
import { AuthService } from '../../services/auth.service';
import authUtils from 'libs/common/src/security/auth.utils';
import { Account } from 'libs/common/src/models/account.model';
import { ForbiddenException, Inject, UnauthorizedException } from '@nestjs/common';
import { AccountStatus, AccountType } from 'libs/common/src/constants/enums';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserNotFoundException } from 'libs/common/src/constants/exceptions';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';

@CommandHandler(SignInAsCommand)
export class SignInAsHandler
  implements ICommandHandler<SignInAsCommand, SigninResponsePayload>
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly authService: AuthService,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly emailNotificationService: EmailNotificationService,
  ) {}

  async execute(command: SignInAsCommand) {
    try {
      this.logger.log(`[SIGNIN-AS-HANDLER-PROCESSING]`);

      const { payload } = command;

      const account = await this.accountRepository.findOneBy({
        email: payload.email,
      });

      if (!account) {
        throw UserNotFoundException();
      }

      if (!authUtils.comparePassword(payload.password, account.password)) {
        this.logger.log(`[SIGNIN-AS-HANDLER-SUCCESS]`);

        throw new UnauthorizedException(
          'Unable to log in. Please verify your email and password.',
        );
      }

      switch (payload.accountType) {
        case AccountType.ADMIN:
          if (
            ![AccountType.ADMIN, AccountType.SUPER_ADMIN].includes(
              account.accountType,
            )
          ) {
            throw new ForbiddenException(
              'Access denied. You are not authorized to access the Admin portal.',
            );
          }

          break;
        case AccountType.DONATION_CENTER:
          if (
            ![AccountType.DONATION_CENTER].includes(
              account.accountType,
            )
          ) {
            throw new ForbiddenException(
              'Access denied. You are not authorized to access the donation center portal.',
            );
          }

          break;
        default:
          throw new ForbiddenException('Invalid account type specified.');
      }

      account.lastLogin = new Date();
      await this.accountRepository.save(account);

      this.logger.log(`[SIGNIN-AS-HANDLER-SUCCESS]`);

      this.logger.log(`[SIGNIN-AS-HANDLER-SUCCESS]`);

      return {
        token: await this.authService.generateUserJWT(account),
      };
    } catch (error) {
      this.logger.log(`[SIGNIN-AS-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
