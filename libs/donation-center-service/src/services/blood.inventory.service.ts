import {
  AccountType,
  AppointmentStatus,
} from 'libs/common/src/constants/enums';
import { CommandBus } from '@nestjs/cqrs';
import { Repository, In, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SecureUserPayload } from 'libs/common/src/interface';
import { AppLogger } from '../../../common/src/logger/logger.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { BloodInventory } from 'libs/common/src/models/blood.inventory.model';
import { BloodInventoryInfo } from 'libs/common/src/models/blood.inventory.model';

@Injectable()
export class BloodInventoryService {
  constructor(
    public commandBus: CommandBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(BloodInventory)
    private readonly bloodInventoryRepository: Repository<BloodInventory>,
  ) {}

  async getBloodInventory(
    secureUser: SecureUserPayload,
  ): Promise<BloodInventoryInfo[]> {
    try {
      this.logger.log(`[GET-BLOOD-INVENTORY-PROCESSING]`);

      const bloodInventory = await this.bloodInventoryRepository.find({
        where: {
          donationCenter: { account: { id: secureUser.id } },
        },
        relations: ['donationCenter', 'donationCenter.account'],
      });

      this.logger.log(`[GET-BLOOD-INVENTORY-SUCCESS]`);

      return bloodInventory.map((bloodInventory) =>
        modelsFormatter.FormatBloodInventoryInfo(bloodInventory),
      );
    } catch (error) {
      this.logger.error(
        `[GET-BLOOD-INVENTORY-FAILED] :: ${error}`,
      );

      throw error;
    }
  }
}
