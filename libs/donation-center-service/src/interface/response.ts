import { ApiProperty } from '@nestjs/swagger';
import { AppointmentInfo } from 'libs/common/src/models/appointment.model';

class DashboardSummary {
  @ApiProperty({
    description:
      'The total number of completed appointments in the current period.',
    example: 214,
  })
  appointments: number;

  @ApiProperty({
    description:
      'The percentage change in the number of appointments compared to the previous period.',
    example: 2,
  })
  appointmentsChange: string;

  @ApiProperty({
    description: 'The total number of appointments in the previous period.',
    example: 2,
  })
  previousMonthAppointments: number;

  @ApiProperty({
    description:
      'The total pints amount in the current period, formatted to 2 decimal places.',
    example: 546230.0,
  })
  pints: number;

  @ApiProperty({
    description:
      'The percentage change in pints compared to the previous period, formatted as a string with "%" sign.',
    example: '2.00%',
  })
  pintsChange: string;

  @ApiProperty({
    description:
      'The total pints amount in the previous period, formatted to 2 decimal places.',
    example: 540.0,
  })
  previousMonthPints: number;

  @ApiProperty({
    description:
      'The total appointments cancelled in the current period, formatted to 2 decimal places.',
    example: 46560,
  })
  appointmentsCancelled: number;

  @ApiProperty({
    description:
      'The percentage change in appointments cancelled compared to the previous period, formatted as a string with "%" sign.',
    example: '-2.00%',
  })
  appointmentsCancelledChange: string;

  @ApiProperty({
    description:
      'The total appointments cancelled in the previous period, formatted to 2 decimal places.',
    example: 418250.0,
  })
  previousMonthAppointmentsCancelled: number;

  @ApiProperty({
    description:
      'The total donors reached in the current period, formatted to 2 decimal places.',
    example: 418250.0,
  })
  donorsReached: number;

  @ApiProperty({
    description:
      'The percentage change in donors reached compared to the previous period, formatted as a string with "%" sign.',
    example: '0.00%',
  })
  donorsReachedChange: string;

  @ApiProperty({
    description:
      'The total donors reached in the previous period, formatted to 2 decimal places.',
    example: 418250.0,
  })
  previousMonthDonorsReached: number;
}

class DashboardInventoryData {
  @ApiProperty({
    description: 'The number of items currently in stock.',
    example: 50,
  })
  itemsInStock: number;

  @ApiProperty({
    description: 'The number of items currently out of stock.',
    example: 10,
  })
  itemsOutOfStock: number;

  @ApiProperty({
    description: 'The number of items.',
    example: 50,
  })
  totalItems: number;
}

export class DashboardFulfillmentRate {
  @ApiProperty({
    description: 'The percentage of fulfilled orders in the current period.',
    example: '95.33%',
  })
  currentRate: string;

  @ApiProperty({
    description: 'The number of completed appointments in the current period.',
    example: 12,
  })
  completedAppointments: number;

  @ApiProperty({
    description: 'The number of cancelled appointments in the current period.',
    example: 12,
  })
  cancelledAppointments: number;

  @ApiProperty({
    description: 'The number of rejected appointments in the current period.',
    example: 2,
  })
  rejectedAppointments: number;
}

export class DashboardAnalyticsDataPoint {
  @ApiProperty({
    description: 'The month of the analytics data point.',
    example: 'Jan',
  })
  month: string;

  @ApiProperty({
    description: 'The value of the analytics data point.',
    example: 100,
  })
  value: number;
}

export class DashboardInfo {
  @ApiProperty({
    description:
      'The period covered by the report, formatted as "1st MMM YYYY - Do MMM YYYY".',
    example: '1st Aug 2024 - 30th Aug 2024',
  })
  period: string;

  @ApiProperty({
    description: 'Summary statistics for the current period.',
  })
  summary: DashboardSummary;

  @ApiProperty({
    isArray: true,
    type: AppointmentInfo,
    description:
      'The total number of active appointments in the current period.',
  })
  activeAppointments: AppointmentInfo[];

  @ApiProperty({
    isArray: true,
    type: DashboardAnalyticsDataPoint,
    description: 'The analytics data for the current period.',
  })
  analytics: DashboardAnalyticsDataPoint[];

  @ApiProperty({
    description: 'Inventory summary for the donation center.',
  })
  inventory: DashboardInventoryData;

  @ApiProperty({
    description: 'Fulfillment rate for the donation center appointments.',
  })
  fulfillmentRate: DashboardFulfillmentRate;
}
