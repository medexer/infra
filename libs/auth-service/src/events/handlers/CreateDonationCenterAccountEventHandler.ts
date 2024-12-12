import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DaysOfWork,
  OpeningHours,
  DonationCenter,
  DonationCenterConfig,
  DonationCenterCompliance,
} from 'libs/common/src/models/donation.center.model';
import { CreateDonationCenterAccountEvent } from '../impl';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';

@EventsHandler(CreateDonationCenterAccountEvent)
export class CreateDonationCenterAccountEventHandler
  implements IEventHandler<CreateDonationCenterAccountEvent>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    private readonly emailNotificationService: EmailNotificationService,
    @InjectRepository(DaysOfWork)
    private readonly daysOfWorkRepository: Repository<DaysOfWork>,
    @InjectRepository(OpeningHours)
    private readonly openingHoursRepository: Repository<OpeningHours>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
    @InjectRepository(DonationCenterConfig)
    private readonly donationCenterConfigRepository: Repository<DonationCenterConfig>,
    @InjectRepository(DonationCenterCompliance)
    private readonly donationCenterComplianceRepository: Repository<DonationCenterCompliance>,
  ) {}

  async handle(event: CreateDonationCenterAccountEvent) {
    try {
      this.logger.log(
        `[CREATE-DONATION-CENTER-ACCOUNT-EVENT-HANDLER-PROCESSING]: ${JSON.stringify(event)}`,
      );

      const { account, donationCenter } = event;

      const defaultOpeningHours = {
        open: '09:00',
        close: '17:00',
        alwaysOpen: false,
        closed: false,
        donation_center: donationCenter,
      };

      const monday = await this.openingHoursRepository.save({
        ...defaultOpeningHours,
      });
      const tuesday = await this.openingHoursRepository.save({
        ...defaultOpeningHours,
      });
      const wednesday = await this.openingHoursRepository.save({
        ...defaultOpeningHours,
      });
      const thursday = await this.openingHoursRepository.save({
        ...defaultOpeningHours,
      });
      const friday = await this.openingHoursRepository.save({
        ...defaultOpeningHours,
      });
      const saturday = await this.openingHoursRepository.save({
        ...defaultOpeningHours,
      });
      const sunday = await this.openingHoursRepository.save({
        ...defaultOpeningHours,
      });

      const daysOfWork = await this.daysOfWorkRepository.save({
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        donation_center: donationCenter,
      });

      await this.donationCenterComplianceRepository.save({
        donationCenter: donationCenter,
      });

      await this.donationCenterConfigRepository.save({
        daysOfWork,
        donation_center: donationCenter,
      });

      this.emailNotificationService.newDonationCenterAccountNotification(
        account,
      );

      this.logger.log(`[CREATE-DONATION-CENTER-ACCOUNT-EVENT-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(
        `[CREATE-DONATION-CENTER-ACCOUNT-EVENT-HANDLER]: ${error}`,
      );

      throw error;
    }
  }
}
