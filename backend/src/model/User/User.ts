export interface User {
  id: number;
  username: string;
  password: string;
  answered_questions: number;
  correct_questions: number;
}

export interface UserIdentification {
  username: string;
  password: string;
}
