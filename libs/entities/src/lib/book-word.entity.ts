import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Book } from './book.entity';

@Entity('book_words')
export class BookWord extends BaseEntity {
  @ApiProperty()
  @Column({ name: 'book_id' })
  book_id!: number;

  @ApiProperty({ type: () => Book })
  @ManyToOne(() => Book, (book) => book.book_words)
  @JoinColumn({ name: 'book_id' })
  book!: Book;

  @ApiProperty()
  @Column()
  word!: string;

  @ApiProperty()
  @Column({ name: 'word_translate' })
  word_translate!: string;

  @ApiProperty()
  @Column()
  image!: string;

  @ApiProperty()
  @Column()
  audio!: string;

  @ApiProperty()
  @Column({ name: 'audio_meaning' })
  audio_meaning!: string;

  @ApiProperty()
  @Column({ name: 'audio_example' })
  audio_example!: string;

  @ApiProperty()
  @Column({ name: 'text_meaning' })
  text_meaning!: string;

  @ApiProperty()
  @Column({ name: 'text_example' })
  text_example!: string;

  @ApiProperty()
  @Column({ name: 'text_meaning_translate' })
  text_meaning_translate!: string;

  @ApiProperty()
  @Column({ name: 'text_example_translate' })
  text_example_translate!: string;

  @ApiProperty()
  @Column()
  transcription!: string;
}
