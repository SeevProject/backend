import { Session } from "express-session";
import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

// extend session to include uid
export interface SessionWithUID extends Session {
	uid?: string;
}

// extend request to include token data
export interface RequestExt extends Request {
	tokenData?: DecodedIdToken;
	session: SessionWithUID;
}

// no need to extend response
export interface ResponseExt extends Response {}
