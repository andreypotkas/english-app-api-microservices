import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { getRabbitMQOptions } from '@english-app-api/shared-contracts';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    getRabbitMQOptions('words_queue'),
  );
  await app.listen();
  Logger.log('Words microservice is listening on words_queue');
}

bootstrap();
