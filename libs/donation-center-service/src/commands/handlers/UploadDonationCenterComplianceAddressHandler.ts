import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'libs/common/src/models/account.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { UploadDonationCenterComplianceAddressCommand } from '../impl';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { UserNotFoundException } from 'libs/common/src/constants/exceptions';
import {
  DonationCenter,
  DonationCenterCompliance,
  DonationCenterComplianceInfo,
} from 'libs/common/src/models/donation.center.model';
import { GoogleLocationService } from 'libs/helper-service/src/services/google-location.service';

@CommandHandler(UploadDonationCenterComplianceAddressCommand)
export class UploadDonationCenterComplianceAddressHandler
  implements
    ICommandHandler<
      UploadDonationCenterComplianceAddressCommand,
      DonationCenterComplianceInfo
    >
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    private readonly googleLocationService: GoogleLocationService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
    @InjectRepository(DonationCenterCompliance)
    private readonly complianceRepository: Repository<DonationCenterCompliance>,
  ) {}

  async execute(command: UploadDonationCenterComplianceAddressCommand) {
    try {
      this.logger.log(
        `[UPLOAD-DONATION-CENTER-COMPLIANCE-ADDRESS-HANDLER-PROCESSING]`,
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

      const placeDetails = await this.googleLocationService.getPlaceDetails(
        payload.placeId,
      );

      console.log('[PLACE-DETAILS] : ', placeDetails);

      Object.assign(donationCenter, {
        state: payload.state,
        address: payload.address,
        // stateArea: payload.stateArea,
        buildingNumber: payload.buildingNumber,
        nearestLandmark: payload.nearestLandMark,
        latitude: placeDetails.geometry.location.lat,
        longitude: placeDetails.geometry.location.lng,
      });

      await this.donationCenterRepository.save(donationCenter);

      this.logger.log(
        `[UPLOAD-DONATION-CENTER-COMPLIANCE-ADDRESS-HANDLER-SUCCESS]`,
      );

      return modelsFormatter.FormatDonationCenterComplianceInfo(
        donationCenter,
        compliance,
      );
    } catch (error) {
      this.logger.log(
        `[UPLOAD-DONATION-CENTER-COMPLIANCE-ADDRESS-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
