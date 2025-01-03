import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BloodInventory,
  BloodInventoryInfo,
} from 'libs/common/src/models/blood.inventory.model';
import { UpdateBloodInventoryItemPriceCommand } from '../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';

@CommandHandler(UpdateBloodInventoryItemPriceCommand)
export class UpdateBloodInventoryItemPriceHandler
  implements
    ICommandHandler<UpdateBloodInventoryItemPriceCommand, BloodInventoryInfo>
{
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(BloodInventory)
    private readonly bloodInventoryRepository: Repository<BloodInventory>,
  ) {}

  async execute(command: UpdateBloodInventoryItemPriceCommand) {
    try {
      this.logger.log(`[UPDATE-BLOOD-INVENTORY-ITEM-PRICE-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      if (parseInt(payload.price) < 1000) {
        throw new BadRequestException('Price must be greater than or equals N1000');
      }
        
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

      Object.assign(bloodInventory, {
        price: payload.price,
      });

      const updatedItem =
        await this.bloodInventoryRepository.save(bloodInventory);

      this.logger.log(`[UPDATE-BLOOD-INVENTORY-ITEM-PRICE-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatBloodInventoryInfo(updatedItem);
    } catch (error) {
      this.logger.log(`[UPDATE-BLOOD-INVENTORY-ITEM-PRICE-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
