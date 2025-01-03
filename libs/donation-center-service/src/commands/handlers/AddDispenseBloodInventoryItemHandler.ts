import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BloodInventory,
  BloodInventoryInfo,
} from 'libs/common/src/models/blood.inventory.model';
import { AddDispenseBloodInventoryItemCommand } from '../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';

@CommandHandler(AddDispenseBloodInventoryItemCommand)
export class AddDispenseBloodInventoryItemHandler
  implements
    ICommandHandler<AddDispenseBloodInventoryItemCommand, BloodInventoryInfo>
{
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(BloodInventory)
    private readonly bloodInventoryRepository: Repository<BloodInventory>,
  ) {}

  async execute(command: AddDispenseBloodInventoryItemCommand) {
    try {
      this.logger.log(`[ADD-DISPENSE-BLOOD-INVENTORY-ITEM-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const bloodInventory = await this.bloodInventoryRepository.findOne({
        where: {
          id: parseInt(payload.inventoryItemId),
          donationCenter: {
            id: parseInt(payload.donationCenterId),
          },
        },
        relations: ['donationCenter'],
      });

      if (!bloodInventory) {
        throw new NotFoundException('Blood inventory item not found');
      }

      if (payload.isAddInventory) {
        Object.assign(bloodInventory, {
          units: (parseInt(bloodInventory.units) + payload.quantity).toString(),
        });
      } else {
        if (parseInt(bloodInventory.units) < payload.quantity) {
          throw new BadRequestException('Not enough inventory units');
        }

        Object.assign(bloodInventory, {
          units: (parseInt(bloodInventory.units) - payload.quantity).toString(),
        });
      }

      const updatedItem =
        await this.bloodInventoryRepository.save(bloodInventory);

      this.logger.log(`[ADD-DISPENSE-BLOOD-INVENTORY-ITEM-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatBloodInventoryInfo(updatedItem);
    } catch (error) {
      this.logger.log(`[ADD-DISPENSE-BLOOD-INVENTORY-ITEM-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
