import { Router } from "express";
import { loginUser } from "./login";
import { registerUser } from "./register";
import { getUserStats } from "./stats";
import passport from "passport";

const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get(
  "/stats",
  passport.authenticate("jwt", { session: false }),
  getUserStats
);

export default router;
