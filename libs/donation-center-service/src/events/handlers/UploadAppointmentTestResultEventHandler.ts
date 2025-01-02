import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadAppointmentTestResultEvent } from '../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import FCMessaging from 'libs/notification-service/src/bases/FCMessaging';

@EventsHandler(UploadAppointmentTestResultEvent)
export class UploadAppointmentTestResultEventHandler
  implements IEventHandler<UploadAppointmentTestResultEvent>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async handle(event: UploadAppointmentTestResultEvent) {
    try {
      this.logger.log(
        `[UPLOAD-APPOINTMENT-TEST-RESULT-EVENT-HANDLER-PROCESSING]`,
      );

      const { appointment } = event;

      const account = await this.accountRepository.findOne({
        where: {
          id: appointment.donor.id,
        },
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      if (account?.fcmToken) {
        FCMessaging.sendNotification(account.fcmToken, {
          title: 'Medical Test Results',
          body: `Your blood test results from ${appointment.donation_center.name} are now available.`,
          data: {
            appointmentId: appointment.id,
          },
        });
      }

      this.logger.log(`[UPLOAD-APPOINTMENT-TEST-RESULT-EVENT-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(
        `[UPLOAD-APPOINTMENT-TEST-RESULT-EVENT-HANDLER-ERROR]: ${error}`,
      );

      throw error;
    }
  }
}
