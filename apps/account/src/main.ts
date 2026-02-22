import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { getRabbitMQOptions } from '@english-app-api/shared-contracts';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, getRabbitMQOptions('account_queue'));
  await app.listen();
  Logger.log('Account microservice is listening on account_queue');
}

bootstrap();
