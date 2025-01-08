import {
  AccountType,
  AppointmentStatus,
} from 'libs/common/src/constants/enums';
import { CommandBus } from '@nestjs/cqrs';
import { Repository, In, Not, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { appMoment } from 'libs/common/src/utils/moment';
import { SecureUserPayload } from 'libs/common/src/interface';
import { AppLogger } from '../../../common/src/logger/logger.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { BloodInventory } from 'libs/common/src/models/blood.inventory.model';
import { BloodInventoryInfo } from 'libs/common/src/models/blood.inventory.model';
import { Appointment } from 'libs/common/src/models/appointment.model';
import { DonationCenter } from 'libs/common/src/models/donation.center.model';
import {
  DashboardAnalyticsDataPoint,
  DashboardInfo,
} from '../interface/response';

@Injectable()
export class DashboardService {
  constructor(
    public commandBus: CommandBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(BloodInventory)
    private readonly bloodInventoryRepository: Repository<BloodInventory>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
  ) {}

  async getDashboardData(
    secureUser: SecureUserPayload,
    startDate?: Date,
    endDate?: Date,
  ): Promise<DashboardInfo> {
    endDate = endDate || appMoment().endOf('month').toDate();
    startDate = startDate || appMoment().startOf('month').toDate();

    const prevPeriodStartDate = appMoment(startDate)
      .subtract(1, 'month')
      .startOf('month')
      .toDate();

    const prevPeriodEndDate = appMoment(startDate)
      .subtract(1, 'day')
      .endOf('day')
      .toDate();

    const donationCenter = await this.donationCenterRepository.findOne({
      where: {
        account: {
          id: secureUser.id,
        },
      },
      relations: ['account'],
    });

    const [currentMonthAppointments, prevMonthAppointments] = await Promise.all(
      [
        this.appointmentRepository.count({
          where: {
            donation_center: {
              id: donationCenter.id,
            },
            createdAt: Between(startDate, endDate),
          },
          relations: ['donation_center'],
        }),
        this.appointmentRepository.count({
          where: {
            donation_center: {
              id: donationCenter.id,
            },
            createdAt: Between(prevPeriodStartDate, prevPeriodEndDate),
          },
          relations: ['donation_center'],
        }),
      ],
    );

    const appointmentChange =
      prevMonthAppointments === 0
        ? currentMonthAppointments > 0
          ? 100
          : 0
        : ((currentMonthAppointments - prevMonthAppointments) /
            prevMonthAppointments) *
          100;

    const [currentMonthPints, prevMonthPints] = await Promise.all([
      this.bloodInventoryRepository.count({
        where: {
          donationCenter: donationCenter,
          createdAt: Between(startDate, endDate),
        },
        relations: ['donationCenter'],
      }),
      this.bloodInventoryRepository.count({
        where: {
          donationCenter: donationCenter,
          createdAt: Between(prevPeriodStartDate, prevPeriodEndDate),
        },
        relations: ['donationCenter'],
      }),
    ]);

    const pintsChange =
      prevMonthPints === 0
        ? currentMonthPints > 0
          ? 100
          : 0
        : ((currentMonthPints - prevMonthPints) / prevMonthPints) * 100;

    const [currentMonthCancelledAppointments, prevMonthCancelledAppointments] =
      await Promise.all([
        this.appointmentRepository.count({
          where: {
            donation_center: {
              id: donationCenter.id,
            },
            status: AppointmentStatus.CANCELLED,
            createdAt: Between(startDate, endDate),
          },
          relations: ['donation_center'],
        }),
        this.appointmentRepository.count({
          where: {
            donation_center: {
              id: donationCenter.id,
            },
            status: AppointmentStatus.CANCELLED,
            createdAt: Between(prevPeriodStartDate, prevPeriodEndDate),
          },
          relations: ['donation_center'],
        }),
      ]);

    const appointmentsCancelledChange =
      prevMonthCancelledAppointments === 0
        ? currentMonthCancelledAppointments > 0
          ? 100
          : 0
        : ((currentMonthCancelledAppointments -
            prevMonthCancelledAppointments) /
            prevMonthCancelledAppointments) *
          100;

    const [currentMonthDonors, prevMonthDonors] = await Promise.all([
      this.appointmentRepository.count({
        where: {
          donation_center: {
            id: donationCenter.id,
          },
          status: AppointmentStatus.COMPLETED,
          createdAt: Between(startDate, endDate),
        },
        relations: ['donation_center'],
      }),
      this.appointmentRepository.count({
        where: {
          donation_center: {
            id: donationCenter.id,
          },
          status: AppointmentStatus.COMPLETED,
          createdAt: Between(prevPeriodStartDate, prevPeriodEndDate),
        },
        relations: ['donation_center'],
      }),
    ]);

    const donorsReachedChange =
      prevMonthDonors === 0
        ? currentMonthDonors > 0
          ? 100
          : 0
        : ((currentMonthDonors - prevMonthDonors) / prevMonthDonors) * 100;

    const activeAppointments = await this.appointmentRepository.find({
      where: {
        status: In([
          AppointmentStatus.PENDING,
          AppointmentStatus.ACCEPTED,
          AppointmentStatus.PROCESSING,
        ]),
        donation_center: {
          id: donationCenter.id,
        },
        createdAt: Between(startDate, endDate),
      },
      relations: ['donation_center', 'donor'],
    });

    const bloodInventory = await this.bloodInventoryRepository.find({
      where: {
        donationCenter: {
          id: donationCenter.id,
        },
      },
      relations: ['donationCenter'],
    });

    const totalInventoryItems = bloodInventory.reduce(
      (acc, item) => acc + parseInt(item.units),
      0,
    );

    const inventoryInStock = bloodInventory.filter(
      (item) => parseInt(item.units) > 0,
    ).length;

    const inventoryOutOfStock = bloodInventory.filter(
      (item) => parseInt(item.units) === 0,
    ).length;

    const appointments = await this.appointmentRepository.find({
      where: {
        donation_center: {
          id: donationCenter.id,
        },
        createdAt: Between(startDate, endDate),
      },
      relations: ['donation_center'],
    });

    const analyticsData = this.calculateAnalyticsData(appointments);
    const appointmentsFulfillmentRate =
      await this.calculateAppointmentsFulfillmentRate(appointments);

    return {
      period: `${appMoment(startDate).format('DD MMM YYYY')} - ${appMoment(endDate).format('DD MMM YYYY')}`,
      summary: {
        appointments: currentMonthAppointments,
        appointmentsChange: `${appointmentChange.toFixed(2)}%`,
        previousMonthAppointments: prevMonthAppointments,
        pints: currentMonthPints,
        pintsChange: `${pintsChange.toFixed(2)}%`,
        previousMonthPints: prevMonthPints,
        appointmentsCancelled: currentMonthCancelledAppointments,
        appointmentsCancelledChange: `${appointmentsCancelledChange.toFixed(2)}%`,
        previousMonthAppointmentsCancelled: prevMonthCancelledAppointments,
        donorsReached: currentMonthDonors,
        donorsReachedChange: `${donorsReachedChange.toFixed(2)}%`,
        previousMonthDonorsReached: prevMonthDonors,
      },
      activeAppointments: activeAppointments.map((appointment) =>
        modelsFormatter.FormatDonationCenterAppointment(appointment),
      ),
      analytics: analyticsData,
      inventory: {
        itemsInStock: inventoryInStock,
        totalItems: totalInventoryItems,
        itemsOutOfStock: inventoryOutOfStock,
      },
      fulfillmentRate: appointmentsFulfillmentRate,
    } as DashboardInfo;
  }

  calculateAnalyticsData(
    appointments: Appointment[],
  ): DashboardAnalyticsDataPoint[] {
    const analyticsData = appointments.reduce(
      (acc, appointment) => {
        const month = appMoment(appointment.createdAt).format('MMM');
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      },
      {} as { [month: string]: number },
    );

    return Object.entries(analyticsData).map(([month, value]) => ({
      month,
      value,
    }));
  }

  calculateAppointmentsFulfillmentRate(appointments: Appointment[]): {
    currentRate: string;
    rejectedAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
  } {
    const completedAppointments = appointments.filter(
      (appointment) => appointment.status === AppointmentStatus.COMPLETED,
    );
    const currentRate =
      appointments.length > 0
        ? (completedAppointments.length / appointments.length) * 100
        : 0;

    const cancelledAppointments = appointments.filter(
      (appointment) => appointment.status === AppointmentStatus.CANCELLED,
    ).length;

    const rejectedAppointments = appointments.filter(
      (appointment) => appointment.status === AppointmentStatus.REJECTED,
    ).length;

    return {
      rejectedAppointments,
      cancelledAppointments,
      currentRate: `${currentRate.toFixed(2)}%`,
      completedAppointments: completedAppointments.length,
    };
  }
}
