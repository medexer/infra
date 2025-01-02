import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  OneToOne,
  JoinColumn,
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DonationCenter } from './donation.center.model';
import { Account } from './account.model';
import { AppointmentStatus } from '../constants/enums';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @ApiPropertyOptional({
    description: 'Appointment ID (Auto generated).',
  })
  id: number;

  @Column({
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Appointment ID from the donation center e.g #123456.',
  })
  appointmentId: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Appointment time e.g 10:00 AM.',
  })
  time: string;

  @Column({
    default: null,
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Appointment date e.g 2024-01-01.',
  })
  date: Date;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Appointment verification code e.g 123456.',
  })
  verificationCode: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  @ApiPropertyOptional({
    description: 'Appointment status e.g pending, completed, cancelled.',
  })
  status: AppointmentStatus;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description:
      'Appointment cancellation reason e.g I have a medical condition.',
  })
  cancellationReason: string;

  @Column({
    default: null,
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Appointment cancelled date e.g 2024-01-01.',
  })
  cancelledAt: Date;

  @Column({
    default: null,
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Appointment accepted date e.g 2024-01-01.',
  })
  acceptedAt: Date;

  @Column({
    default: null,
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Appointment processing date e.g 2024-01-01.',
  })
  processingAt: Date;

  @Column({
    default: null,
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Appointment test results uploaded date e.g 2024-01-01.',
  })
  testResultsUploadedAt: Date;

  @Column({
    default: null,
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Appointment completed date e.g 2024-01-01.',
  })
  completedAt: Date;

  @ManyToOne(() => DonationCenter, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'donation_center' })
  donation_center: DonationCenter;

  @ManyToOne(() => Account, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'donor' })
  donor: Account;

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

export class AppointmentInfo {
  @ApiProperty({ example: '75' })
  id: string;

  @ApiProperty({ example: '123456' })
  appointmentId: string;

  @ApiProperty({ example: '10:00 AM' })
  time: string;

  @ApiProperty({ example: '2024-01-01' })
  date: Date;

  @ApiProperty({ example: 'pending', enum: AppointmentStatus })
  status: AppointmentStatus;

  @ApiProperty({ example: '123456' })
  verificationCode: string;

  @ApiProperty({ example: 'Donation Center Name' })
  centerName: string;

  @ApiProperty({ example: 'Donation Center Cover Photo' })
  centerCoverPhoto: string;

  @ApiProperty({ example: 'Donation center address' })
  centerAddress: string;

  @ApiProperty({ example: 'Donation center phone number' })
  centerPhone: string;

  @ApiProperty({ example: 'Donation center email' })
  centerEmail: string;

  @ApiProperty({ example: 'Donation center latitude' })
  centerLatitude: string;

  @ApiProperty({ example: 'Donation center longitude' })
  centerLongitude: string;

  @ApiProperty({ example: '2024-12-16T13:03:10.747Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-12-16T13:03:10.747Z' })
  updatedAt: Date;
}

export class DonationCenterAppointmentInfo {
  @ApiProperty({ example: '75' })
  id: string;

  @ApiProperty({ example: '123456' })
  appointmentId: string;

  @ApiProperty({ example: '10:00 AM' })
  time: string;

  @ApiProperty({ example: '2024-01-01' })
  date: Date;

  @ApiProperty({ example: 'pending', enum: AppointmentStatus })
  status: AppointmentStatus;

  @ApiProperty({ example: '123456' })
  verificationCode: string;

  @ApiProperty({ example: 'Donor Name' })
  donorName: string;

  @ApiProperty({ example: 'Donor Cover Photo' })
  donorProfilePhoto: string;

  @ApiProperty({ example: 'Donor phone number' })
  donorPhone: string;

  @ApiProperty({ example: 'Donor email' })
  donorEmail: string;

  @ApiProperty({ example: '2024-12-16T13:03:10.747Z' })
  acceptedAt: Date | '';

  @ApiProperty({ example: '2024-12-16T13:03:10.747Z' })
  processingAt: Date | '';

  @ApiProperty({ example: '2024-12-16T13:03:10.747Z' })
  testResultsUploadedAt: Date | '';

  @ApiProperty({ example: '2024-12-16T13:03:10.747Z' })
  completedAt: Date | '';

  @ApiProperty({ example: '2024-12-16T13:03:10.747Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-12-16T13:03:10.747Z' })
  updatedAt: Date;
}
