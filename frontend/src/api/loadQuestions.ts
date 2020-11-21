import axios from "axios";
import { ClientQuestion } from "../../../shared/model/Question";
import { getAuthHeaderConfig } from "./common/getAuthHeaderConfig";

export interface CleanQuestion extends ClientQuestion {
  cleanQuestion: string;
  cleanAnswers: string[];
}

export const loadQuestions = async (params: {
  isChallenge: boolean;
}): Promise<CleanQuestion[]> => {
  const endpointName = params.isChallenge ? "challenge" : "practice";
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/question/${endpointName}`;
  const questions = (await axios
    .get(url, getAuthHeaderConfig())
    .then((result) => result.data)) as ClientQuestion[];
  return questions.map(cleanQuestion);
};

const cleanQuestion = (rawQuestion: ClientQuestion): CleanQuestion => {
  return {
    ...rawQuestion,
    cleanQuestion: htmlDecode(rawQuestion.question),
    cleanAnswers: rawQuestion.answers.map(htmlDecode),
  };
};

// https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
function htmlDecode(input: string) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent as string;
}
