import { Schema } from "mongoose";
import { Account, accountModel } from "./account.model";

// define schema

export interface AdminAccount extends Account {
	type: "admin";
}

const adminAccountSchema = new Schema<AdminAccount>({
	type: {
		type: String,
		enum: ["admin"],
		default: "admin",
		required: true,
	},
});

// create model

export const adminAccountModel = accountModel.discriminator<AdminAccount>(
	"Admin",
	adminAccountSchema,
);
