import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadDonorComplianceCommand } from '../impl';
import authUtils from 'libs/common/src/security/auth.utils';
import { Account } from 'libs/common/src/models/account.model';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { AccountStatus } from 'libs/common/src/constants/enums';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserNotFoundException } from 'libs/common/src/constants/exceptions';
import { DonorCompliance } from 'libs/common/src/models/donor.compliance.model';
import { EmailNotificationService } from 'libs/notification-service/src/services/email.notification.service';

@CommandHandler(UploadDonorComplianceCommand)
export class UploadDonorComplianceHandler
  implements ICommandHandler<UploadDonorComplianceCommand>
{
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    private readonly emailNotificationService: EmailNotificationService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(DonorCompliance)
    private readonly donorComplianceRepository: Repository<DonorCompliance>,
  ) {}

  async execute(command: UploadDonorComplianceCommand) {
    try {
      this.logger.log(`[UPLOAD-DONOR-COMPLIANCE-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const account = await this.accountRepository.findOne({
        where: { id: secureUser.id },
      });

      if (!account) {
        throw UserNotFoundException();
      }

      const complianceExists = await this.donorComplianceRepository.findOne({
        where: { accountId: { id: account.id } },
        relations: ['accountId'],
      });

      if (complianceExists) {
        throw new UnauthorizedException(
          'Compliance for this account is already uploaded.',
        );
      }

      await this.donorComplianceRepository.save({
        accountId: account,
        ...payload,
      });

      Object.assign(account, {
        isComplianceUploaded: true,
        genotype: payload.genotype,
        bloodGroup: payload.bloodGroup,
        hasTattoos: payload.hasTattoos,
        lastDonationDate: payload.lastDonatedBloodDate
          ? payload.lastDonatedBloodDate
          : null,
        inRecovery: payload.hasPreviouslyDonatedBlood
          ? !authUtils.isDatePastThreeMonths(
              payload.lastDonatedBloodDate!.toString(),
            )
          : false,
      });

      await this.accountRepository.save(account);

      this.emailNotificationService.donorComplianceNotification(account);

      this.logger.log(`[UPLOAD-DONOR-COMPLIANCE-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[UPLOAD-DONOR-COMPLIANCE-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
