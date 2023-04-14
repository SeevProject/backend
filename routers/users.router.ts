import { Router } from "express";
import {
	createUserCV,
	getAllTemplates,
	getUserData,
	updateUserData,
} from "../controllers/users.controller";

export const usersRouter = Router();

usersRouter
	.get("/me", getUserData)
	.put("/me", updateUserData)
	.post("/me/templates/:id", createUserCV)
	.get("/me/templates", getAllTemplates);
