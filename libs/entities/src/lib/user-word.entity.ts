import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { BookWord } from './book-word.entity';

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

  @ApiProperty({ type: () => BookWord })
  @ManyToOne(() => BookWord, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_word_id' })
  book_word!: BookWord;

  @ApiProperty({ enum: UserWordType })
  @Column({ type: 'enum', enum: UserWordType })
  type!: UserWordType;
}
