import { Router } from "express";
import * as AS from "./auth.service.js";
import { auth } from "../../middleware/auth.js";

const router = Router();
router.post("/signup", AS.signup);
router.post("/verify-otp", AS.verifyOtp);
router.post("/signin", AS.signin);
router.post("/logout", auth, AS.logout);

export default router;
