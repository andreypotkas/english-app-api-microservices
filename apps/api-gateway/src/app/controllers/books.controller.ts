import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BOOKS, AccessType } from '@english-app-api/shared-contracts';
import { ApiTag } from '../decorators/api-endpoint.decorator';
import { DocGet } from '../decorators/doc-route.decorator';
import { Book } from '@english-app-api/entities';

@ApiTag('books')
@Controller('books')
export class BooksController {
  constructor(@Inject('WORDS_SERVICE') private wordsClient: ClientProxy) {}

  @DocGet(undefined, undefined, AccessType.Public)
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  async getBooks(@Query('page') page?: string, @Query('limit') limit?: string): Promise<Book[]> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const offset = (pageNum - 1) * limitNum;

    return firstValueFrom(
      this.wordsClient.send(BOOKS.GET_LIST, {
        limit: limitNum,
        offset,
      }),
    );
  }

  @DocGet(':id', undefined, AccessType.Public)
  @ApiParam({ name: 'id', description: 'Book ID' })
  async getBook(@Param('id') id: string): Promise<Book> {
    return firstValueFrom(this.wordsClient.send(BOOKS.GET_ONE, { id: parseInt(id, 10) }));
  }
}
