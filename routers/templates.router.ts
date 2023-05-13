import { Router } from "express";
import {
	addTemplate,
	deleteTemplate,
	getAllTemplates,
	updateTemplate,
} from "../controllers/templates.controller";
import { requiresAdmin, requiresSession } from "../middleware/auth.middleware";
import { generateCV } from "../controllers/users.controller";

export const templatesRouter = Router();

// all routes require a session

templatesRouter
	.get("/", requiresSession, requiresAdmin, getAllTemplates)
	.post("/", requiresSession, requiresAdmin, addTemplate)
	.post("/:id", requiresSession, generateCV)
	.put("/:id", requiresSession, requiresAdmin, updateTemplate)
	.delete("/:id", requiresSession, requiresAdmin, deleteTemplate);
