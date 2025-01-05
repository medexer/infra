import { Repository, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { UpdateDonationCenterAccountProfileCommand } from '../impl';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';
import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';

@CommandHandler(UpdateDonationCenterAccountProfileCommand)
export class UpdateDonationCenterAccountProfileHandler
  implements
    ICommandHandler<UpdateDonationCenterAccountProfileCommand, AccountInfo>
{
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async execute(command: UpdateDonationCenterAccountProfileCommand) {
    try {
      this.logger.log(
        `[UPDATE-DONATION-CENTER-ACCOUNT-PROFILE-HANDLER-PROCESSING]`,
      );

      const { payload, secureUser } = command;

      const account = await this.accountRepository.findOne({
        where: {
          id: secureUser.id,
        },
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      const emailExists = await this.accountRepository.exists({
        where: {
          email: payload.email,
          id: Not(secureUser.id),
        },
      });

      if (emailExists) {
        throw new BadRequestException('Email already exists');
      }

      Object.assign(account, {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        profilePhoto: payload.profilePhoto,
      });

      const updatedAccount = await this.accountRepository.save(account);

      this.logger.log(
        `[UPDATE-DONATION-CENTER-ACCOUNT-PROFILE-HANDLER-SUCCESS]`,
      );

      return modelsFormatter.FormatAccountInfo(updatedAccount);
    } catch (error) {
      this.logger.log(
        `[UPDATE-DONATION-CENTER-ACCOUNT-PROFILE-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
