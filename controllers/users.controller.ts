import { RequestExt, ResponseExt } from '../utils/types';
import { isError, result } from '../utils/error';
import { userAccountModel } from '../models/userAccount.model';
import { userValidation } from '../validation/user.validation';
import { firebaseStorage } from '../utils/firebase';
import { failResponse, successResponse } from '../utils/response';
import { accountModel } from '../models/account.model';

export async function getAllUsers(req: RequestExt, res: ResponseExt) {
	const user = await result(userAccountModel.find());

	if (isError(user))
		return failResponse(res, 404, 'Could not return users', user);

	return successResponse(res, 200, 'Succeded in returning users', user);
}
export async function getUsersById(req: RequestExt, res: ResponseExt) {
	const id = req.params.id;
	const user = await result(userAccountModel.findById(id));

	if (isError(user))
		return failResponse(res, 404, 'Could not return users', user);

	return successResponse(res, 200, 'Succeded in returning users', user);
}


export async function getUserData(req: RequestExt, res: ResponseExt) {
	const userId = req.session.uid;
	const user = await result(userAccountModel.findOne({ uid: userId }));
	if (isError(user))
		return failResponse(res, 404, 'Could not return user ', user);

	return successResponse(res, 200, 'Succeded in returning users', user);
}

export async function updateUserPicture(req: RequestExt, res: ResponseExt) {
	// get user id from session
	const userId = req.session.uid;

	// get file from request
	const reqFile = req.files?.picture;

	if (!reqFile)
		return failResponse(
			res,
			404,
			"No files provided (submit with name 'picture')",
		);

	if (Array.isArray(reqFile))
		return failResponse(res, 400, 'Submit only one file');

	// validate picture
	if (reqFile.mimetype !== 'image/jpeg' && reqFile.mimetype !== 'image/png')
		return failResponse(res, 400, 'File in request is not a picture');

	// upload file to firebase

	const firebaseLink = `users/${userId}/picture${
		reqFile.mimetype === 'image/jpeg' ? '.jpg' : '.png'
	}`;

	const uploadResult = await result(
		firebaseStorage.upload(reqFile.tempFilePath, {
			destination: firebaseLink,
		}),
	);

	if (isError(uploadResult))
		return failResponse(res, 404, 'Could not upload request file to firebase');

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
		return failResponse(res, 404, 'Could not update user picture');

	return successResponse(res, 200, 'User picture updated', user);
}

export async function updateUserData(req: RequestExt, res: ResponseExt) {
	// get user id from session
	const userId = req.session.uid;

	// validate user data
	const validationResult = userValidation(req.body);

	if (!validationResult.success)
		return failResponse(res, 400, `${validationResult.error}`);

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
		return failResponse(res, 404, 'Could not update user data');

	return successResponse(res, 404, JSON.stringify(user), user);
}

export const deleteUser = async (req, res) => {
	console.log("delete")
		const id = req.params.id;
		const user = await result(userAccountModel.findByIdAndDelete(id));
	if (isError(user))
		return failResponse(res, 404, 'Could not return users', user);

	return successResponse(res, 200, 'Succeded in returning users', user);
};