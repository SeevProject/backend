import { adminAccountModel } from "../models/adminAccount.model";
import { isError, result } from "../utils/error";
import { failResponse, successResponse } from "../utils/response";
import { RequestExt, ResponseExt } from "../utils/types";

export async function getAdminData(req: RequestExt, res: ResponseExt) {
	const userId = req.session.uid;
	const user = await result(adminAccountModel.findOne({ uid: userId }));
	if (isError(user))
		return failResponse(res, 404, 'Could not return user ', user);

	return successResponse(res, 200, 'Succeded in returning users', user);
}
