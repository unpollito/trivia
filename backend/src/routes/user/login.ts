import { Request, Response } from "express";
import { getDbClient } from "../../db/dbClient";
import { UserDao } from "../../model/User/UserDao";
import { User } from "../../model/User/User";
import { UserIdentification } from "../../../../shared/model/Login";
import { isNoResultFoundException } from "../../model/DbErrors";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { createJwt } from "./common/createJwt";

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body as UserIdentification;
  const client = await getDbClient();
  const userDao = new UserDao(client);
  let user: User;
  try {
    user = await userDao.getByUsername(username);
  } catch (e) {
    if (isNoResultFoundException(e)) {
      return res.status(StatusCodes.UNAUTHORIZED).json({});
    }
    throw e;
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (!passwordIsCorrect) {
    return res.status(StatusCodes.UNAUTHORIZED).json({});
  }

  const token = createJwt({
    id: user.id,
    username,
  });

  return res.status(StatusCodes.OK).json({ token });
};
