import { CommandBus } from '@nestjs/cqrs';
import { Repository, Not, In } from 'typeorm';
import {
  Appointment,
  AppointmentInfo,
} from 'libs/common/src/models/appointment.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { SecureUserPayload } from 'libs/common/src/interface';
import { AppointmentStatus } from 'libs/common/src/constants/enums';
import { AppLogger } from '../../../common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';

@Injectable()
export class AppointmentService {
  constructor(
    public commandBus: CommandBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async getPendingDonorAppointments(
    secureUser: SecureUserPayload,
  ): Promise<AppointmentInfo[]> {
    try {
      this.logger.log(`[GET-PENDING-DONOR-APPOINTMENTS-PROCESSING]`);

      const appointments = await this.appointmentRepository.find({
        where: {
          donor: { id: secureUser.id },
          status: In([
            AppointmentStatus.PENDING,
            AppointmentStatus.ACCEPTED,
            AppointmentStatus.PROCESSING,
          ]),
        },
        relations: ['donor', 'donation_center'],
      });

      this.logger.log(`[GET-PENDING-DONOR-APPOINTMENTS-SUCCESS]`);

      return appointments.map((appointment) =>
        modelsFormatter.FormatDonorAppointment(appointment),
      );
    } catch (error) {
      this.logger.error(`[GET-PENDING-DONOR-APPOINTMENTS-FAILED] :: ${error}`);

      throw error;
    }
  }

  async getCompletedDonorAppointments(
    secureUser: SecureUserPayload,
  ): Promise<AppointmentInfo[]> {
    try {
      this.logger.log(`[GET-COMPLETED-DONOR-APPOINTMENTS-PROCESSING]`);

      const appointments = await this.appointmentRepository.find({
        where: {
          donor: { id: secureUser.id },
          status: Not(
            In([
              AppointmentStatus.PENDING,
              AppointmentStatus.ACCEPTED,
              AppointmentStatus.PROCESSING,
            ]),
          ),
        },
        relations: ['donor', 'donation_center'],
      });

      this.logger.log(`[GET-COMPLETED-DONOR-APPOINTMENTS-SUCCESS]`);

      return appointments.map((appointment) =>
        modelsFormatter.FormatDonorAppointment(appointment),
      );
    } catch (error) {
      this.logger.error(
        `[GET-COMPLETED-DONOR-APPOINTMENTS-FAILED] :: ${error}`,
      );

      throw error;
    }
  }
}
