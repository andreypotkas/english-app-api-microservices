export interface StartGamePayload {
  userId: string;
  topicId?: string;
}

export interface GameSessionResponse {
  sessionId: string;
  words: Array<{ id: string; text: string }>;
}
