import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import cors from "cors";

import express, { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import "express-async-errors";

import BaseRouter from "./routes";
import logger from "@shared/Logger";
import passport from "passport";
import {
  Strategy as JWTStrategy,
  StrategyOptions,
  ExtractJwt,
} from "passport-jwt";
import { getDbClient } from "./db/dbClient";
import { UserDao } from "./model/User/UserDao";

const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: "http://localhost:3001",
    })
  );
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};
passport.use(
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  new JWTStrategy(opts, async (jwtPayload, done) => {
    const client = await getDbClient();
    try {
      const userDao = new UserDao(client);
      const user = await userDao.getById(jwtPayload.id);
      done(null, user);
    } catch (e) {
      done(e, false);
    } finally {
      client.end();
    }
  })
);

// Add APIs
app.use("/api", BaseRouter);

// Print API errors
app.use((err: Error, req: Request, res: Response) => {
  logger.err(err, true);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: err.message,
  });
});

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));
app.get("*", (req: Request, res: Response) => {
  res.sendFile("index.html", { root: viewsDir });
});

// Export express instance
export default app;
