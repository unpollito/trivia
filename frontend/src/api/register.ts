import { UserIdentification, LoginResponse } from "../../../shared/model/Login";
import axios, { AxiosResponse } from "axios";

export const register = (
  payload: UserIdentification
): Promise<LoginResponse> => {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/user/register`;
  return axios.post(url, payload).then((result: AxiosResponse) => result.data);
};
