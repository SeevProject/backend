import { RequestExt, ResponseExt } from "../utils/types";
import { isError, result } from "../utils/error";
import { userAccountModel } from "../models/userAccount.model";
import { userValidation } from "../validation/user.validation";

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
	// get user id from session
	const userId = req.session.uid;

	// validate user data
	const validationResult = userValidation(req.body);

	if (!validationResult.success)
		return res
			.status(400)
			.json({ status: "Error", message: validationResult.error });

	const validData = validationResult.data;

	// update user data in database
	const user = await result(
		userAccountModel.findOneAndUpdate(
			{ uid: userId },
			{
				$set: { data: validData },
			},
		),
	);

	if (isError(user))
		return res
			.status(404)
			.json({ status: "error", message: "Could not update user data" });

	return res
		.status(200)
		.json({ status: "success", message: JSON.stringify(user) });
}
