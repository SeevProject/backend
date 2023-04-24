import { RequestExt, ResponseExt } from "../utils/types";

export async function getAllUsers(req: RequestExt, res: ResponseExt) {
	return res.send(["user1", "user2"]);
}

export async function getUserData(req: RequestExt, res: ResponseExt) {
	const userId = req.session.uid;

	return res.json({ uid: userId });
}

export async function updateUserData(_, res: ResponseExt) {
	return res.send("updating user data");
}

export async function generateCV(_, res: ResponseExt) {
	return res.send("generating cv");
}
