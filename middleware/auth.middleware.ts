import { Request, Response, NextFunction } from "express";

// a middleware that checks if the user is logged in
// if not, it returns an error
// if yes, it calls the next middleware
export function requiresAuth(req: Request, res: Response, next: NextFunction) {
	if (!req.session.uid)
		return res.status(401).json({ message: "not logged in" });

	next();
}
