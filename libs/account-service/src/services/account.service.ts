import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';
import { AppLogger } from '../../../common/src/logger/logger.service';
import { SecureUserPayload } from 'libs/common/src/interface';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';

@Injectable()
export class AccountService {
  constructor(
    public jwtService: JwtService,
    public commandBus: CommandBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async getDetailedProfile(
    secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    try {
      this.logger.log('[GET-DETAILED-ACCOUNT-PROCESSING]');

      const account = await this.accountRepository.findOneBy({
        id: secureUser.id,
      });

      if (!account) {
        throw new Error(`Account with id ${secureUser.id} not found`);
      }

      this.logger.log('[GET-DETAILED-ACCOUNT-SUCCESS]');

      return modelsFormatter.FormatAccountInfo(account);
    } catch (error) {
      this.logger.log(`[GET-DETAILED-ACCOUNT-ERROR] : ${error}`);

      throw error;
    }
  }
}
