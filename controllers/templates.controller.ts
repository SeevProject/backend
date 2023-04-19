import { Request, Response } from "express";

export async function getAllTemplates(_, res: Response) {
	return res.send(["template1", "template2"]);
}

export async function addTemplate(_, res: Response) {
	return res.send("adding template");
}

export async function updateTemplate(_, res: Response) {
	return res.send("updating template");
}

export async function deleteTemplate(_, res: Response) {
	return res.send("deleting template");
}
