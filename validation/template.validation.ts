import { z } from "zod";

export const templateValidation = (body) =>{
const validation = z.object({
	link: z.string(),
	fields: z.array(
		z.object({
			title: z.string(),
			char_limit: z.number(),
		}),
	),
	preview:z.string(),

});

const result = validation.safeParse(body);

return result
}