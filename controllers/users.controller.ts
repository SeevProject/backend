import { z } from "zod";
import { RequestExt, ResponseExt } from "../utils/types";
import { isError, result } from "../utils/error";
import { userAccountModel } from "../models/userAccount.model";
import { templateModel } from "../models/template.model";

export async function getAllUsers(req: RequestExt, res: ResponseExt) {
	const user = await result(userAccountModel.find());

	if (isError(user))
		return res
			.status(404)
			.json({ status: "error", message: "Could not return users " });

	return res.status(200).json({ status: "sucsess", data: user });
}

export async function getUserData(req: RequestExt, res: ResponseExt) {
	const userId = req.session.uid;
	const user = await result(userAccountModel.findOne({ uid: userId }));
	if (isError(user))
		return res
			.status(404)
			.json({ status: "error", message: "Could not return user " });

	return res.status(200).json({ status: "sucsess", data: user });
}

export async function updateUserData(req: RequestExt, res: ResponseExt) {
	const userId = req.session.uid;
	const user = await result(
		userAccountModel.findOneAndUpdate(
			{ uid: userId },
			{
				$set: { data: req.body.data },
			},
		),
	);
	if (isError(user))
		return res
			.status(404)
			.json({ status: "error", message: "Could not update user data" });

	return res.status(200).json({ status: "sucsess", data: user });
}

export async function generateCV(req: RequestExt, res: ResponseExt) {
	const template = await result(templateModel.create(req.body));
	if (isError(template))
		return res
			.status(404)
			.json({ status: "error", message: "Could not create template " });

	return res.status(200).json({ status: "sucsess", data: template });
}
