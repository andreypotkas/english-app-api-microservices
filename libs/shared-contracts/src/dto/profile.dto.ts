export interface GetProfilePayload {
  userId: string;
}

export interface UpdateProfilePayload {
  userId: string;
  name?: string;
  avatarUrl?: string;
}

/** Аккаунт как из БД без password_hash */
export interface AccountSafe {
  id: number;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}
