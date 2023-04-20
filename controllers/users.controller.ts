import { Request, Response } from "express";

export async function getAllUsers(req: Request, res: Response) {
	// test reading session
	console.log(req.session);

	return res.send(["user1", "user2"]);
}

export async function getUserData(_, res: Response) {
	return res.json({ usename: "Henry", email: "", data: {} });
}

export async function updateUserData(_, res: Response) {
	return res.send("updating user data");
}

export async function generateCV(_, res: Response) {
	return res.send("generating cv");
}
