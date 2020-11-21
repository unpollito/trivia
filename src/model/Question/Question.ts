import { Difficulty } from "./Difficulty";

export interface BaseQuestion {
  id: number;
  question: string;
}

export interface ServerQuestion extends BaseQuestion {
  difficulty: Difficulty;
  correct_answer: string;
  incorrect_answers: [string, string, string];
}

export interface ClientQuestion extends BaseQuestion {
  answers: [string, string, string, string];
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
