import axios from 'axios';
import { Repository } from 'typeorm';
import * as csvParser from 'csv-parse';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import {
  DonationCenter,
  DonationCenterCompliance,
} from 'libs/common/src/models/donation.center.model';
import { Account } from 'libs/common/src/models/account.model';
import { GoogleLocationService } from './google-location.service';
import { AppLogger } from '../../../common/src/logger/logger.service';
import { AccountStatus, AccountType, BloodGroup } from 'libs/common/src/constants/enums';
import { BloodInventory } from 'libs/common/src/models/blood.inventory.model';
import { ReferralCodeGenerator } from 'libs/common/src/utils/id.generator';

@Injectable()
export class SeederService {
  constructor(
    private configService: ConfigService,
    @Inject('Logger') private readonly logger: AppLogger,
    private readonly googleLocationService: GoogleLocationService,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(BloodInventory)
    private bloodInventoryRepository: Repository<BloodInventory>,
    @InjectRepository(DonationCenter)
    private donationCenterRepository: Repository<DonationCenter>,
    @InjectRepository(DonationCenterCompliance)
    private readonly complianceRepository: Repository<DonationCenterCompliance>,
  ) {}

  private parseCSV(csvData: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      csvParser.parse(
        csvData,
        {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        },
        (err, records) => {
          if (err) {
            this.logger.error(`Error parsing CSV: ${err}`);
            reject(err);
          }
          resolve(records);
        },
      );
    });
  }

  async initializeUsers(payload: any, file: Express.Multer.File){
 try {
      this.logger.log('[INITIALIZE-USERS-PROCESSING]');

      const failedAccounts = [];
      const csvData = file.buffer.toString();

      // Separate CSV parsing into its own Promise
      const records = await this.parseCSV(csvData);
      this.logger.log(`Parsed ${records.length} records from CSV`);

      // Process records sequentially with delay between each
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      let recordCounter = 0;

      const updates = await Promise.all(
        records.map(async (record) => {
          try {
            if (recordCounter > 0) {
              await delay(1000);
            }
            recordCounter++;

            if(record?.email?.trim()?.length === 0){
              return;
            }

            this.logger.log(`Processing record for email: ${record.email}`);

            const existingUser = await this.accountRepository.findOne({
              where: { email: record.email },
            });

            if (existingUser) {
              this.logger.warn(`Account info for email already exists: ${record.email}`);
              failedAccounts.push(record.email);
              return null;
            }

            const account = this.accountRepository.create({
              email: record.email,
              password: record.password,
              firstName: record.firstName,
              lastName: record.lastName,
              phone: record.phoneNumber,
              status: AccountStatus.ACTIVE,
              referralCode: ReferralCodeGenerator(),
            });

            await this.accountRepository.save(account);

            return {
              email: record.email,
            };
          } catch (error) {
            this.logger.error(`Error processing record: ${error.message}`);
            throw error;
          }
        }),
      );

      this.logger.log('[INITIALIZE-USERS-SUCCESS]');
      return { updates, failedAccounts };
    } catch (error) {
      this.logger.error(`[INITIALIZE-USERS-FAILED] :: ${error}`);
      throw error;
    }
  }

  async initializeDonationCenters(payload: any, file: Express.Multer.File) {
    try {
      this.logger.log('[INITIALIZE-DONATION-CENTERS-PROCESSING]');

      const failedAccounts = [];
      const csvData = file.buffer.toString();

      // Separate CSV parsing into its own Promise
      const records = await this.parseCSV(csvData);
      this.logger.log(`Parsed ${records.length} records from CSV`);

      // Process records sequentially with delay between each
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      let recordCounter = 0;

      const updates = await Promise.all(
        records.map(async (record) => {
          try {
            if (recordCounter > 0) {
              await delay(1000);
            }
            recordCounter++;

            this.logger.log(`Processing record for email: ${record.email}`);

            const account = await this.accountRepository.findOne({
              where: { email: record.email },
            });

            if (!account) {
              this.logger.warn(`No account found for email: ${record.email}`);
              failedAccounts.push(record.email);
              return null;
            }

            const donationCenter = await this.donationCenterRepository.findOne({
              where: { account: { id: account.id } },
              relations: ['account'],
            });

            const compliance = await this.complianceRepository.findOne({
              where: { donationCenter: { id: donationCenter.id } },
              relations: ['donationCenter'],
            });

            const placeDetails =
              await this.googleLocationService.getPlaceDetails(record.place_id);

            // Update the donation center
            Object.assign(donationCenter, {
              state: record.state,
              address: record.address,
              logo: record.logo,
              coverPhoto: record.cover_photo,
              longDescription: record.long_description,
              shortDescription: record.short_description,
              buildingNumber: record.building_number,
              nearestLandmark: record.nearest_landmark,
              latitude: placeDetails.geometry.location.lat,
              longitude: placeDetails.geometry.location.lng,
              isComplianceUploaded: true,
            });

            // Update the compliance
            Object.assign(compliance, {
              cacCertificate: record.cac_certificate,
              proofOfAddress: record.proof_of_address,
            });

            const updatedDonationCenter =
              await this.donationCenterRepository.save(donationCenter);
            const updatedCompliance =
              await this.complianceRepository.save(compliance);

            return {
              email: record.email,
              donationCenter: updatedDonationCenter,
              compliance: updatedCompliance,
            };
          } catch (error) {
            this.logger.error(`Error processing record: ${error.message}`);
            throw error;
          }
        }),
      );

      this.logger.log('[INITIALIZE-DONATION-CENTERS-SUCCESS]');
      return { updates, failedAccounts };
    } catch (error) {
      this.logger.error(`[INITIALIZE-DONATION-CENTERS-FAILED] :: ${error}`);
      throw error;
    }
  }

  async initializeDonationCentersWithInventory(
    payload: any,
    file: Express.Multer.File,
  ) {
    try {
      this.logger.log(
        '[INITIALIZE-DONATION-CENTERS-WITH-INVENTORY-PROCESSING]',
      );

      const failedAccounts = [];
      const csvData = file.buffer.toString();

      // Separate CSV parsing into its own Promise
      const records = await this.parseCSV(csvData);
      this.logger.log(`Parsed ${records.length} records from CSV`);

      // Process records sequentially with delay between each
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      let recordCounter = 0;

      const updates = await Promise.all(
        records.map(async (record) => {
          try {
            if (recordCounter > 0) {
              await delay(1000);
            }
            recordCounter++;

            this.logger.log(`Processing record for email: ${record.email}`);

            const account = await this.accountRepository.findOne({
              where: { email: record.email },
            });

            if (!account) {
              this.logger.warn(`No account found for email: ${record.email}`);
              failedAccounts.push(record.email);
              return null;
            }

            const donationCenter = await this.donationCenterRepository.findOne({
              where: { account: { id: account.id } },
              relations: ['account'],
            });

            const inventory = await this.bloodInventoryRepository.find({
              where: { donationCenter: { id: donationCenter.id } },
              relations: ['donationCenter'],
            });

            if (inventory.length > 0) {
              return {
                email: record.email,
                status: 'INVENTORY-ALREADY-INITIALIZED',
              };
            }

            await Promise.all(
              Object.values(BloodGroup).map(
                async (bloodGroup) =>
                  await this.bloodInventoryRepository.save({
                    bloodGroup,
                    units: '0',
                    price: '0',
                    description:
                      bloodGroup === BloodGroup.APositive
                        ? 'Has A antigen and Rh factor'
                        : bloodGroup === BloodGroup.ANegative
                          ? 'Has A antigen, no Rh factor'
                          : bloodGroup === BloodGroup.BPositive
                            ? 'Has B antigen and Rh factor'
                            : bloodGroup === BloodGroup.BNegative
                              ? 'Has B antigen, no Rh factor'
                              : bloodGroup === BloodGroup.ABPositive
                                ? 'Has both A and B antigens and Rh factor'
                                : bloodGroup === BloodGroup.ABNegative
                                  ? 'Has both A and B antigens, no Rh factor'
                                  : bloodGroup === BloodGroup.OPositive
                                    ? 'No A or B antigens, has Rh factor'
                                    : 'No A or B antigens, no Rh factor',
                    donationCenter: donationCenter,
                  }),
              ),
            );

            return {
              email: record.email,
              status: 'INVENTORY-INITIALIZED',
            };
          } catch (error) {
            this.logger.error(`Error processing record: ${error.message}`);
            throw error;
          }
        }),
      );

      this.logger.log('[INITIALIZE-DONATION-CENTERS-WITH-INVENTORY-SUCCESS]');
      return { updates, failedAccounts };
    } catch (error) {
      this.logger.error(
        `[INITIALIZE-DONATION-CENTERS-WITH-INVENTORY-FAILED] :: ${error}`,
      );
      throw error;
    }
  }

  async initializeOldDonationCentersWithInventory() {
    try {
      this.logger.log(
        '[INITIALIZE-OLD-DONATION-CENTERS-WITH-INVENTORY-PROCESSING]',
      );

      const failedAccounts = [];

      // Separate CSV parsing into its own Promise
      const records = await this.accountRepository.find({
        where: {
          accountType: AccountType.DONATION_CENTER,
        },
      });

      // Process records sequentially with delay between each
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      let recordCounter = 0;

      const updates = await Promise.all(
        records.map(async (account) => {
          try {
            if (recordCounter > 0) {
              await delay(1000);
            }
            recordCounter++;

            this.logger.log(`Processing record for email: ${account.email}`);

            const donationCenter = await this.donationCenterRepository.findOne({
              where: { account: { id: account.id } },
              relations: ['account'],
            });

            const inventory = await this.bloodInventoryRepository.find({
              where: { donationCenter: { id: donationCenter.id } },
              relations: ['donationCenter'],
            });

            if (inventory.length > 0) {
              return {
                email: account.email,
                status: 'INVENTORY-ALREADY-INITIALIZED',
              };
            }

            await Promise.all(
              Object.values(BloodGroup).map(
                async (bloodGroup) =>
                  await this.bloodInventoryRepository.save({
                    bloodGroup,
                    units: '0',
                    price: '0',
                    description:
                      bloodGroup === BloodGroup.APositive
                        ? 'Has A antigen and Rh factor'
                        : bloodGroup === BloodGroup.ANegative
                          ? 'Has A antigen, no Rh factor'
                          : bloodGroup === BloodGroup.BPositive
                            ? 'Has B antigen and Rh factor'
                            : bloodGroup === BloodGroup.BNegative
                              ? 'Has B antigen, no Rh factor'
                              : bloodGroup === BloodGroup.ABPositive
                                ? 'Has both A and B antigens and Rh factor'
                                : bloodGroup === BloodGroup.ABNegative
                                  ? 'Has both A and B antigens, no Rh factor'
                                  : bloodGroup === BloodGroup.OPositive
                                    ? 'No A or B antigens, has Rh factor'
                                    : 'No A or B antigens, no Rh factor',
                    donationCenter: donationCenter,
                  }),
              ),
            );

            return {
              email: account.email,
              status: 'INVENTORY-INITIALIZED',
            };
          } catch (error) {
            this.logger.error(`Error processing record: ${error.message}`);
            throw error;
          }
        }),
      );

      this.logger.log(
        '[INITIALIZE-OLD-DONATION-CENTERS-WITH-INVENTORY-SUCCESS]',
      );
      return { updates, failedAccounts };
    } catch (error) {
      this.logger.error(
        `[INITIALIZE-OLD-DONATION-CENTERS-WITH-INVENTORY-FAILED] :: ${error}`,
      );

      throw error;
    }
  }
}
