import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	FILE_DELETE_SUCCESS,
	FILE_UPLOAD_SUCCESS,
	GET_FILES_SUCCESS,
} from '../constants';
import { FileService } from '../services/file.services';
import { successResponse } from '../utils';

export const uploadFile = asyncHandler(async (req, res) => {
	const fileService = new FileService(req);
	const data = await fileService.uploadFile();
	return successResponse(res, HttpStatus.CREATED, FILE_UPLOAD_SUCCESS, data);
});

export const uploadMultipleFiles = asyncHandler(async (req, res) => {
	const fileService = new FileService(req);
	const data = await fileService.uploadMultiple();
	return successResponse(res, HttpStatus.CREATED, FILE_UPLOAD_SUCCESS, data);
});

export const getFiles = asyncHandler(async (req, res) => {
	const fileService = new FileService(req);
	const data = await fileService.getFiles();
	return successResponse(res, HttpStatus.OK, GET_FILES_SUCCESS, data);
});

export const getFile = asyncHandler(async (req, res) => {
	const fileService = new FileService(req);
	const data = await fileService.getFile();
	return successResponse(res, HttpStatus.OK, GET_FILES_SUCCESS, data);
});

export const deleteFile = asyncHandler(async (req, res) => {
	const fileService = new FileService(req);
	const data = await fileService.deleteFile();
	return successResponse(res, HttpStatus.OK, FILE_DELETE_SUCCESS, data);
});
