import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { ProfileController } from './controllers/profile.controller';
import { WordsController } from './controllers/words.controller';
import { GamesController } from './controllers/games.controller';
import { UserWordsController } from './controllers/user-words.controller';
import { BooksController } from './controllers/books.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    ClientsModule.register([
      {
        name: 'ACCOUNT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: 'account_queue',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'WORDS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: 'words_queue',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'GAMES_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: 'games_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [AuthController, ProfileController, WordsController, GamesController, UserWordsController, BooksController],
  providers: [JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
