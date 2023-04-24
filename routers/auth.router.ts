import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { requiresAuth, requiresNoAuth } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter
	.post("/login", requiresNoAuth, login)
	.post("/register", requiresNoAuth, register)
	.post("/logout", requiresAuth, logout);
