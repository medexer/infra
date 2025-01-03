import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BloodGroup } from '../constants/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DonationCenter } from './donation.center.model';

@Entity()
export class BloodInventory {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @ApiPropertyOptional({
    description: 'Blood Inventory ID (Auto generated).',
  })
  id: number;

  @Column({
    type: 'enum',
    enum: BloodGroup,
    nullable: false,
  })
  @ApiPropertyOptional({
    enum: BloodGroup,
    description: 'Blood group type',
  })
  bloodGroup: BloodGroup;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Description of blood type',
  })
  description: string;

  @Column({
    default: '0',
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Available units of blood',
  })
  units: string;

  @Column({
    default: '0',
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Price of blood per unit',
  })
  price: string;

  @ManyToOne(() => DonationCenter, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'donationCenter' })
  donationCenter: DonationCenter;

  @CreateDateColumn()
  @ApiPropertyOptional({
    description: 'Date blood inventory was created',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiPropertyOptional({
    description: 'Date blood inventory was last updated',
  })
  updatedAt: Date;
}


export class BloodInventoryInfo {
  @ApiProperty({ example: '75' })
  id: string;

  @ApiProperty({ example: 'A+' })
  bloodGroup: string;

  @ApiProperty({ example: 'Has A antigen and Rh factor' })
  description: string;

  @ApiProperty({ example: '10' })
  units: string;

  @ApiProperty({ example: '10000' })
  price: string;

  @ApiProperty({ example: '2024-12-16T13:03:10.747Z' })
  createdAt: Date;
}
