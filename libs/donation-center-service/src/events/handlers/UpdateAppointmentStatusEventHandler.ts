import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAppointmentStatusEvent } from '../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { AppointmentStatus } from 'libs/common/src/constants/enums';
import FCMessaging from 'libs/notification-service/src/bases/FCMessaging';

@EventsHandler(UpdateAppointmentStatusEvent)
export class UpdateAppointmentStatusEventHandler
  implements IEventHandler<UpdateAppointmentStatusEvent>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async handle(event: UpdateAppointmentStatusEvent) {
    try {
      this.logger.log(`[UPDATE-APPOINTMENT-STATUS-EVENT-HANDLER-PROCESSING]`);

      const { appointment, status } = event;

      const account = await this.accountRepository.findOne({
        where: {
          id: appointment.donor.id,
        },
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      if (account?.fcmToken) {
        if (status === AppointmentStatus.ACCEPTED) {
          FCMessaging.sendNotification(account.fcmToken, {
            title: 'Appointment',
            body: `Your appointment with ${appointment.donation_center.name} has been accepted.`,
            data: {
              appointmentId: appointment.id,
            },
          });
        } else if (status === AppointmentStatus.REJECTED) {
          FCMessaging.sendNotification(account.fcmToken, {
            title: 'Appointment',
            body: `Your appointment with ${appointment.donation_center.name} has been rejected.`,
            data: {
              appointmentId: appointment.id,
            },
          });
        } else if (status === AppointmentStatus.PROCESSING) {
          FCMessaging.sendNotification(account.fcmToken, {
            title: 'Appointment',
            body: `Your appointment with ${appointment.donation_center.name} is being processed.`,
            data: {
              appointmentId: appointment.id,
            },
          });
        }
      }

      this.logger.log(`[UPDATE-APPOINTMENT-STATUS-EVENT-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(
        `[UPDATE-APPOINTMENT-STATUS-EVENT-HANDLER-ERROR]: ${error}`,
      );

      throw error;
    }
  }
}
