import { firebaseAdmin } from "../auth";
import { Request, Response } from "express";

export async function login(req: Request, res: Response) {
	// test verifying auth token
	const tokenData = await firebaseAdmin
		.auth()
		.verifyIdToken(req.headers.authorization!.split(" ")[1]);

	// test adding info to session
	req.session.email = tokenData.email;

	return res.send("logging in");
}

export async function register(req: Request, res: Response) {
	return res.send("registering");
}

export async function logout(req: Request, res: Response) {
	return res.send("logging out");
}
