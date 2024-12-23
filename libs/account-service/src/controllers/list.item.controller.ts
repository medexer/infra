import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AddListItemDTO } from '../interface';
import { ListItemService } from '../services/list.item.service';
import { JwtAuthGuard } from 'libs/common/src/auth/jwt-auth.guard';
import { ListItemInfo } from 'libs/common/src/models/list.item.model';
import { SecureUserPayload } from 'libs/common/src/interface';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';

@ApiTags('user-list')
@Controller('list-items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ListItemController {
  constructor(private readonly listItemService: ListItemService) {}

  @Get()
  @ApiOperation({ summary: 'Get all list items for the current user' })
  @ApiOkResponse({
    isArray: true,
    type: ListItemInfo,
  })
  async getUserList(
    @Req() req: any,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<ListItemInfo[]> {
    return this.listItemService.fetchListItems(secureUser);
  }

  @Post()
  @ApiOperation({ summary: "Add an item to a user's list" })
  @ApiOkResponse({
    type: ListItemInfo,
  })
  async addItemToList(
    @Req() req: any,
    @Body() payload: AddListItemDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<ListItemInfo> {
    return this.listItemService.addItemToList(secureUser, payload);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: "Remove an item from a user's list" })
  @ApiParam({ name: 'itemId', description: 'ID of the list item to remove' })
  async removeItemFromList(@Param('itemId') itemId: number): Promise<void> {
    return this.listItemService.removeItemFromList(itemId);
  }
}
