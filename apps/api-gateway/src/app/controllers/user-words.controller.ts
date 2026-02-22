import { Controller, Get, Post, Delete, Body, Inject, Param, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTag } from '../decorators/api-endpoint.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DocGet, DocPost, DocDelete } from '../decorators/doc-route.decorator';
import { User } from '../../decorators/user.decorator';
import type { JwtPayload } from '../auth/jwt.strategy';
import { USER_WORDS, UserWordType, AccessType } from '@english-app-api/shared-contracts';
import { BookWord } from '@english-app-api/entities';

@ApiTag('user-words')
@ApiBearerAuth('JWT')
@Controller('user-words')
export class UserWordsController {
  constructor(@Inject('ACCOUNT_SERVICE') private accountClient: ClientProxy) {}

  @DocPost(':bookWordId/favorite', undefined, AccessType.User)
  async addFavorite(
    @User() user: JwtPayload,
    @Param('bookWordId') bookWordId: number,
  ): Promise<void> {
    await firstValueFrom(
      this.accountClient.send(USER_WORDS.ADD, {
        userId: user.sub,
        book_word_id: bookWordId,
        type: UserWordType.Favorite,
      }),
    );
  }

  @DocDelete(':bookWordId/favorite', undefined, AccessType.User)
  async removeFavorite(
    @User() user: JwtPayload,
    @Param('bookWordId') bookWordId: number,
  ): Promise<void> {
    await firstValueFrom(
      this.accountClient.send(USER_WORDS.REMOVE, {
        userId: user.sub,
        book_word_id: bookWordId,
        type: UserWordType.Favorite,
      }),
    );
  }

  @DocPost(':bookWordId/studied', undefined, AccessType.User)
  async addStudied(
    @User() user: JwtPayload,
    @Param('bookWordId') bookWordId: number,
  ): Promise<void> {
    await firstValueFrom(
      this.accountClient.send(USER_WORDS.ADD, {
        userId: user.sub,
        book_word_id: bookWordId,
        type: UserWordType.Studied,
      }),
    );
  }

  @DocDelete(':bookWordId/studied', undefined, AccessType.User)
  async removeStudied(
    @User() user: JwtPayload,
    @Param('bookWordId') bookWordId: number,
  ): Promise<void> {
    await firstValueFrom(
      this.accountClient.send(USER_WORDS.REMOVE, {
        userId: user.sub,
        book_word_id: bookWordId,
        type: UserWordType.Studied,
      }),
    );
  }

  @DocGet('favorites', undefined, AccessType.User)
  async getFavorites(@User() user: JwtPayload): Promise<BookWord[]> {
    return firstValueFrom(
      this.accountClient.send(USER_WORDS.GET_LIST, {
        userId: user.sub,
        type: UserWordType.Favorite,
      }),
    );
  }

  @DocGet('favorites/ids', undefined, AccessType.User)
  async getFavoriteIds(@User() user: JwtPayload): Promise<number[]> {
    return firstValueFrom(
      this.accountClient.send(USER_WORDS.GET_IDS, {
        userId: user.sub,
        type: UserWordType.Favorite,
      }),
    );
  }

  @DocGet('studied', undefined, AccessType.User)
  async getStudied(@User() user: JwtPayload): Promise<BookWord[]> {
    return firstValueFrom(
      this.accountClient.send(USER_WORDS.GET_LIST, {
        userId: user.sub,
        type: UserWordType.Studied,
      }),
    );
  }

  @DocGet('studied/ids', undefined, AccessType.User)
  async getStudiedIds(@User() user: JwtPayload): Promise<number[]> {
    return firstValueFrom(
      this.accountClient.send(USER_WORDS.GET_IDS, {
        userId: user.sub,
        type: UserWordType.Studied,
      }),
    );
  }
}
