import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { GetWordsListPayload } from '@english-app-api/shared-contracts';
import { Book, BookWord } from '@english-app-api/entities';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookWord)
    private readonly bookWordRepository: Repository<BookWord>,
  ) {}

  async getWordsList(payload: GetWordsListPayload): Promise<BookWord[]> {
    const query = this.bookWordRepository.createQueryBuilder('book_word');

    if (payload.bookId) {
      query.where('book_word.book_id = :bookId', { bookId: payload.bookId });
    }

    if (payload.limit) {
      query.take(payload.limit);
    }

    if (payload.offset !== undefined) {
      query.skip(payload.offset);
    }

    return query.getMany();
  }

  async getWordsByIds(wordIds: number[]): Promise<BookWord[]> {
    if (wordIds.length === 0) {
      return [];
    }
    return this.bookWordRepository.findByIds(wordIds);
  }

  async getBooks(payload: { limit: number; offset: number }): Promise<Book[]> {
    return this.bookRepository.find({
      take: payload.limit,
      skip: payload.offset,
      order: { id: 'ASC' },
    });
  }

  async getBook(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }
}
