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
import { Get, Req, UseGuards, Controller, Patch, Query, Body } from '@nestjs/common';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import { BloodInventoryService } from '../services/blood.inventory.service';
import { BloodInventoryInfo } from 'libs/common/src/models/blood.inventory.model';
import authUtils from 'libs/common/src/security/auth.utils';
import {
  AddDispenseBloodInventoryItemCommand,
  UpdateBloodInventoryItemPriceCommand,
} from '../commands/impl';
import { AddDispenseBloodInventoryItemDTO, UpdateBloodInventoryItemPriceDTO } from '../interface';

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
  @ApiInternalServerErrorResponse()
  async addBloodInventoryItem(
    @Req() req: Request,
    @Body() payload: AddDispenseBloodInventoryItemDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BloodInventoryInfo> {
    return await this.command.execute(
      new AddDispenseBloodInventoryItemCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        payload,
      ),
    );
  }

  @Patch('update-item-price')
  @ApiOkResponse({
    type: BloodInventoryInfo,
  })
  @ApiInternalServerErrorResponse()
  async updateBloodInventoryItemPrice(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
    @Body() payload: UpdateBloodInventoryItemPriceDTO,    
  ): Promise<BloodInventoryInfo> {
    return await this.command.execute(
      new UpdateBloodInventoryItemPriceCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        payload,
      ),
    );
  }
}
