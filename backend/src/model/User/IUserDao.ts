import { User } from "./User";
import { UserIdentification } from "../../../../shared/model/Login";

export interface IUserDao {
  getById: (id: number) => Promise<User>;
  insert: (user: UserIdentification) => Promise<void>;
  update: (user: User) => Promise<void>;
}
