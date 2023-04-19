import { Router } from "express";
import {
	addTemplate,
	deleteTemplate,
	getAllTemplates,
	updateTemplate,
} from "../controllers/templates.controller";

export const templatesRouter = Router();

templatesRouter
	.get("/", getAllTemplates)
	.post("/", addTemplate)
	.put("/:id", updateTemplate)
	.delete("/:id", deleteTemplate);
