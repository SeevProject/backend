import { Router } from "express";
import {
	addCompany,
	deleteCompany,
	getAllCompanies,
	getCompanyData,
	updateCompanyData,
} from "../controllers/companies.controller";

export const companiesRouter = Router();

// all routes require a session

companiesRouter
	.get("/", getAllCompanies)
	.post("/", addCompany)
	.get("/:id", getCompanyData)
	.put("/:id", updateCompanyData)
	.delete("/:id", deleteCompany);
