import express from "express";
import {
	login,
	getCurrentUser,
	changePassword,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
	authValidationRules,
	validate,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Login
router.post("/login", authValidationRules.login, validate, login);

// Get current user
router.get("/me", authenticate, getCurrentUser);

// Change password
router.post(
	"/change-password",
	authenticate,
	authValidationRules.changePassword,
	validate,
	changePassword
);

export default router;
