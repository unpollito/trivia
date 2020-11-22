import { Difficulty } from "./Difficulty";
import {
  BaseQuestion,
  ClientQuestion,
} from "../../../../shared/model/Question";

export interface ServerQuestion extends BaseQuestion {
  difficulty: Difficulty;
  correct_answer: string;
  incorrect_answers: [string, string, string];
}

export interface DatabaseQuestion {
  id: number;
  question: string;
  difficulty: Difficulty;
  correct_answer: string;
  incorrect_answer1: string;
  incorrect_answer2: string;
  incorrect_answer3: string;
}

export const serverQuestionToClientQuestion = (
  question: ServerQuestion
): ClientQuestion => {
  return {
    id: question.id,
    question: question.question,
    // Randomize the answer order
    answers: [question.correct_answer, ...question.incorrect_answers].sort(() =>
      Math.random() < 0.5 ? -1 : 1
    ) as [string, string, string, string],
  };
};

export const databaseQuestionToServerQuestion = (
  question: DatabaseQuestion
): ServerQuestion => {
  return {
    id: question.id,
    question: question.question,
    difficulty: question.difficulty,
    correct_answer: question.correct_answer,
    incorrect_answers: [
      question.incorrect_answer1,
      question.incorrect_answer2,
      question.incorrect_answer3,
    ],
  };
};
