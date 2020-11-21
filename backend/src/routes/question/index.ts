import { Router } from "express";
import { getPracticeQuestions } from "./practice";
import { answerQuestion } from "./answer";
import passport from "passport";

const router = Router();

router.get(
  "/practice",
  passport.authenticate("jwt", { session: false }),
  getPracticeQuestions
);

router.post(
  "/answer",
  passport.authenticate("jwt", { session: false }),
  answerQuestion
);

export default router;
