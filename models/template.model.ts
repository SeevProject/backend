import { Schema, model, Document } from "mongoose";

export interface TemplateType {
	link: string;
	fields: {
		id: string;
		length: number;
		type: "string" | "number" | "unknown";
	}[];
	preview: string;
}

// Define the template schema
interface Template extends Document, TemplateType {}

const templateSchema = new Schema<Template>({
	link: { type: String, required: true },
	fields: [
		{
			id: { type: String, required: true },
			char_limit: { type: Number, required: true },
		},
	],
	preview: { type: String, required: false },
});

export const templateModel = model<Template>("Template", templateSchema);
