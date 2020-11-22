import { IUserDao } from "./IUserDao";
import { BaseDao } from "../BaseDao";
import { User } from "./User";
import { NoResultFoundException } from "../DbErrors";
import { UserIdentification } from "../../../../shared/model/Login";

export class UserDao extends BaseDao<User> implements IUserDao {
  public async getById(id: number): Promise<User> {
    const query = {
      text: 'SELECT * FROM "user" WHERE id = $1',
      values: [id],
    };
    const queryResult = await this.client.query(query);
    if (queryResult.rows.length === 0) {
      throw new NoResultFoundException();
    }
    return queryResult.rows[0] as User;
  }

  public async getByUsername(username: string): Promise<User> {
    const query = {
      text: 'SELECT * FROM "user" WHERE username = $1',
      values: [username],
    };
    const queryResult = await this.client.query(query);
    if (queryResult.rows.length === 0) {
      throw new NoResultFoundException();
    }
    return queryResult.rows[0] as User;
  }

  async insert(user: UserIdentification): Promise<void> {
    const query = {
      text: 'INSERT INTO "user"(username, password) VALUES ($1, $2)',
      values: [user.username, user.password],
    };
    await this.client.query(query);
  }

  async update(user: User): Promise<void> {
    const text =
      'UPDATE "user" SET username=$1, password=$2,' +
      "              answered_question_count=$3, correct_question_count=$4" +
      "              WHERE id=$5";
    const values = [
      user.username,
      user.password,
      user.answered_question_count,
      user.correct_question_count,
      user.id,
    ];
    const query = { text, values };
    await this.client.query(query);
    return;
  }
}
