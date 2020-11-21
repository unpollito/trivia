import { Router } from "express";
import { getPracticeQuestions } from "./practice";
import { answerQuestion } from "./answer";

const router = Router();

router.get("/practice", getPracticeQuestions);
router.post("/answer", answerQuestion);

export default router;
