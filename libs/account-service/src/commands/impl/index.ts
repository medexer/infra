import {
  DeleteAccountDTO,
  UpdateAccountEmailDTO,
  UpdateAccountNameDTO,
  UpdateAccountPasswordDTO,
  UpdateAccountPhoneDTO,
  UpdateFCMTokenDTO,
  UpdateProfileImageDTO,
  VerifyNewAccountEmailDTO,
} from '../../interface';
import { SecureUserPayload } from 'libs/common/src/interface';

export class UpdateAccountFCMTokenCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: UpdateFCMTokenDTO,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class UpdateAccountNameCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateAccountNameDTO,
  ) {}
}

export class UpdateProfileImageCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateProfileImageDTO,
  ) {}
}

export class UpdateAccountPasswordCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateAccountPasswordDTO,
  ) {}
}

export class DeleteAccountCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: DeleteAccountDTO,
  ) {}
}

export class UpdateAccountEmailCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateAccountEmailDTO,
  ) {}
}

export class VerifyNewAccountEmailCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: VerifyNewAccountEmailDTO,
  ) {}
}

export class UpdateAccountPhoneCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateAccountPhoneDTO,
  ) {}
}
