import { z } from "zod";

export const CompanyValidation = (body) =>{
const validation = z.object({
	permissions: z.array(
		z.object({
			contact: z.boolean().optional(),
			status: z.object({
				employed: z.boolean().optional(),
				student: z.boolean().optional(),
			}).optional(),
			languages: z.array(
				z.object({
					name: z.string().optional(),
				}).optional(),
			).optional(),
			skills: z.array(
				z.object({
					name: z.string().optional(),
					level: z.number().optional(),
				}).optional(),
			).optional(),
			courses: z.array(
				z.object({
					subjects: z.string().optional(),
				}).optional(),
			).optional(),
			education: z.array(
				z.object({
					facility: z.string().optional(),
					degree_level: z.string().optional(),
					degree_field: z.string().optional(),
				}).optional(),
			).optional(),
		}).optional(),
	).optional(),
}).required();

const result = validation.safeParse(body);

return result
}