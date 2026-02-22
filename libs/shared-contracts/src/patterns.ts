/**
 * Message patterns for RabbitMQ (request-response between API Gateway and microservices).
 */

export const ACCOUNT = {
  GET_USER: 'account.get_user',
  REGISTER: 'account.register',
  LOGIN: 'account.login',
} as const;

export const PROFILE = {
  GET: 'profile.get',
  UPDATE: 'profile.update',
} as const;

export const USER_WORDS = {
  ADD: 'user_words.add',
  REMOVE: 'user_words.remove',
  GET_LIST: 'user_words.get_list',
  GET_IDS: 'user_words.get_ids',
} as const;

export const BOOKS = {
  GET_LIST: 'books.get_list',
  GET_ONE: 'books.get_one',
} as const;

export const WORDS = {
  GET_ONE: 'words.get_one',
  GET_LIST: 'words.get_list',
  GET_BY_IDS: 'words.get_by_ids',
} as const;

export const GAMES = {
  START: 'games.start',
  SUBMIT_ANSWER: 'games.submit_answer',
} as const;
