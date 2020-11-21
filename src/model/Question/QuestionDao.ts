import { ServerQuestion } from "./Question";
import { BaseDao } from "../BaseDao";
import {
  IQuestionDao,
  QuestionSortParams,
  ServerQuestionWithoutId,
} from "./IQuestionDao";
import { Difficulty } from "./Difficulty";
import { NoResultFoundException } from "../DbErrors";

interface DatabaseQuestion {
  id: number;
  question: string;
  difficulty: Difficulty;
  correct_answer: string;
  incorrect_answer1: string;
  incorrect_answer2: string;
  incorrect_answer3: string;
}

export class QuestionDao extends BaseDao implements IQuestionDao {
  public async getOneById(id: number): Promise<ServerQuestion> {
    const query = {
      text: "SELECT * FROM question WHERE id = $1",
      values: [id],
    };
    const queryResult = await this.client.query(query);
    if (queryResult.rows.length === 0) {
      throw new NoResultFoundException();
    }
    return this.convertDatabaseQuestionToServerQuestion(queryResult.rows[0]);
  }

  public async getList(
    count: number,
    sort: QuestionSortParams = { random: false, fields: [] }
  ): Promise<ServerQuestion[]> {
    let orderBy = "ORDER BY RANDOM()";
    if (!sort.random) {
      if (sort.fields.length > 0) {
        const orderByFieldString = sort.fields
          .map((field) => {
            return field.isAscending ? field.name : `${field.name} DESC`;
          })
          .join(", ");
        orderBy = `ORDER BY ${orderByFieldString}`;
      } else {
        orderBy = "";
      }
    }
    const queryText = `SELECT * FROM question ${orderBy};`;
    const queryResult = await this.client.query(queryText);
    return queryResult.rows.map((question) =>
      this.convertDatabaseQuestionToServerQuestion(question)
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

  private convertDatabaseQuestionToServerQuestion(
    question: DatabaseQuestion
  ): ServerQuestion {
    return {
      id: question.id,
      question: question.question,
      difficulty: question.difficulty,
      correct_answer: question.correct_answer,
      incorrect_answers: [
        question.incorrect_answer1,
        question.incorrect_answer2,
        question.incorrect_answer3,
      ],
    };
  }
}
