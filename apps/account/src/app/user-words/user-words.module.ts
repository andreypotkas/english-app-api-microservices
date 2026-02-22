import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWordsService } from './user-words.service';
import { UserWordsController } from './user-words.controller';
import { UserWord } from '@english-app-api/entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserWord])],
  providers: [UserWordsService],
  controllers: [UserWordsController],
  exports: [UserWordsService],
})
export class UserWordsModule {}
