import { z } from "zod";

export const registerValidation = z.object({
	accountUID: z.string().optional(),
	accountUsername: z.string(),
	accountType: z.enum(["user", "company"]),
});

export function validateRegisterBody(body: any) {
	// try to parse the body of the request
	const result = registerValidation.safeParse(body);

	if (!result.success) return result.error.message;

	return result.data;
}
