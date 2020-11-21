import { User, UserIdentification } from "./User";

export interface IUserDao {
  getById: (id: number) => Promise<User>;
  insert: (user: UserIdentification) => Promise<void>;
  update: (user: User) => Promise<void>;
}
