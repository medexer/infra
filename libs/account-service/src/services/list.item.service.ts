import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';
import { AddListItemDTO } from '../interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { SecureUserPayload } from 'libs/common/src/interface';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from '../../../common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { ListItem, ListItemInfo } from 'libs/common/src/models/list.item.model';

@Injectable()
export class ListItemService {
  constructor(
    public jwtService: JwtService,
    public commandBus: CommandBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async fetchListItems(secureUser: SecureUserPayload): Promise<ListItemInfo[]> {
    try {
      this.logger.log('[GET-LIST-ITEMS-PROCESSING]');

      const listItems = await this.listItemRepository.find({
        where: {
          account: { id: secureUser.id },
        },
        relations: ['account'],
      });

      console.log('[SECURE-USER] :: ', secureUser.id, listItems[0]?.account.id);
      console.log('[LIST-ITEMS] :: ', listItems);

      this.logger.log('[GET-LIST-ITEMS-SUCCESS]');

      return listItems.map((item) => modelsFormatter.FormatListItemInfo(item));
    } catch (error) {
      this.logger.error(`[GET-LIST-ITEMS-ERROR] : ${error}`);

      throw error;
    }
  }

  async addItemToList(
    secureUser: SecureUserPayload,
    payload: AddListItemDTO,
  ): Promise<ListItemInfo> {
    try {
      this.logger.log('[ADD-ITEM-TO-LIST-PROCESSING]');

    //   console.log('[SECURE-USER] :: ', secureUser.id);

      const account = await this.accountRepository.findOne({
        where: {
          id: secureUser.id,
        },
      });

      if (!account) {
        throw new Error('Account not found');
      }

      const newItem = await this.listItemRepository.save({
        account,
        itemType: payload.itemType,
        entityType: payload.entityType,
        itemId: payload.itemId.toString(),
      });

      const savedItem = await this.listItemRepository.findOne({
        where: { id: newItem.id },
        relations: ['account'],
      });

      //   console.log('[SAVED-ITEM] :: ', savedItem);

      this.logger.log('[ADD-ITEM-TO-LIST-SUCCESS]');

      return modelsFormatter.FormatListItemInfo(savedItem);
    } catch (error) {
      this.logger.error(`[ADD-ITEM-TO-LIST-ERROR] : ${error}`);

      throw error;
    }
  }

  async removeItemFromList(itemId: number): Promise<void> {
    try {
      this.logger.log('[REMOVE-ITEM-FROM-LIST-PROCESSING]');

      const item = await this.listItemRepository.findOne({
        where: {
          id: itemId,
        },
      });

      await this.listItemRepository.remove(item);

      this.logger.log('[REMOVE-ITEM-FROM-LIST-SUCCESS]');
    } catch (error) {
      this.logger.error(`[REMOVE-ITEM-FROM-LIST-ERROR] : ${error}`);

      throw error;
    }
  }
}
