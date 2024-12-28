import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'libs/common/src/models/account.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { UploadDonationCenterComplianceDetailsCommand } from '../impl';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { UserNotFoundException } from 'libs/common/src/constants/exceptions';
import {
  DonationCenter,
  DonationCenterCompliance,
  DonationCenterComplianceInfo,
} from 'libs/common/src/models/donation.center.model';

@CommandHandler(UploadDonationCenterComplianceDetailsCommand)
export class UploadDonationCenterComplianceDetailsHandler
  implements
    ICommandHandler<
      UploadDonationCenterComplianceDetailsCommand,
      DonationCenterComplianceInfo
    >
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
    @InjectRepository(DonationCenterCompliance)
    private readonly complianceRepository: Repository<DonationCenterCompliance>,
  ) {}

  async execute(command: UploadDonationCenterComplianceDetailsCommand) {
    try {
      this.logger.log(
        `[UPLOAD-DONATION-CENTER-COMPLIANCE-DETAILS-HANDLER-PROCESSING]`,
      );

      const { payload, secureUser } = command;

      const account = await this.accountRepository.findOne({
        where: { id: secureUser.id },
      });

      if (!account) {
        throw UserNotFoundException();
      }

      const donationCenter = await this.donationCenterRepository.findOne({
        where: { account: { id: account.id } },
        relations: ['account'],
      });

      const compliance = await this.complianceRepository.findOne({
        where: { donationCenter: { id: donationCenter.id } },
      });

      Object.assign(donationCenter, {
        name: payload.name,
        logo: payload.logo,
        email: payload.email,
        phone: payload.phone,
        coverPhoto: payload.coverPhoto,
        longDescription: payload.longDescription,
        shortDescription: payload.shortDescription,
      });

      await this.donationCenterRepository.save(donationCenter);

      this.logger.log(
        `[UPLOAD-DONATION-CENTER-COMPLIANCE-DETAILS-HANDLER-SUCCESS]`,
      );

      return modelsFormatter.FormatDonationCenterComplianceInfo(
        donationCenter,
        compliance,
      );
    } catch (error) {
      this.logger.log(
        `[UPLOAD-DONATION-CENTER-COMPLIANCE-DETAILS-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
