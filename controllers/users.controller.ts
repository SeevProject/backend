import { Request, Response } from "express";

export async function getAllUsers(_, res: Response) {
	return res.send(["user1", "user2"]);
}

export async function getUserData(_, res: Response) {
	return res.json({ usename: "Henry", email: "", data: {} });
}

export async function updateUserData(_, res: Response) {
	return res.send("Hello");
}

export async function createUserCV(_, res: Response) {
	return res.send("Hello");
}
