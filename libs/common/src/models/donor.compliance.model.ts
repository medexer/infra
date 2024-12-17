import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.model';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  BloodGroup,
  DonorIdentificationType,
  Genotype,
} from '../constants/enums';

@Entity()
export class DonorCompliance {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @ApiPropertyOptional({
    description: 'Compliance ID (Auto generated).',
  })
  id: number;

  @OneToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account' })
  @ApiPropertyOptional({
    description: 'Donor account id e.g 18',
  })
  accountId: Account;

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
    description: 'Has previously donated blood e.g false',
  })
  hasPreviouslyDonatedBlood: boolean;

  @Column({
    default: null,
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Has previously donated blood e.g false',
  })
  lastDonatedBloodDate: Date;

  @Column({
    default: false,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Has tattoos e.g false',
  })
  hasTattoos: boolean;

  @Column({
    type: 'enum',
    enum: DonorIdentificationType,
    default: DonorIdentificationType.VOTER_CARD,
  })
  @ApiPropertyOptional({
    description: 'Identification type e.g voter_card',
  })
  identificationType: DonorIdentificationType;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    description:
      'Identification document url e.g https://medexer.s3.amazonaws.com/avatars/avatar.png',
  })
  identificationDocument: string;

  @CreateDateColumn({ nullable: true })
  @ApiPropertyOptional({
    description: 'Created at e.g 2024-11-10_T_11:29:22',
  })
  createdAt: Date;
}
