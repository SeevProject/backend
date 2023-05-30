import { templateModel } from "../models/template.model";
import { isError, result } from "../utils/error";
import { RequestExt, ResponseExt } from "../utils/types";

export async function getAllTemplates(req: RequestExt, res: ResponseExt) {
	const template = await result(templateModel.find());
	if (isError(template))
		return res
			.status(404)
			.json({ status: "error", message: "Could not return templates " });

	return res.status(200).json({ status: "sucsess", data: template });
}

export async function addTemplate(req: RequestExt, res: ResponseExt) {
	const template = await result(templateModel.create(req.body));
	if (isError(template))
		return res
			.status(404)
			.json({ status: "error", message: "Could not create template " });

	return res.status(200).json({ status: "sucsess", data: template });
}

export async function updateTemplate(req: RequestExt, res: ResponseExt) {
	const template = await result(
		templateModel.updateOne(
			{ _id: req.params.id },
			{
				$set: req.body,
			},
		),
	);
	if (isError(template))
		return res
			.status(404)
			.json({ status: "error", message: "Could not update template data" });

	return res.status(200).json({ status: "sucsess", data: template });
}

export async function deleteTemplate(req: RequestExt, res: ResponseExt) {
	const template = await result(
		templateModel.deleteOne({ _id: req.params.id }),
	);
	if (isError(template))
		return res
			.status(404)
			.json({ status: "error", message: "Could not update template data" });

	return res.status(200).json({ status: "sucsess", data: template });
}
