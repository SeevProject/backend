import { z } from "zod";

export const CompanyValidation = (body) =>{
const validation = z.object({
	permissions: z.array(
		z.object({
			contact: z.boolean(),
			status: z.object({
				employed: z.boolean(),
				student: z.boolean(),
			}),
			languages: z.array(
				z.object({
					name: z.string(),
				}),
			),
			skills: z.array(
				z.object({
					name: z.string(),
					level: z.number(),
				}),
			),
			courses: z.array(
				z.object({
					subjects: z.string(),
				}),
			),
			education: z.array(
				z.object({
					facility: z.string(),
					degree_level: z.string(),
					degree_field: z.string(),
				}),
			),
		}),
	),
}).required();

const result = validation.safeParse(body);

return result
}