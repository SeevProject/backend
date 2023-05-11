import { companyAccountModel } from "../models/companyAccount.model";
import { RequestExt, ResponseExt } from "../utils/types";

export async function getAllCompanies(req: RequestExt, res: ResponseExt) {
	return res.send("getting all companies");
}

export async function addCompany(req: RequestExt, res: ResponseExt) {
	try {
		const company = await companyAccountModel.create(req.body)
		res.json({status:"success",data:company})
	} catch (error) {
		 res.status(400).json({ status: "error haia", message: error });
	}
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
