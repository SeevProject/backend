import { Request, Response } from "express";

export async function getAllTemplates(_, res: Response) {
	return res.send(["template1", "template2"]);
}
