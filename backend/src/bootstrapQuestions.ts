import { getDbClient } from "./db/dbClient";
import { QuestionDao } from "./model/Question/QuestionDao";
import { loadRemoteQuestions } from "./remote/loadRemoteQuestions";
import { QUIZ_SIZE } from "@shared/constants";

export const bootstrapQuestions = async () => {
  const client = await getDbClient();
  const questionDao = new QuestionDao(client);
  const questions = await questionDao.getList(QUIZ_SIZE);
  if (questions.length < QUIZ_SIZE) {
    await loadRemoteQuestions(client);
  }
  await client.end();
};
