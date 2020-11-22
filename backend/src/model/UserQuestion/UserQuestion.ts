import { ServerQuestion } from "../Question/Question";

export interface UserQuestion {
  user_id: number;
  question_id: number;
  last_answer_correct: boolean;
  correct_answer_count: number;
  incorrect_answer_count: number;
}

export interface UserQuestionWithQuestion
  extends ServerQuestion,
    UserQuestion {}
