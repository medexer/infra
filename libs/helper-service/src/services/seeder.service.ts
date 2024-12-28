import axios from 'axios';
import * as csvParser from 'csv-parse';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppLogger } from '../../../common/src/logger/logger.service';
import {
  DonationCenter,
  DonationCenterCompliance,
} from 'libs/common/src/models/donation.center.model';
import { Account } from 'libs/common/src/models/account.model';
import { GoogleLocationService } from './google-location.service';

@Injectable()
export class SeederService {
  constructor(
    private configService: ConfigService,
    @Inject('Logger') private readonly logger: AppLogger,
    private readonly googleLocationService: GoogleLocationService,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(DonationCenter)
    private donationCenterRepository: Repository<DonationCenter>,
    @InjectRepository(DonationCenterCompliance)
    private readonly complianceRepository: Repository<DonationCenterCompliance>,
  ) {}

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

  // Add this new private method to handle CSV parsing
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
}
