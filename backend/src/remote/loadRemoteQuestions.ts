import axios from "axios";
import { Difficulty } from "../model/Question/Difficulty";
import { QuestionDao } from "../model/Question/QuestionDao";
import { Client } from "pg";
import { QUESTION_CATEGORY, QUESTIONS_TO_LOAD } from "@shared/constants";
import { AllHtmlEntities } from "html-entities";
import { ServerQuestionWithoutId } from "../model/Question/IQuestionDao";

interface OpenApiQuestion {
  category: string;
  type: string;
  difficulty: Difficulty;
  question: string;
  correct_answer: string;
  incorrect_answers: [string, string, string];
}

export const loadRemoteQuestions = async (client: Client) => {
  const url =
    "https://opentdb.com/api.php" +
    `?amount=${QUESTIONS_TO_LOAD}&category=${QUESTION_CATEGORY}&type=multiple`;
  const response = await axios.get(url);
  const questions: ServerQuestionWithoutId[] = (response.data
    .results as OpenApiQuestion[]).map(cleanQuestion);
  return new QuestionDao(client).insert(questions);
};

export const cleanQuestion = (
  question: OpenApiQuestion
): ServerQuestionWithoutId => {
  return {
    correct_answer: AllHtmlEntities.decode(question.correct_answer),
    difficulty: question.difficulty,
    incorrect_answers: question.incorrect_answers.map((answer) =>
      AllHtmlEntities.decode(answer)
    ) as [string, string, string],
    question: AllHtmlEntities.decode(question.question),
  };
};
