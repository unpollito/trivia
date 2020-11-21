import { ServerQuestion } from "./Question";
import { RandomSortParams } from "../BaseDao";

export type ServerQuestionWithoutId = Omit<ServerQuestion, "id">;

export interface QuestionSortField {
  name: "difficulty";
  isAscending: boolean;
}

export interface QuestionCustomSort {
  random: false;
  fields: QuestionSortField[];
}

export type QuestionSortParams = RandomSortParams | QuestionCustomSort;

export interface IQuestionDao {
  getList(count: number, sort?: QuestionSortParams): Promise<ServerQuestion[]>;
  getOneById(id: number): Promise<ServerQuestion>;
  insert(questions: ServerQuestionWithoutId[]): Promise<void>;
}
