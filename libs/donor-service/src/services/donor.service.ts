import { Repository, Not } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from '../../../common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import {
  DonationCentreDaysOfWork,
  DaysOfWork,
  DonationCenter,
  DonationCenterInfo,
  DonationCenterAvailability,
  DaySchedule,
} from 'libs/common/src/models/donation.center.model';
import {
  Appointment,
  AppointmentInfo,
} from 'libs/common/src/models/appointment.model';
import { SecureUserPayload } from 'libs/common/src/interface';
import { AppointmentStatus } from 'libs/common/src/constants/enums';
@Injectable()
export class DonorService {
  constructor(
    public commandBus: CommandBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
    @InjectRepository(DaysOfWork)
    private readonly daysOfWorkRepository: Repository<DaysOfWork>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async getDonationCenters(): Promise<DonationCenterInfo[]> {
    try {
      this.logger.log('[FETCH-DONATION-CENTERS-PROCESSING]');

      const donationCenters: DonationCenterInfo[] = [];

      const centers = await this.donationCenterRepository.find({
        where: { isComplianceUploaded: true },
      });

      // console.log('[DONATION-CENTERS] :: ', centers.length);

      await Promise.all(
        centers.map(async (donationCenter) => {
          donationCenters.push(
            modelsFormatter.FormatDetailedDonationCenterAccountResponse(
              donationCenter,
            ),
          );
        }),
      );

      this.logger.log('[FETCH-DONATION-CENTERS-SUCCESS]');

      return donationCenters;
    } catch (error) {
      this.logger.error(`[FETCH-DONATION-CENTERS-FAILED] :: ${error}`);

      throw error;
    }
  }

  async getDonationCenterDaysOfWork(
    donationCenterId: number,
  ): Promise<DonationCentreDaysOfWork[]> {
    try {
      this.logger.error(`[FETCH-DONATION-CENTER-DAYS-OF-WORK-PROCESSING]`);

      const donationCenter = await this.donationCenterRepository.findOne({
        where: {
          id: donationCenterId,
        },
      });

      const daysOfWork = await this.daysOfWorkRepository.findOne({
        where: {
          donation_center: {
            id: donationCenter.id,
          },
        },
        relations: [
          'donation_center',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ],
      });

      this.logger.error(`[FETCH-DONATION-CENTER-DAYS-OF-WORK-SUCCESS]`);

      // console.log(daysOfWork);

      return modelsFormatter.FormatDonationCenterDaysOfWork(daysOfWork);
    } catch (error) {
      this.logger.error(
        `[FETCH-DONATION-CENTER-DAYS-OF-WORK-SUCCESS] :: ${error}`,
      );

      throw error;
    }
  }

  async getDonationCenterAppointmentAvailability(
    donationCenterId: number,
  ): Promise<DonationCenterAvailability[]> {
    try {
      this.logger.log(`[FETCH-DONATION-CENTER-AVAILABILITY-PROCESSING]`);

      const daysOfWork = await this.daysOfWorkRepository.findOne({
        where: {
          donation_center: { id: donationCenterId },
        },
        relations: [
          'donation_center',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ],
      });

      // Get next 7 days starting from today
      const availability: DonationCenterAvailability[] = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

        const dayMapping: { [key: number]: DaySchedule } = {
          0: {
            isOpen: daysOfWork.sunday?.closed ? false : true,
            openTime: daysOfWork.sunday?.open,
            closeTime: daysOfWork.sunday?.close,
          },
          1: {
            isOpen: daysOfWork.monday?.closed ? false : true,
            openTime: daysOfWork.monday?.open,
            closeTime: daysOfWork.monday?.close,
          },
          2: {
            isOpen: daysOfWork.tuesday?.closed ? false : true,
            openTime: daysOfWork.tuesday?.open,
            closeTime: daysOfWork.tuesday?.close,
          },
          3: {
            isOpen: daysOfWork.wednesday?.closed ? false : true,
            openTime: daysOfWork.wednesday?.open,
            closeTime: daysOfWork.wednesday?.close,
          },
          4: {
            isOpen: daysOfWork.thursday?.closed ? false : true,
            openTime: daysOfWork.thursday?.open,
            closeTime: daysOfWork.thursday?.close,
          },
          5: {
            isOpen: daysOfWork.friday?.closed ? false : true,
            openTime: daysOfWork.friday?.open,
            closeTime: daysOfWork.friday?.close,
          },
          6: {
            isOpen: daysOfWork.saturday?.closed ? false : true,
            openTime: daysOfWork.saturday?.open,
            closeTime: daysOfWork.saturday?.close,
          },
        };

        // console.log(dayMapping);

        const daySchedule: DaySchedule | undefined = dayMapping[dayOfWeek];

        console.log(daySchedule);

        const timeSlots = daySchedule?.isOpen
          ? this.generateTimeSlots(daySchedule, date)
          : [];

        if (timeSlots.length > 0) {
          availability.push({
            date: date,
            isOpen: daySchedule?.isOpen || false,
            availableTimeSlots: timeSlots,
          });
        }
      }

      this.logger.log(`[FETCH-DONATION-CENTER-AVAILABILITY-SUCCESS]`);
      return availability;
    } catch (error) {
      this.logger.error(
        `[FETCH-DONATION-CENTER-AVAILABILITY-FAILED] :: ${error}`,
      );
      throw error;
    }
  }

  private generateTimeSlots(daySchedule: DaySchedule, date: Date): string[] {
    const timeSlots: string[] = [];
    if (!daySchedule.openTime || !daySchedule.closeTime) return timeSlots;

    const [openHour, openMinute] = daySchedule.openTime.split(':');
    const [closeHour, closeMinute] = daySchedule.closeTime.split(':');

    // Create opening time
    let currentTime = new Date(date);
    currentTime.setHours(parseInt(openHour), parseInt(openMinute), 0);

    const closeTime = new Date(date);
    closeTime.setHours(parseInt(closeHour), parseInt(closeMinute), 0);

    const now = new Date();

    // If date is today, start from next available slot after current time + 1 hour
    if (date.toDateString() === now.toDateString()) {
      const adjustedTime = new Date(now);
      adjustedTime.setHours(adjustedTime.getHours() + 1);
      // Round up to next 30 minute slot
      adjustedTime.setMinutes(Math.ceil(adjustedTime.getMinutes() / 30) * 30);

      // Only use adjusted time if it's after opening time
      if (adjustedTime > currentTime) {
        currentTime = adjustedTime;
      }
    }

    // Generate 30-minute slots only within opening hours
    while (currentTime < closeTime) {
      timeSlots.push(
        currentTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      );
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return timeSlots;
  }

  async getPendingDonorAppointments(
    secureUser: SecureUserPayload,
  ): Promise<AppointmentInfo[]> {
    try {
      this.logger.error(`[GET-PENDING-DONOR-APPOINTMENTS-PROCESSING]`);

      const appointments = await this.appointmentRepository.find({
        where: {
          donor: { id: secureUser.id },
          status: AppointmentStatus.PENDING,
        },
        relations: ['donor', 'donation_center'],
      });

      this.logger.error(`[GET-PENDING-DONOR-APPOINTMENTS-SUCCESS]`);

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
      this.logger.error(`[GET-COMPLETED-DONOR-APPOINTMENTS-PROCESSING]`);

      const appointments = await this.appointmentRepository.find({
        where: {
          donor: { id: secureUser.id },
          status: Not(AppointmentStatus.PENDING),
        },
        relations: ['donor', 'donation_center'],
      });

      this.logger.error(`[GET-COMPLETED-DONOR-APPOINTMENTS-SUCCESS]`);

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
