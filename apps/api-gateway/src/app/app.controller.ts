import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Inject,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  ACCOUNT,
  PROFILE,
  WORDS,
  GAMES,
} from '@english-app-api/shared-contracts';
import type { AuthErrorResponse } from '@english-app-api/shared-contracts';

function isAuthError(
  res: unknown,
): res is AuthErrorResponse {
  return (
    typeof res === 'object' &&
    res !== null &&
    'error' in res &&
    'statusCode' in res
  );
}

@Controller()
export class AppController {
  constructor(
    @Inject('ACCOUNT_SERVICE') private accountClient: ClientProxy,
    @Inject('WORDS_SERVICE') private wordsClient: ClientProxy,
    @Inject('GAMES_SERVICE') private gamesClient: ClientProxy,
  ) {}

  @ApiTags('auth')
  @Post('auth/register')
  @ApiOperation({ summary: 'Регистрация' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' }, plan: { type: 'string', enum: ['free', 'premium'] } }, required: ['email', 'password'] } })
  async register(
    @Body() body: { email: string; password: string; plan?: 'free' | 'premium' },
  ) {
    const res = await firstValueFrom(
      this.accountClient.send(ACCOUNT.REGISTER, {
        email: body.email,
        password: body.password,
        role: 'user',
        plan: body.plan ?? 'free',
      }),
    );
    if (isAuthError(res)) {
      throw new HttpException(res.error, res.statusCode);
    }
    return res;
  }

  @ApiTags('auth')
  @Post('auth/login')
  @ApiOperation({ summary: 'Вход' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] } })
  async login(@Body() body: { email: string; password: string }) {
    const res = await firstValueFrom(
      this.accountClient.send(ACCOUNT.LOGIN, {
        email: body.email,
        password: body.password,
      }),
    );
    if (isAuthError(res)) {
      throw new HttpException(res.error, res.statusCode);
    }
    return res;
  }

  @ApiTags('account')
  @Get('account/:userId')
  @ApiOperation({ summary: 'Пользователь по id' })
  @ApiParam({ name: 'userId' })
  async getAccount(@Param('userId') userId: string) {
    const user = await firstValueFrom(
      this.accountClient.send(ACCOUNT.GET_USER, { userId }),
    );
    if (user == null) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  @ApiTags('profile')
  @Get('profile/:userId')
  @ApiOperation({ summary: 'Профиль по userId' })
  @ApiParam({ name: 'userId' })
  async getProfile(@Param('userId') userId: string) {
    const profile = await firstValueFrom(
      this.accountClient.send(PROFILE.GET, { userId }),
    );
    if (profile == null) {
      throw new HttpException('Profile not found', 404);
    }
    return profile;
  }

  @ApiTags('profile')
  @Put('profile/:userId')
  @ApiOperation({ summary: 'Обновить профиль' })
  @ApiParam({ name: 'userId' })
  @ApiBody({ schema: { type: 'object', properties: { displayName: { type: 'string' }, avatarUrl: { type: 'string' } } } })
  async updateProfile(
    @Param('userId') userId: string,
    @Body() body: { displayName?: string; avatarUrl?: string },
  ) {
    const profile = await firstValueFrom(
      this.accountClient.send(PROFILE.UPDATE, {
        userId,
        displayName: body.displayName,
        avatarUrl: body.avatarUrl,
      }),
    );
    if (profile == null) {
      throw new HttpException('Profile not found', 404);
    }
    return profile;
  }

  @ApiTags('words')
  @Get('words/:wordId')
  @ApiOperation({ summary: 'Одно слово по id' })
  @ApiParam({ name: 'wordId' })
  async getWord(@Param('wordId') wordId: string) {
    return firstValueFrom(
      this.wordsClient.send(WORDS.GET_ONE, { wordId }),
    );
  }

  @ApiTags('words')
  @Get('words')
  @ApiOperation({ summary: 'Список слов' })
  @ApiQuery({ name: 'topicId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async getWords(
    @Query('topicId') topicId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return firstValueFrom(
      this.wordsClient.send(WORDS.GET_LIST, {
        topicId,
        limit: limit ? parseInt(limit, 10) : undefined,
        offset: offset ? parseInt(offset, 10) : undefined,
      }),
    );
  }

  @ApiTags('games')
  @Post('games/start')
  @ApiOperation({ summary: 'Старт игры' })
  @ApiBody({ schema: { type: 'object', properties: { userId: { type: 'string' }, topicId: { type: 'string' } }, required: ['userId'] } })
  async startGame(@Body() body: { userId: string; topicId?: string }) {
    return firstValueFrom(
      this.gamesClient.send(GAMES.START, {
        userId: body.userId,
        topicId: body.topicId,
      }),
    );
  }
}
