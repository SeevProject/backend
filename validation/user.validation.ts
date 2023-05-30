import {z} from "zod";

export const userValidation=(body)=>{

	const validation = z
		.object({
			data: z.object({
				name: z.object({
					first: z.string().optional(),
					middle: z.string().optional(),
					last: z.string().optional(),
				}).optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				picture: z.string().optional(),
				about: z.string().optional(),
				status: z.object({
					employed: z.boolean().optional(),
					student: z.boolean().optional(),
				}).optional(),
				address: z.object({
					country: z.string().optional(),
					city: z.string().optional(),
					street: z.string().optional(),
				}).optional(),
				languages: z.array(
					z.object({
						name: z.string().optional(),
						level: z.string().optional(),
					}).optional(),
				).optional(),
				education: z.array(
					z.object({
						facility: z.string().optional(),
						location: z.string().optional(),
						degree_level: z.string().optional(),
						degree_field: z.string().optional(),
						date_start: z.string().optional(),
						date_end: z.string().optional(),
					}).optional(),
				).optional(),
				courses: z.array(
					z.object({
						title: z.string().optional(),
						about: z.string().optional(),
						subjects: z.string().optional(),
						location: z.string().optional(),
					}).optional(),
				).optional(),
				skills: z.array(
					z.object({
						name: z.string().optional(),
						about: z.string().optional(),
						level: z.string().optional(),
					}).optional(),
				).optional(),
				hobbies: z.array(
					z.object({
						name: z.string().optional(),
						about: z.string().optional(),
					}).optional(),
				).optional(),
			}),
		}).required();

	const result =validation.safeParse(body)

	return result
}
z.object({});