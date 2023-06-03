import { readFile, rm } from "fs/promises";
import { insertData } from "../generator/inserter";
import {
	flattenObject,
	getCompatability,
	parseTemplate,
} from "../generator/parser";
import { templateModel } from "../models/template.model";
import { userAccountModel } from "../models/userAccount.model";
import { isError, result } from "../utils/error";
import { firebaseStorage } from "../utils/firebase";
import { RequestExt, ResponseExt } from "../utils/types";
import { load } from "cheerio";
import { convertHTMLtoPDF } from "../generator/converter";
import { uid } from "uid";
import path from "path";

export async function getAllTemplates(req: RequestExt, res: ResponseExt) {
	const template = await result(templateModel.find());

	if (isError(template))
		return res
			.status(404)
			.json({ status: "error", message: "Could not return templates " });

	return res.status(200).json({ status: "sucsess", data: template });
}

export async function addTemplate(req: RequestExt, res: ResponseExt) {
	if (!req.files)
		return res.status(400).json({ status: "Could not find submitted file" });

	// get file from request
	const reqFile = req.files.template;

	if (Array.isArray(reqFile))
		return res.status(400).json({ status: "Submit only one file" });

	const firebaseLink = `templates/${uid(18)}.html`;

	// upload file to firebase
	const uploadResult = await result(
		firebaseStorage.upload(reqFile.tempFilePath, {
			destination: firebaseLink,
		}),
	);

	if (isError(uploadResult))
		return res.status(404).json({
			status: "error",
			message: "Could not upload request file to firebase",
		});

	// read request's file from the file system
	const templateReadFileResult = await result(readFile(reqFile.tempFilePath));

	if (isError(templateReadFileResult))
		return res.status(404).json({
			status: "error",
			message: "Could not read request file from filesystem",
		});

	const templateFile = templateReadFileResult.toString();

	// load template file into cheerio document
	const templateFileAsDocument = load(templateFile);

	// parse data in template file and get template object
	const template = parseTemplate(templateFileAsDocument, firebaseLink);

	// add template object to to db
	const createResult = await result(templateModel.create(template));

	if (isError(createResult))
		return res.status(404).json({
			status: "error",
			message: "Could not add template to db",
			data: createResult.message,
		});

	// reply with success
	return res
		.status(200)
		.json({ status: "Added template to db", data: createResult });
}

export async function updateTemplate(req: RequestExt, res: ResponseExt) {
	const templateId = req.params.templateId;

	// try to find template in db using id
	const findResult = templateModel.findById(templateId);

	if (isError(findResult))
		return res.status(404).json({
			status: "error",
			message: "Could not find specified template in db",
		});

	// see if template is attached
	if (!req.files)
		return res.status(400).json({ status: "Could not find submitted file" });

	// get file from request
	const reqFile = req.files.template;

	if (Array.isArray(reqFile))
		return res.status(400).json({ status: "Submit only one file" });

	const firebaseLink = `templates/${uid(18)}.html`;

	// upload file to firebase
	const uploadResult = await result(
		firebaseStorage.upload(reqFile.tempFilePath, {
			destination: firebaseLink,
		}),
	);

	if (isError(uploadResult))
		return res.status(404).json({
			status: "error",
			message: "Could not upload request file to firebase",
		});

	// read request's file from the file system
	const templateReadFileResult = await result(readFile(reqFile.tempFilePath));

	if (isError(templateReadFileResult))
		return res.status(404).json({
			status: "error",
			message: "Could not read request file from filesystem",
		});

	const templateFile = templateReadFileResult.toString();

	// load template file into cheerio document
	const templateFileAsDocument = load(templateFile);

	// parse data in template file and get template object
	const template = parseTemplate(templateFileAsDocument, firebaseLink);

	// add template object to to db
	const updateResult = await result(
		templateModel.updateOne({ _id: templateId }, template),
	);

	if (isError(updateResult))
		return res.status(404).json({
			status: "error",
			message: "Could not add template to db",
		});

	// reply with success
	return res
		.status(200)
		.json({ status: "Updated template in db", data: updateResult });
}

export async function deleteTemplate(req: RequestExt, res: ResponseExt) {
	const templateId = req.params.id;

	// get template data
	const templateData = await result(templateModel.findOne({ _id: templateId }));

	if (isError(templateData))
		return res
			.status(404)
			.json({ status: "error", message: "Could not perform search to delete" });

	if (!templateData)
		return res
			.status(404)
			.json({ status: "error", message: "Could not find template to delete" });

	// if a file is attached to a template
	if (templateData.link) {
		// delete template file from firebase
		const deleteResult = await result(
			firebaseStorage.file(templateData.link).delete(),
		);

		if (isError(deleteResult))
			return res.status(404).json({
				status: "error",
				message: "Could not delete template file from firebase",
			});
	}

	const deleteResult = await result(
		templateModel.deleteOne({ _id: templateId }),
	);

	if (isError(deleteResult))
		return res
			.status(404)
			.json({ status: "error", message: "Could not update template data" });

	return res.status(200).json({
		status: "sucsess",
		message: "template deleted from db and firebase files",
	});
}

export async function generateFromTemplate(req: RequestExt, res: ResponseExt) {
	// SECTION: get template data from db

	const templateId = req.params.id;

	// get template data from db
	const templateData = await result(templateModel.findOne({ _id: templateId }));

	if (isError(templateData))
		return res
			.status(404)
			.json({ status: "error", message: "Could not find template" });

	if (!templateData)
		return res
			.status(404)
			.json({ status: "error", message: "Could not find template" });

	// SECTION: get user data from db

	const user = await result(userAccountModel.findOne({ uid: req.session.uid }));

	if (isError(user))
		return res
			.status(404)
			.json({ status: "error", message: "Could not look for user in db" });

	if (!user)
		return res
			.status(404)
			.json({ status: "error", message: "Could not find user in db" });

	// SECTION: compare template data with user data
	const flattenedData = flattenObject(user.toObject().data);

	const problems = getCompatability(flattenedData, user.picture, templateData);

	if (problems.length > 0)
		return res.status(400).json({
			status: "error",
			message: "User data and template are not compatible",
			data: problems,
		});

	// SECTION: get template file from firebase storage

	// get template path from db
	const templatePath = templateData.link;

	// create file refrence
	const templateFile = firebaseStorage.file(templatePath);

	// check if file exists
	const fileExists = await result(templateFile.exists());

	if (isError(fileExists))
		return res.status(404).json({
			status: "error",
			message: "Could not use link to search for file in storage",
		});

	if (!fileExists[0])
		return res
			.status(404)
			.json({ status: "error", message: "Could not find file in storage" });

	// download file
	const downloadResult = await result(templateFile.download());

	if (isError(downloadResult))
		return res.status(404).json({
			status: "error",
			message: "Could not download file from storage" + downloadResult.message,
		});

	const file = downloadResult[0];

	// SECTION: insert data into template and convert to pdf

	// read file as string for cheerio
	const templateAsDocument = load(file.toString());

	// insert data into template
	insertData(templateAsDocument, flattenedData, user.picture);

	const fileName = uid(18);
	const localLink = path.join(__dirname, "..", `tmp/${fileName}.pdf`);
	const firebaseLink = `cv/${fileName}.pdf`;

	// convert to pdf
	await convertHTMLtoPDF(templateAsDocument.html(), localLink);

	// SECTION: upload pdf and add link to user data

	// upload pdf
	const uploadResult = await result(
		firebaseStorage.upload(localLink, {
			destination: firebaseLink,
		}),
	);

	if (isError(uploadResult))
		return res
			.status(404)
			.json({ status: "error", message: "Could not upload pdf" });

	// add link to user data in cv links
	const userUpdateResult = await result(
		userAccountModel.updateOne(
			{ uid: req.session.uid },
			{ $push: { cvlist: firebaseLink } },
			{ new: true },
		),
	);

	if (isError(userUpdateResult))
		return res
			.status(404)
			.json({ status: "error", message: "Could not update user data" });

	// delete template file from tmp
	const deleteResult = await result(rm(localLink));

	if (isError(deleteResult))
		return res.status(200).json({
			message: "Successfully generated CV but could not delete file from tmp",
		});

	// return successfull response
	return res.status(200).json({ message: "Successfully generated cv" });
}
