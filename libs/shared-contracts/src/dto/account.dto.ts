export type UserRole = 'user' | 'admin';
export type UserPlan = 'free' | 'premium';

export interface GetUserPayload {
  userId: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
  createdAt: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role?: UserRole;
  plan?: UserPlan;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
}

export interface AuthErrorResponse {
  error: string;
  statusCode: number;
}
