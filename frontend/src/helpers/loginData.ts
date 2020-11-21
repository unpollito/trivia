import { UserTokenData } from "../../../shared/model/Login";

export const getLoginData = (): UserTokenData | null => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return null;
  }
  const encodedData = token.split(".")[1];
  return JSON.parse(atob(encodedData)) as UserTokenData;
};

export const setLoginToken = (data: string | null): void => {
  if (data) {
    localStorage.setItem("authToken", data);
  } else {
    localStorage.removeItem("authToken");
  }
};
