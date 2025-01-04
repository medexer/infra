import { Repository } from 'typeorm';
import { EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DaysOfWork,
  OpeningHours,
  DonationCenterConfig,
  DonationCenterOperationsInfo,
} from 'libs/common/src/models/donation.center.model';
import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDonationCenterDaysOfWorkCommand } from '../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';

@CommandHandler(UpdateDonationCenterDaysOfWorkCommand)
export class UpdateDonationCenterDaysOfWorkHandler
  implements
    ICommandHandler<
      UpdateDonationCenterDaysOfWorkCommand,
      DonationCenterOperationsInfo
    >
{
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(DaysOfWork)
    private readonly daysOfWorkRepository: Repository<DaysOfWork>,
    @InjectRepository(OpeningHours)
    private readonly openingHoursRepository: Repository<OpeningHours>,
    @InjectRepository(DonationCenterConfig)
    private readonly donationCenterConfigRepository: Repository<DonationCenterConfig>,
  ) {}

  async execute(command: UpdateDonationCenterDaysOfWorkCommand) {
    try {
      this.logger.log(
        `[UPDATE-DONATION-CENTER-DAYS-OF-WORK-HANDLER-PROCESSING]`,
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
        throw new NotFoundException(
          'Donation center operations config not found',
        );
      }

      await Promise.all(
        payload.daysOfWork?.map(async (item) => {
          try {
            const itemId = Number(item.id);
            if (isNaN(itemId)) {
              throw new Error(`Invalid opening hours ID: ${item.id}`);
            }

            const dayOfWork = await this.openingHoursRepository.findOne({
              where: {
                id: itemId,
              },
            });

            if (!dayOfWork) {
              throw new NotFoundException(
                `Opening hours with ID ${itemId} not found`,
              );
            }

            Object.assign(dayOfWork, {
              open: item.open,
              close: item.close,
              alwaysOpen: item.alwaysOpen,
              closed: item.closed,
            });

            await this.openingHoursRepository.save(dayOfWork);
          } catch (error) {
            this.logger.log(
              `[UPDATE-DONATION-CENTER-DAYS-OF-WORK-HANDLER-ERROR] :: ${error}`,
            );

            throw error;
          }
        }),
      );

      this.logger.log(
        `[UPDATE-DONATION-CENTER-DAYS-OF-WORK-HANDLER-SUCCESS]`,
      );

      return modelsFormatter.FormatDonationCenterOperationsInfo(config);
    } catch (error) {
      this.logger.log(
        `[UPDATE-DONATION-CENTER-DAYS-OF-WORK-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
