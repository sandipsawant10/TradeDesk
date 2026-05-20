import express from "express";
import {
  register,
  login,
  getAllUsers,
  getMe,
} from "../../controllers/auth.controller.js";
import { protect, requireRole } from "../../middleware/auth.js";
import { registerRules, loginRules } from "../../validators/auth.validator.js";
import { validate } from "../../middleware/validate.js";
import { authLimiter } from "../../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, registerRules, validate, register);
router.post("/login", authLimiter, loginRules, validate, login);

router.get("/me", protect, getMe);
router.get("/users", protect, requireRole("admin"), getAllUsers);

export default router;
