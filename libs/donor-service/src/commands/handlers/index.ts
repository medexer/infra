import { CreateAppointmentHandler } from './CreateAppointmentHandler';
import { UploadDonorComplianceHandler } from './UploadDonorComplianceHandler';
import { AddDonationCenterRatingHandler } from './AddDonationCenterRatingHandler';

export const DonorServiceCommandHandlers = [
  CreateAppointmentHandler,
  UploadDonorComplianceHandler,
  AddDonationCenterRatingHandler,
];
