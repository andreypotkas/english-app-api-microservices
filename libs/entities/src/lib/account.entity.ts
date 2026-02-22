import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';

export enum UserRole {
  Public = 'public',
  User = 'user',
  Admin = 'admin',
}

@Entity('accounts')
export class Account extends BaseEntity {
  @ApiProperty()
  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
  password_hash!: string;

  @ApiProperty({ enum: UserRole })
  @Column({ type: 'varchar', length: 20, default: 'user' })
  role!: UserRole;
}
