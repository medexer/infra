import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Appointment } from 'libs/common/src/models/appointment.model';
import { DonationCenter } from 'libs/common/src/models/donation.center.model';
import { AccountType, AppointmentStatus } from 'libs/common/src/constants/enums';
import FCMessaging from 'libs/notification-service/src/bases/FCMessaging';

@Injectable()
export class DonorCronService {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
  ) {}

//   @Cron(CronExpression.EVERY_10_SECONDS)
  async handleDonationAppointmentReminder() {
    try {
      const appointments = await this.appointmentRepository.find({
        where: {
          status: AppointmentStatus.PENDING,
        },
        relations: ['donor', 'donation_center'],
      });

      const users = await this.accountRepository.find({
        where: {
          accountType: AccountType.INDIVIDUAL,
        },
      });

      await Promise.all(
        users.map(async (user) => {
          try {
            // const account = await this.accountRepository.findOneBy({
            //   id: appointment.donor.id,
            // });

            const token = user?.fcmToken;

            if (token) {
              await FCMessaging.sendNotification(token, {
                title: 'Appointment Reminder',
                body: 'You have an upcoming donation appointment. Please remember to come on time.',
                data: {
                  type: 'appointment_reminder',
                //   appointmentId: appointment.id.toString(),
                },
              });
            }
          } catch (error) {
            this.logger.error(
              `[DONATION-APPOINTMENT-REMINDER-FAILED] :: ${error}`,
            );
          }
        }),
      );
    } catch (error) {
      this.logger.error(`[DONATION-APPOINTMENT-REMINDER-FAILED] :: ${error}`);
    }
  }
}
