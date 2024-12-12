import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyNewAccountEmailCommand } from '../impl';
import { Account } from 'libs/common/src/models/account.model';
import {
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';

@CommandHandler(VerifyNewAccountEmailCommand)
export class VerifyNewAccountEmailHandler
  implements ICommandHandler<VerifyNewAccountEmailCommand>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async execute(command: VerifyNewAccountEmailCommand) {
    try {
      this.logger.log(`[VERIFY-NEW-ACCOUNT-EMAIL-HANDLER-PROCESSING]`);

      const { payload } = command;

      const account = await this.accountRepository.findOne({
        where: {
          activationCode: payload.otp,
          activationCodeExpires: MoreThanOrEqual(new Date()),
        },
      });

      if (!account) {
        throw new UnauthorizedException('Invalid OTP or OTP expired');
      }

      Object.assign(account, {
        newEmail: '',
        activationCode: '',
        email: account.newEmail,
        activationCodeExpires: null,
      });

      await this.accountRepository.save(account);

      this.logger.log(`[VERIFY-NEW-ACCOUNT-EMAIL-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[VERIFY-NEW-ACCOUNT-EMAIL-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
