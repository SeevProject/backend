import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { requiresAuth } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter
	.post("/login", login)
	.post("/register", register)
	.post("/logout", requiresAuth, logout);
