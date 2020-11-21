import { UserQuestion } from "./UserQuestion";

export interface UserQuestionFilter {
  last_answer_correct?: boolean;
}

export interface IUserQuestionDao {
  getListForUser(
    userId: number,
    count: number,
    filter?: UserQuestionFilter
  ): Promise<UserQuestion[]>;
  getOne(userId: number, questionId: number): Promise<UserQuestion>;
  insert(ids: UserQuestion): Promise<void>;
  update(userQuestion: UserQuestion): Promise<void>;
}
