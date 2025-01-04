import {
  IsEnum,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsNumberString,
  IsNumber,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  toLowerCaseTransformer,
  trimTransformer,
} from 'libs/common/src/helpers/local-class-validator';
import {
  AppointmentStatus,
  BloodGroup,
  Genotype,
} from 'libs/common/src/constants/enums';
import { DonationCentreDaysOfWork } from 'libs/common/src/models/donation.center.model';

export class DonationCenterComplianceDetailsDTO {
  @ApiProperty({
    example: 'https://medexer.s3.amazonaws.com/avatars/avatar.png',
    description: 'Logo of the donation center.',
  })
  @IsString()
  @IsNotEmpty()
  logo: string;

  @ApiProperty({
    example: 'https://medexer.s3.amazonaws.com/avatars/avatar.png',
    description: 'Cover photo of the donation center.',
  })
  @IsString()
  @IsNotEmpty()
  coverPhoto: string;

  @IsString()
  @ApiProperty({
    example: 'Jos University Teaching Hospital',
    description: 'Name of the donation center',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Saving Lives',
    description: 'Short description of the donation center',
  })
  shortDescription: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'We are a donation center that saves lives',
    description: 'Long description of the donation center',
  })
  longDescription: string;

  @ApiProperty({
    example: 'admin@juth.com',
    description: 'Donation center email.',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;

  @ApiProperty({
    example: '+2348123456789',
    description: 'Phone number of the donation center.',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  @Transform(({ value }) => trimTransformer(value))
  phone: string;
}

export class DonationCenterComplianceAddressDTO {
  @ApiProperty({
    example: 'Gate 1, Jos University Teaching Hospital',
    description: 'Address of the donation center.',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '42',
    description: 'Building number of the donation center.',
  })
  @IsString()
  @IsNotEmpty()
  buildingNumber: string;

  @ApiProperty({
    example: 'Plateau',
    description: 'State of the donation center.',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  // @ApiProperty({
  //   example: 'Jos North',
  //   description: 'State area of the donation center.',
  // })
  // @IsString()
  // @IsNotEmpty()
  // stateArea: string;

  @ApiProperty({
    example: 'ChIJbRW9oF90UxAR1RgPAqUhpDg',
    description: 'Place ID of the donation center.',
  })
  @IsString()
  @IsNotEmpty()
  placeId: string;

  // @ApiProperty({
  //   example: '9.2928839',
  //   description: 'Latitude of the donation center.',
  // })
  // @IsString()
  // @IsNotEmpty()
  // latitude: string;

  // @ApiProperty({
  //   example: '7.4238839',
  //   description: 'Longitude of the donation center.',
  // })
  // @IsString()
  // @IsNotEmpty()
  // longitude: string;

  @ApiProperty({
    example: 'Gate 1 Lamingo Road Jos, Plateau State',
    description: 'Nearest landmark of the donation center.',
  })
  @IsString()
  @IsNotEmpty()
  nearestLandMark: string;
}

export class DonationCenterComplianceCredentialsDTO {
  @ApiProperty({
    example:
      'https://d30n3oi2bakvug.cloudfront.net/versions/original/d785858c-e783-4465-b9b4-a12e8a9e8f5a.jpeg',
    description: 'CAC Certificate of the donation center.',
  })
  @IsString()
  @IsNotEmpty()
  cacCertificate: string;

  @ApiProperty({
    example:
      'https://d30n3oi2bakvug.cloudfront.net/versions/original/d75c1ac3-7df9-408a-a1fd-69a3de0e9acb.png',
    description: 'Proof of address of the donation center.',
  })
  @IsString()
  @IsNotEmpty()
  proofOfAddress: string;
}

export class UpdateAppointmentStatusDTO {
  @ApiProperty({
    example: 'accepted',
    enum: AppointmentStatus,
    description: 'Status of the appointment.',
  })
  @IsEnum(AppointmentStatus)
  @IsNotEmpty()
  status: AppointmentStatus;

  @ApiProperty({
    example: '31',
    description: 'ID of the appointment.',
  })
  @IsString()
  @IsNotEmpty()
  appointmentId: string;
}

export class UploadTestResultsDTO {
  @ApiProperty({
    example: 'AA',
    description: 'Genotype',
    enum: Genotype,
  })
  @IsEnum(Genotype)
  @IsNotEmpty()
  genotype: Genotype;

  @ApiProperty({
    example: 'O+',
    description: 'Blood group',
    enum: BloodGroup,
  })
  @IsEnum(BloodGroup)
  @IsNotEmpty()
  bloodGroup: BloodGroup;

  @ApiProperty({
    example: true,
    description: 'HIV1 status',
  })
  @IsBoolean()
  @IsNotEmpty()
  hiv1: boolean;

  @ApiProperty({
    example: false,
    description: 'HIV2 status',
  })
  @IsBoolean()
  @IsNotEmpty()
  hiv2: boolean;

  @ApiProperty({
    example: false,
    description: 'Hepatitis B status',
  })
  @IsBoolean()
  @IsNotEmpty()
  hepatitisB: boolean;

  @ApiProperty({
    example: false,
    description: 'Hepatitis C status',
  })
  @IsBoolean()
  @IsNotEmpty()
  hepatitisC: boolean;

  @ApiProperty({
    example: false,
    description: 'Syphilis status',
  })
  @IsBoolean()
  @IsNotEmpty()
  syphilis: boolean;
}

export class AddDispenseBloodInventoryItemDTO {
  @ApiProperty({
    example: 'true',
    description: 'Whether to add or dispense inventory item',
  })
  @IsBoolean()
  @IsNotEmpty()
  isAddInventory: boolean;

  @ApiProperty({
    example: '1',
    description: 'Quantity of the inventory item',
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    example: '1',
    description: 'Inventory item ID',
  })
  @IsString()
  @IsNotEmpty()
  inventoryItemId: string;

  @ApiProperty({
    example: '1',
    description: 'Donation center ID',
  })
  @IsString()
  @IsNotEmpty()
  donationCenterId: string;
}

export class UpdateBloodInventoryItemPriceDTO {
  @ApiProperty({
    example: '100',
    description: 'New price of the inventory item',
  })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    example: '1',
    description: 'Inventory item ID',
  })
  @IsString()
  @IsNotEmpty()
  inventoryItemId: string;

  @ApiProperty({
    example: '1',
    description: 'Donation center ID',
  })
  @IsString()
  @IsNotEmpty()
  donationCenterId: string;
}

export class UpdateDonationCenterOperationsConfigDTO {
  @ApiProperty({
    example: 'true',
    description: 'Whether the donation center is accepting appointments',
  })
  @IsBoolean()
  @IsNotEmpty()
  isAcceptingAppointments: boolean;

  @ApiProperty({
    example: 'true',
    description: 'Whether the donation center is accepting appointments',
  })
  @IsBoolean()
  @IsNotEmpty()
  isAppointmentNotificationsEnabled: boolean;

  @ApiProperty({
    example: 'true',
    description: 'Whether the donation center is accepting appointments',
  })
  @IsBoolean()
  @IsNotEmpty()
  newAppointmentRequiresAction: boolean;

  @ApiProperty({
    example: '10',
    description: 'Maximum number of appointments per day',
  })
  @IsNumber()
  @IsNotEmpty()
  maxAppointmentPerDay: number;
}

export class UpdateDonationCenterWorkingHoursConfigDTO {
  @ApiProperty({
    // isArray: true,
    type: 'array',
    description: 'Opening hours for each day',
    example: [DonationCentreDaysOfWork],
  })
  @IsArray()
  daysOfWork: DonationCentreDaysOfWork[];
}
