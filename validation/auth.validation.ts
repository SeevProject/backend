import { z } from "zod";

export const validateRegister = z.object({
	uid: z.string().optional(),
	username: z.string(),
	type: z.enum(["user", "company"]),
});