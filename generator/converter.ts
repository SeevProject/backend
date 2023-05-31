import puppeteer from "puppeteer";

export async function convertHTMLtoPDF(htmlString: string, outputPath: string) {
	// launch browser with page
	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();

	// set the page content to the html string
	await page.setContent(htmlString, {
		waitUntil: "networkidle0",
	});

	await page.evaluateHandle("document.fonts.ready");

	// convert the page to pdf and save it to the output path
	await page.pdf({ path: outputPath, format: "A4" });

	// close the browser
	await browser.close();
}
