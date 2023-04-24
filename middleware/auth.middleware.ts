import { NextFunction } from "express";
import { isError, result } from "../utils/error";
import { firebaseAdmin } from "../utils/firebase";
import { RequestExt, ResponseExt } from "../utils/types";

// middlware that forbids anyone without a google auth token from accessing
export async function requiresToken(
	req: RequestExt,
	res: ResponseExt,
	next: NextFunction,
) {
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
