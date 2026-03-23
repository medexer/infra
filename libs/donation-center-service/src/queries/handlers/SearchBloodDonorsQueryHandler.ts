import { Inject } from '@nestjs/common';
import { Repository, ILike } from 'typeorm';
import { SearchBloodDonorsQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { AccountType, BloodGroup, Genotype } from 'libs/common/src/constants/enums';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { DonationCenter } from 'libs/common/src/models/donation.center.model';
import { Account, BloodDonorInfo } from 'libs/common/src/models/account.model';
import { GoogleLocationService } from 'libs/helper-service/src/services/google-location.service';

@QueryHandler(SearchBloodDonorsQuery)
export class SearchBloodDonorsQueryHandler
	implements
	IQueryHandler<SearchBloodDonorsQuery, BloodDonorInfo[]> {
	constructor(
		@Inject('Logger') private readonly logger: AppLogger,
		@InjectRepository(Account)
		private readonly accountRepository: Repository<Account>,
		@InjectRepository(DonationCenter)
		private readonly donationCenterRepository: Repository<DonationCenter>,
		private readonly googleLocationService: GoogleLocationService,
	) { }

	async execute(searchQuery: SearchBloodDonorsQuery) {
		try {
			this.logger.log(`[SEARCH-BLOOD-DONOR-QUERY-HANDLER-PROCESSING]`);

			const { query, secureUser } = searchQuery;

			const donationCenter = await this.donationCenterRepository.findOne({
				where: { account: { id: secureUser.id } },
			});

			if (!donationCenter) {
				throw new Error('Donation center not found');
			}

			let centerState = donationCenter.state || '';
			let centerCity = donationCenter.stateArea || '';

			if (donationCenter.latitude && donationCenter.longitude) {
				try {
					const locationInfo = await this.googleLocationService.reverseGeocode(
						donationCenter.latitude,
						donationCenter.longitude
					);
					if (locationInfo.state) centerState = locationInfo.state;
					if (locationInfo.city) centerCity = locationInfo.city;
				} catch (error) {
					this.logger.log(`[SEARCH-BLOOD-DONOR] reverse geocode failed: ${error}`);
				}
			}

			const trimmedQuery = query.trim();
			const upperQuery = trimmedQuery.toUpperCase();

			const isBloodGroup = Object.values(BloodGroup).includes(upperQuery as unknown as BloodGroup);
			const isGenotype = Object.values(Genotype).includes(upperQuery as unknown as Genotype);

			const whereConditions: any[] = [
				{ state: ILike(`%${trimmedQuery}%`) },
				{ stateArea: ILike(`%${trimmedQuery}%`) },
			];

			if (isBloodGroup) {
				whereConditions.push({ bloodGroup: upperQuery as unknown as BloodGroup });
			}

			if (isGenotype) {
				whereConditions.push({ genotype: upperQuery as unknown as Genotype });
			}

			let donors = await this.accountRepository.find({
				where: whereConditions.map(condition => ({
					...condition,
					accountType: AccountType.INDIVIDUAL,
				})),
				take: 30,
			});

			if (donationCenter.latitude && donationCenter.longitude) {
				const centerLat = parseFloat(donationCenter.latitude);
				const centerLng = parseFloat(donationCenter.longitude);

				if (!isNaN(centerLat) && !isNaN(centerLng)) {
					donors.forEach((donor: any) => {
						if (donor.latitude && donor.longitude) {
							const dLat = parseFloat(donor.latitude);
							const dLng = parseFloat(donor.longitude);
							if (!isNaN(dLat) && !isNaN(dLng)) {
								const R = 6371; // Radius of the earth in km
								const dLatRad = (dLat - centerLat) * Math.PI / 180;
								const dLngRad = (dLng - centerLng) * Math.PI / 180;
								const a =
									Math.sin(dLatRad / 2) * Math.sin(dLatRad / 2) +
									Math.cos(centerLat * Math.PI / 180) * Math.cos(dLat * Math.PI / 180) *
									Math.sin(dLngRad / 2) * Math.sin(dLngRad / 2);
								const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
								donor.distance = R * c; // Distance in km
							} else {
								donor.distance = Infinity;
							}
						} else {
							donor.distance = Infinity;
						}

						let matchLevel = 2; // Different state
						if (centerState && donor.state && donor.state.toLowerCase() === centerState.toLowerCase()) {
							if (centerCity && donor.stateArea && donor.stateArea.toLowerCase() === centerCity.toLowerCase()) {
								matchLevel = 0; // Same state and SAME city
							} else {
								matchLevel = 1; // Same state DIFFERENT city
							}
						}
						donor.matchLevel = matchLevel;
					});

					donors.sort((a: any, b: any) => {
						if (a.matchLevel !== b.matchLevel) {
							return a.matchLevel - b.matchLevel;
						}
						return a.distance - b.distance;
					});
				}
			}

			// donors = donors.slice(0, 30);

			this.logger.log(`[SEARCH-BLOOD-DONOR-QUERY-HANDLER-SUCCESS]`);

			return donors.map((donor) => modelsFormatter.FormatBloodDonorInfo(donor, donationCenter));
		} catch (error) {
			this.logger.log(`[SEARCH-BLOOD-DONOR-QUERY-HANDLER-ERROR] :: ${error}`);

			throw error;
		}
	}
}
