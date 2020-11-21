export interface UserQuestion {
  user_id: number;
  question_id: number;
  last_answer_correct: boolean;
  correct_answers: number;
  incorrect_answers: number;
}
