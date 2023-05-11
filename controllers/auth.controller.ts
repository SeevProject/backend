import { firebaseAdmin } from "../utils/firebase";
import { isError, result } from "../utils/error";
import { userAccountModel } from "../models/userAccount.model";
import { RequestExt, ResponseExt } from "../utils/types";
import { companyAccountModel } from "../models/companyAccount.model";

export async function login(req: RequestExt, res: ResponseExt) {
	// token data is already added to the request by the previous middleware
	const tokenData = req.tokenData;

	// try to find user account in database
	const userAccount = await result(
		userAccountModel.findOne({
			uid: tokenData?.uid,
		}),
	);

	// if got error while finding account, return error
	if (isError(userAccount))
		return res
			.status(401)
			.json({ message: "Could not finish search for your account" });

	// if user account does not exist, return error
	if (!userAccount)
		return res
			.status(401)
			.json({ message: "You do not have an account to login to" });

	// finally create session using uid retrieved from database
	req.session.uid = userAccount.uid;

	return res.status(200).json({ message: "successfully logged user in" });
}

export async function register(req: RequestExt, res: ResponseExt) {
	// token data is already added to the request by the previous middleware
	const tokenData = req.tokenData;

	// try to find user account in database
	const userAccount = await result(
		userAccountModel.findOne({
			uid: tokenData?.uid,
		}),
	);

	// if got error while finding account, return error
	if (isError(userAccount))
		return res
			.status(401)
			.json({ message: "Could not try to find if you already got an account" });

	// if user account already exists, return error
	if (userAccount)
		return res
			.status(401)
			.json({ message: "You already got an account, cannot make another" });

	// TODO use request data
	const username = "Carmack";

	// create user account in database
	const createdUserAccount = await result(
		userAccountModel.create({
			username,
			uid: tokenData?.uid,
			createdAt: new Date().toString(),
			type: "user",
			data: {},
		}),
	);

	// if could not create user account, return error
	if (isError(createdUserAccount))
		return res
			.status(401)
			.json({ message: "Could not create your account in db" });

	// finally create session using uid retrieved from database
	req.session.uid = createdUserAccount.uid;

	return res.send("successfully registered user");
}

// for testing
// to register a company (only to be used by admin account)
// TODO delete and integrate into main register route
export async function registerCompany(req: RequestExt, res: ResponseExt) {
	// token data is already added to the request by the previous middleware
	const tokenData = req.tokenData;

	// try to find user account in database
	const companyAccount = await result(
		companyAccountModel.findOne({
			uid: tokenData?.uid,
		}),
	);

	// if got error while finding account, return error
	if (isError(companyAccount))
		return res
			.status(401)
			.json({ message: "Could not try to find if you already got an account" });

	// if user account already exists, return error
	if (companyAccount)
		return res
			.status(401)
			.json({ message: "You already got an account, cannot make another" });

	// TODO use request data
	const username = "companyUsername";

	// create user account in database
	const createdCompanyAccount = await result(
		companyAccountModel.create({
			username,
			uid: tokenData?.uid,
			createdAt: new Date().toString(),
			type: "company",
			permissions: {},
		}),
	);

	// if could not create user account, return error
	if (isError(createdCompanyAccount))
		return res
			.status(401)
			.json({ message: "Could not create your account in db" });

	// finally create session using uid retrieved from database
	req.session.uid = createdCompanyAccount.uid;

	return res.send("successfully registered user");
}

export async function logout(req: RequestExt, res: ResponseExt) {
	// delete session for user
	req.session.destroy((err) => {
		if (err) return res.status(500).json({ message: "error logging out" });
	});

	return res.status(200).json({ message: "successfully logged user out" });
}
