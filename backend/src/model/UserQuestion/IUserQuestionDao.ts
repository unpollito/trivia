import { UserQuestion, UserQuestionWithQuestion } from "./UserQuestion";
import { QuerySortParams } from "../BaseDao";
import { ServerQuestion } from "../Question/Question";

export interface UserQuestionFilter {
  last_answer_correct?: boolean;
}

export interface GetUserQuestionListParams {
  userId: number;
  count: number;
  filter?: UserQuestionFilter;
  sort?: QuerySortParams<UserQuestion>;
}

export interface GetUnansweredQuestionListParams {
  userId: number;
  count: number;
  sort?: QuerySortParams<ServerQuestion>;
}

export interface GetUserQuestionWithQuestionListParams {
  userId: number;
  count: number;
  filter?: UserQuestionFilter;
  sort?: QuerySortParams<UserQuestionWithQuestion>;
}

export interface IUserQuestionDao {
  getListForUser(params: GetUserQuestionListParams): Promise<UserQuestion[]>;
  getListForUserWithQuestions(
    params: GetUserQuestionWithQuestionListParams
  ): Promise<UserQuestionWithQuestion[]>;
  getUnansweredQuestionsForUser(
    params: GetUnansweredQuestionListParams
  ): Promise<ServerQuestion[]>;
  getOne(userId: number, questionId: number): Promise<UserQuestion>;
  insert(ids: UserQuestion): Promise<void>;
  update(userQuestion: UserQuestion): Promise<void>;
}
