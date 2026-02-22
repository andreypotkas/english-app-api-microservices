import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { SeedService } from './app/seed.service';
import { getRabbitMQOptions } from '@english-app-api/shared-contracts';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, getRabbitMQOptions('words_queue'));
  await app.listen();
  Logger.log('Words microservice is listening on words_queue');

  // Seed database on startup if empty
  const seedService = app.get(SeedService);
  await seedService.seed();
}

bootstrap();
