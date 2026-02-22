import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookWord } from '@english-app-api/entities';
import { book1, book2, book3, book4, book5, book6 } from '../data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookWord)
    private readonly bookWordRepository: Repository<BookWord>,
  ) {}

  async seed(): Promise<void> {
    const bookCount = await this.bookRepository.count();
    if (bookCount > 0) {
      this.logger.log('Database already seeded. Skipping...');
      return;
    }

    this.logger.log('Seeding database with books and words...');

    const booksData = [
      { title: 'Книга 1: Базовые слова', description: 'Основные слова для начинающих: повседневные предметы, действия и понятия', words: book1 },
      { title: 'Книга 2: Наука и эксперименты', description: 'Слова связанные с наукой, экспериментами и исследованиями', words: book2 },
      { title: 'Книга 3: Природа и окружающий мир', description: 'Слова о природе, погоде, растениях и животных', words: book3 },
      { title: 'Книга 4: Дом и повседневная жизнь', description: 'Слова о доме, семье, работе и повседневных делах', words: book4 },
      { title: 'Книга 5: Путешествия и приключения', description: 'Слова о путешествиях, транспорте и новых впечатлениях', words: book5 },
      { title: 'Книга 6: Продвинутая лексика', description: 'Сложные слова и выражения для продолжающих изучение', words: book6 },
    ];

    for (const bookData of booksData) {
      const book = this.bookRepository.create({
        title: bookData.title,
        description: bookData.description,
        total_words: 0,
      });
      const savedBook = await this.bookRepository.save(book);

      const bookWords = bookData.words.map((wordData) =>
        this.bookWordRepository.create({
          book_id: savedBook.id,
          word: wordData.word,
          word_translate: wordData.wordTranslate,
          image: wordData.image,
          audio: wordData.audio,
          audio_meaning: wordData.audioMeaning,
          audio_example: wordData.audioExample,
          text_meaning: wordData.textMeaning,
          text_example: wordData.textExample,
          text_meaning_translate: wordData.textMeaningTranslate,
          text_example_translate: wordData.textExampleTranslate,
          transcription: wordData.transcription,
        }),
      );

      await this.bookWordRepository.save(bookWords);

      savedBook.total_words = bookWords.length;
      await this.bookRepository.save(savedBook);

      this.logger.log(`Seeded ${bookData.title} with ${bookWords.length} words`);
    }

    this.logger.log('Database seeding completed successfully!');
  }
}
