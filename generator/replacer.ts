import { CheerioAPI } from "cheerio";
import { log } from "console";

export function handleRepeats(doc: CheerioAPI) {
	// go through all elements with repeat attribute
	const elementsWithRepeat = doc("[repeat]");
	elementsWithRepeat.each((_, repeatElement) => {
		// get number of repeats
		const repeatValue = parseInt(doc(repeatElement).attr("repeat") || "0");

		// remove the repeat attribute
		doc(repeatElement).removeAttr("repeat");

		// according to repeatValue, make copies and append as siblings
		for (let index = 1; index < repeatValue; index += 1) {
			const newElement = doc(repeatElement).clone();

			// get the id of the new element
			const elementId = doc(newElement).attr("id");

			// if there is an id and it contains a 0, replace it with the index
			if (elementId && elementId.includes("0")) {
				doc(newElement).attr("id", elementId.replace("0", index.toString()));
			}
			// else any of the children that have an id contain a 0, replace it with the index
			else {
				doc(newElement)
					.children("[id]")
					.each((_, child) => {
						const childId = doc(child).attr("id");
						if (!childId) return;
						if (childId.includes("0")) {
							doc(child).attr("id", childId.replace("0", index.toString()));
						}
					});
			}

			doc(repeatElement).after(newElement);
		}
	});
}

export function insertData(doc: CheerioAPI, data: any) {
	let problems: string[] = [];

	doc("[id]").each((_, element) => {
		// get element id
		const elementId = doc(element).attr("id");
		if (!elementId) return;

		// get the value to insert at the id
		let dataValue = data[elementId];
		if (!dataValue) return;

		// compare lengths

		const elementLength = doc(element).attr("length");
		if (elementLength) {
			const elementLengthValue = parseInt(elementLength);

			if (dataValue.length > elementLengthValue) {
				problems.push(
					`${dataValue} is ${dataValue.length} characters long. But no more than ${elementLength} is accepted on ${elementId}`,
				);
				dataValue = dataValue.substring(0, elementLengthValue);
			}
		}

		// compare type

		const elementType = doc(element).attr("type");

		if (elementType) {
			if (elementType == "string" && typeof dataValue !== "string") {
				problems.push(
					`${dataValue} is not a string. But a string is expected on ${elementId}`,
				);
			} else if (elementType == "number") {
				const dataValueNumber = parseInt(dataValue);
				if (isNaN(dataValueNumber)) {
					problems.push(
						`${dataValue} is not a number. But a number is expected on ${elementId}`,
					);
				} else {
					dataValue = dataValueNumber;
				}
			}
		}

		// insert the data

		log(`Inserting ${dataValue} into ${elementId}`);

		doc(element).text(dataValue);
	});

	console.log(problems);

	return problems;
}
