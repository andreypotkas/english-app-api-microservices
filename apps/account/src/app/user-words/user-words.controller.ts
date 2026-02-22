import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserWordsService } from './user-words.service';
import { USER_WORDS, UserWordPayload, UserWordListPayload } from '@english-app-api/shared-contracts';
import { UserWord } from '@english-app-api/entities';

@Controller()
export class UserWordsController {
  constructor(protected readonly userWordsService: UserWordsService) {}

  @MessagePattern(USER_WORDS.ADD)
  async addWord(@Payload() payload: UserWordPayload & { userId: number }): Promise<UserWord> {
    return this.userWordsService.addWord(payload.userId, payload.book_word_id, payload.type);
  }

  @MessagePattern(USER_WORDS.REMOVE)
  async removeWord(@Payload() payload: UserWordPayload & { userId: number }): Promise<void> {
    return this.userWordsService.removeWord(payload.userId, payload.book_word_id, payload.type);
  }

  @MessagePattern(USER_WORDS.GET_IDS)
  async getWordIds(@Payload() payload: UserWordListPayload & { userId: number }): Promise<number[]> {
    return this.userWordsService.getWordIds(payload.userId, payload.type);
  }
}
