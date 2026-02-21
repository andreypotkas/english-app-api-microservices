import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Account } from './entities/account.entity';
import { Profile } from './entities/profile.entity';
import { AuthModule } from './auth/auth.module';

const dbHost = process.env.POSTGRES_HOST || 'localhost';
const dbPort = parseInt(process.env.POSTGRES_PORT || '5432', 10);
const dbUser = process.env.POSTGRES_USER || 'postgres';
const dbPassword = process.env.POSTGRES_PASSWORD || 'postgres';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      username: dbUser,
      password: dbPassword,
      database: 'account_db',
      entities: [Account, Profile],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
