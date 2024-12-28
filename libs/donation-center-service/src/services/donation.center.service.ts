import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from '../../../common/src/logger/logger.service';
import {
  DonationCenter,
  DonationCenterInfo,
} from 'libs/common/src/models/donation.center.model';
import { AccountType } from 'libs/common/src/constants/enums';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { SecureUserPayload } from 'libs/common/src/interface';

@Injectable()
export class DonationCenterService {
  constructor(
    public commandBus: CommandBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
  ) {}

  async getDonationCenterProfile(
    secureUser: SecureUserPayload,
  ): Promise<DonationCenterInfo> {
    try {
      this.logger.log('[FETCH-DONATION-CENTER-PROFILE-PROCESSING]');

      const donationCenter = await this.donationCenterRepository.findOne({
        where: { account: { id: secureUser.id } },
        relations: ['account'],
      });

      if (!donationCenter) {
        throw new NotFoundException('Donation center not found');
      }

      this.logger.log('[FETCH-DONATION-CENTER-PROFILE-SUCCESS]');

      return modelsFormatter.FormatDetailedDonationCenterAccountResponse(
        donationCenter,
      );
    } catch (error) {
      this.logger.error(`[FETCH-DONATION-CENTER-PROFILE-FAILED] :: ${error}`);

      throw error;
    }
  }
}
