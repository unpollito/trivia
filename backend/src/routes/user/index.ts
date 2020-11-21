import { Router } from "express";
import { loginUser } from "./login";
import { registerUser } from "./register";

const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
