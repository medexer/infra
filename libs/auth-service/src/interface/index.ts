import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { toLowerCaseTransformer, trimTransformer } from '../../../common/helpers/local-class-validator';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class SignupResponsePayload {
  @ApiProperty()
  token: string;
}

export class CreateDonorAccountDTO {
    @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
    @ApiProperty()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;
  
    @ApiProperty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
  
    @Transform(({ value }) => trimTransformer(value))
    @ApiProperty()
    @IsString()
    @MaxLength(16)
    @IsNotEmpty()
    firstName: string;
  
    @Transform(({ value }) => trimTransformer(value))
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(16)
    lastName: string;
  
    @Transform(({ value }) => trimTransformer(value))
    @ApiProperty()
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;
  
    @Transform(({ value }) => trimTransformer(value))
    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(10)
    referralCode: string;
  }  

// export class CreateDonorAccountDTO extends PickType(CreateAccountDTO, [
//     'email',
//     'firstName',
//     'lastName',
//     'password',
//     'phone',
//     'referralCode',
//   ]) {
//     @ApiPropertyOptional({
//       description: 'Name of the vendor, used across the Tukshopp platform.',
//       example: 'Gourmet Pizza Place',
//     })
//     @IsString()
//     vendorName: string;
//     @ApiPropertyOptional({
//       description: 'Short description of the vendor’s business.',
//       example: 'Serving the best gourmet pizzas in town.',
//     })
//     @IsString()
//     @IsOptional()
//     shortDescription: string;
//     @ApiPropertyOptional({ description: 'Type of business' })
//     @IsString()
//     @IsOptional()
//     businessType?: string;
//   }
