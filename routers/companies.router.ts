import { Router } from "express";
import {
	approveCompany as approveCompany,
	deleteCompany,
	getAllCompanies,
	getCompanyData,
	getUsercompany,
	updateCompanyData,
} from "../controllers/companies.controller";
import { requiresAdmin, requiresSession } from "../middleware/auth.middleware";

export const companiesRouter = Router();

// all routes require a session

companiesRouter
	.get('/me', requiresSession, getUsercompany)
	.get('/:id', requiresSession, getCompanyData)
	.get('/', requiresSession, requiresAdmin, getAllCompanies)
	.post('/:id', requiresSession, requiresAdmin, approveCompany)
	.put('/:id', requiresSession, requiresAdmin, updateCompanyData)
	.delete('/:id', requiresSession, requiresAdmin, deleteCompany);
