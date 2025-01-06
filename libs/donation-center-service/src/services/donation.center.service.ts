import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from '../../../common/src/logger/logger.service';
import {
  DonationCenter,
  DonationCenterCompliance,
  DonationCenterComplianceInfo,
  DonationCenterInfo,
  DonationCenterRatingsInfo,
  DonationCenterRating,
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
    @InjectRepository(DonationCenterCompliance)
    private readonly donationCenterComplianceRepository: Repository<DonationCenterCompliance>,
    @InjectRepository(DonationCenterRating)
    private readonly donationCenterRatingRepository: Repository<DonationCenterRating>,
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

  async getDonationCenterRatings(
    secureUser: SecureUserPayload,
  ): Promise<DonationCenterRatingsInfo> {
    try {
      this.logger.log('[FETCH-DONATION-CENTER-RATINGS-PROCESSING]');

      const donationCenter = await this.donationCenterRepository.findOne({
        where: { account: { id: secureUser.id } },
        relations: ['account'],
      });

      if (!donationCenter) {
        throw new NotFoundException('Donation center not found');
      }

      const ratings = await this.donationCenterRatingRepository.find({
        where: { donationCenter: { id: donationCenter.id } },
        relations: ['account', 'donationCenter'],
      });

      
      this.logger.log('[FETCH-DONATION-CENTER-RATINGS-SUCCESS]');
      
      return modelsFormatter.FormatDonationCenterRatingsInfo(
        donationCenter,
        ratings,
      );
    } catch (error) {
      this.logger.error(`[FETCH-DONATION-CENTER-RATINGS-FAILED] :: ${error}`);

      throw error;
    }
  }

  async getComplianceInfo(
    secureUser: SecureUserPayload,
  ): Promise<DonationCenterComplianceInfo> {
    try {
      this.logger.log('[FETCH-DONATION-CENTER-COMPLIANCE-INFO-PROCESSING]');

      const donationCenter = await this.donationCenterRepository.findOne({
        where: { account: { id: secureUser.id } },
        relations: ['account'],
      });

      if (!donationCenter) {
        throw new NotFoundException('Donation center not found');
      }

      const compliance = await this.donationCenterComplianceRepository.findOne({
        where: { donationCenter: { id: donationCenter.id } },
      });

      this.logger.log('[FETCH-DONATION-CENTER-COMPLIANCE-INFO-SUCCESS]');

      return modelsFormatter.FormatDonationCenterComplianceInfo(
        donationCenter,
        compliance,
      );
    } catch (error) {
      this.logger.error(
        `[FETCH-DONATION-CENTER-COMPLIANCE-INFO-FAILED] :: ${error}`,
      );

      throw error;
    }
  }
}
