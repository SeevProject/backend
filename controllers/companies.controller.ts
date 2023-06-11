import { companyAccountModel } from '../models/companyAccount.model';
import { isError, result } from '../utils/error';
import { failResponse, successResponse } from '../utils/response';
import { RequestExt, ResponseExt } from '../utils/types';
import { CompanyValidation } from '../validation/company.validation';

export async function getAllCompanies(req: RequestExt, res: ResponseExt) {
	const company = await result(companyAccountModel.find());

	if (isError(company))
		return failResponse(res, 404, 'Could not return companys data', company);

	return successResponse(res, 200, 'Succeded in returning companys', company);
}

export async function approveCompany(req: RequestExt, res: ResponseExt) {
	// try to update the account and change approved status
	const account = await result(
		companyAccountModel.updateOne(
			{ _id: req.params.id },
			{ $set: { approved: true } },
		),
	);

	// if could not update, return error
	if (isError(account))
		return failResponse(res, 404, 'could not update,companys data');

	// if could update, return success
	return successResponse(res, 200, 'company account approved', account);
}

export async function getCompanyData(req: RequestExt, res: ResponseExt) {
	const company = await result(companyAccountModel.findById(req.params.id));

	if (isError(company))
		return failResponse(res, 404, 'Could not return companys data');

	return successResponse(res, 200, 'Succeded in returning companys', company);
}

export async function updateCompanyData(req: RequestExt, res: ResponseExt) {
	const validationResult = CompanyValidation(req.body);
	// console.log(validationResult)
	if (!validationResult.success)
		return res
			.status(400)
			.json({ status: 'Error', message: validationResult.error });

	const validateData = validationResult.data.permissions;

	const company = await result(
		companyAccountModel.updateOne(
			{ _id: req.params.id },
			{
				$set: { permissions: validateData },
			},
		),
	);
	if (isError(company))
		return failResponse(res, 404, 'Could not update company data');

	return successResponse(res, 200, 'Succeded in update companys', company);
}

export async function deleteCompany(req: RequestExt, res: ResponseExt) {
	const company = await result(
		companyAccountModel.findByIdAndDelete(req.params.id),
	);
	if (isError(company))
	      return failResponse(res, 404, 'Could not delete company data');

	return successResponse(res, 200, 'Succeded in delete companys', company);
}
