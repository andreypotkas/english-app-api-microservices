export type UserRole = 'user' | 'admin';
export type UserPlan = 'free' | 'premium';

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
