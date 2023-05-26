import path from "path";
import puppeteer from "puppeteer";

export async function convertHTMLtoPDF()  {
	// launch a new browser with page
	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();

	// get the file path and go to it
	const filePath = path.resolve(__dirname, "cv.html");
	await page.goto(`file://${filePath}`, {
		waitUntil: "networkidle0",
	});

	// convert the page to pdf
	await page.pdf({ path: "output.pdf", format: "A4" });

	// close the browser
	await browser.close();
};
