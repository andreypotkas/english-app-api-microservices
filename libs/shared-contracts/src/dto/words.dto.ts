export interface GetWordPayload {
  wordId: string;
}

export interface GetWordsListPayload {
  topicId?: string;
  limit?: number;
  offset?: number;
}

export interface WordResponse {
  id: string;
  text: string;
  translation: string;
  topicId: string;
}
