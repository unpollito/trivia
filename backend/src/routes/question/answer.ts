import { Request, Response } from "express";
import { getDbClient } from "../../db/dbClient";
import StatusCodes from "http-status-codes";
import { QuestionDao } from "../../model/Question/QuestionDao";
import { ServerQuestion } from "../../model/Question/Question";
import { isNoResultFoundException } from "../../model/DbErrors";
import { UserDao } from "../../model/User/UserDao";
import { UserQuestionDao } from "../../model/UserQuestion/UserQuestionDao";
import { UserQuestion } from "../../model/UserQuestion/UserQuestion";
import { User } from "../../model/User/User";
import { DbTransaction } from "../../db/DbTransaction";
import {
  AnswerRequestBody,
  AnswerResponseBody,
} from "../../../../shared/model/AnswerBody";

export const answerQuestion = async (req: Request, res: Response) => {
  const client = await getDbClient();
  const { id, answer } = req.body as AnswerRequestBody;
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

  const userId = (req.user as User).id;
  const userQuestionPromise = userQuestionDao.getOne(userId, id).catch((e) => {
    if (!isNoResultFoundException(e)) {
      throw e;
    }
    return null;
  });
  const userPromise = userDao.getById(userId).catch((e) => {
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
        userQuestion.correct_answer_count += 1;
        userQuestion.last_answer_correct = true;
      } else {
        userQuestion.incorrect_answer_count += 1;
        userQuestion.last_answer_correct = false;
      }
      upsertQuestionPromise = userQuestionDao.update(userQuestion);
    } else {
      const newUserQuestion: UserQuestion = {
        user_id: userId,
        question_id: id,
        last_answer_correct: isAnswerCorrect,
        incorrect_answer_count: isAnswerCorrect ? 0 : 1,
        correct_answer_count: isAnswerCorrect ? 1 : 0,
      };
      upsertQuestionPromise = userQuestionDao.insert(newUserQuestion);
    }

    user.answered_question_count += 1;
    if (isAnswerCorrect) {
      user.correct_question_count += 1;
    }
    const updateUserPromise = userDao.update(user);

    return Promise.all([upsertQuestionPromise, updateUserPromise]);
  };

  await new DbTransaction(client, updateFunc).run();
  client.end();
  return res.status(StatusCodes.OK).json({
    isCorrect: isAnswerCorrect,
  } as AnswerResponseBody);
};
