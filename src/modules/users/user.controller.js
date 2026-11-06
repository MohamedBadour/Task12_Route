import { Router } from "express";
import * as US from "./user.service.js";
import { auth } from "../../middleware/auth.js";
import { uploadSingle } from "../../middleware/multer.js";

const router = Router();
router.get("/profile", auth, US.getProfile);
router.patch("/profile-pic", auth, uploadSingle("image"), US.uploadProfilePicture);

export default router;
