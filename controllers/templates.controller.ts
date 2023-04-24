import { ResponseExt } from "../utils/types";

export async function getAllTemplates(_, res: ResponseExt) {
	return res.send(["template1", "template2"]);
}

export async function addTemplate(_, res: ResponseExt) {
	return res.send("adding template");
}

export async function updateTemplate(_, res: ResponseExt) {
	return res.send("updating template");
}

export async function deleteTemplate(_, res: ResponseExt) {
	return res.send("deleting template");
}
