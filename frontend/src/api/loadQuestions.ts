import axios from "axios";
import { ClientQuestion } from "../../../shared/model/Question";

export const loadQuestions = async (params: {
  isChallenge: boolean;
}): Promise<ClientQuestion[]> => {
  const endpointName = params.isChallenge ? "challenge" : "practice";
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/question/${endpointName}`;
  return axios.get(url).then((result) => result.data);
};
