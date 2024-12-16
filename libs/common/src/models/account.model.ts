import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  AccountStatus,
  AccountType,
  BloodGroup,
  Genotype,
} from '../constants/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Account {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @ApiPropertyOptional({
    description: 'Account ID (Auto generated).',
  })
  id: number;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'First name e.g Tunde.',
  })
  firstName: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Last name e.g Omotayo.',
  })
  lastName: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Phone number e.g +2348090292842.',
  })
  phone: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'New phone number e.g +2348090292842.',
  })
  newPhone: string;

  @Column({
    nullable: false,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Email address e.g tundeomotayo@gmail.com.',
  })
  email: string;

  @Column({
    nullable: false,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'New email address e.g tundeomotayo11@gmail.com.',
  })
  newEmail: string;

  @Column({
    nullable: false,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Password e.g SECURE_Lively1!@123',
  })
  password: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'State e.g Plateau',
  })
  state: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'State area e.g Jos North',
  })
  stateArea: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Latitude e.g 9.2928839',
  })
  latitude: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Longitude e.g 9.481991',
  })
  longitude: string;

  @Column({
    nullable: true,
    default: 'https://medexer.s3.amazonaws.com/avatars/avatar.png',
  })
  @ApiPropertyOptional({
    description:
      'Profile photo e.g https://medexer.s3.amazonaws.com/avatars/avatar.png',
  })
  profilePhoto: string;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.INDIVIDUAL,
  })
  @ApiPropertyOptional({
    description: 'Account type e.g INDIVIDUAL',
  })
  accountType: AccountType;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  @ApiPropertyOptional({
    description: 'Account status e.g PENDING',
  })
  status: AccountStatus;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'FCM token - Random firebase messaging string',
  })
  fcmToken: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Referral code e.g MDX_299292',
  })
  referralCode: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Referred by e.g 489',
  })
  referredBy: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Activation code by e.g 5492',
  })
  activationCode: string;

  @Column({
    default: null,
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Activation code expires by e.g 2024-11-10_T_11:29:22',
  })
  activationCodeExpires: Date;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Password reset code by e.g 5492',
  })
  passwordResetCode: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Password reset token by e.g ja92jkAjj11ma2',
  })
  passwordResetToken: string;

  @Column({
    default: null,
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Password reset code expires by e.g 2024-11-10_T_11:29:22',
  })
  passwordResetCodeExpires: Date;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Temporal access token by e.g ja92jkAjj11ma2',
  })
  temporalAccessToken: string;

  @Column({ default: null, nullable: true, type: 'timestamp' })
  @ApiPropertyOptional({
    description: 'Last login e.g 2024-11-10_T_11:29:22',
  })
  lastLogin: Date;

  @Column({ default: null, nullable: true, type: 'timestamp' })
  @ApiPropertyOptional({
    description: 'Last donation date e.g 2024-11-10_T_11:29:22',
  })
  lastDonationDate: Date;

  @Column({ default: false, nullable: true })
  @ApiPropertyOptional({
    description: 'In recovery from donation e.g false',
  })
  inRecovery: boolean;

  @Column({
    type: 'enum',
    nullable: true,
    enum: BloodGroup,
    default: BloodGroup.ABNegative,
  })
  @ApiPropertyOptional({
    description: 'Blood group e.g O+',
  })
  bloodGroup: BloodGroup;

  @Column({
    type: 'enum',
    nullable: true,
    enum: Genotype,
    default: Genotype.AA,
  })
  @ApiPropertyOptional({
    description: 'Genotype e.g AS',
  })
  genotype: Genotype;

  @Column({
    default: false,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Has tattoos e.g false',
  })
  hasTattoos: boolean;

  @Column({ default: false, nullable: true })
  @ApiPropertyOptional({
    description: 'In compliance uploaded e.g false',
  })
  isComplianceUploaded: boolean;

  @Column({ default: '', nullable: true })
  @ApiPropertyOptional({
    description: 'Signup verification hash',
  })
  signupVerificationHash: string;

  @CreateDateColumn({ nullable: true })
  @ApiPropertyOptional({
    description: 'Created at e.g 2024-11-10_T_11:29:22',
  })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  @ApiPropertyOptional({
    description: 'Created at e.g 2025-11-10_T_11:29:22',
  })
  updatedAt: Date;
}

export class AccountInfo {
  @ApiProperty({ example: '75' })
  id: number;

  @ApiProperty({ example: 'Ibrahim' })
  firstName: string;

  @ApiProperty({ example: 'Gyang' })
  lastName: string;

  @ApiProperty({ example: '+2348054618649' })
  phone: string;

  @ApiProperty({ example: 'gibrahim@yopmail.com' })
  email: string;

  @ApiProperty({ example: '' })
  state: string;

  @ApiProperty({ example: '' })
  stateArea: string;

  @ApiProperty({ example: '' })
  latitude: string;

  @ApiProperty({ example: '' })
  longitude: string;

  @ApiProperty({
    example: 'https://medexer.s3.amazonaws.com/avatars/avatar.png',
  })
  profilePhoto: string;

  @ApiProperty({ example: 'individual', enum: AccountType })
  accountType: AccountType;

  @ApiProperty({ example: 'active', enum: AccountStatus })
  status: AccountStatus;

  @ApiProperty({ example: '' })
  fcmToken: string;

  @ApiProperty({ example: 'MDX-DF1LUVRU' })
  referralCode: string;

  @ApiProperty({ example: '' })
  referredBy: string;

  @ApiProperty({ example: '2024-12-16T13:03:10.747Z' })
  lastLogin: Date;

  @ApiProperty({ example: null })
  lastDonationDate: Date | null;

  @ApiProperty({ example: false })
  inRecovery: boolean;

  @ApiProperty({ example: 'AB-', enum: BloodGroup })
  bloodGroup: BloodGroup;

  @ApiProperty({ example: 'AA', enum: Genotype })
  genotype: Genotype;

  @ApiProperty({ example: false })
  hasTattoos: boolean;

  @ApiProperty({ example: false })
  isComplianceUploaded: boolean;
}
