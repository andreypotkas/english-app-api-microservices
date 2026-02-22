import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { WORDS } from '@english-app-api/shared-contracts';
import type { GetWordPayload, GetWordsListPayload, WordResponse } from '@english-app-api/shared-contracts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(WORDS.GET_ONE)
  getWord(payload: GetWordPayload): WordResponse {
    return this.appService.getWord(payload.wordId);
  }

  @MessagePattern(WORDS.GET_LIST)
  getWordsList(payload: GetWordsListPayload): WordResponse[] {
    return this.appService.getWordsList(payload);
  }
}
