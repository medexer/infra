import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from '../../../common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { DonationCenter } from 'libs/common/src/models/donation.center.model';
import { DonationCenterInfo } from 'libs/common/src/models/donation.center.model';

@Injectable()
export class DonorService {
  constructor(
    public commandBus: CommandBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
  ) {}

  async getDonationCenters(): Promise<DonationCenterInfo[]> {
    try {
      this.logger.log('[FETCH-DONATION-CENTERS-PROCESSING]');

      const donationCenters: DonationCenterInfo[] = [];

      const centers = await this.donationCenterRepository.find({
        where: { isComplianceUploaded: true },
      });

      // console.log('[DONATION-CENTERS] :: ', centers.length);

      await Promise.all(
        centers.map(async (donationCenter) => {
          donationCenters.push(
            modelsFormatter.FormatDetailedDonationCenterAccountResponse(
              donationCenter,
            ),
          );
        }),
      );

      this.logger.log('[FETCH-DONATION-CENTERS-SUCCESS]');

      return donationCenters;
    } catch (error) {
      this.logger.error(`[FETCH-DONATION-CENTERS-FAILED] :: ${error}`);

      throw error;
    }
  }
}
