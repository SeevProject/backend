import { Request, Response } from "express";

export async function login(req: Request, res: Response) {
	return res.send(req.headers.authorization);
}

export async function register(req: Request, res: Response) {
	return res.send(req.headers.authorization);
}

export async function logout(req: Request, res: Response) {
	return res.send(req.headers.authorization);
}
