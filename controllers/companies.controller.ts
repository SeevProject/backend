import { companyAccountModel } from "../models/companyAccount.model";
import { isError, result } from "../utils/error";
import { RequestExt, ResponseExt } from "../utils/types";

export async function getAllCompanies(req: RequestExt, res: ResponseExt) {
	try {
		const company = await companyAccountModel.find();
		res.status(200).json({ status: "sucsess", data: company });
	} catch (error) {
		res.status(404).json({ status: "error", message: error });
	}
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

	console.log(account);
	// if could not update, return error
	if (isError(account))
		return res.status(500).json({ message: "Could not approve company account"  });

	return res.status(200).json({ message: "company account approved" });
}

export async function getCompanyData(req: RequestExt, res: ResponseExt) {
	try {
		  const company = await companyAccountModel.findById(req.params.id);
		   res.status(200).json({ status: "sucsess", data: company });
	} catch (error) {
		res.status(404).json({ status: "error", message: error });
	}
}

export async function updateCompanyData(req: RequestExt, res: ResponseExt) {
		try {
			const company = await companyAccountModel.findByIdAndUpdate(
				 req.params.id,
				{ $push: { permissions: req.body.permissions } })
			res.status(200).json({ status: "sucsess", data: company });
		} catch (error) {
			res.status(404).json({ status: "error", message: error });
		}
}

export async function deleteCompany(req: RequestExt, res: ResponseExt) {
		try {
			const company = await companyAccountModel.findByIdAndDelete(req.params.id);
			res.status(200).json({ status: "sucsess", data: company });
		} catch (error) {
			res.status(404).json({ status: "error", message: error });
		}
}
