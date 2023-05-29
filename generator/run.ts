import { load } from "cheerio";
import { readFileSync } from "fs";
import path from "path";
import { handleRepeats, insertData } from "./replacer";
import { flattenObject } from "./utils";
import { userData } from "./example/data";
import { convertHTMLtoPDF } from "./converter";

export async function runGenerator(
	data: any,
	templatePath: string,
	outputPath: string,
) {
	const fileString = readFileSync(templatePath, "utf8");

	const document = load(fileString);

	handleRepeats(document);

	const problems = insertData(document, flattenObject(data));

	console.log(problems);

	const modifiedHtml = document.html();

	await convertHTMLtoPDF(modifiedHtml, outputPath);
}

runGenerator(
	userData,
	path.join(__dirname, "./example/cv.html"),
	path.join(__dirname, "./example/output.pdf"),
);
