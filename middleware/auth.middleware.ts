import { NextFunction } from "express";
import { isError, result } from "../utils/error";
import { firebaseAdmin } from "../utils/firebase";
import { RequestExt, ResponseExt } from "../utils/types";
import { adminAccountModel } from "../models/adminAccount.model";
import dotenv from "dotenv";

dotenv.config();

// middlware that forbids anyone without a google auth token from accessing
// requires tokens from firebase
// for testing, we've removed that requirement
export async function requiresToken(
	req: RequestExt,
	res: ResponseExt,
	next: NextFunction,
) {
	// for testing
	// if in dev mode do not read tokens
	// provide a uid in the body
	if (process.env.DEV) {
		if (!req.body.uid) return res.status(400).json({message: "Please add a uid in the body"})

		req.tokenData = {
			uid: req.body.uid,
		};

		next();
	}

	// get jwt token from client
	const jwtToken = req.headers.authorization?.split(" ")[1];

	// if no token, return error
	if (!jwtToken) return res.status(401).json({ message: "No token provided" });

	// verify token using firebase auth
	const tokenData = await result(firebaseAdmin.auth().verifyIdToken(jwtToken));

	// if token is invalid, return error
	if (isError(tokenData))
		return res.status(401).json({ message: "Your token is invalid" });

	// add token into request
	req.tokenData = tokenData;

	next();
}

// middlware that forbids non authenticated requests (requests without session)
export function requiresSession(
	req: RequestExt,
	res: ResponseExt,
	next: NextFunction,
) {
	if (!req.session.uid)
		return res.status(401).json({ message: "not logged in" });

	next();
}

// middlware that forbids authenticated requests (requests with session)
export function requiresNoSession(
	req: RequestExt,
	res: ResponseExt,
	next: NextFunction,
) {
	if (req.session.uid)
		return res.status(400).json({ message: "already logged in" });

	next();
}

// middlware that forbids non admins
export async function requiresAdmin(
	req: RequestExt,
	res: ResponseExt,
	next: NextFunction,
) {
	// try to find admin account with session uid
	const adminAccount = await result(
		adminAccountModel.findOne({
			uid: req.session.uid,
		}),
	);

	// if got error while finding account, return error
	if (isError(adminAccount))
		return res
			.status(401)
			.json({ message: "Could not try to find if you are an admin" });

	// if the account is not an admin, return error
	if (!adminAccount)
		return res.status(401).json({ message: "You're not an admin" });

	next();
}
