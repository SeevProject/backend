import { Router } from "express";
import {
	generateCV,
	getAllUsers,
	getUserData,
	updateUserData,
} from "../controllers/users.controller";

export const usersRouter = Router();

// all routes require a session

usersRouter
	.get("/", getAllUsers)
	.get("/me", getUserData)
	.put("/me", updateUserData)
	.post("/me/generate", generateCV);
