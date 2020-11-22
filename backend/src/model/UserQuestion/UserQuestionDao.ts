import { BaseDao } from "../BaseDao";
import {
  GetUnansweredQuestionListParams,
  GetUserQuestionListParams,
  GetUserQuestionWithQuestionListParams,
  IUserQuestionDao,
} from "./IUserQuestionDao";
import { UserQuestion, UserQuestionWithQuestion } from "./UserQuestion";
import { NoResultFoundException } from "../DbErrors";
import {
  DatabaseQuestion,
  databaseQuestionToServerQuestion,
  ServerQuestion,
} from "../Question/Question";

interface QueryBuilderParams {
  filterText: string;
  limitText: string;
  orderByText: string;
}

type QueryBuilderFunction = (params: QueryBuilderParams) => string;

export class UserQuestionDao
  extends BaseDao<UserQuestion>
  implements IUserQuestionDao {
  public async getListForUser(
    params: GetUserQuestionListParams
  ): Promise<UserQuestion[]> {
    return this.getList<UserQuestion, GetUserQuestionListParams>(
      params,
      (queryParams: QueryBuilderParams) => {
        const { filterText, limitText, orderByText } = queryParams;
        return `SELECT * FROM user_question WHERE user_id = $1 ${filterText} 
             ${orderByText} LIMIT ${limitText}`;
      }
    );
  }

  public async getListForUserWithQuestions(
    params: GetUserQuestionWithQuestionListParams
  ): Promise<UserQuestionWithQuestion[]> {
    const list = await this.getList<
      DatabaseQuestion & UserQuestion,
      GetUserQuestionWithQuestionListParams
    >(params, (queryParams: QueryBuilderParams) => {
      const { filterText, limitText, orderByText } = queryParams;
      return `SELECT * FROM user_question INNER JOIN question ON question_id = id
             WHERE user_id = $1 ${filterText} ${orderByText} LIMIT ${limitText}`;
    });
    return list.map((entry) =>
      this.databaseDataToUserQuestionWithQuestion(entry)
    );
  }

  public async getUnansweredQuestionsForUser(
    params: GetUnansweredQuestionListParams
  ): Promise<ServerQuestion[]> {
    const list = await this.getList<
      DatabaseQuestion,
      GetUnansweredQuestionListParams
    >(params, (queryParams: QueryBuilderParams) => {
      const { limitText, orderByText } = queryParams;
      return `SELECT question.* FROM question WHERE NOT EXISTS (
                SELECT NULL FROM user_question
                WHERE user_question.user_id = $1 AND user_question.question_id = question.id
              ) ${orderByText} LIMIT ${limitText}`;
    });
    return list.map((entry) => databaseQuestionToServerQuestion(entry));
  }

  private async getList<
    T,
    U extends
      | GetUserQuestionListParams
      | GetUserQuestionWithQuestionListParams
      | GetUnansweredQuestionListParams
  >(params: U, queryBuilder: QueryBuilderFunction): Promise<T[]> {
    const { userId, count, sort = { random: false, fields: [] } } = params;
    const filter = (params as GetUserQuestionListParams).filter ?? {};
    const values: any[] = [userId];
    let filterText = "";
    if (filter && filter.last_answer_correct !== undefined) {
      filterText = " AND last_answer_correct = $2";
      values.push(filter.last_answer_correct);
    }
    const orderByText = this.getOrderByString(sort as any);

    const text = queryBuilder({
      filterText,
      limitText: count.toString(),
      orderByText,
    });
    console.log(text);

    const query = { text, values };
    const queryResult = await this.client.query(query);
    return queryResult.rows as T[];
  }

  public async getOne(
    userId: number,
    questionId: number
  ): Promise<UserQuestion> {
    const query = {
      text:
        "SELECT * FROM user_question WHERE user_id = $1 and question_id = $2",
      values: [userId, questionId],
    };
    const queryResult = await this.client.query(query);
    if (queryResult.rows.length === 0) {
      throw new NoResultFoundException();
    }
    return queryResult.rows[0] as UserQuestion;
  }

  public async insert(userQuestion: UserQuestion): Promise<void> {
    const query = {
      text:
        "INSERT INTO user_question(user_id, question_id," +
        "    last_answer_correct, correct_answer_count, incorrect_answer_count)" +
        "  VALUES ($1, $2, $3, $4, $5)",
      values: [
        userQuestion.user_id,
        userQuestion.question_id,
        userQuestion.last_answer_correct,
        userQuestion.correct_answer_count,
        userQuestion.incorrect_answer_count,
      ],
    };
    await this.client.query(query);
    return;
  }

  public async update(userQuestion: UserQuestion): Promise<void> {
    const text =
      "UPDATE user_question SET last_answer_correct=$1," +
      "         correct_answer_count=$2, incorrect_answer_count=$3" +
      "         WHERE user_id = $4 and question_id = $5";
    const values = [
      userQuestion.last_answer_correct,
      userQuestion.correct_answer_count,
      userQuestion.incorrect_answer_count,
      userQuestion.user_id,
      userQuestion.question_id,
    ];
    const query = { text, values };
    await this.client.query(query);
    return;
  }

  private databaseDataToUserQuestionWithQuestion(
    entry: DatabaseQuestion & UserQuestion
  ): UserQuestionWithQuestion {
    return {
      correct_answer: entry.correct_answer,
      correct_answer_count: entry.correct_answer_count,
      difficulty: entry.difficulty,
      id: entry.id,
      incorrect_answer_count: entry.incorrect_answer_count,
      incorrect_answers: [
        entry.incorrect_answer1,
        entry.incorrect_answer2,
        entry.incorrect_answer3,
      ],
      last_answer_correct: entry.last_answer_correct,
      question: entry.question,
      question_id: entry.question_id,
      user_id: entry.user_id,
    };
  }
}
