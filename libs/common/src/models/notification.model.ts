import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.model';
import { Appointment } from './appointment.model';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '../constants/enums';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @ApiPropertyOptional({
    description: 'Notification ID (Auto generated).',
  })
  id: number;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Notification subject.',
  })
  subject: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Notification message.',
  })
  message: string;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    description: 'Notification is read.',
  })
  isRead: boolean;

  @Column({
    nullable: true,
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.DEFAULT,
  })
  @ApiPropertyOptional({
    description: 'Notification type.',
  })
  type: NotificationType;

  @ManyToOne(() => Appointment, {
    onDelete: 'CASCADE',
  })
  @ApiPropertyOptional({
    description: 'Appointment ID.',
  })
  appointment: Appointment;

  @ManyToOne(() => Account, {
    onDelete: 'CASCADE',
  })
  @ApiPropertyOptional({
    description: 'Account ID.',
  })
  account: Account;

  @CreateDateColumn({ nullable: true })
  @ApiPropertyOptional({
    description: 'Created at e.g 2024-11-10_T_11:29:22',
  })
  createdAt: Date;
}

export class NotificationInfo {
  @ApiPropertyOptional({
    example: '1',
    description: 'Notification ID',
  })
  id: string;

  @ApiPropertyOptional({
    example: 'Donation reminder',
    description: 'Notification subject',
  })
  subject: string;

  @ApiPropertyOptional({
    example:
      'Your donation appointment with Ahmadu Bello University is in 9 days time.',
    description: 'Notification message',
  })
  message: string;

  @ApiPropertyOptional({
    type: 'enum',
    enum: NotificationType,
    description: 'Notification type',
    example: NotificationType.DEFAULT,
  })
  type: NotificationType;

  @ApiPropertyOptional({
    example: '1',
    description: 'Appointment ID',
  })
  appointment?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Notification is read',
  })
  isRead: boolean;
}
