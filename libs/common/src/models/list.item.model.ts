import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.model';
import { ListItemType } from '../constants/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('list_items')
export class ListItem {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @ApiPropertyOptional({
    description: 'List Item ID (Auto generated).',
  })
  id: number;

  @Column({
    type: 'enum',
    nullable: true,
    enum: ListItemType,
  })
  @ApiProperty({
    enum: ListItemType,
    description: 'Type of the list item.',
  })
  itemType: ListItemType;

  @Column({ nullable: true, default: '' })
  @ApiProperty({
    description: 'ID of the item.',
  })
  itemId: string;

  @ManyToOne(() => Account, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account' })
  account: Account;

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

export class ListItemInfo {
  @ApiProperty({
    description: 'List Item ID',
  })
  id: string;

  @ApiProperty({
    type: 'enum',
    enum: ListItemType,
    description: 'List Item Type',
  })
  itemType: ListItemType;

  @ApiProperty({
    example: '42',
    description: 'ID of the item.',
  })
  itemId: string;
}
