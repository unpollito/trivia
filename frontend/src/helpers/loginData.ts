import { UserTokenData } from "../../../shared/model/Login";

export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

export const getLoginData = (): UserTokenData | null => {
  const token = getAuthToken();
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
