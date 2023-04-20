import { firebaseAdmin } from "../utils/auth";
import { Request, Response } from "express";
import { isError, result } from "../utils/error";

export async function login(req: Request, res: Response) {
	// if user is already logged in, return error
	if (req.session.uid)
		return res.status(400).json({ message: "already logged in" });

	// get jwt token from client
	const jwtToken = req.headers.authorization!.split(" ")[1];

	// verify token using firebase auth
	let tokenData = await result(firebaseAdmin.auth().verifyIdToken(jwtToken));

	// if token is invalid, return error
	if (isError(tokenData))
		return res.status(401).json({ message: "You cannot login" });

	// TODO check if user exists in database and act accordingly

	// create session for user and store uid
	req.session.uid = tokenData.uid;

	return res.status(200).json({ message: "successfully logged user in" });
}

export async function register(req: Request, res: Response) {
	return res.send("registering");
}

export async function logout(req: Request, res: Response) {
	// if user is not logged in, return error
	if (!req.session.uid)
		return res.status(400).json({ message: "not logged in" });

	// delete session for user
	req.session.destroy((err) => {
		if (err) return res.status(500).json({ message: "error logging out" });
	});

	return res.status(200).json({ message: "successfully logged user out" });
}
