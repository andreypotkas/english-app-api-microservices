import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWord, UserWordType, BookWord } from '@english-app-api/entities';

@Injectable()
export class UserWordsService {
  constructor(
    @InjectRepository(UserWord)
    private readonly userWordRepository: Repository<UserWord>,
    @InjectRepository(BookWord)
    private readonly bookWordRepository: Repository<BookWord>,
  ) {}

  async addWord(userId: number, bookWordId: number, type: UserWordType): Promise<UserWord> {
    const bookWord = await this.bookWordRepository.findOne({ where: { id: bookWordId } });
    if (!bookWord) {
      throw new NotFoundException('Word not found');
    }

    const existing = await this.userWordRepository.findOne({
      where: { user_id: userId, book_word_id: bookWordId, type },
    });

    if (existing) {
      return existing;
    }

    const userWord = this.userWordRepository.create({
      user_id: userId,
      book_word_id: bookWordId,
      type,
    });

    return this.userWordRepository.save(userWord);
  }

  async removeWord(userId: number, bookWordId: number, type: UserWordType): Promise<void> {
    const userWord = await this.userWordRepository.findOne({
      where: { user_id: userId, book_word_id: bookWordId, type },
    });

    if (userWord) {
      await this.userWordRepository.remove(userWord);
    }
  }

  async getWords(userId: number, type: UserWordType): Promise<BookWord[]> {
    const userWords = await this.userWordRepository.find({
      where: { user_id: userId, type },
      relations: ['book_word'],
    });

    return userWords.map((uw) => uw.book_word);
  }

  async getWordIds(userId: number, type: UserWordType): Promise<number[]> {
    const userWords = await this.userWordRepository.find({
      where: { user_id: userId, type },
      select: ['book_word_id'],
    });

    return userWords.map((uw) => uw.book_word_id);
  }
}
