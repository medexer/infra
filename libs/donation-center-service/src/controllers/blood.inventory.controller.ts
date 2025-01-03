import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'libs/common/src/auth';
import { SecureUserPayload } from 'libs/common/src/interface';
import { Get, Req, UseGuards, Controller } from '@nestjs/common';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import { BloodInventoryService } from '../services/blood.inventory.service';
import { BloodInventoryInfo } from 'libs/common/src/models/blood.inventory.model';

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
}
