import { Request, Response, NextFunction } from "express";

// if yes, it calls the next middleware
// middlware that forbids non authenticated requests
export function requiresAuth(req: Request, res: Response, next: NextFunction) {
	if (!req.session.uid)
		return res.status(401).json({ message: "not logged in" });

	next();
}

// middleware that forbids authenticated requests
export function requiresNoAuth(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (req.session.uid)
		return res.status(400).json({ message: "already logged in" });

	next();
}
