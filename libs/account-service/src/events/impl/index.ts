import { Account } from 'libs/common/src/models/account.model';

export class CreateAccountEvent {
  constructor(
    public readonly origin: string,
    public readonly account: Account,
  ) {}
}
