import { isError, result } from '../utils/error';
import { userAccountModel } from '../models/userAccount.model';
import { RequestExt, ResponseExt } from '../utils/types';
import { accountModel } from '../models/account.model';
import { validateRegister } from '../validation/auth.validation';
import { companyAccountModel } from '../models/companyAccount.model';
import { failResponse, successResponse } from '../utils/response';
import { adminAccountModel } from '../models/adminAccount.model';

export async function login(req: RequestExt, res: ResponseExt) {
	// token data is already added to the request by the previous middleware
	const tokenData = req.tokenData;

	// try to find account in database
	const account = await result(
		// accountModel will search in all account types
		adminAccountModel.findOne({
			// use uid from token
			uid: tokenData?.uid,
		}),
	);

	// if got error while finding account, return error
	if (isError(account))
		return failResponse(res, 401, 'Could not finish search for your account');

	// if user account does not exist, return error
	if (!account)
		return failResponse(res, 401, 'You do not have an account to login to');

	// finally create session using uid retrieved from database
	req.session.uid = account.uid;

	return successResponse(res, 200, 'successfully logged in', account);
}

export async function register(req: RequestExt, res: ResponseExt) {
	// token data is already added to the request by the previous middleware
	const tokenData = req.tokenData;

	// validate req.body data and return error if not matching
	const validationResult = validateRegister.safeParse(req.body);
	if (!validationResult.success)
		return failResponse(res, 401, `${validationResult.error}`);

	// use validated body data instead of req.body
	const validBody = validationResult.data;

	// try to find user account in database
	const account = await result(
		accountModel.findOne({
			uid: tokenData?.uid,
		}),
	);

	// if got error while finding account, return error
	if (isError(account))
		return failResponse(
			res,
			401,
			'Could not try to find if you already got an account',
		);

	// if user account already exists, return error
	if (account)
		return failResponse(
			res,
			401,
			'You already got an account, cannot make another',
		);

	// // create user account in database
	// const createdAccount = await result(
	// 	// use accountModel as it supports both user types
	// 	accountModel.create({
	// 		username: validBody.username,
	// 		uid: tokenData?.uid,
	// 		createdAt: new Date().toString(),
	// 		type: validBody.type,
	// 	}),
	// );

	let createdAccount;

	if (validBody.type == 'company') {
		createdAccount = companyAccountModel.create({
			username: validBody.username,
			uid: tokenData?.uid,
			createdAt: new Date().toString(),
			type: 'company',
			approved: false,
		});
	} else {
		createdAccount = userAccountModel.create({
			username: validBody.username,
			uid: tokenData?.uid,
			createdAt: new Date().toString(),
			type: 'user',
			cvlist: [],
		});
	}

	// if could not create account, return error
	if (isError(createdAccount))
		return failResponse(res, 401, 'Could not create your account in db');

	// finally create session using uid retrieved from database
	req.session.uid = createdAccount.uid;
	return successResponse(
		res,
		200,
		'successfully registered the account',
		createdAccount,
	);
}

export async function loginOrRegister(req: RequestExt, res: ResponseExt) {
	// token data is already added to the request by the previous middleware
	const tokenData = req.tokenData;
	//try to find user account in database
	const account = await result(
		accountModel.findOne({
			uid: tokenData?.uid,
		}),
	);

	// if got error while finding account, return error
	if (isError(account))
		return failResponse(
			res,
			401,
			'Could not try to find if you already got an account',
		);

	// if the account exists set session and return
	if (account) {
		req.session.uid = account.uid;
		return successResponse(res, 200, 'successfully logged in', account);
	}

	// else register the account
	// validate req.body data and return error if not matching
	const validationResult = validateRegister.safeParse(req.body);
	if (!validationResult.success)
		return res.status(400).json({ message: validationResult.error });

	// use validated body data instead of req.body
	const validBody = validationResult.data;

	// create user account in database

	let createdAccount;

	console.log(tokenData?.uid);
	if (validBody.type == 'company') {
		createdAccount = await companyAccountModel.create({
			uid: tokenData?.uid,
			createdAt: new Date().toString(),
			type: 'company',
			approved: false,
		});
	} else {
		createdAccount = await userAccountModel.create({
			uid: tokenData?.uid,
			createdAt: new Date().toString(),
			type: 'user',
			cvlist: [],
		});
	}

	// if could not create account, return error
	if (isError(createdAccount))
		return failResponse(res, 401, 'Could not create your account in db');

	// finally create session using uid retrieved from database
	req.session.uid = createdAccount.uid; //createdAccount.uid;

	return successResponse(
		res,
		200,
		'successfully registered the account',
		createdAccount,
	);
}

export async function logout(req: RequestExt, res: ResponseExt) {
	// delete session for user
	req.session.destroy((err) => {
		if (err) return failResponse(res, 500, 'error logging out');
	});
	return successResponse(
		res,
		200,
		'successfully logged user out',
		'not user exit',
	);
}
