import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAppointmentStatusCommand } from '../impl';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { AppointmentStatus } from 'libs/common/src/constants/enums';
import { Appointment } from 'libs/common/src/models/appointment.model';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { DonationCenterAppointmentInfo } from 'libs/common/src/models/appointment.model';
import { UpdateAppointmentStatusEvent } from '../../events/impl';

@CommandHandler(UpdateAppointmentStatusCommand)
export class UpdateAppointmentStatusHandler
  implements
    ICommandHandler<
      UpdateAppointmentStatusCommand,
      DonationCenterAppointmentInfo
    >
{
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async execute(command: UpdateAppointmentStatusCommand) {
    try {
      this.logger.log(`[UPDATE-APPOINTMENT-STATUS-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const appointment = await this.appointmentRepository.findOne({
        where: {
          id: payload.appointmentId,
        },
        relations: ['donor', 'donation_center', 'donation_center.account'],
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      if (
        ![
          AppointmentStatus.ACCEPTED,
          AppointmentStatus.REJECTED,
          AppointmentStatus.PROCESSING,
        ].includes(appointment.status)
      ) {
        throw new BadRequestException('Invalid appointment status');
      }

      Object.assign(appointment, {
        status: payload.status,
      });

      if (payload.status === AppointmentStatus.REJECTED) {
        Object.assign(appointment, {
          rejectedAt: new Date(),
        });
      } else if (payload.status === AppointmentStatus.ACCEPTED) {
        Object.assign(appointment, {
          acceptedAt: new Date(),
        });
      } else if (payload.status === AppointmentStatus.PROCESSING) {
        Object.assign(appointment, {
          processingAt: new Date(),
        });
      }

      const updatedAppointment =
        await this.appointmentRepository.save(appointment);

      this.logger.log(`[UPDATE-APPOINTMENT-STATUS-HANDLER-SUCCESS]`);

      this.eventBus.publish(
        new UpdateAppointmentStatusEvent(updatedAppointment, updatedAppointment.status),
      );

      return modelsFormatter.FormatDonationCenterAppointment(
        updatedAppointment,
      );
    } catch (error) {
      this.logger.log(`[UPDATE-APPOINTMENT-STATUS-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
