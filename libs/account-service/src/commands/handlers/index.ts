import { UpdateAccountNameHandler } from './UpdateAccountNameHandler';
import { UpdateAccountPhoneHandler } from './UpdateAccountPhoneHandler';
import { UpdateAccountEmailHandler } from './UpdateAccountEmailHandler';
import { UpdateAccountFCMTokenHandler } from './UpdateAccountFCMTokenHandler';
import { UpdateAccountPasswordHandler } from './UpdateAccountPasswordHandler';
import { VerifyNewAccountEmailHandler } from './VerifyNewAccountEmailHandler';

export const AccountServiceCommandHandlers = [
  UpdateAccountNameHandler,
  UpdateAccountEmailHandler,
  UpdateAccountPhoneHandler,
  UpdateAccountFCMTokenHandler,
  VerifyNewAccountEmailHandler,
  UpdateAccountPasswordHandler,
];
