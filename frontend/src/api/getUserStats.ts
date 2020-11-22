import { UserStats } from "../../../shared/model/Login";
import axios from "axios";
import { getAuthHeaderConfig } from "./common/getAuthHeaderConfig";

export const getUserStats = (): Promise<UserStats> => {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/user/stats`;
  return axios.get(url, getAuthHeaderConfig()).then((result) => result.data);
};
