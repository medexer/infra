import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { CreateAccountCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupResponsePayload } from '../../interface';
import authUtils from 'libs/common/src/security/auth.utils';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ReferralCodeGenerator } from 'libs/common/src/utils/id.generator';
import { EmailAlreadyUsedException } from 'libs/common/src/constants/exceptions';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand, SignupResponsePayload>
{
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly emailNotificationService: EmailNotificationService,
  ) {}

  async execute(command: CreateAccountCommand) {
    try {
      this.logger.log(`[CREATE-ACCOUNT-HANDLER-PROCESSING]`);

      const { payload, origin, createdWithGoogle } = command;

      const hashPayload = Object.fromEntries(
        Object.entries(payload).filter(
          ([key]) => !['referralCode', 'password'].includes(key),
        ),
      );

      // console.log('[HASH-PAYLOAD] : ', hashPayload);

      const hash = createHash('sha256')
        .update(JSON.stringify(hashPayload))
        .digest('hex');

      const activationCode = authUtils.generateRandomPin();
      const activationCodeExpiration = authUtils.generateFutureDate(1, 'hours');

      let filterUser = [
        {
          email: payload.email,
        },
        {
          phone: payload.phone,
        },
      ];

      if (createdWithGoogle) {
        filterUser = [
          {
            email: payload.email,
          },
        ];
      }

      const existingUser = await this.accountRepository.findOne({
        where: filterUser,
      });

      if (existingUser && existingUser.signupVerificationHash === '') {
        throw EmailAlreadyUsedException();
      }

      const existingHash = await this.accountRepository.findOne({
        where: {
          signupVerificationHash: hash,
        },
      });

      if (existingHash) {
        Object.assign(existingHash, {
          ...existingHash,
          signupVerificationHash: hash,
          activationCode: activationCode,
          activationCodeExpires: activationCodeExpiration,
        });

        await this.accountRepository.save(existingHash);

        this.emailNotificationService.newAccountNotifications(existingHash);

        this.logger.log(`[CREATE-ACCOUNT-HANDLER-SUCCESS]`);

        return {
          signupVerificationHash: hash,
        } as SignupResponsePayload;
      } else {
        const password = await authUtils.hashPassword(payload.password);

        let referrer: Account;

        if (payload.referralCode && payload.referralCode !== '') {
          referrer = await this.accountRepository.findOne({
            where: {
              referralCode: payload.referralCode.toUpperCase(),
            },
          });
        }

        const newAccount = await this.accountRepository.save({
          ...payload,
          password,
          signupVerificationHash: hash,
          activationCode: activationCode,
          referrer: referrer ? referrer : null,
          referralCode: ReferralCodeGenerator(),
          activationCodeExpires: activationCodeExpiration,
        });

        // this.eventBus.publish(new CreateAccountEvent(origin, newAccount));

        this.emailNotificationService.newAccountNotifications(newAccount);

        this.logger.log(`[CREATE-ACCOUNT-HANDLER-SUCCESS]`);

        return {
          signupVerificationHash: newAccount.signupVerificationHash,
        } as SignupResponsePayload;
      }
    } catch (error) {
      this.logger.log(`[CREATE-ACCOUNT-HANDLER-ERROR] :: ${error}`);
      console.log(error);

      throw error;
    }
  }
}
