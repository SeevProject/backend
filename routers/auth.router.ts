import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";
import {
	requiresSession,
	requiresNoSession,
	requiresToken,
} from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter
	.post("/login", requiresNoSession, requiresToken, login)
	.post("/register", requiresNoSession, requiresToken, register)
	.post("/logout", requiresSession, logout);
