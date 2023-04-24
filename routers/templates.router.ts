import { Router } from "express";
import {
	addTemplate,
	deleteTemplate,
	getAllTemplates,
	updateTemplate,
} from "../controllers/templates.controller";

export const templatesRouter = Router();

// all routes require a session

templatesRouter
	.get("/", getAllTemplates)
	.post("/", addTemplate)
	.put("/:id", updateTemplate)
	.delete("/:id", deleteTemplate);
