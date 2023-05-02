import { Router } from "express";
import {
	generateCV,
	getAllUsers,
	getUserData,
	updateUserData,
} from "../controllers/users.controller";
import { requiresAdmin, requiresSession } from "../middleware/auth.middleware";

export const usersRouter = Router();

// all routes require a session

usersRouter
	.get("/me", requiresSession, getUserData)
	.put("/me", requiresSession, updateUserData)
	.post("/me/generate", requiresSession, generateCV)
	.get("/", requiresSession, requiresAdmin, getAllUsers);
