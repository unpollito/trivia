import { Request, Response } from "express";
import { User } from "../../model/User/User";
import { StatusCodes } from "http-status-codes";
import { UserStats } from "../../../../shared/model/Login";

export const getUserStats = (req: Request, res: Response) => {
  const user = req.user as User;
  const result: UserStats = {
    answered_question_count: user.answered_question_count,
    correct_question_count: user.correct_question_count,
    id: user.id,
  };
  return res.status(StatusCodes.OK).json(result);
};
