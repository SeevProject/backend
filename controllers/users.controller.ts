import { z } from "zod";
import { RequestExt, ResponseExt } from "../utils/types";

export async function getAllUsers(req: RequestExt, res: ResponseExt) {
	return res.send(["user1", "user2"]);
}

export async function getUserData(req: RequestExt, res: ResponseExt) {
	const userId = req.session.uid;

	return res.json({ uid: userId });
}

export async function updateUserData(req: RequestExt, res: ResponseExt) {
	const userUpdateValidator = z.object({
		data: z.object({
			name: z.object({
				first: z.string(),
				middle: z.string(),
				last: z.string(),
			}),
		}),
	});

	const result = userUpdateValidator.safeParse(req.body);
	if (!result.success) return res.status(400).json(result.error);

	return res.send("updating user data");
}

export async function generateCV(req: RequestExt, res: ResponseExt) {
	return res.send("generating cv");
}
