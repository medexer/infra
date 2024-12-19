import {
  IsEnum,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';
import {
  Genotype,
  BloodGroup,
  DonorIdentificationType,
} from 'libs/common/src/constants/enums';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { DonorCompliance } from 'libs/common/src/models/donor.compliance.model';

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
  @IsDateString()
  @ApiProperty({
    example: '2023-01-01',
    description: 'Last donated blood date',
  })
  lastDonatedBloodDate?: Date;

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

  @IsNotEmpty()
  @ApiProperty({
    example: 'VOTERS_CARD',
    enum: DonorIdentificationType,
    description: 'Donor identification document type',
  })
  @IsEnum(DonorIdentificationType)
  identificationType: DonorIdentificationType;
}
