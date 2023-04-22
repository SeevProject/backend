import { Schema } from "mongoose";
import { Account, accountModel } from "./account.model";

// define schema

export interface CompanyAccount extends Account {
	type: "company";
	permissions: {
		contact: boolean;
		status: {
			employed: boolean;
			student: boolean;
		};
		languages: {
			name: string;
		}[];
		skills: {
			name: string;
			level: number;
		}[];
		courses: {
			subjects: string[];
		};
		education: {
			facility: string;
			degree_level: string[];
			degree_field: string[];
		};
	}[];
}

const companyAccountSchema = new Schema<CompanyAccount>({
	type: {
		type: String,
		enum: ["company"],
		default: "company",
		required: true,
	},
	permissions: [
		{
			contact: { type: Boolean, required: true },
			status: {
				employed: { type: Boolean, required: true },
				student: { type: Boolean, required: true },
			},
			languages: [
				{
					name: { type: String, required: true },
				},
			],
			skills: [
				{
					name: { type: String, required: true },
					level: { type: Number, required: true },
				},
			],
			courses: [
				{
					subjects: { type: [String], required: true },
				},
			],
			education: [
				{
					facility: { type: String, required: true },
					degree_level: { type: [String], required: true },
					degree_field: { type: [String], required: true },
				},
			],
		},
	],
});

// create model

export const companyAccountModel = accountModel.discriminator<CompanyAccount>(
	"Company",
	companyAccountSchema,
);
