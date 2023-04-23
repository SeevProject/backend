import { Schema, model, Document } from "mongoose";
import { Account, accountModel } from "./account.model";

// define schema

export interface UserAccount extends Account {
	type: "user";
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
	},
});

// create model

export const userAccountModel = accountModel.discriminator<UserAccount>(
	"User",
	userAccountSchema,
);
