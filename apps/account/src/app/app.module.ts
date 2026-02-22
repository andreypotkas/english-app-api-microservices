import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { Account, Profile, UserWord, BookWord } from '@english-app-api/entities';
import { AuthModule } from './auth/auth.module';
import { UserWordsModule } from './user-words/user-words.module';

const dbHost = process.env.POSTGRES_HOST || 'localhost';
const dbPort = parseInt(process.env.POSTGRES_PORT || '5432', 10);
const dbUser = process.env.POSTGRES_USER || 'postgres';
const dbPassword = process.env.POSTGRES_PASSWORD || 'postgres';
const stage = process.env.STAGE || 'dev';
const dbName = `account_${stage}_db`;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      username: dbUser,
      password: dbPassword,
      database: dbName,
      entities: [Account, Profile, UserWord, BookWord],
      synchronize: true,
    }),
    AuthModule,
    UserWordsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
