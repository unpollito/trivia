import { UserIdentification, LoginResponse } from "../../../shared/model/Login";
import axios from "axios";

export const login = (payload: UserIdentification): Promise<LoginResponse> => {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/user/login`;
  return axios.post(url, payload).then((result) => result.data);
};
