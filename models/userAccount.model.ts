import { Schema } from "mongoose";
import { Account, accountModel } from "./account.model";

// define schema

export interface UserAccount extends Account {
	type: "user";
	cvlist: string[];
	data: {
		name: {
			first: string;
			middle: string;
			last: string;
		};
		phone: string;
		email: string;
		picture: string;
		about: string;
		status: {
			employed: boolean;
			student: boolean;
		};
		address: {
			country: string;
			city: string;
			street: string;
		};
		languages: {
			name: string;
			level: string;
		}[];
		education: {
			facility: string;
			location: string;
			degree_level: string;
			degree_field: string;
			date_start: string;
			date_end: string;
		}[];
		courses: {
			title: string;
			about: string;
			subjects: string[];
			location: string;
		}[];
		skills: {
			name: string;
			about: string;
			level: number;
		}[];
		hobbies: {
			name: string;
			about: string;
		}[];
	};
}

const userAccountSchema = new Schema<UserAccount>({
	type: {
		type: String,
		enum: ["user"],
		default: "user",
		required: true,
	},
	data: {
		name: {
			first: { type: String, required: false },
			middle: { type: String, required: false },
			last: { type: String, required: false },
		},
		phone: { type: String, required: false },
		email: { type: String, required: false },
		picture: { type: String, required: false },
		about: { type: String, required: false },
		status: {
			employed: { type: Boolean, required: false },
			student: { type: Boolean, required: false },
		},
		address: {
			country: { type: String, required: false },
			city: { type: String, required: false },
			street: { type: String, required: false },
		},
		languages: [
			{
				name: { type: String, required: false },
				level: { type: String, required: false },
			},
		],
		education: [
			{
				facility: { type: String, required: false },
				location: { type: String, required: false },
				degree_level: { type: String, required: false },
				degree_field: { type: String, required: false },
				date_start: { type: String, required: false },
				date_end: { type: String, required: false },
			},
		],
		courses: [
			{
				title: { type: String, required: false },
				about: { type: String, required: false },
				subjects: { type: [String], required: false },
				location: { type: String, required: false },
			},
		],
		skills: [
			{
				name: { type: String, required: false },
				about: { type: String, required: false },
				level: { type: Number, required: false },
			},
		],
		hobbies: [
			{
				name: { type: String, required: false },
				about: { type: String, required: false },
			},
		],
	},
});

// create model

export const userAccountModel = accountModel.discriminator<UserAccount>(
	"User",
	userAccountSchema,
);
