import { Router } from "express";
import { login, loginOrRegister, logout, register } from "../controllers/auth.controller";
import {
	requiresSession,
	requiresNoSession,
	requiresToken,
} from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter
	.post('/login', requiresNoSession, requiresToken, login)
	.post('/loginwithgoogle', requiresNoSession, requiresToken, loginOrRegister)
	.post('/register', requiresNoSession, requiresToken, register)
	.post('/logout', requiresSession, logout);