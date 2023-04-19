import { Request, Response } from "express";

export async function getAllCompanies(req: Request, res: Response) {
	return res.send("getting all companies");
}

export async function addCompany(req: Request, res: Response) {
	return res.send("adding company");
}

export async function getCompanyData(req: Request, res: Response) {
	return res.send("getting company data");
}

export async function updateCompanyData(req: Request, res: Response) {
	return res.send("updating company data");
}

export async function deleteCompany(req: Request, res: Response) {
	return res.send("deleting company");
}
