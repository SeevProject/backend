import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";
import {
	requiresAuth,
	requiresNoAuth,
	requiresToken,
} from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter
	.post("/login", requiresNoAuth, requiresToken, login)
	.post("/register", requiresNoAuth, requiresToken, register)
	.post("/logout", requiresAuth, logout);
