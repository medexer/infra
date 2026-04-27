import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { AccountType } from 'libs/common/src/constants/enums';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from '../../../common/src/logger/logger.service';
import { DonationCenter } from 'libs/common/src/models/donation.center.model';
import { ImageUploadService } from 'libs/helper-service/src/services/image-upload.service';

@Injectable()
export class AdminService {
  constructor(
    private configService: ConfigService,
    private readonly imageUploadService: ImageUploadService,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(DonationCenter)
    private readonly donationCenterRepository: Repository<DonationCenter>,
  ) { }

  async fetchDefaultImage() {
    try {
      this.logger.log(`[UPDATE-DONATION-CENTER-PROFILE-PROCESSING]`);

      const response = await fetch('https://medexer.s3.amazonaws.com/avatars/avatar.png');
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);
        const mimetype = response.headers.get('content-type') || 'image/jpeg';

        const mockFile = {
          buffer,
          mimetype,
          originalname: '_logo',
        } as Express.Multer.File;

        const uploadResult = await this.imageUploadService.uploadFileToAws(mockFile);

        console.log({ uploadResult });
      }

      this.logger.log(`[UPDATE-DONATION-CENTER-PROFILE-SUCCESS]`);
    } catch (error) {
      this.logger.error(`[UPDATE-DONATION-CENTER-PROFILE-ERROR] :: ${error}`);
      throw error;
    }
  }

  async updateDonationCenterProfile() {
    try {
      this.logger.log(`[UPDATE-DONATION-CENTER-PROFILE-PROCESSING]`);

      const accounts = await this.accountRepository.find({
        where: {
          accountType: AccountType.DONATION_CENTER,
        },
      });

      await Promise.all(accounts.map(async (account) => {
        try {
          this.logger.log(`[UPDATE-DONATION-CENTER-PROFILE-MANAGER-PROCESSING]`);

          const donationCenter = await this.donationCenterRepository.findOne({
            where: {
              account: {
                id: account.id,
              },
            },
          });

          if (donationCenter && donationCenter.coverPhoto) {
            const response = await fetch(donationCenter.coverPhoto);
            if (response.ok) {
              const arrayBuffer = await response.arrayBuffer();

              const buffer = Buffer.from(arrayBuffer);

              const mimetype = response.headers.get('content-type') || 'image/jpeg';

              const mockFile = {
                buffer,
                mimetype,
                originalname: donationCenter.name + '_cover-photo',
              } as Express.Multer.File;

              const uploadResult = await this.imageUploadService.uploadFileToAws(mockFile);

              donationCenter.coverPhoto = uploadResult.url;

              console.log({ uploadResult });

              await this.donationCenterRepository.save(donationCenter);
            }
          }

          this.logger.log(`[UPDATE-DONATION-CENTER-PROFILE-MANAGER-SUCCESS]`);
        } catch (error) {
          this.logger.error(`[UPDATE-DONATION-CENTER-PROFILE-MANAGER-ERROR] :: ${error}`);
        }
      }));

      this.logger.log(`[UPDATE-DONATION-CENTER-PROFILE-SUCCESS]`);
    } catch (error) {
      this.logger.error(`[UPDATE-DONATION-CENTER-PROFILE-ERROR] :: ${error}`);
      throw error;
    }
  }

  async updateAccountProfile() {
    try {
      this.logger.log(`[UPDATE-PROFILE-PROCESSING]`);

      const accounts = await this.accountRepository.find({
        where: {
          // accountType: AccountType.INDIVIDUAL,
        },
      });

      await Promise.all(accounts.map(async (account) => {
        try {
          this.logger.log(`[UPDATE-PROFILE-MANAGER-PROCESSING]`);
          account.profilePhoto = 'https://afritint-media.s3.eu-north-1.amazonaws.com/versions/original/5415ab65-fcc2-45f7-9ef7-c4decf861019.png';

          await this.accountRepository.save(account);

          // const response = await fetch(account.profilePhoto);

          // if (response.ok) {
          //   const arrayBuffer = await response.arrayBuffer();

          //   const buffer = Buffer.from(arrayBuffer);

          //   const mimetype = response.headers.get('content-type') || 'image/jpeg';

          //   const mockFile = {
          //     buffer,
          //     mimetype,
          //     originalname: account.firstName + '_profile-photo',
          //   } as Express.Multer.File;

          //   const uploadResult = await this.imageUploadService.uploadFileToAws(mockFile);

          //   account.profilePhoto = uploadResult.url;

          //   console.log({ uploadResult });

          //   await this.accountRepository.save(account);
          // }

          setTimeout(() => {
          }, 4000);
          this.logger.log(`[UPDATE-PROFILE-MANAGER-SUCCESS]`);
        } catch (error) {
          this.logger.error(`[UPDATE-PROFILE-MANAGER-ERROR] :: ${error}`);
          console.log(error, ' --ERROR-- ', account.profilePhoto);
        }
      }));

      this.logger.log(`[UPDATE-PROFILE-SUCCESS]`);
    } catch (error) {
      this.logger.error(`[UPDATE-PROFILE-ERROR] :: ${error}`);
      throw error;
    }
  }
}
