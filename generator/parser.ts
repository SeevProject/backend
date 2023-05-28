import { readFileSync } from "fs";

type Field = {
	exact: string;
	properties: { key: string; value: string }[];
};

export type Template = {
	name: string;
	fields: Field[];
};

export function parseTemplateFromFile(
	templateName: string,
	filePath: string,
): Template {
	// read the file
	const fileBuffer = readFileSync(filePath);

	// parse the fields
	const parsedFields = parseFields(fileBuffer.toString());

	// put together the template
	const template = {
		name: templateName,
		fields: parsedFields,
	};

	return template;
}

export function parseFields(fileString: string): Field[] {
	// the list of extracted fields (bare)
	let fields: Field[] = [];

	// the previous five characters iterated over
	let previousFive: string[] = [];

	// postitions of field start and end
	let startIndex = -1;
	let endIndex = -1;

	// current index
	let index = 0;

	// for each character in the file
	for (const char of fileString) {
		// detect start and end tags
		if (previousFive.join("") === "<!--$") startIndex = index - 5;
		if (previousFive.join("") === "$$-->") endIndex = index;

		// if found a start and an end
		if (startIndex > -1 && endIndex > -1) {
			// get the field using range and map it
			const fieldRange = fileString.slice(startIndex, endIndex);
			const field = mapField(fieldRange);

			// add to fields
			fields.push(field);

			// reset index
			startIndex = -1;
			endIndex = -1;
		}

		// remove the first character if has 5 characters or more
		if (previousFive.length >= 5) previousFive.shift();

		// at end add current character into the previous four characters
		previousFive.push(char);

		// add to index
		index += 1;
	}

	// return the fields
	return fields;
}

export function mapField(fieldRange: string): Field {
	// clean the field
	let cleanedField = fieldRange
		// remove start and end tags
		.replace(/<!--\$/g, "")
		.replace(/\$\$-->/g, "")
		// remove new lines, tabs and spaces
		.replace(/\n/g, "")
		.replace(/\t/g, "")
		.replace(/ /g, "");

	// split the field into properties
	let properties = cleanedField
		.replace(/##/g, "#")
		.split("#")
		.filter((prop) => prop !== "");

	// map the properties into key value pairs
	let parsedProperties = properties.map((property) => {
		let [key, value] = property.split("=");

		return { key, value };
	});

	// return the field
	return {
		exact: fieldRange,
		properties: parsedProperties,
	};
}
