import { Router } from "express";
import {
	createUserCV,
	getUserData,
	updateUserData,
} from "../controllers/users.controller";

export const usersRouter = Router();

usersRouter
	.get("/")
	.get("/me", getUserData)
	.put("/me", updateUserData)
	.post("/me/generate", createUserCV);
