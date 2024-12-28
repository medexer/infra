import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Type } from 'class-transformer';
import { Account } from './account.model';
import {
  AccountStatus,
  AccountType,
  BloodGroup,
  Genotype,
} from '../constants/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class DonationCenter {
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
  name: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Phone number e.g +2348090292842.',
  })
  phone: string;

  @Column({
    nullable: false,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Email address e.g tundeomotayo@gmail.com.',
  })
  email: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Address e.g Gate 1 Laming Road Jos, Plateau State',
  })
  address: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Building number e.g 123',
  })
  buildingNumber: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Nearest landmark e.g Gate 1 Laming Road Jos, Plateau State',
  })
  nearestLandMark: string;

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
    description: 'Logo e.g https://medexer.s3.amazonaws.com/avatars/avatar.png',
  })
  logo: string;

  @Column({
    nullable: true,
    default: 'https://medexer.s3.amazonaws.com/avatars/avatar.png',
  })
  @ApiPropertyOptional({
    description:
      'Cover photo e.g https://medexer.s3.amazonaws.com/avatars/avatar.png',
  })
  coverPhoto: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Short description of the donation center.',
    example: 'Teaching Hospital of the University of Jos.',
  })
  shortDescription: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Detailed description of the donation center.',
    example:
      'Providing vast healthcare services to people with resident doctors.',
  })
  longDescription: string;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  @ApiPropertyOptional({
    description: 'Account status e.g PENDING',
  })
  status: AccountStatus;

  @Column({ default: false, nullable: true })
  @ApiPropertyOptional({
    description: 'In compliance uploaded e.g false',
  })
  isComplianceUploaded: boolean;

  @Column({ default: false, nullable: true })
  @ApiPropertyOptional({
    description: 'In compliance approved e.g false',
  })
  isComplianceApproved: boolean;

  @Column({ default: '', nullable: true })
  @ApiPropertyOptional({
    description:
      'Flag to check if donation center credentials requires verification',
  })
  verificationDeclineReason: string;

  @OneToOne(() => Account, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account' })
  account: Account;

  @Column({ default: '0', nullable: true })
  @ApiPropertyOptional({
    description: 'Rating one e.g 4',
  })
  ratingOne: string;

  @Column({ default: '0', nullable: true })
  @ApiPropertyOptional({
    description: 'Rating two e.g 56',
  })
  ratingTwo: string;

  @Column({ default: '0', nullable: true })
  @ApiPropertyOptional({
    description: 'Rating three e.g 78',
  })
  ratingThree: string;

  @Column({ default: '0', nullable: true })
  @ApiPropertyOptional({
    description: 'Rating four e.g 90',
  })
  ratingFour: string;

  @Column({ default: '0', nullable: true })
  @ApiPropertyOptional({
    description: 'Rating five e.g 100',
  })
  ratingFive: string;

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

@Entity()
export class DonationCenterCompliance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    default: 'https://medexer.s3.amazonaws.com/avatars/avatar.png',
  })
  @ApiPropertyOptional({
    description:
      'CAC Certificate e.g https://medexer.s3.amazonaws.com/avatars/avatar.png',
  })
  cacCertificate: string;

  @Column({
    nullable: true,
    default: 'https://medexer.s3.amazonaws.com/avatars/avatar.png',
  })
  @ApiPropertyOptional({
    description:
      'Proof of address e.g https://medexer.s3.amazonaws.com/avatars/avatar.png',
  })
  proofOfAddress: string;

  @OneToOne(() => DonationCenter, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'donation_center' })
  donationCenter: DonationCenter;
}

@Entity()
export class OpeningHours {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiPropertyOptional({ description: 'Opening time (e.g., 09:00)' })
  @Column({ nullable: true, default: '09:00' })
  open: string;

  @ApiPropertyOptional({ description: 'Closing time (e.g., 17:00)' })
  @Column({ nullable: true, default: '21:00' })
  close: string;

  @ApiPropertyOptional({
    description: 'Indicates if the outlet is always open',
  })
  @Column({ default: false })
  alwaysOpen: boolean;

  @ApiPropertyOptional({
    description: 'Indicates if the outlet is always closed',
  })
  @Column({ default: false })
  closed: boolean;

  @ManyToOne(() => DonationCenter, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'donation_center' })
  donation_center: DonationCenter;
}

@Entity()
export class DaysOfWork {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiPropertyOptional({ type: OpeningHours })
  @OneToOne(() => OpeningHours, { cascade: true, eager: true })
  @JoinColumn()
  @Type(() => OpeningHours)
  monday: OpeningHours;

  @ApiPropertyOptional({ type: OpeningHours })
  @OneToOne(() => OpeningHours, { cascade: true, eager: true })
  @JoinColumn()
  @Type(() => OpeningHours)
  tuesday: OpeningHours;

  @ApiPropertyOptional({ type: OpeningHours })
  @OneToOne(() => OpeningHours, { cascade: true, eager: true })
  @JoinColumn()
  @Type(() => OpeningHours)
  wednesday: OpeningHours;

  @ApiPropertyOptional({ type: OpeningHours })
  @OneToOne(() => OpeningHours, { cascade: true, eager: true })
  @JoinColumn()
  @Type(() => OpeningHours)
  thursday: OpeningHours;

  @ApiPropertyOptional({ type: OpeningHours })
  @OneToOne(() => OpeningHours, { cascade: true, eager: true })
  @JoinColumn()
  @Type(() => OpeningHours)
  friday: OpeningHours;

  @ApiPropertyOptional({ type: OpeningHours })
  @OneToOne(() => OpeningHours, { cascade: true, eager: true })
  @JoinColumn()
  @Type(() => OpeningHours)
  saturday: OpeningHours;

  @ApiPropertyOptional({ type: OpeningHours })
  @OneToOne(() => OpeningHours, { cascade: true, eager: true })
  @JoinColumn()
  @Type(() => OpeningHours)
  sunday: OpeningHours;

  @OneToOne(() => DonationCenter, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'donation_center' })
  donation_center: DonationCenter;
}

@Entity()
export class DonationCenterConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiPropertyOptional({ type: DaysOfWork })
  @OneToOne(() => DaysOfWork, { cascade: true, eager: true })
  @JoinColumn()
  daysOfWork: DaysOfWork;

  @ApiPropertyOptional({ description: 'Reason for temporary closure' })
  @Column({ nullable: true })
  closureReason?: string;

  @ApiPropertyOptional({
    description: 'Indicates if the donation center is currently closed',
  })
  @Column({ default: false })
  isClosed?: boolean;

  @ApiPropertyOptional({
    description:
      'Indicates whether a newly placed appointment requires action accept/decline to continue',
  })
  @Column({ default: false })
  newAppointmentRequiresAction?: boolean;

  @ApiPropertyOptional({})
  @Column({ default: true })
  acceptingAppointments?: boolean;

  @OneToOne(() => DonationCenter, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'donation_center' })
  donation_center: DonationCenter;
}

export class DonationCenterComplianceInfo {
  @ApiPropertyOptional({ description: 'Account ID (Auto generated)' })
  id: number;

  @ApiPropertyOptional({ description: 'First name e.g Tunde' })
  name: string;

  @ApiPropertyOptional({ description: 'Phone number e.g +2348090292842' })
  phone: string;

  @ApiPropertyOptional({
    description: 'Email address e.g tundeomotayo@gmail.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Address e.g Gate 1 Laming Road Jos, Plateau State',
  })
  address: string;

  @ApiPropertyOptional({ description: 'Building number e.g 123' })
  buildingNumber: string;

  @ApiPropertyOptional({ description: 'Nearest landmark' })
  nearestLandMark: string;

  @ApiPropertyOptional({ description: 'State e.g Plateau' })
  state: string;

  @ApiPropertyOptional({ description: 'State area e.g Jos North' })
  stateArea: string;

  @ApiPropertyOptional({ description: 'Latitude e.g 9.2928839' })
  latitude: string;

  @ApiPropertyOptional({ description: 'Longitude e.g 9.481991' })
  longitude: string;

  @ApiPropertyOptional({ description: 'Logo URL' })
  logo: string;

  @ApiPropertyOptional({ description: 'Cover photo URL' })
  coverPhoto: string;

  @ApiPropertyOptional({
    description: 'Short description of the donation center',
  })
  shortDescription: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the donation center',
  })
  longDescription: string;

  @ApiPropertyOptional({ description: 'Account status', enum: AccountStatus })
  status: AccountStatus;

  @ApiPropertyOptional({ description: 'In compliance uploaded' })
  isComplianceUploaded: boolean;

  @ApiPropertyOptional({ description: 'In compliance approved' })
  isComplianceApproved: boolean;

  @ApiPropertyOptional({ description: 'Verification decline reason' })
  verificationDeclineReason: string;

  @ApiPropertyOptional({ description: 'CAC Certificate URL' })
  cacCertificate: string;

  @ApiPropertyOptional({ description: 'Proof of address document URL' })
  proofOfAddress: string;
}

export class DonationCentreDaysOfWork {
  @ApiPropertyOptional()
  day: string;

  @ApiPropertyOptional()
  open: string;

  @ApiPropertyOptional()
  close: string;

  @ApiPropertyOptional()
  alwaysOpen: boolean;

  @ApiPropertyOptional()
  closed: boolean;
}

export class DonationCenterInfo {
  @ApiPropertyOptional({ description: 'Account ID (Auto generated)' })
  id: string;

  @ApiPropertyOptional({
    description: 'First name e.g Tunde.',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Phone number e.g +2348090292842.',
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'Email address e.g tundeomotayo@gmail.com.',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Address e.g Gate 1 Laming Road Jos, Plateau State',
  })
  address: string;

  @ApiPropertyOptional({
    description: 'Building number e.g 123',
  })
  buildingNumber: string;

  @ApiPropertyOptional({
    description: 'Nearest landmark e.g Gate 1 Laming Road Jos, Plateau State',
  })
  nearestLandMark: string;

  @ApiPropertyOptional({
    description: 'State e.g Plateau',
  })
  state: string;

  @ApiPropertyOptional({
    description: 'State area e.g Jos North',
  })
  stateArea: string;

  @ApiPropertyOptional({
    description: 'Latitude e.g 9.2928839',
  })
  latitude: string;

  @ApiPropertyOptional({
    description: 'Longitude e.g 9.481991',
  })
  longitude: string;

  @ApiPropertyOptional({
    description: 'Logo e.g https://medexer.s3.amazonaws.com/avatars/avatar.png',
  })
  logo: string;

  @ApiPropertyOptional({
    description:
      'Cover photo e.g https://medexer.s3.amazonaws.com/avatars/avatar.png',
  })
  coverPhoto: string;

  @ApiPropertyOptional({
    description: 'Short description of the donation center.',
    example: 'Teaching Hospital of the University of Jos.',
  })
  shortDescription: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the donation center.',
    example:
      'Providing vast healthcare services to people with resident doctors.',
  })
  longDescription: string;

  @ApiPropertyOptional({
    description: 'Account status e.g PENDING',
  })
  status: AccountStatus;

  @ApiPropertyOptional({
    description: 'In compliance uploaded e.g false',
  })
  isComplianceUploaded: boolean;

  @ApiPropertyOptional({
    description: 'In compliance approved e.g false',
  })
  isComplianceApproved: boolean;

  @ApiPropertyOptional({
    description:
      'Flag to check if donation center credentials requires verification',
  })
  verificationDeclineReason: string;

  @ApiPropertyOptional({
    description: 'Average rating e.g 4.5',
  })
  averageRating: string;
}

export class DonationCenterAvailability {
  @ApiPropertyOptional({ description: 'Date for availability' })
  date: Date;

  @ApiPropertyOptional({
    description: 'Whether the center is open on this date',
  })
  isOpen: boolean;

  @ApiPropertyOptional({ description: 'Available time slots for appointments' })
  availableTimeSlots: string[];
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}
