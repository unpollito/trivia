import axios from "axios";
import { ClientQuestion } from "../../../shared/model/Question";
import { getAuthHeaderConfig } from "./common/getAuthHeaderConfig";

export const loadQuestions = async (params: {
  isChallenge: boolean;
}): Promise<ClientQuestion[]> => {
  const endpointName = params.isChallenge ? "challenge" : "practice";
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/question/${endpointName}`;
  return axios.get(url, getAuthHeaderConfig()).then((result) => result.data);
};
