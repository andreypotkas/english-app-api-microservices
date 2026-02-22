import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWord, UserWordType } from '@english-app-api/entities';

@Injectable()
export class UserWordsService {
  constructor(
    @InjectRepository(UserWord)
    private readonly userWordRepository: Repository<UserWord>,
  ) {}

  async addWord(userId: number, bookWordId: number, type: UserWordType): Promise<{ success: boolean; message: string }> {
    const existing = await this.userWordRepository.findOne({
      where: { user_id: userId, book_word_id: bookWordId, type },
    });

    if (existing) {
      return { success: true, message: 'Word already in list' };
    }

    const userWord = this.userWordRepository.create({
      user_id: userId,
      book_word_id: bookWordId,
      type,
    });

    await this.userWordRepository.save(userWord);
    return { success: true, message: 'Word added successfully' };
  }

  async removeWord(userId: number, bookWordId: number, type: UserWordType): Promise<{ success: boolean; message: string }> {
    const userWord = await this.userWordRepository.findOne({
      where: { user_id: userId, book_word_id: bookWordId, type },
    });

    if (userWord) {
      await this.userWordRepository.remove(userWord);
      return { success: true, message: 'Word removed successfully' };
    }
    return { success: false, message: 'Word not found in list' };
  }

  async getWordIds(userId: number, type: UserWordType): Promise<number[]> {
    const userWords = await this.userWordRepository.find({
      where: { user_id: userId, type },
      select: ['book_word_id'],
    });

    return userWords.map((uw) => uw.book_word_id);
  }
}
