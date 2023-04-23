import { firebaseAdmin } from "../utils/firebase";
import { Request, Response } from "express";
import { isError, result } from "../utils/error";
import { userAccountModel } from "../models/userAccount.model";

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
		return res.status(401).json({ message: "Your token is invalid" });

	const userAccount = await result(
		userAccountModel.findOne({
			uid: tokenData.uid,
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

	// otherwise create session for user and store uid
	req.session.uid = tokenData.uid;

	return res.status(200).json({ message: "successfully logged user in" });
}

export async function register(req: Request, res: Response) {
	// get jwt token from client
	const jwtToken = req.headers.authorization!.split(" ")[1];

	// verify token using firebase auth
	let tokenData = await result(firebaseAdmin.auth().verifyIdToken(jwtToken));

	// if token is invalid, return error
	if (isError(tokenData))
		return res.status(401).json({ message: "Your token is invalid" });

	// try to find user account in database
	const userAccount = await result(
		userAccountModel.findOne({
			uid: tokenData.uid,
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

	// TODOD use request data
	const username = "Carmack";

	// create user account in database
	const createdUserAccount = await result(
		userAccountModel.create({
			username,
			uid: tokenData.uid,
			createdAt: new Date().toString(),
			type: "user",
			data: {},
		}),
	);

	// if could not create user account, return error
	if (isError(createdUserAccount))
		return res.status(401).json({ message: "Could not create your account in db" });

	// create session for user and store uid
	req.session.uid = tokenData.uid;

	return res.send("successfully registered user");
}

export async function logout(req: Request, res: Response) {
	// delete session for user
	req.session.destroy((err) => {
		if (err) return res.status(500).json({ message: "error logging out" });
	});

	return res.status(200).json({ message: "successfully logged user out" });
}
