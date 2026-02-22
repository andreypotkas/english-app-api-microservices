import { Controller, Get, Param, Query, Inject } from '@nestjs/common';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { WORDS } from '@english-app-api/shared-contracts';
import { ApiTag } from '../decorators/api-endpoint.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DocGet } from '../decorators/doc-route.decorator';

@ApiTag('words')
@ApiBearerAuth('JWT')
@Controller('words')
export class WordsController {
  constructor(@Inject('WORDS_SERVICE') private wordsClient: ClientProxy) {}

  @DocGet(':wordId', undefined)
  @ApiParam({ name: 'wordId' })
  async getWord(@Param('wordId') wordId: string) {
    return firstValueFrom(this.wordsClient.send(WORDS.GET_ONE, { wordId }));
  }

  @DocGet(undefined, undefined)
  @ApiQuery({ name: 'topicId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async getWords(@Query('topicId') topicId?: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return firstValueFrom(
      this.wordsClient.send(WORDS.GET_LIST, {
        topicId,
        limit: limit ? parseInt(limit, 10) : undefined,
        offset: offset ? parseInt(offset, 10) : undefined,
      }),
    );
  }
}
