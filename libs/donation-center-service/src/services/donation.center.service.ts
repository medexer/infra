import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from '../../../common/src/logger/logger.service';
import {
  DonationCenter,
  DonationCenterInfo,
} from 'libs/common/src/models/donation.center.model';
import { AccountType } from 'libs/common/src/constants/enums';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';

@Injectable()
export class DonationCenterService {
  constructor(
    public commandBus: CommandBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}
}
