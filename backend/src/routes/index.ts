import { Router } from "express";
import QuestionRouter from "./question";

const router = Router();

router.use("/question", QuestionRouter);

// Export the base-router
export default router;
