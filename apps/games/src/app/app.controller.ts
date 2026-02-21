import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { GAMES } from '@english-app-api/shared-contracts';
import type {
  StartGamePayload,
  GameSessionResponse,
} from '@english-app-api/shared-contracts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(GAMES.START)
  startGame(payload: StartGamePayload): GameSessionResponse {
    return this.appService.startGame(payload);
  }
}
