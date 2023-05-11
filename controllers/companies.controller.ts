import { companyAccountModel } from "../models/companyAccount.model";
import { isError, result } from "../utils/error";
import { RequestExt, ResponseExt } from "../utils/types";

export async function getAllCompanies(req: RequestExt, res: ResponseExt) {
	return res.send("getting all companies");
}

export async function approveCompany(req: RequestExt, res: ResponseExt) {
	// TODO add validation
	// the id of the company to be approved
	const companyId = req.body.companyID;

	// try to update the account and change approved status
	const account = await result(
		companyAccountModel.updateOne(
			{ _id: companyId },
			{ $set: { approved: true } },
		),
	);

	// if could not update, return error
	if (isError(account))
		return res
			.status(500)
			.json({ message: "Could not approve company account" });

	return res.status(200).json({ message: "company account approved" });
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
