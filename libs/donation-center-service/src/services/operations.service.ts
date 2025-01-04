import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SecureUserPayload } from 'libs/common/src/interface';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import {
  DonationCenter,
  DaysOfWork,
  DonationCenterConfig,
  DonationCenterOperationsInfo,
} from 'libs/common/src/models/donation.center.model';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';

@Injectable()
export class OperationsService {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(DaysOfWork)
    private readonly daysOfWorkRepository: Repository<DaysOfWork>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
    @InjectRepository(DonationCenterConfig)
    private readonly donationCenterConfigRepository: Repository<DonationCenterConfig>,
  ) {}

  async getDonationCenterOperationsInfo(donationCenterId: number): Promise<DonationCenterOperationsInfo> {
    try {
      this.logger.log('[FETCH-DONATION-CENTER-DAYS-OF-WORK-PROCESSING]');

      const config = await this.donationCenterConfigRepository.findOne({
        where: {
          donation_center: {
            id: donationCenterId,
          },
        },
        relations: ['daysOfWork', 'donation_center'],
      });

      this.logger.error(`[FETCH-DONATION-CENTER-DAYS-OF-WORK-SUCCESS]`);

      return modelsFormatter.FormatDonationCenterOperationsInfo(config);
    } catch (error) {
      this.logger.error(
        `[FETCH-DONATION-CENTER-DAYS-OF-WORK-FAILED] :: ${error}`,
      );

      throw error;
    }
  }
}
