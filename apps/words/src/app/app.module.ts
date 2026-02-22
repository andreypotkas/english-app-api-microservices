import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { Book, BookWord } from '@english-app-api/entities';

const dbHost = process.env.POSTGRES_HOST || 'localhost';
const dbPort = parseInt(process.env.POSTGRES_PORT || '5432', 10);
const dbUser = process.env.POSTGRES_USER || 'postgres';
const dbPassword = process.env.POSTGRES_PASSWORD || 'postgres';
const stage = process.env.STAGE || 'dev';
const dbName = `words_${stage}_db`;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      username: dbUser,
      password: dbPassword,
      database: dbName,
      entities: [Book, BookWord],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Book, BookWord]),
  ],
  controllers: [AppController, SeedController],
  providers: [AppService, SeedService],
})
export class AppModule {}
