import { load } from "cheerio";
import { readFileSync } from "fs";
import { convertHTMLtoPDF } from "../converter";
import { insertData } from "../inserter";
import { flattenObject, getCompatability, parseTemplate } from "../parser";
import { userData } from "./data";

export async function generateCV(
	data: any,
	pictureLink: string,
	templatePath: string,
) {
	// init

	const fileString = readFileSync(templatePath).toString();

	const document = load(fileString);

	// parser

	let template = parseTemplate(document, templatePath);

	console.log(template);

	let flattenedData = flattenObject(data);

	let problems = getCompatability(flattenedData, pictureLink, template);

	console.log(problems);

	// inserter

	insertData(document, flattenObject(data), pictureLink);

	// converter

	const pdf = await convertHTMLtoPDF(document.html(), __dirname + "/cv.pdf");
}

generateCV(userData, __dirname + "/profile.jpg", __dirname + "/cv.html");
