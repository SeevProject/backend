import { load } from "cheerio";
import { readFileSync } from "fs";
import { convertHTMLtoPDF } from "../converter";
import { firebaseStorage } from "../../utils/firebase";
import { insertData } from "../inserter";
import { flattenObject, getCompatability, parseTemplate } from "../parser";
import { userData } from "./data";

export async function generateCV(
	data: any,
	templatePath: string,
	// outputPath: string,
) {
	// init

	const fileString = readFileSync(templatePath).toString();

	const document = load(fileString);

	// parser

	let template = parseTemplate(document, templatePath);

	console.log(template);

	let flattenedData = flattenObject(data);

	let problems = getCompatability(flattenedData, template);

	console.log(problems);

	// inserter

	insertData(document, flattenObject(data));

	// converter
}

generateCV(userData, __dirname + "/cv.html");
