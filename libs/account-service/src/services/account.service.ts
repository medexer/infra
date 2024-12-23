import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';
import { AppLogger } from '../../../common/src/logger/logger.service';
import { SecureUserPayload } from 'libs/common/src/interface';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { MedicalHistoryInfo } from 'libs/common/src/models/medical.history.model';
import { NotificationInfo } from 'libs/common/src/models/notification.model';
import { MedicalHistory } from 'libs/common/src/models/medical.history.model';
import { Notification } from 'libs/common/src/models/notification.model';

@Injectable()
export class AccountService {
  constructor(
    public jwtService: JwtService,
    public commandBus: CommandBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(MedicalHistory)
    private readonly medicalHistoryRepository: Repository<MedicalHistory>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async getDetailedProfile(
    secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    try {
      this.logger.log('[GET-DETAILED-ACCOUNT-PROCESSING]');

      const account = await this.accountRepository.findOneBy({
        id: secureUser.id,
      });

      if (!account) {
        throw new Error(`Account with id ${secureUser.id} not found`);
      }

      this.logger.log('[GET-DETAILED-ACCOUNT-SUCCESS]');

      return modelsFormatter.FormatAccountInfo(account);
    } catch (error) {
      this.logger.log(`[GET-DETAILED-ACCOUNT-ERROR] : ${error}`);

      throw error;
    }
  }

  async getMedicalHistory(
    secureUser: SecureUserPayload,
  ): Promise<MedicalHistoryInfo[]> {
    try {
      this.logger.log(`[GET-MEDICAL-HISTORY-PROCESSING]`);

      const medicalHistory = await this.medicalHistoryRepository.find({
        where: {
          account: { id: secureUser.id },
        },
        relations: ['account', 'appointment', 'appointment.donation_center'],
      });

      this.logger.log(`[GET-MEDICAL-HISTORY-SUCCESS]`);

      return medicalHistory.map((history) =>
        modelsFormatter.FormatMedicalHistoryInfo(history),
      );
    } catch (error) {
      this.logger.error(
        `[GET-COMPLETED-DONOR-APPOINTMENTS-FAILED] :: ${error}`,
      );

      throw error;
    }
  }

  async getNotifications(
    secureUser: SecureUserPayload,
  ): Promise<NotificationInfo[]> {
    try {
      this.logger.log(`[GET-NOTIFICATIONS-PROCESSING]`);

      const notifications = await this.notificationRepository.find({
        where: {
          account: { id: secureUser.id },
        },
        relations: ['account', 'appointment'],
      });

      this.logger.log(`[GET-NOTIFICATIONS-SUCCESS]`);

      return notifications.map((notification) =>
        modelsFormatter.FormatNotificationInfo(notification),
      );
    } catch (error) {
      this.logger.error(`[GET-NOTIFICATIONS-ERROR] :: ${error}`);
    }
  }
}
