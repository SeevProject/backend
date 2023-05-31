import { load } from "cheerio";
import { readFileSync } from "fs";
import { convertHTMLtoPDF } from "./converter";
import { firebaseStorage } from "../utils/firebase";
import { insertData } from "./inserter";
import { flattenObject, getCompatability, parseTemplate } from "./parser";

export async function generateCV(
	data: any,
	templatePath: string,
	downloadPath: string,
	outputPath: string,
) {
	firebaseStorage.file(templatePath).download({
		destination: downloadPath,
	});
	// init

	const fileString = readFileSync(downloadPath).toString();

	const document = load(fileString);

	// parser

	let template = parseTemplate(document, templatePath);
	let flattenedData = flattenObject(data);

	let problems = getCompatability(flattenedData, template);

	console.log(problems);

	// inserter

	insertData(document, flattenObject(data));

	// converter

	await convertHTMLtoPDF(document.html(), outputPath);
}
