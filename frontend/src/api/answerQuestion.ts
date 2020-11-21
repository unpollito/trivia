import axios from "axios";
import {
  AnswerRequestBody,
  AnswerResponseBody,
} from "../../../shared/model/AnswerBody";
import { getAuthHeaderConfig } from "./common/getAuthHeaderConfig";

export const answerQuestion = (params: {
  questionId: number;
  answer: string;
}): Promise<AnswerResponseBody> => {
  const { questionId, answer } = params;
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/question/answer`;
  return axios
    .post(
      url,
      { id: questionId, answer } as AnswerRequestBody,
      getAuthHeaderConfig()
    )
    .then((result) => result.data);
};
