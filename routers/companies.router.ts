import { Router } from "express";
import {
	approveCompany as approveCompany,
	deleteCompany,
	getAllCompanies,
	getCompanyData,
	updateCompanyData,
} from "../controllers/companies.controller";
import { requiresAdmin, requiresSession } from "../middleware/auth.middleware";

export const companiesRouter = Router();

// all routes require a session

companiesRouter
	.get("/:id", requiresSession, getCompanyData)
	.get("/", requiresSession, requiresAdmin, getAllCompanies)
	.post("/", requiresSession, requiresAdmin, approveCompany)
	.put("/:id", requiresSession, requiresAdmin, updateCompanyData)
	.delete("/:id", requiresSession, requiresAdmin, deleteCompany);
