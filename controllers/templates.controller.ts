import { readFile, rm } from 'fs/promises';
import { insertData } from '../generator/inserter';
import {
	flattenObject,
	getCompatability,
	parseTemplate,
} from '../generator/parser';
import { templateModel } from '../models/template.model';
import { userAccountModel } from '../models/userAccount.model';
import { isError, result } from '../utils/error';
import { firebaseStorage } from '../utils/firebase';
import { RequestExt, ResponseExt } from '../utils/types';
import { load } from 'cheerio';
import { convertHTMLtoPDF } from '../generator/converter';
import { uid } from 'uid';
import path from 'path';
import { failResponse, successResponse } from '../utils/response';

export async function getAllTemplates(req: RequestExt, res: ResponseExt) {
	const templateResult = await result(templateModel.find());

	if (isError(templateResult))
		return failResponse(res, 404, 'Failed to return templates', templateResult);

	return successResponse(
		res,
		200,
		'Succeded in returning templates',
		templateResult,
	);
}

export async function addTemplate(req: RequestExt, res: ResponseExt) {
	if (!req.files)
		return failResponse(res, 400, 'Failed to find submitted file');

	// get file from request
	const reqFile = req.files.template;

	if (Array.isArray(reqFile))
		return failResponse(res, 400, 'Failed to find submitted file');

	const firebaseLink = `templates/${uid(18)}.html`;

	// upload file to firebase
	const uploadResult = await result(
		firebaseStorage.upload(reqFile.tempFilePath, {
			destination: firebaseLink,
		}),
	);

	if (isError(uploadResult))
		return failResponse(
			res,
			500,
			'Failed to upload submitted file',
			uploadResult,
		);

	// read request's file from the file system
	const templateReadFileResult = await result(readFile(reqFile.tempFilePath));

	if (isError(templateReadFileResult))
		return failResponse(
			res,
			404,
			'Failed to read submitted file',
			templateReadFileResult,
		);

	const templateFile = templateReadFileResult.toString();

	// load template file into cheerio document
	const templateFileAsDocument = load(templateFile);

	// parse data in template file and get template object
	const template = parseTemplate(templateFileAsDocument, firebaseLink);

	// add template object to to db
	const createResult = await result(templateModel.create(template));

	if (isError(createResult))
		return failResponse(
			res,
			404,
			'Failed to add template to database',
			createResult,
		);

	// reply with success
	return successResponse(
		res,
		200,
		'Succeded in adding template to database',
		createResult,
	);
}

export async function updateTemplate(req: RequestExt, res: ResponseExt) {
	const templateId = req.params.templateId;

	// try to find template in db using id
	const findResult = templateModel.findById(templateId);

	if (isError(findResult))
		return failResponse(
			res,
			404,
			'Failed to find specified template in db',
			findResult,
		);

	// see if template is attached
	if (!req.files)
		return failResponse(res, 400, 'Failed to find submitted file');

	// get file from request
	const reqFile = req.files.template;

	if (Array.isArray(reqFile))
		return failResponse(res, 400, 'Failed to find submitted file');

	const firebaseLink = `templates/${uid(18)}.html`;

	// upload file to firebase
	const uploadResult = await result(
		firebaseStorage.upload(reqFile.tempFilePath, {
			destination: firebaseLink,
		}),
	);

	if (isError(uploadResult))
		return failResponse(
			res,
			404,
			'Failed to upload submitted file',
			uploadResult,
		);

	// read request's file from the file system
	const templateReadFileResult = await result(readFile(reqFile.tempFilePath));

	if (isError(templateReadFileResult))
		return failResponse(
			res,
			404,
			'Failed to read submitted file',
			templateReadFileResult,
		);

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
		return failResponse(
			res,
			404,
			'Failed to update template in db',
			updateResult,
		);

	// reply with success
	return successResponse(
		res,
		200,
		'Succeded in updating template in db',
		updateResult,
	);
}

export async function deleteTemplate(req: RequestExt, res: ResponseExt) {
	const templateId = req.params.id;

	// get template data
	const templateData = await result(templateModel.findOne({ _id: templateId }));

	if (isError(templateData))
		return failResponse(res, 404, 'Could not perform search to delete');

	if (!templateData)
		return failResponse(res, 404, 'Could not find template to delete');

	// if a file is attached to a template
	if (templateData.link) {
		// delete template file from firebase
		const deleteResult = await result(
			firebaseStorage.file(templateData.link).delete(),
		);

		if (isError(deleteResult))
			return failResponse(
				res,
				404,
				'Could not delete template file from firebase',
			);
	}
	const deleteResult = await result(
		templateModel.deleteOne({ _id: templateId }),
	);

	if (isError(deleteResult))
		return failResponse(res, 404, 'Could not update template data');

	return successResponse(
		res,
		200,
		'template deleted from db and firebase files',
		templateData,
	);
}

export async function generateFromTemplate(req: RequestExt, res: ResponseExt) {
	// SECTION: get template data from db

	const templateId = req.params.id;

	// get template data from db
	const templateData = await result(templateModel.findOne({ _id: templateId }));

	if (isError(templateData))
			 return failResponse(res, 404, 'Could not find template');

	if (!templateData)
	     return failResponse(res, 404, 'Could not find template');

	// SECTION: get user data from db

	const user = await result(userAccountModel.findOne({ uid: req.session.uid }));

	if (isError(user))
		 return failResponse(res, 404, 'Could not look for user in db');

	if (!user)
		return failResponse(res, 404, 'Could not find user in db');

	// SECTION: compare template data with user data
	const flattenedData = flattenObject(user.toObject().data);

	const problems = getCompatability(flattenedData, user.picture, templateData);

	if (problems.length > 0)
		return failResponse(
			res,
			400,
			'User data and template are not compatible',
			// problems
		);

	// SECTION: get template file from firebase storage

	// get template path from db
	const templatePath = templateData.link;

	// create file refrence
	const templateFile = firebaseStorage.file(templatePath);

	// check if file exists
	const fileExists = await result(templateFile.exists());

	if (isError(fileExists))
		return failResponse(
			res,
			404,
			'Could not use link to search for file in storage',
		);
	if (!fileExists[0])
		return failResponse(res, 404, 'Could not find file in storage');

	// download file
	const downloadResult = await result(templateFile.download());

	if (isError(downloadResult))
		return failResponse(
			res,
			404,
			`Could not download file from storage ${downloadResult.message}`,
		);

	const fileBuffer = downloadResult[0];

	// SECTION: insert data into template and convert to pdf

	// get user picture from firebase
	const pictureFile = firebaseStorage.file(user.picture);

	// make file publicly available
	const makePublicResult = await result(pictureFile.makePublic());

	if (isError(makePublicResult))
		return failResponse(res, 404, 'Could not make user picture public');

	// get public link
	const picturePublicLink = pictureFile.publicUrl();

	console.log(picturePublicLink);

	// read file as string for cheerio
	const templateAsDocument = load(fileBuffer.toString());

	// insert data and picture link into template
	insertData(templateAsDocument, flattenedData, picturePublicLink);

	const fileName = uid(18);
	const localLink = path.join(__dirname, '..', `tmp/${fileName}.pdf`);
	const firebaseLink = `cv/${fileName}.pdf`;

	// convert to pdf
	await convertHTMLtoPDF(templateAsDocument.html(), localLink);

	// make picture private again
	const makePrivateResult = await result(pictureFile.makePrivate());

	if (isError(makePrivateResult))
		return failResponse(res, 404, 'Could not make user picture private');

	// SECTION: upload pdf and add link to user data

	// upload pdf
	const uploadResult = await result(
		firebaseStorage.upload(localLink, {
			destination: firebaseLink,
		}),
	);

	if (isError(uploadResult))
		return failResponse(res, 404, 'Could not upload pdf');

	// add link to user data in cv links
	const userUpdateResult = await result(
		userAccountModel.updateOne(
			{ uid: req.session.uid },
			{ $push: { cvlist: firebaseLink } },
			{ new: true },
		),
	);

	if (isError(userUpdateResult))
		return failResponse(res, 404, 'Could not update user data');

	// delete template file from tmp
	const deleteResult = await result(rm(localLink));

	if (isError(deleteResult))
		return failResponse(
			res,
			404,
			'Successfully generated CV but could not delete file from tmp',
		);
	// return successfull response
	return successResponse(res, 200, 'Successfully generated cv', templateData);
}
