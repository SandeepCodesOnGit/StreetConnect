import express from 'express';
const router = express.Router();
import {login, logout, signup, getMe} from '../controllers/authController.js';
import wrapAsync from "../utils/wrapAsync.js";
import { validateLogin, validateRegister } from '../midddleware/middleware.js';
import { protect } from "../midddleware/authMiddleware.js";
router.post("/signin", validateLogin, wrapAsync(login));

router.post("/signup", validateRegister, wrapAsync(signup));

router.post("/logout", wrapAsync(logout));

router.get("/me", protect, wrapAsync(getMe));

export default router;