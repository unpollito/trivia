import { UserTokenData } from "../../../../../shared/model/Login";

import jsonwebtoken from "jsonwebtoken";

export const createJwt = (userTokenData: UserTokenData) => {
  return jsonwebtoken.sign(userTokenData, process.env.JWT_SECRET_KEY as string);
};
