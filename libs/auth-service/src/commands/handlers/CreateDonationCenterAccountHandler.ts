import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SigninResponsePayload,
  SignupResponsePayload,
  CreateDonationCenterAccountDTO,
} from '../../interface';
import authUtils from 'libs/common/src/security/auth.utils';
import { CreateDonationCenterAccountCommand } from '../impl';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ReferralCodeGenerator } from 'libs/common/src/utils/id.generator';
import { EmailAlreadyUsedException } from 'libs/common/src/constants/exceptions';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';
import { CreateDonationCenterAccountEvent } from '../../events/impl';
import { DonationCenter } from 'libs/common/src/models/donation.center.model';
import { AuthService } from '../../services/auth.service';
import { AccountType } from 'libs/common/src/constants/enums';

@CommandHandler(CreateDonationCenterAccountCommand)
export class CreateDonationCenterAccountHandler
  implements
    ICommandHandler<CreateDonationCenterAccountCommand, SigninResponsePayload>
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly authService: AuthService,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
  ) {}

  async execute(command: CreateDonationCenterAccountCommand) {
    try {
      this.logger.log(`[CREATE-DONATION-CENTER-ACCOUNT-HANDLER-PROCESSING]`);

      const { payload, origin } = command;

      const newAccount = await this.createDonationCenterAccount(payload);

      const donationCenter = await this.donationCenterRepository.save({
        ...payload,
        account: newAccount,
      });

      this.eventBus.publish(
        new CreateDonationCenterAccountEvent(
          origin,
          newAccount,
          donationCenter,
        ),
      );

      this.logger.log(`[CREATE-DONATION-CENTER-ACCOUNT-HANDLER-SUCCESS]`);

      return {
        token: await this.authService.generateUserJWT(newAccount),
      };
    } catch (error) {
      this.logger.log(
        `[CREATE-DONATION-CENTER-ACCOUNT-HANDLER-ERROR] :: ${error}`,
      );
      // console.log(error);

      throw error;
    }
  }

  async createDonationCenterAccount(
    payload: CreateDonationCenterAccountDTO,
  ): Promise<Account> {
    this.logger.log(`[CREATE-DONATION-CENTER-ACCOUNT-HANDLER-PROCESSING]`);

    let filterUser = [
      {
        email: payload.email,
      },
      {
        phone: payload.phone,
      },
    ];

    const existingUser = await this.accountRepository.findOne({
      where: filterUser,
    });

    if (existingUser) {
      throw EmailAlreadyUsedException();
    }

    const password = await authUtils.hashPassword(payload.password);

    const newAccount = await this.accountRepository.save({
      ...payload,
      password,
      genotype: null,
      bloodGroup: null,
      lastLogin: new Date(),
      referralCode: ReferralCodeGenerator(),
      accountType: AccountType.DONATION_CENTER,
    });

    this.logger.log(`[CREATE-DONATION-CENTER-ACCOUNT-HANDLER-SUCCESS]`);

    return newAccount;
  }
}
