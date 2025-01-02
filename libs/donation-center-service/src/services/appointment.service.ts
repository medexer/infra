import { Repository, In, Not } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from '../../../common/src/logger/logger.service';
import { DonationCenter } from 'libs/common/src/models/donation.center.model';
import { SecureUserPayload } from 'libs/common/src/interface';
import { Appointment } from 'libs/common/src/models/appointment.model';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import {
  AccountType,
  AppointmentStatus,
} from 'libs/common/src/constants/enums';
import { DonationCenterAppointmentInfo } from 'libs/common/src/models/appointment.model';

@Injectable()
export class AppointmentService {
  constructor(
    public commandBus: CommandBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async getPendingAppointments(
    secureUser: SecureUserPayload,
  ): Promise<DonationCenterAppointmentInfo[]> {
    try {
      this.logger.log(`[GET-PENDING-DONATION-CENTER-APPOINTMENTS-PROCESSING]`);

      const appointments = await this.appointmentRepository.find({
        where: {
          donation_center: { account: { id: secureUser.id } },
          status: In([
            AppointmentStatus.PENDING,
            AppointmentStatus.ACCEPTED,
            AppointmentStatus.PROCESSING,
          ]),
        },
        relations: ['donor', 'donation_center', 'donation_center.account'],
      });

      this.logger.log(`[GET-PENDING-DONATION-CENTER-APPOINTMENTS-SUCCESS]`);

      return appointments.map((appointment) =>
        modelsFormatter.FormatDonationCenterAppointment(appointment),
      );
    } catch (error) {
      this.logger.error(
        `[GET-PENDING-DONATION-CENTER-APPOINTMENTS-FAILED] :: ${error}`,
      );

      throw error;
    }
  }

  async getCompletedAppointments(
    secureUser: SecureUserPayload,
  ): Promise<DonationCenterAppointmentInfo[]> {
    try {
      this.logger.log(
        `[GET-COMPLETED-DONATION-CENTER-APPOINTMENTS-PROCESSING]`,
      );

      const appointments = await this.appointmentRepository.find({
        where: {
          donation_center: { account: { id: secureUser.id } },
          status: Not(
            In([AppointmentStatus.PENDING, AppointmentStatus.ACCEPTED]),
          ),
        },
        relations: ['donor', 'donation_center', 'donation_center.account'],
      });

      this.logger.log(`[GET-COMPLETED-DONATION-CENTER-APPOINTMENTS-SUCCESS]`);

      return appointments.map((appointment) =>
        modelsFormatter.FormatDonationCenterAppointment(appointment),
      );
    } catch (error) {
      this.logger.error(
        `[GET-COMPLETED-DONATION-CENTER-APPOINTMENTS-FAILED] :: ${error}`,
      );

      throw error;
    }
  }

  async updateAppointmentStatus(
    secureUser: SecureUserPayload,
    appointmentId: string,
    status: AppointmentStatus,
  ) {}
}
