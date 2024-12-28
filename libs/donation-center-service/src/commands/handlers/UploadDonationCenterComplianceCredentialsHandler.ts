import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DonationCenter,
  DonationCenterCompliance,
  DonationCenterComplianceInfo,
} from 'libs/common/src/models/donation.center.model';
import { Account } from 'libs/common/src/models/account.model';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { UploadDonationCenterComplianceCredentialsCommand } from '../impl';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { UserNotFoundException } from 'libs/common/src/constants/exceptions';

@CommandHandler(UploadDonationCenterComplianceCredentialsCommand)
export class UploadDonationCenterComplianceCredentialsHandler
  implements
    ICommandHandler<
      UploadDonationCenterComplianceCredentialsCommand,
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

  async execute(command: UploadDonationCenterComplianceCredentialsCommand) {
    try {
      this.logger.log(
        `[UPLOAD-DONATION-CENTER-COMPLIANCE-CREDENTIALS-HANDLER-PROCESSING]`,
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
        relations: ['donationCenter'],
      });

      Object.assign(compliance, {
        cacCertificate: payload.cacCertificate,
        proofOfAddress: payload.proofOfAddress,
      });

      await this.donationCenterRepository.save({
        ...donationCenter,
        isComplianceUploaded: true,
      });

      await this.complianceRepository.save(compliance);

      this.logger.log(
        `[UPLOAD-DONATION-CENTER-COMPLIANCE-CREDENTIALS-HANDLER-SUCCESS]`,
      );

      return modelsFormatter.FormatDonationCenterComplianceInfo(
        await this.donationCenterRepository.findOne({
          where: { account: { id: account.id } },
          relations: ['account'],
        }),
        compliance,
      );
    } catch (error) {
      this.logger.log(
        `[UPLOAD-DONATION-CENTER-COMPLIANCE-CREDENTIALS-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
