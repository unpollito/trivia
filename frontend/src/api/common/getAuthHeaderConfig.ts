import { AxiosRequestConfig } from "axios";
import { getAuthToken } from "../../helpers/loginData";

export const getAuthHeaderConfig = (): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  };
};
