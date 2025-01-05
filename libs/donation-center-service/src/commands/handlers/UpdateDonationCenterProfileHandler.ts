import { Repository, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateDonationCenterProfileCommand } from '../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { DonationCenter, DonationCenterInfo } from 'libs/common/src/models/donation.center.model';

@CommandHandler(UpdateDonationCenterProfileCommand)
export class UpdateDonationCenterProfileHandler
  implements
    ICommandHandler<UpdateDonationCenterProfileCommand, DonationCenterInfo>
{
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
  ) {}

  async execute(command: UpdateDonationCenterProfileCommand) {
    try {
      this.logger.log(
        `[UPDATE-DONATION-CENTER-PROFILE-HANDLER-PROCESSING]`,
      );

      const { payload, secureUser } = command;

      const donationCenter = await this.donationCenterRepository.findOne({
        where: {
          account: { id: secureUser.id },
        },
        relations: ['account'],
      });

      if (!donationCenter) {
        throw new NotFoundException('Donation center not found');
      }

      Object.assign(donationCenter, {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        coverPhoto: payload.coverPhoto,
      });

      const updatedDonationCenter = await this.donationCenterRepository.save(donationCenter);

      this.logger.log(
        `[UPDATE-DONATION-CENTER-PROFILE-HANDLER-SUCCESS]`,
      );

      return modelsFormatter.FormatDetailedDonationCenterAccountResponse(updatedDonationCenter);
    } catch (error) {
      this.logger.log(
        `[UPDATE-DONATION-CENTER-PROFILE-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
