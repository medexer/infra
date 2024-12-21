import { CreateAppointmentDTO, UploadDonorComplianceDTO } from '../../interface';
import { SecureUserPayload } from 'libs/common/src/interface';

export class UploadDonorComplianceCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UploadDonorComplianceDTO,
  ) {}
}

export class CreateAppointmentCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: CreateAppointmentDTO,
  ) {}
}
