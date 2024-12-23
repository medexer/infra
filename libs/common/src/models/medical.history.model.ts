import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.model';
import { Appointment } from './appointment.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BloodGroup, Genotype } from '../constants/enums';

@Entity()
export class MedicalHistory {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @ApiPropertyOptional({
    description: 'Medical History ID (Auto generated).',
  })
  id: number;

  @Column({
    type: 'enum',
    nullable: true,
    enum: BloodGroup,
  })
  @ApiPropertyOptional({
    description: 'Blood group e.g O+',
  })
  bloodGroup: BloodGroup;

  @Column({
    type: 'enum',
    nullable: true,
    enum: Genotype,
  })
  @ApiPropertyOptional({
    description: 'Genotype e.g AS',
  })
  genotype: Genotype;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    description: 'HIV1 status',
  })
  hiv1: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    description: 'HIV2 status',
  })
  hiv2: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    description: 'Hepatitis B status',
  })
  hepatitisB: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    description: 'Hepatitis C status',
  })
  hepatitisC: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    description: 'Syphilis status',
  })
  syphilis: boolean;

  @ManyToOne(() => Account, {
    onDelete: 'CASCADE',
  })
  @ApiPropertyOptional({
    description: 'Account ID.',
  })
  account: Account;

  @ManyToOne(() => Appointment, {
    onDelete: 'CASCADE',
  })
  @ApiPropertyOptional({
    description: 'Appointment ID.',
  })
  appointment: Appointment;

  @CreateDateColumn({ nullable: true })
  @ApiPropertyOptional({
    description: 'Created at e.g 2024-11-10_T_11:29:22',
  })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  @ApiPropertyOptional({
    description: 'Updated at e.g 2024-11-10_T_11:29:22',
  })
  updatedAt: Date;
}

export class MedicalHistoryInfo {
  @ApiProperty({ example: '75' })
  id: string;

  @ApiProperty({ example: 'O+' })
  bloodGroup: BloodGroup;

  @ApiProperty({ example: 'AS' })
  genotype: Genotype;

  @ApiProperty({ example: true })
  hiv1: boolean;

  @ApiProperty({ example: true })
  hiv2: boolean;

  @ApiProperty({ example: true })
  hepatitisB: boolean;

  @ApiProperty({ example: true })
  hepatitisC: boolean;

  @ApiProperty({ example: true })
  syphilis: boolean;

  @ApiProperty({ example: '75' })
  appointmentId: string;

  @ApiProperty({ example: 'Abubakar Tafawa Balewa University Teaching Hospital' })
  centerName: string;

  @ApiProperty({ example: 'https://medexer.s3.us-east-2.amazonaws.com/donation-center.jpg' })
  centerCoverPhoto: string;

  @ApiProperty({ example: 'No 123, Ibadan, Oyo State' })
  centerAddress: string;

  @ApiProperty({ example: '+2348033333333' })
  centerPhone: string;

  @ApiProperty({ example: 'abuth@yopmail.com' })
  centerEmail: string;

  @ApiProperty({ example: '9.987654' })
  centerLatitude: string;

  @ApiProperty({ example: '8.987654' })
  centerLongitude: string;

  @ApiProperty({ example: '2024-11-10_T_11:29:22' })
  createdAt: Date;
}
