import {
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DonationCenter,
  DonationCenterRating,
} from 'libs/common/src/models/donation.center.model';
import { AddDonationCenterRatingCommand } from '../impl';
import { Account } from 'libs/common/src/models/account.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Appointment } from 'libs/common/src/models/appointment.model';
import { UserNotFoundException } from 'libs/common/src/constants/exceptions';

@CommandHandler(AddDonationCenterRatingCommand)
export class AddDonationCenterRatingHandler
  implements ICommandHandler<AddDonationCenterRatingCommand>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(DonationCenterRating)
    private readonly donationCenterRatingRepository: Repository<DonationCenterRating>,
  ) {}

  async execute(command: AddDonationCenterRatingCommand) {
    try {
      this.logger.log(`[ADD-DONATION-CENTER-RATING-HANDLER-PROCESSING]`);

      const { payload, secureUser, appointmentId } = command;

      const account = await this.accountRepository.findOne({
        where: { id: secureUser.id },
      });

      if (!account) {
        throw UserNotFoundException();
      }
      
      const appointment = await this.appointmentRepository.findOne({
        where: { id: appointmentId },
        relations: ['donation_center'],
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      if (appointment.hasCompletedReview) {
        throw new BadRequestException('Appointment has already been reviewed');
      }

      if (payload.rating === '0') {
        throw new BadRequestException('Rating cannot be 0');
      }

      if (payload.rating === '1') {
        Object.assign(appointment.donation_center, {
          ratingOne: (
            parseInt(appointment.donation_center.ratingOne) + parseInt(payload.rating)
          ).toString(),
        });
      } else if (payload.rating === '2') {
        Object.assign(appointment.donation_center, {
          ratingTwo: (
            parseInt(appointment.donation_center.ratingTwo) + parseInt(payload.rating)
          ).toString(),
        });
      } else if (payload.rating === '3') {
        Object.assign(appointment.donation_center, {
          ratingThree: (
            parseInt(appointment.donation_center.ratingThree) + parseInt(payload.rating)
          ).toString(),
        });
      } else if (payload.rating === '4') {
        Object.assign(appointment.donation_center, {
          ratingFour: (
            parseInt(appointment.donation_center.ratingFour) + parseInt(payload.rating)
          ).toString(),
        });
      } else if (payload.rating === '5') {
        Object.assign(appointment.donation_center, {
          ratingFive: (
            parseInt(appointment.donation_center.ratingFive) + parseInt(payload.rating)
          ).toString(),
        });
      }

      await this.appointmentRepository.update(appointmentId, {
        hasCompletedReview: true,
      });

      await this.donationCenterRepository.save(appointment.donation_center);

      await this.donationCenterRatingRepository.save({
        ...payload,
        account,
        donationCenter: appointment.donation_center,
      });

      this.logger.log(`[ADD-DONATION-CENTER-RATING-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[ADD-DONATION-CENTER-RATING-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
