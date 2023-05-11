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
			contact: { type: Boolean, required: false },
			status: {
				employed: { type: Boolean, required: false },
				student: { type: Boolean, required: false },
			},
			languages: [
				{
					name: { type: String, required: false },
				},
			],
			skills: [
				{
					name: { type: String, required: false },
					level: { type: Number, required: false },
				},
			],
			courses: [
				{
					subjects: { type: [String], required: false },
				},
			],
			education: [
				{
					facility: { type: String, required: false },
					degree_level: { type: [String], required: false },
					degree_field: { type: [String], required: false },
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
