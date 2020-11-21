import { BaseDao } from "../BaseDao";
import { IUserQuestionDao, UserQuestionFilter } from "./IUserQuestionDao";
import { UserQuestion } from "./UserQuestion";
import { NoResultFoundException } from "../DbErrors";

export class UserQuestionDao extends BaseDao implements IUserQuestionDao {
  public async getListForUser(
    userId: number,
    count: number,
    filter: UserQuestionFilter = {}
  ): Promise<UserQuestion[]> {
    const values: any[] = [userId];
    let filterText = "";
    if (filter && filter.last_answer_correct !== undefined) {
      filterText = " AND last_answer_correct = $2";
      values.push(filter.last_answer_correct);
    }
    const query = {
      text: `SELECT * FROM user_question WHERE user_id = $1 ${filterText} LIMIT ${count}`,
      values,
    };
    const queryResult = await this.client.query(query);
    return queryResult.rows as UserQuestion[];
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
        "    last_answer_correct, correct_answers, incorrect_answers)" +
        "  VALUES ($1, $2, $3, $4, $5)",
      values: [
        userQuestion.user_id,
        userQuestion.question_id,
        userQuestion.last_answer_correct,
        userQuestion.correct_answers,
        userQuestion.incorrect_answers,
      ],
    };
    await this.client.query(query);
    return;
  }

  public async update(userQuestion: UserQuestion): Promise<void> {
    const text =
      "UPDATE user_question SET last_answer_correct=$1," +
      "         correct_answers=$2, incorrect_answers=$3" +
      "         WHERE user_id = $4 and question_id = $5";
    const values = [
      userQuestion.last_answer_correct,
      userQuestion.correct_answers,
      userQuestion.incorrect_answers,
      userQuestion.user_id,
      userQuestion.question_id,
    ];
    const query = { text, values };
    await this.client.query(query);
    return;
  }
}
