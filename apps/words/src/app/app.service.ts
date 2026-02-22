import { Injectable } from '@nestjs/common';
import type { GetWordsListPayload, WordResponse } from '@english-app-api/shared-contracts';

@Injectable()
export class AppService {
  getWord(wordId: string): WordResponse {
    return {
      id: wordId,
      text: 'hello',
      translation: 'привет',
      topicId: 'greetings',
    };
  }

  getWordsList(payload: GetWordsListPayload): WordResponse[] {
    const limit = payload.limit ?? 10;
    return Array.from({ length: limit }, (_, i) => this.getWord(`word-${i}`));
  }
}
