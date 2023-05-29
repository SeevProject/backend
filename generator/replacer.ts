import { CheerioAPI } from "cheerio";

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
	doc("[id]").each((_, element) => {
		const elementId = doc(element).attr("id");
		if (!elementId) return;

		const elementValue = data[elementId];
		if (!elementValue) return;

		doc(element).text(elementValue);
	});
}
