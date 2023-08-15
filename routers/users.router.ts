import { Router } from "express";
import {
	deleteUser,
	getAllUsers,
	getUserData,
	getUsersById,
	updateUserData,
	updateUserPicture,
} from "../controllers/users.controller";
import { requiresAdmin, requiresCompanyAndadmin, requiresSession } from "../middleware/auth.middleware";

export const usersRouter = Router();

// all routes require a session

usersRouter
	.get('/me', requiresSession, getUserData)
	.put('/me/data', requiresSession, updateUserData)
	.put('/me/picture', requiresSession, updateUserPicture)
	.get('/', requiresSession, requiresCompanyAndadmin, getAllUsers)
	.get('/:id', requiresSession, requiresCompanyAndadmin, getUsersById)
	.delete('/:id', requiresSession, requiresAdmin, deleteUser);
