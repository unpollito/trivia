import { Router } from "express";
import QuestionRouter from "./question";
import UserRouter from "./user";

const router = Router();

router.use("/question", QuestionRouter);
router.use("/user", UserRouter);

// Export the base-router
export default router;
