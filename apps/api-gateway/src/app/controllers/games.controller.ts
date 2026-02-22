import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GAMES } from '@english-app-api/shared-contracts';
import { ApiTag } from '../decorators/api-endpoint.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DocPost } from '../decorators/doc-route.decorator';

@ApiTag('games')
@ApiBearerAuth('JWT')
@Controller('games')
export class GamesController {
  constructor(@Inject('GAMES_SERVICE') private gamesClient: ClientProxy) {}

  @DocPost('start', undefined)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        topicId: { type: 'string' },
      },
      required: ['userId'],
    },
  })
  async startGame(body: { userId: string; topicId?: string }) {
    return firstValueFrom(
      this.gamesClient.send(GAMES.START, {
        userId: body.userId,
        topicId: body.topicId,
      }),
    );
  }
}
