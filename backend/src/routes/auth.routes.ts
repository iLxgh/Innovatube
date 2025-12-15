import { Router } from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/auth.validator.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();


router.use(authLimiter);

// POST /api/auth/register
router.post("/register", validate(registerSchema), register);

// POST /api/auth/login
router.post("/login", validate(loginSchema), login);

// POST /api/auth/forgot-password
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

// POST /api/auth/reset-password
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
