export interface GetProfilePayload {
  userId: string;
}

export interface UpdateProfilePayload {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface ProfileResponse {
  userId: string;
  displayName: string;
  avatarUrl?: string;
}
