import { Router } from "express";
import {
	deleteUser,
	getAllUsers,
	getUserData,
	getUserOrAdminData,
	updateUserData,
	updateUserPicture,
} from "../controllers/users.controller";
import { requiresAdmin, requiresSession } from "../middleware/auth.middleware";

export const usersRouter = Router();

// all routes require a session

usersRouter
	.get('/me', requiresSession, getUserData)
	.get('/meBoth', requiresSession, getUserOrAdminData)
	.put('/me/data', requiresSession, updateUserData)
	.put('/me/picture', requiresSession, updateUserPicture)
	.get('/', requiresSession, requiresAdmin, getAllUsers)
	.delete('/:id', requiresSession, requiresAdmin, deleteUser);
