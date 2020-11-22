import StatusCodes from "http-status-codes";
import { getDbClient } from "../../db/dbClient";
import { Request, Response } from "express";
import { UserQuestionDao } from "../../model/UserQuestion/UserQuestionDao";
import { UserQuestion } from "../../model/UserQuestion/UserQuestion";
import {
  ServerQuestion,
  serverQuestionToClientQuestion,
} from "../../model/Question/Question";
import { difficultyNumberMap } from "../../model/Question/Difficulty";
import { QUIZ_SIZE } from "@shared/constants";
import { User } from "../../model/User/User";

export const getPracticeQuestions = async (req: Request, res: Response) => {
  const userId = (req.user as User).id;
  const client = await getDbClient();
  const userQuestionDao = new UserQuestionDao(client);

  let questions: ServerQuestion[] = await getFailedQuestions({
    userId,
    userQuestionDao,
  });

  if (questions.length < QUIZ_SIZE) {
    const limit = QUIZ_SIZE - questions.length;
    const unansweredQuestions = await getUnansweredQuestions({
      userId,
      userQuestionDao,
      limit,
    });
    questions = [...questions, ...unansweredQuestions];
  }

  if (questions.length < QUIZ_SIZE) {
    const limit = QUIZ_SIZE - questions.length;
    const correctQuestions = await getRightQuestions({
      userId,
      userQuestionDao,
      limit,
    });
    questions = [...questions, ...correctQuestions];
  }
  client.end();
  const result = questions.map(serverQuestionToClientQuestion);
  return res.status(StatusCodes.OK).json(result);
};

const getFailedQuestions = async (params: {
  userId: number;
  userQuestionDao: UserQuestionDao;
}): Promise<ServerQuestion[]> => {
  const { userId, userQuestionDao } = params;
  return await userQuestionDao.getListForUserWithQuestions({
    userId,
    count: QUIZ_SIZE,
    filter: { last_answer_correct: false },
    sort: {
      random: false,
      fields: [
        { name: "incorrect_answer_count", isAscending: false },
        { name: "difficulty", isAscending: false },
      ],
    },
  });
};

const getUnansweredQuestions = async (params: {
  userId: number;
  userQuestionDao: UserQuestionDao;
  limit: number;
}): Promise<ServerQuestion[]> => {
  const { userId, userQuestionDao, limit } = params;
  return await userQuestionDao.getUnansweredQuestionsForUser({
    userId,
    count: limit,
    sort: {
      random: false,
      fields: [{ name: "difficulty", isAscending: true }],
    },
  });
};

const getRightQuestions = async (params: {
  userId: number;
  userQuestionDao: UserQuestionDao;
  limit: number;
}): Promise<ServerQuestion[]> => {
  const { userId, userQuestionDao, limit } = params;
  return await userQuestionDao.getListForUserWithQuestions({
    userId,
    count: limit,
    filter: { last_answer_correct: true },
    sort: {
      random: false,
      fields: [
        { name: "correct_answer_count", isAscending: true },
        { name: "difficulty", isAscending: false },
      ],
    },
  });
};

// Unused - initially I used this to just sort everything in JS. This works nicely when we have
// 20 questions, but this would obviously be a problem if we had to load 1000 questions from the
// database to pick 15.
// (FWIW normally I'd just delete this, but since this is for a code interview, I figured I'd
// leave it in.)
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
        if (uqA.incorrect_answer_count !== uqB.incorrect_answer_count) {
          // More incorrect answers first
          return uqB.incorrect_answer_count - uqA.incorrect_answer_count;
        }
        // Harder questions first
        return bDifficulty - aDifficulty;
      } else if (aLastAnswerIndex === 0) {
        // Never answered: return easier questions first
        return aDifficulty - bDifficulty;
      } else {
        // Both answered correctly
        if (uqA.correct_answer_count !== uqB.correct_answer_count) {
          // Fewer correct answers first
          return uqA.correct_answer_count - uqB.correct_answer_count;
        }
        // Harder questions first
        return bDifficulty - aDifficulty;
      }
    })
    .slice(0, QUIZ_SIZE);
};
