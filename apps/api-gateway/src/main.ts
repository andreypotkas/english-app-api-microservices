import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('English App API')
    .setDescription('API Gateway: auth, account, profile, words, games')
    .setVersion('1.0')
    .addTag('auth', 'Регистрация и вход')
    .addTag('account', 'Пользователь по id')
    .addTag('profile', 'Профиль')
    .addTag('words', 'Словарь')
    .addTag('games', 'Игры')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`API Gateway: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
