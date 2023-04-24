import { RequestExt, ResponseExt } from "../utils/types";

export async function getAllCompanies(req: RequestExt, res: ResponseExt) {
	return res.send("getting all companies");
}

export async function addCompany(req: RequestExt, res: ResponseExt) {
	return res.send("adding company");
}

export async function getCompanyData(req: RequestExt, res: ResponseExt) {
	return res.send("getting company data");
}

export async function updateCompanyData(req: RequestExt, res: ResponseExt) {
	return res.send("updating company data");
}

export async function deleteCompany(req: RequestExt, res: ResponseExt) {
	return res.send("deleting company");
}
