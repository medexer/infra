import { AppointmentStatus } from 'libs/common/src/constants/enums';
import { Appointment } from 'libs/common/src/models/appointment.model';

export class UpdateAppointmentStatusEvent {
  constructor(
      public readonly appointment: Appointment,
      public readonly status: AppointmentStatus,
  ) {}
}
