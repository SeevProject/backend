import { Request, Response } from "express";

export async function getAllUsers(req: Request, res: Response) {
	return res.send(["user1", "user2"]);
}

export async function getUserData(req: Request, res: Response) {
	const userId = req.session.uid;

	return res.json({ uid: userId });
}

export async function updateUserData(_, res: Response) {
	return res.send("updating user data");
}

export async function generateCV(_, res: Response) {
	return res.send("generating cv");
}
