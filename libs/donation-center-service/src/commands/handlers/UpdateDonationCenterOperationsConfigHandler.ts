import { Repository } from 'typeorm';
import { EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { UpdateDonationCenterOperationsConfigCommand } from '../impl';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import {
  DonationCenterConfig,
  DonationCenterOperationsInfo,
} from 'libs/common/src/models/donation.center.model';

@CommandHandler(UpdateDonationCenterOperationsConfigCommand)
export class UpdateDonationCenterOperationsConfigHandler
  implements
    ICommandHandler<
      UpdateDonationCenterOperationsConfigCommand,
      DonationCenterOperationsInfo
    >
{
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(DonationCenterConfig)
    private readonly donationCenterConfigRepository: Repository<DonationCenterConfig>,
  ) {}

  async execute(command: UpdateDonationCenterOperationsConfigCommand) {
    try {
      this.logger.log(
        `[UPDATE-DONATION-CENTER-OPERATIONS-CONFIG-HANDLER-PROCESSING]`,
      );

      const { donationCenterId, payload } = command;

      const config = await this.donationCenterConfigRepository.findOne({
        where: {
          donation_center: {
            id: donationCenterId,
          },
        },
        relations: ['donation_center'],
      });

      if (!config) {
        throw new NotFoundException('Donation center configuration settings not found');
      }

      Object.assign(config, payload);

      const updatedConfig =
        await this.donationCenterConfigRepository.save(config);

      this.logger.log(
        `[UPDATE-DONATION-CENTER-OPERATIONS-CONFIG-HANDLER-SUCCESS]`,
      );

      return modelsFormatter.FormatDonationCenterOperationsInfo(updatedConfig);
    } catch (error) {
      this.logger.log(
        `[UPDATE-DONATION-CENTER-OPERATIONS-CONFIG-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
