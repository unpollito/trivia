import axios from "axios";
import { Difficulty } from "../model/Question/Difficulty";
import { QuestionDao } from "../model/Question/QuestionDao";
import { Client } from "pg";
import { QUESTION_CATEGORY, QUESTIONS_TO_LOAD } from "@shared/constants";

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
  const questions: OpenApiQuestion[] = response.data.results;
  return new QuestionDao(client).insert(questions);
};
