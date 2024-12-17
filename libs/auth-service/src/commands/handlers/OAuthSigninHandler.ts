import { Repository } from 'typeorm';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { OAuthSignInCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../../services/auth.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { SigninResponsePayload } from 'libs/auth-service/src/interface';
import { UserNotFoundException } from 'libs/common/src/constants/exceptions';
import { AccountStatus, AccountType } from 'libs/common/src/constants/enums';

@CommandHandler(OAuthSignInCommand)
export class OAuthSignInHandler
  implements ICommandHandler<OAuthSignInCommand, SigninResponsePayload>
{
  constructor(
    private readonly authService: AuthService,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async execute(command: OAuthSignInCommand) {
    try {
      this.logger.log(`[OAUTH-SIGNIN-HANDLER-PROCESSING]`);

      const { payload, origin } = command;

      const account = await this.accountRepository.findOneBy({
        email: payload.email,
      });

      if (!account) {
        throw UserNotFoundException();
      }

      if (account.accountType !== AccountType.INDIVIDUAL) {
        throw new UnauthorizedException(
          'Account is not an individual account.',
        );
      }

      if (account.status === AccountStatus.PENDING) {
        throw new UnauthorizedException(
          'Account not activated. Please contact support to complete your verification.',
        );
      } else if (
        account.status === AccountStatus.DISABLED ||
        account.status === AccountStatus.INACTIVE ||
        account.status === AccountStatus.SHADOW_BANNED
      ) {
        throw new UnauthorizedException(
          'Account disabled. Please contact support.',
        );
      }

      this.logger.log(`[OAUTH-SIGN-SUCCESS]`);

      return {
        token: await this.authService.generateUserJWT(account),
      };
    } catch (error) {
      this.logger.log(`[OAUTH-SIGNIN-HANDLER-ERROR] :: ${error}`);
      console.log(error);

      throw error;
    }
  }
}
