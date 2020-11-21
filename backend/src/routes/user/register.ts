import { Request, Response } from "express";
import { getDbClient } from "../../db/dbClient";
import { UserDao } from "../../model/User/UserDao";
import { UserIdentification } from "../../../../shared/model/Login";
import { isNoResultFoundException } from "../../model/DbErrors";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { createJwt } from "./common/createJwt";

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body as UserIdentification;
  const client = await getDbClient();
  const userDao = new UserDao(client);
  try {
    await userDao.getByUsername(username);
    return res.status(StatusCodes.CONFLICT).json({});
  } catch (e) {
    if (!isNoResultFoundException(e)) {
      throw e;
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userData: UserIdentification = {
    username,
    password: hashedPassword,
  };
  await userDao.insert(userData);
  const user = await userDao.getByUsername(username);
  client.end();

  const token = createJwt({ id: user.id, username });

  return res.status(StatusCodes.OK).json({ token });
};
