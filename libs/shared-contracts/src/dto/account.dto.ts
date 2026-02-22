import { UserRole, UserWordType } from '@english-app-api/entities';

export { UserRole, UserWordType };

export enum AccessType {
  Public = 'public',
  User = 'user',
  Admin = 'admin',
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface AuthErrorResponse {
  error: string;
  statusCode: number;
}

export interface UserWordPayload {
  book_word_id: number;
  type: UserWordType;
}

export interface UserWordListPayload {
  type: UserWordType;
}

export interface UserWordIdsPayload {
  type: UserWordType;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
