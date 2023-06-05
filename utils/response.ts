import { env } from "./env";
import { ResponseExt } from "./types";

export function failResponse(
	responseObject: ResponseExt,
	statusCode: number,
	message: string,
	devFailData?: Error,
	devMessage?: string,
) {
	if (env.DEV) {
		return responseObject.status(statusCode).json(
			devFailData
				? {
						message: devMessage || message,
						data: devFailData.message,
				  }
				: {
						message: devMessage || message,
				  },
		);
	}

	return responseObject.status(statusCode).json({
		message,
	});
}

export function successResponse(
	res: ResponseExt,
	statusCode: number,
	message: string,
	successData: any,
	devMessage?: string,
) {
	if (env.DEV) {
		return res.status(statusCode).json({
			message: devMessage || message,
			data: successData,
		});
	}

	return res.status(statusCode).json({
		message,
		data: successData,
	});
}
