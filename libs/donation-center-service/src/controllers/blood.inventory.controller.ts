import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'libs/common/src/auth';
import { SecureUserPayload } from 'libs/common/src/interface';
import { Get, Req, UseGuards, Controller, Patch, Query } from '@nestjs/common';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import { BloodInventoryService } from '../services/blood.inventory.service';
import { BloodInventoryInfo } from 'libs/common/src/models/blood.inventory.model';
import authUtils from 'libs/common/src/security/auth.utils';
import { AddDispenseBloodInventoryItemCommand, UpdateBloodInventoryItemPriceCommand } from '../commands/impl';

@ApiTags('blood-inventory')
@Controller({ path: 'blood-inventory' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BloodInventoryController {
  constructor(
    public command: CommandBus,
    public readonly bloodInventoryService: BloodInventoryService,
  ) {}

  @Get('')
  @ApiOkResponse({
    isArray: true,
    type: BloodInventoryInfo,
  })
  @ApiInternalServerErrorResponse()
  async getBloodInventory(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BloodInventoryInfo[]> {
    return await this.bloodInventoryService.getBloodInventory(secureUser);
  }

  @Patch('add-dispense-item')
  @ApiOkResponse({
    type: BloodInventoryInfo,
  })
  @ApiQuery({
    name: 'isAddInventory',
    description: 'Whether to add or dispense inventory item',
  })
  @ApiQuery({
    name: 'quantity',
    description: 'Quantity of the inventory item',
  })
  @ApiQuery({
    name: 'inventoryItemId',
    description: 'Inventory item ID',
  })
  @ApiQuery({
    name: 'donationCenterId',
    description: 'Donation center ID',
  })

  @ApiInternalServerErrorResponse()
  async addBloodInventoryItem(
    @Req() req: Request,
    @Query('quantity') quantity: number,
    @Query('isAddInventory') isAddInventory: boolean,
    @Query('inventoryItemId') inventoryItemId: string,
    @Query('donationCenterId') donationCenterId: string,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BloodInventoryInfo> {
    return await this.command.execute(
      new AddDispenseBloodInventoryItemCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        { quantity, inventoryItemId, donationCenterId, isAddInventory },
      ),
    );
  }

  @Patch('update-item-price')
  @ApiOkResponse({
    type: BloodInventoryInfo,
  })
  @ApiQuery({
    name: 'price',
    description: 'New price of the inventory item',
  })
  @ApiQuery({
    name: 'inventoryItemId',
    description: 'Inventory item ID',
  })
  @ApiQuery({
    name: 'donationCenterId',
    description: 'Donation center ID',
  })

  @ApiInternalServerErrorResponse()
  async updateBloodInventoryItemPrice(
    @Req() req: Request,
    @Query('price') price: string,
    @Query('inventoryItemId') inventoryItemId: string,
    @Query('donationCenterId') donationCenterId: string,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BloodInventoryInfo> {
    return await this.command.execute(
      new UpdateBloodInventoryItemPriceCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        { price, inventoryItemId, donationCenterId },
      ),
    );
  }

}
