import { Controller, Get, Query, Inject } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { WORDS, AccessType } from '@english-app-api/shared-contracts';
import { ApiTag } from '../decorators/api-endpoint.decorator';
import { DocGet } from '../decorators/doc-route.decorator';

@ApiTag('words')
@Controller('words')
export class WordsController {
  constructor(@Inject('WORDS_SERVICE') private wordsClient: ClientProxy) {}

  @DocGet(undefined, undefined, AccessType.Public)
  @ApiQuery({ name: 'book_id', required: false })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20)' })
  async getWords(
    @Query('book_id') bookId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offset = (pageNum - 1) * limitNum;

    return firstValueFrom(
      this.wordsClient.send(WORDS.GET_LIST, {
        bookId: bookId ? parseInt(bookId, 10) : undefined,
        limit: limitNum,
        offset,
      }),
    );
  }
}
