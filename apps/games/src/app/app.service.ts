import { Injectable } from '@nestjs/common';
import type { StartGamePayload, GameSessionResponse } from '@english-app-api/shared-contracts';

@Injectable()
export class AppService {
  startGame(payload: StartGamePayload): GameSessionResponse {
    return {
      sessionId: `session-${Date.now()}`,
      words: [
        { id: '1', text: 'hello' },
        { id: '2', text: 'world' },
      ],
    };
  }
}
