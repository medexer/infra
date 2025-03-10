import {
  IsHash,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  trimTransformer,
  capitalizeTransformer,
  toLowerCaseTransformer,
} from '../../../common/src/helpers/local-class-validator';
import { AccountType } from 'libs/common/src/constants/enums';

export class CreateAccountDTO {
  @ApiProperty({
    example: 'kunleadeboye@gmail.com',
    description: 'Email address of the donor.',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Password for the donor account.',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @Transform(({ value }) => capitalizeTransformer(value))
  @ApiProperty({
    example: 'Kunle',
    description: 'First name of the donor.',
  })
  @IsString()
  @MaxLength(16)
  @IsNotEmpty()
  firstName: string;

  @Transform(({ value }) => capitalizeTransformer(value))
  @ApiProperty({
    example: 'Adeboye',
    description: 'Last name of the donor.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  lastName: string;

  @Transform(({ value }) => trimTransformer(value))
  @ApiPropertyOptional({
    example: '+2348123456789',
    description: 'Phone number of the donor.',
  })
  @IsPhoneNumber()
  @IsOptional()
  phone: string;

  @Transform(({ value }) => trimTransformer(value))
  @ApiProperty({
    example: 'MDX1902123',
    description: 'Referral code of the donor (Optional).',
  })
  @IsOptional()
  @IsString()
  // @MaxLength(10)
  referralCode: string;
}

export class CreateDonationCenterAccountDTO {
  @Transform(({ value }) => capitalizeTransformer(value))
  @ApiProperty({
    example: 'Kunle',
    description: 'First name of the donation center administrator.',
  })
  @IsString()
  @MaxLength(16)
  @IsNotEmpty()
  firstName: string;

  @Transform(({ value }) => capitalizeTransformer(value))
  @ApiProperty({
    example: 'Adeboye',
    description: 'Last name of the donation center administrator.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  lastName: string;
  @ApiProperty({
    example: 'admin@juth.com',
    description: 'Email address of the donation center.',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Password for the donation center account.',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @Transform(({ value }) => capitalizeTransformer(value))
  @ApiProperty({
    example: 'Jos University Teaching Hospital',
    description: 'Name of the donation center.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => trimTransformer(value))
  @ApiProperty({
    example: '+2348123456789',
    description: 'Phone number of the donation center.',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;
}

export class CompleteSignupVerificationDTO {
  @ApiProperty()
  @IsHash('sha256')
  signupVerificationHash: string;

  @ApiProperty()
  @IsString()
  otp: string;
}

export class OAuthSigninDTO {
  @ApiProperty({
    example: 'kunle@gmail.com',
    description: 'Account email.',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({
    example: 'kunle@gmail.com',
    description: 'Account email.',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;
}

export class ResetPasswordDTO {
  @ApiProperty({
    example: 'Password@123',
    description: 'Account password.',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;

  @ApiProperty({
    example: 'a7c9c7a9-249a-2890-8396-1643b5dbca72',
    description: 'Password reset token.',
  })
  @IsString()
  @IsOptional()
  passwordResetToken: string;

  @ApiProperty({
    example: 29,
    description: 'Account Id.',
  })
  @IsString()
  @IsOptional()
  accountId: string;
}

export class ResetPasswordVerificationDTO {
  @ApiProperty({
    example: 'kunle@gmail.com',
    description: 'Account email.',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;

  @ApiProperty({
    example: '2938',
    description: 'Password reset token.',
  })
  @IsString()
  otp: string;
}

export class SignupResponsePayload {
  @ApiProperty()
  signupVerificationHash: string;
}

export class SignupVerificationResponsePayload {
  @ApiProperty()
  token: string;
}

export class SigninResponsePayload extends SignupVerificationResponsePayload {}

export class ResetPasswordOTPVerificationResponsePayload {
  @ApiProperty({
    example: '23',
    description: 'Account Id.',
  })
  accountId: string;

  @ApiProperty({
    example: 'Random UUID',
    description: 'Password reset token',
  })
  passwordResetToken: string;
}

export class SigninDTO {
  @ApiProperty({
    example: 'kunle@gmail.com',
    description: 'Account email.',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'Account password.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SigninAsDTO {
  @ApiProperty({
    example: 'kunle@gmail.com',
    description: 'Account email.',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'Account password.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: AccountType })
  @IsNotEmpty()
  @IsEnum(AccountType)
  accountType: string;
}

export class AvailabilityCheckResponsePayload {
  @ApiProperty({ type: Boolean })
  isAvailable: boolean;
}
