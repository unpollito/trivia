import { ServerQuestion } from "./Question";
import { CustomSortParams, RandomSortParams } from "../BaseDao";

export type ServerQuestionWithoutId = Omit<ServerQuestion, "id">;

export type QuestionSortParams =
  | RandomSortParams
  | CustomSortParams<ServerQuestion>;

export interface IQuestionDao {
  getList(count: number, sort?: QuestionSortParams): Promise<ServerQuestion[]>;
  getOneById(id: number): Promise<ServerQuestion>;
  insert(questions: ServerQuestionWithoutId[]): Promise<void>;
}
