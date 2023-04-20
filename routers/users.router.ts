import { Router } from "express";
import {
	generateCV,
	getAllUsers,
	getUserData,
	updateUserData,
} from "../controllers/users.controller";
import { requiresAuth } from "../middleware/auth.middleware";

export const usersRouter = Router();

usersRouter
	.get("/", getAllUsers)
	.get("/me", requiresAuth, getUserData)
	.put("/me", updateUserData)
	.post("/me/generate", generateCV);
