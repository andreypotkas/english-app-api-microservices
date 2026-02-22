import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Account } from './account.entity';

@Entity('profiles')
export class Profile extends BaseEntity {
  @ApiProperty()
  @Column({ name: 'account_id', unique: true })
  account_id!: number;

  @ApiProperty({ type: () => Account })
  @OneToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account!: Account;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  name!: string | null;

  @ApiPropertyOptional()
  @Column({ name: 'avatar_url', nullable: true })
  avatar_url!: string | null;
}
