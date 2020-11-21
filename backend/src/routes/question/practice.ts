import StatusCodes from "http-status-codes";
import { getDbClient } from "../../db/dbClient";
import { Request, Response } from "express";
import { UserQuestionDao } from "../../model/UserQuestion/UserQuestionDao";
import { QuestionDao } from "../../model/Question/QuestionDao";
import { UserQuestion } from "../../model/UserQuestion/UserQuestion";
import { ServerQuestion, serverQuestionToClientQuestion } from "../../model/Question/Question";
import { difficultyNumberMap } from "../../model/Question/Difficulty";
import { QUESTIONS_TO_LOAD, QUIZ_SIZE, USER_ID } from "@shared/constants";

export const getPracticeQuestions = async (req: Request, res: Response) => {
  const client = await getDbClient();
  const userQuestionDao = new UserQuestionDao(client);
  const questionDao = new QuestionDao(client);
  const questionsPromise = await questionDao.getList(QUESTIONS_TO_LOAD);
  const userQuestionsPromise = await userQuestionDao.getListForUser(
    USER_ID,
    QUESTIONS_TO_LOAD
  );
  const [questions, userQuestions] = await Promise.all([
    questionsPromise,
    userQuestionsPromise,
  ]);
  client.end();
  const result = getSortedQuestions(questions, userQuestions)
    .map(serverQuestionToClientQuestion);
  return res.status(StatusCodes.OK).json(result);
};

const getSortedQuestions = (
  questions: ServerQuestion[],
  userQuestions: UserQuestion[]
) => {
  const userQuestionsMap: { [key: number]: UserQuestion } = {};
  userQuestions.forEach(
    (userQuestion) =>
      (userQuestionsMap[userQuestion.question_id] = userQuestion)
  );
  return questions
    .slice() // don't modify the original array
    .sort((questionA, questionB) => {
      const uqA = userQuestionsMap[questionA.id];
      const uqB = userQuestionsMap[questionB.id];
      let aLastAnswerIndex = 0;
      let bLastAnswerIndex = 0;
      // -1: last answer was wrong; 0: never answered; 1: last answer was correct
      if (uqA) {
        aLastAnswerIndex = uqA.last_answer_correct ? 1 : -1;
      }
      if (uqB) {
        bLastAnswerIndex = uqB.last_answer_correct ? 1 : -1;
      }
      if (aLastAnswerIndex !== bLastAnswerIndex) {
        // Return first if wrongly answered, second if never answered, third if correctly answered.
        return aLastAnswerIndex - bLastAnswerIndex;
      }

      const aDifficulty = difficultyNumberMap[questionA.difficulty];
      const bDifficulty = difficultyNumberMap[questionB.difficulty];

      if (aLastAnswerIndex === -1) {
        // Both answered incorrectly
        if (uqA.incorrect_answers !== uqB.incorrect_answers) {
          // More incorrect answers first
          return uqB.incorrect_answers - uqA.incorrect_answers;
        }
        // Harder questions first
        return bDifficulty - aDifficulty;
      } else if (aLastAnswerIndex === 0) {
        // Never answered: return easier questions first
        return aDifficulty - bDifficulty;
      } else {
        // Both answered correctly
        if (uqA.correct_answers !== uqB.correct_answers) {
          // Fewer correct answers first
          return uqA.correct_answers - uqB.correct_answers;
        }
        // Harder questions first
        return bDifficulty - aDifficulty;
      }
    })
    .slice(0, QUIZ_SIZE);
};
