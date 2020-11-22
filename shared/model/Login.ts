export interface UserIdentification {
  username: string;
  password: string;
}

export interface UserStats {
  id: number;
  answered_question_count: number;
  correct_question_count: number;
}

export interface LoginResponse {
  token: string;
}

export interface UserTokenData {
  id: number;
  username: string;
}