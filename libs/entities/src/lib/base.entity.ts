import { PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;
}
