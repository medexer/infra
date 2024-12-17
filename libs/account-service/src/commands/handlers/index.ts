import { DeleteAccountHandler } from './DeleteAccountHandler';
import { UpdateAccountNameHandler } from './UpdateAccountNameHandler';
import { UpdateAccountPhoneHandler } from './UpdateAccountPhoneHandler';
import { UpdateAccountEmailHandler } from './UpdateAccountEmailHandler';
import { UpdateAccountFCMTokenHandler } from './UpdateAccountFCMTokenHandler';
import { UpdateAccountPasswordHandler } from './UpdateAccountPasswordHandler';
import { VerifyNewAccountEmailHandler } from './VerifyNewAccountEmailHandler';
import { UpdateProfileImageHandler } from './UpdateProfileImageHandler';

export const AccountServiceCommandHandlers = [
  DeleteAccountHandler,
  UpdateAccountNameHandler,
  UpdateProfileImageHandler,
  UpdateAccountEmailHandler,
  UpdateAccountPhoneHandler,
  UpdateAccountFCMTokenHandler,
  VerifyNewAccountEmailHandler,
  UpdateAccountPasswordHandler,
];
