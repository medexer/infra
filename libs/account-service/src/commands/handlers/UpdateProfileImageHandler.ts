import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAccountNameCommand, UpdateProfileImageCommand } from '../impl';
import authUtils from 'libs/common/src/security/auth.utils';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import {
  ForbiddenException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';

@CommandHandler(UpdateProfileImageCommand)
export class UpdateProfileImageHandler
  implements ICommandHandler<UpdateProfileImageCommand, AccountInfo>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async execute(command: UpdateProfileImageCommand) {
    try {
      this.logger.log(`[UPDATE-ACCOUNT-PROFILE-PHOTO-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const account = await this.accountRepository.findOne({
        where: {
          id: secureUser.id,
        },
      });

      if (!account) {
        throw new UnauthorizedException('Account not found.');
      }

      Object.assign(account, {
        profilePhoto: payload.imageUrl,
      });

      await this.accountRepository.save(account);

      this.logger.log(`[UPDATE-ACCOUNT-PROFILE-PHOTO-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatAccountInfo(account);
    } catch (error) {
      this.logger.log(`[UPDATE-ACCOUNT-PROFILE-PHOTO-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
