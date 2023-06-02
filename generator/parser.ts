import { CheerioAPI } from "cheerio";
import { TemplateType } from "../models/template.model";

// function that flattens an object to a single level
// turns { a: { b: { c: 1 } } } into { a.b.c: 1 }
export function flattenObject(obj: any) {
	const flattenedObject: any = {};

	function flatten(obj: any, prefix: string) {
		Object.keys(obj).forEach((key) => {
			const value = obj[key];

			if (typeof value === "object") {
				flatten(value, `${prefix}${key}.`);
			} else {
				flattenedObject[`${prefix}${key}`] = value;
			}
		});
	}

	flatten(obj, "");

	return flattenedObject;
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

		if (elementType !== "string" && elementType !== "number")
			newField.type = "unknown";
		else newField.type = elementType;

		// add new field to template
		template.fields.push(newField);
	});

	return template;
}

// function that compares a data object to a template
export function getCompatability(data: any, template: TemplateType) {
	const problems: {
		field: string;
		message: string;
	}[] = [];

	for (const field of template.fields) {
		// compare each property on the field to the data object
		if (data[field.id] === undefined) {
			problems.push({
				field: field.id,
				message: `Field ${field.id} is missing from data`,
			});
			continue;
		}

		if (typeof data[field.id] !== field.type) {
			problems.push({
				field: field.id,
				message: `Field ${field.id} is of type ${typeof data[
					field.id
				]} but should be of type ${field.type}`,
			});
			continue;
		}

		if (field.length !== 0 && data[field.id].length > field.length) {
			problems.push({
				field: field.id,
				message: `Field ${field.id} has a length of ${
					data[field.id].length
				} but should have a length of ${field.length}`,
			});
			continue;
		}
	}

	return problems;
}
