import { Request, Response } from "express";
import { getDbClient } from "../../db/dbClient";
import StatusCodes from "http-status-codes";
import { QuestionDao } from "../../model/Question/QuestionDao";
import { ServerQuestion } from "../../model/Question/Question";
import { isNoResultFoundException } from "../../model/DbErrors";
import { UserDao } from "../../model/User/UserDao";
import { UserQuestionDao } from "../../model/UserQuestion/UserQuestionDao";
import { USER_ID } from "@shared/constants";
import { UserQuestion } from "../../model/UserQuestion/UserQuestion";
import { User } from "../../model/User/User";
import { DbTransaction } from "../../db/DbTransaction";

interface QuestionAnswer {
  id: number;
  answer: string;
}

export const answerQuestion = async (req: Request, res: Response) => {
  const client = await getDbClient();
  const { id, answer } = req.body as QuestionAnswer;
  const questionDao = new QuestionDao(client);
  let question: ServerQuestion;

  try {
    question = await questionDao.getOneById(id);
  } catch (e) {
    client.end();
    if (isNoResultFoundException(e)) {
      return res.status(StatusCodes.NOT_FOUND).json({});
    }
    throw e;
  }

  const isAnswerCorrect = answer === question.correct_answer;

  const userQuestionDao = new UserQuestionDao(client);
  const userDao = new UserDao(client);

  const userQuestionPromise = userQuestionDao.getOne(USER_ID, id).catch((e) => {
    if (!isNoResultFoundException(e)) {
      throw e;
    }
    return null;
  });
  const userPromise = userDao.getById(USER_ID).catch((e) => {
    if (isNoResultFoundException(e)) {
      return res.status(StatusCodes.NOT_FOUND).json({});
    }
    throw e;
  });
  const [userQuestion, user] = (await Promise.all([
    userQuestionPromise,
    userPromise,
  ])) as [UserQuestion, User];

  const updateFunc = () => {
    let upsertQuestionPromise;

    if (userQuestion) {
      if (isAnswerCorrect) {
        userQuestion.correct_answers += 1;
        userQuestion.last_answer_correct = true;
      } else {
        userQuestion.incorrect_answers += 1;
        userQuestion.last_answer_correct = false;
      }
      upsertQuestionPromise = userQuestionDao.update(userQuestion);
    } else {
      const newUserQuestion: UserQuestion = {
        user_id: USER_ID,
        question_id: id,
        last_answer_correct: isAnswerCorrect,
        incorrect_answers: isAnswerCorrect ? 0 : 1,
        correct_answers: isAnswerCorrect ? 1 : 0,
      };
      upsertQuestionPromise = userQuestionDao.insert(newUserQuestion);
    }

    user.answered_questions += 1;
    if (isAnswerCorrect) {
      user.correct_questions += 1;
    }
    const updateUserPromise = userDao.update(user);

    return Promise.all([upsertQuestionPromise, updateUserPromise]);
  };

  await new DbTransaction(client, updateFunc).run();
  client.end();
  return res.status(StatusCodes.OK).json({});
};
