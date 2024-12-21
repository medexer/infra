import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAppointmentCommand } from '../impl';
import authUtils from 'libs/common/src/security/auth.utils';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';
import { Inject, UnauthorizedException } from '@nestjs/common';
import {
  AccountStatus,
  AppointmentStatus,
} from 'libs/common/src/constants/enums';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  AppointmentAlreadyExistsException,
  UnauthorizedDonorException,
  UserNotFoundException,
} from 'libs/common/src/constants/exceptions';
import { DonorCompliance } from 'libs/common/src/models/donor.compliance.model';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import {
  Appointment,
  AppointmentInfo,
} from 'libs/common/src/models/appointment.model';
import { DonationCenter } from 'libs/common/src/models/donation.center.model';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';
import { GenerateUniqueTrackingNumber } from 'libs/common/src/utils/id.generator';

@CommandHandler(CreateAppointmentCommand)
export class CreateAppointmentHandler
  implements ICommandHandler<CreateAppointmentCommand, AppointmentInfo>
{
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    private readonly emailNotificationService: EmailNotificationService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
  ) {}

  async execute(command: CreateAppointmentCommand) {
    try {
      this.logger.log(`[CREATE-APPOINTMENT-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const account = await this.accountRepository.findOne({
        where: { id: secureUser.id },
      });

      if (!account) {
        throw UserNotFoundException();
      }

      if (account.inRecovery) {
        throw UnauthorizedDonorException();
      }

      const appointment = await this.appointmentRepository.findOne({
        where: {
          donor: { id: account.id },
          status: AppointmentStatus.PENDING,
        },
        relations: ['donor', 'donation_center'],
      });

      if (appointment) {
        throw AppointmentAlreadyExistsException(
          appointment.donation_center.name,
        );
      }

      const donationCenter = await this.donationCenterRepository.findOne({
        where: { id: payload.donationCenter },
      });

      const newAppointment = await this.appointmentRepository.save({
        donor: account,
        date: payload.date,
        time: payload.time,
        donation_center: donationCenter,
        appointmentId: GenerateUniqueTrackingNumber(),
        verificationCode: authUtils.generateRandomPin(),
      });

      this.emailNotificationService.newAppointmentNotification(
        account,
        donationCenter.name,
      );

      this.logger.log(`[CREATE-APPOINTMENT-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatDonorAppointment(newAppointment);
    } catch (error) {
      this.logger.log(`[CREATE-APPOINTMENT-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
