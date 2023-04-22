import { Schema, model, Document } from "mongoose";

// Define the template schema
export interface Template extends Document {
	link: string;
	fields: {
		title: string;
		char_limit: number;
	}[];
	preview: string;
}

const templateSchema = new Schema<Template>({
	link: { type: String, required: true },
	fields: [
		{
			title: { type: String, required: true },
			char_limit: { type: Number, required: true },
		},
	],
	preview: { type: String, required: false },
});

export const templateModel = model<Template>("Template", templateSchema);
