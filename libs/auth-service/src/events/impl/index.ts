import { Account } from 'libs/common/src/models/account.model';
import { DonationCenter } from 'libs/common/src/models/donation.center.model';

export class CreateDonationCenterAccountEvent {
  constructor(
    public readonly origin: string,
    public readonly account: Account,
    public readonly donationCenter: DonationCenter,
  ) {}
}
