import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { BookWord } from './book-word.entity';

@Entity('books')
export class Book extends BaseEntity {
  @ApiProperty()
  @Column()
  title!: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  description!: string | null;

  @ApiProperty()
  @Column({ name: 'total_words', default: 0 })
  total_words!: number;

  @ApiProperty({ type: () => [BookWord] })
  @OneToMany(() => BookWord, (bookWord) => bookWord.book)
  book_words!: BookWord[];
}
