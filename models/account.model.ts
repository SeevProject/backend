import { Schema, Document, model } from "mongoose";

export interface Account extends Document {
	username: string;
	auth: string;
	createdAt: Date;
}

const accountSchema = new Schema<Account>({
	username: { type: String, required: true },
	auth: { type: String, required: true },
	createdAt: { type: Date, required: true, default: Date.now },
});

export const accountModel = model<Account>("Account", accountSchema);
