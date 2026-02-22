import { Entity, Column, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';

export enum UserWordType {
  Favorite = 'favorite',
  Studied = 'studied',
}

@Entity('user_words')
@Unique(['user_id', 'book_word_id', 'type'])
export class UserWord extends BaseEntity {
  @ApiProperty()
  @Column({ name: 'user_id' })
  user_id!: number;

  @ApiProperty()
  @Column({ name: 'book_word_id' })
  book_word_id!: number;

  @ApiProperty({ enum: UserWordType })
  @Column({ type: 'enum', enum: UserWordType })
  type!: UserWordType;
}
