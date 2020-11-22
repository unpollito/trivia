import { databaseQuestionToServerQuestion, ServerQuestion } from "./Question";
import { BaseDao, CustomSortParams } from "../BaseDao";
import { IQuestionDao, ServerQuestionWithoutId } from "./IQuestionDao";
import { NoResultFoundException } from "../DbErrors";

export class QuestionDao
  extends BaseDao<ServerQuestion>
  implements IQuestionDao {
  public async getOneById(id: number): Promise<ServerQuestion> {
    const query = {
      text: "SELECT * FROM question WHERE id = $1",
      values: [id],
    };
    const queryResult = await this.client.query(query);
    if (queryResult.rows.length === 0) {
      throw new NoResultFoundException();
    }
    return databaseQuestionToServerQuestion(queryResult.rows[0]);
  }

  public async getList(
    count: number,
    sort: CustomSortParams<ServerQuestion> = { random: false, fields: [] }
  ): Promise<ServerQuestion[]> {
    const orderBy = this.getOrderByString(sort);
    const queryText = `SELECT * FROM question ${orderBy};`;
    const queryResult = await this.client.query(queryText);
    return queryResult.rows.map((question) =>
      databaseQuestionToServerQuestion(question)
    );
  }

  public async insert(questions: ServerQuestionWithoutId[]): Promise<void> {
    // Example query:
    // INSERT INTO question(question, difficulty, correct_answer,
    //                      incorrect_answer1, incorrect_answer2, incorrect_answer3)
    // VALUES ($1, $2, $3, $4, $5, $6), ($7, $8, $9, $10, $11, $12)

    const valueIndices: string[] = questions.map((question, questionIndex) => {
      const paramIndices = [
        questionIndex * 6 + 1,
        questionIndex * 6 + 2,
        questionIndex * 6 + 3,
        questionIndex * 6 + 4,
        questionIndex * 6 + 5,
        questionIndex * 6 + 6,
      ];
      const joinedValueIndices = paramIndices
        .map((index) => `$${index}`)
        .join(", ");
      return `(${joinedValueIndices})`;
    });

    const text = `INSERT INTO question(
                    question, difficulty, correct_answer, 
                    incorrect_answer1, incorrect_answer2, incorrect_answer3
                  ) VALUES ${valueIndices.join(", ")}`;

    const values: string[] = questions
      .map((question) => {
        return [
          question.question,
          question.difficulty,
          question.correct_answer,
          question.incorrect_answers[0],
          question.incorrect_answers[1],
          question.incorrect_answers[2],
        ];
      })
      .reduce((a, b) => a.concat(b), []);

    const query = { text, values };

    await this.client.query(query);
    return;
  }
}
