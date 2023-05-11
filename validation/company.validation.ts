import {z} from "zod"

export const addCompanyValidation=(body)=>{
const validation = z.object({
	permissions: z.array(
		z.object({
			contact: z.boolean(),
			status: z.object({
				employed: z.boolean(),
				student: z.boolean(),
			}).required(),
			languages: z.array(
				z.object({
					name: z.number(),
				}).required(),
			),
			skills: z.array(
				z.object({
					name: z.string(),
					level: z.number(),
				}).required(),
			),
			courses: z.array(
				z.object({
					subjects: z.string(),
				}).required(),
			),
			education: z.array(
				z.object({
					facility: z.string(),
					degree_level: z.string(),
					degree_field: z.string(),
				}).required(),
			),
		}),
	),
}).required();

const result = validation.safeParse(body);

return result
}