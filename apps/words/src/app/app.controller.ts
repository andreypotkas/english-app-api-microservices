import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { WORDS, BOOKS } from '@english-app-api/shared-contracts';
import type { GetWordsListPayload } from '@english-app-api/shared-contracts';
import { Book, BookWord } from '@english-app-api/entities';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(WORDS.GET_LIST)
  async getWordsList(payload: GetWordsListPayload): Promise<BookWord[]> {
    return this.appService.getWordsList(payload);
  }

  @MessagePattern(BOOKS.GET_LIST)
  async getBooks(payload: { limit: number; offset: number }): Promise<Book[]> {
    return this.appService.getBooks(payload);
  }

  @MessagePattern(BOOKS.GET_ONE)
  async getBook(payload: { id: number }): Promise<Book> {
    return this.appService.getBook(payload.id);
  }
}
