export interface UserIdentification {
  username: string;
  password: string;
}

export interface UserStats {
  id: number;
  answered_questions: number;
  correct_questions: number;
}

export interface LoginResponse {
  token: string;
}

export interface UserTokenData {
  id: number;
  username: string;
}