import { RequestExt, ResponseExt } from "../utils/types";
import { isError, result } from "../utils/error";
import { userAccountModel } from "../models/userAccount.model";
import { userValidation } from "../validation/user.validation";
import { firebaseStorage } from "../utils/firebase";

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

export async function updateUserPicture(req: RequestExt, res: ResponseExt) {
	// get user id from session
	const userId = req.session.uid;

	// get file from request
	const reqFile = req.files?.picture;

	if (!reqFile)
		return res.status(400).json({
			status: "error",
			message: "No files provided (submit with name 'picture')",
		});

	if (Array.isArray(reqFile))
		return res.status(400).json({ status: "Submit only one file" });

	// validate picture
	if (reqFile.mimetype !== "image/jpeg" && reqFile.mimetype !== "image/png")
		return res
			.status(400)
			.json({ status: "error", message: "File in request is not a picture" });

	// upload file to firebase

	const firebaseLink = `users/${userId}/profilePicture${
		reqFile.mimetype === "image/jpeg" ? ".jpg" : ".png"
	}`;

	const uploadResult = await result(
		firebaseStorage.upload(reqFile.tempFilePath, {
			destination: firebaseLink,
		}),
	);

	if (isError(uploadResult))
		return res.status(404).json({
			status: "error",
			message: "Could not upload request file to firebase",
		});

	// update user data in database
	const user = await result(
		userAccountModel.findOneAndUpdate(
			{ uid: userId },
			{
				$set: { picture: firebaseLink },
			},
		),
	);

	if (isError(user))
		return res
			.status(404)
			.json({ status: "error", message: "Could not update user picture" });

	return res
		.status(200)
		.json({ status: "success", message: "User picture updated" });
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
