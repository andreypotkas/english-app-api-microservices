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

export const WORDS = {
  GET_ONE: 'words.get_one',
  GET_LIST: 'words.get_list',
} as const;

export const GAMES = {
  START: 'games.start',
  SUBMIT_ANSWER: 'games.submit_answer',
} as const;
