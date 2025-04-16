import {
  IsEnum,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import {
  Genotype,
  BloodGroup,
  DonorIdentificationType,
} from 'libs/common/src/constants/enums';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class UploadDonorComplianceDTO {
  @ApiProperty({
    example: 'AB',
    description: 'Blood group of the donor.',
    enum: BloodGroup,
  })
  @IsNotEmpty()
  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @ApiProperty({
    example: 'AA',
    description: 'Genotype of the donor.',
    enum: Genotype,
  })
  @IsNotEmpty()
  @IsEnum(Genotype)
  genotype: Genotype;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '2023-01-01',
    description: 'Last donated blood date',
  })
  lastDonatedBloodDate?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'https://medexer.s3.aws.com/identification',
    description: 'Donor identification document url',
  })
  identificationDocument: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: 'Has tattoos',
  })
  hasTattoos: boolean;

  @ApiProperty({
    example: 'true',
    description: 'Has previously donated blood e.g false',
  })
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: 'true',
    description: 'Has previously donated blood e.g false',
  })
  hasPreviouslyDonatedBlood: boolean;

  @ApiProperty({
    example: 'VOTERS_CARD',
    enum: DonorIdentificationType,
    description: 'Donor identification document type',
    // default: DonorIdentificationType.NATIONAL_IDENTITY_CARD,
  })
  @IsNotEmpty()
  @IsEnum(DonorIdentificationType)
  identificationType: DonorIdentificationType;
}

export class CreateAppointmentDTO {
  @ApiProperty({
    example: '10:00 AM',
    description: 'Appointment time e.g 10:00 AM.',
  })
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Appointment date e.g 2024-01-01.',
  })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({
    example: '14',
    description: 'Appointment donation center id e.g 14.',
  })
  @IsOptional()
  @IsNumber()
  donationCenter?: number;
}

export class AddDonationCenterRatingDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '4',
    description: 'Rating e.g 4',
  })
  rating: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'This is a great donation center.',
    description: 'Comment e.g This is a great donation center.',
  })
  comment: string;  
}
