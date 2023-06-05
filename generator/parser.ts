import { CheerioAPI } from "cheerio";
import { TemplateType } from "../models/template.model";

export function flattenObject(obj: Object) {
	let flattened = {};

	for (let property in obj) {
		const value = obj[property];

		// skip properties with the name "_id"
		if (property === "_id") continue;

		// if key is an array
		if (Array.isArray(value)) {
			for (let index = 0; index < value.length; index++) {
				const value2 = value[index];

				if (typeof value2 === "object") {
					for (let property3 in value2) {
						// skip properties with the name "_id"
						if (property3 === "_id") continue;

						const value3 = value2[property3];

						if (Array.isArray(value3)) {
							for (let index2 = 0; index2 < value3.length; index2++) {
								const value4 = value3[index2];

								flattened[`${property}.${index}.${property3}.${index2}`] =
									value4;
							}
							continue;
						}

						flattened[`${property}.${index}.${property3}`] = value3;
					}
					continue;
				}
			}
			continue;
		}

		// if key is an object
		if (typeof value === "object") {
			for (let property2 in value) {
				// skip properties with the name "_id"
				if (property2 === "_id") continue;

				const value2 = value[property2];

				flattened[`${property}.${property2}`] = value2;
			}
			continue;
		}

		// if key is a value
		flattened[property] = value;
	}

	return flattened;
}

// function that parses a template from a cheerio document
export function parseTemplate(doc: CheerioAPI, link: string): TemplateType {
	let template: TemplateType = {
		link: link,
		fields: [],
		preview: "",
	};

	doc("[id]").each((index, element) => {
		// prepare new field
		let newField: TemplateType["fields"][0] = {
			id: "",
			length: 0,
			type: "unknown",
		};

		// get element id
		const elementId = doc(element).attr("id");

		newField.id = elementId as string;

		const elementLength = doc(element).attr("length");

		if (!elementLength) newField.length = 0;
		else newField.length = parseInt(elementLength);

		const elementType = doc(element).attr("type");

		if (
			elementType !== "string" &&
			elementType !== "number" &&
			elementType !== "boolean" &&
			elementType !== "picture"
		)
			newField.type = "unknown";
		else newField.type = elementType;

		// add new field to template
		template.fields.push(newField);
	});

	return template;
}

// function that compares a data object to a template
export function getCompatability(
	data: any,
	pictureLink: string,
	template: TemplateType,
) {
	const problems: {
		field: string;
		message: string;
	}[] = [];

	for (const field of template.fields) {
		// compare each property on the field to the data object
		if (data[field.id] === undefined && field.id !== "picture") {
			problems.push({
				field: field.id,
				message: `Template: field exists <=> UserData: not found`,
			});
			continue;
		}

		if (typeof data[field.id] !== field.type && field.id !== "picture") {
			problems.push({
				field: field.id,
				message: `Template: field type is ${
					field.type
				} <=> UserData: type is ${typeof data[field.id]}.`,
			});
			continue;
		}

		if (
			field.length !== 0 &&
			data[field.id].length > field.length &&
			field.id !== "picture"
		) {
			problems.push({
				field: field.id,
				message: `Template: field max length is ${
					field.length
				} <=> UserData: length is ${data[field.id].length}.`,
			});
			continue;
		}

		if (field.id === "picture") {
			if (!pictureLink) {
				problems.push({
					field: field.id,
					message: `Template: field exists <=> UserData: not found`,
				});
				continue;
			}
		}
	}

	return problems;
}
