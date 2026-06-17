import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import HttpStatus from 'http-status-codes';

import { FILE_NOT_FOUND } from '../constants';
import { FILE_RESOURCE_TYPE_IDS } from '../constants/lookup.constants';
import { AppError } from '../errors';
import { resolveFileResourceTypeId } from '../utils/lookup.utils';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/cloudinary.utils';

const prisma = new PrismaClient();

const formatFile = (record) => {
	if (!record) return record;
	const formatted = { ...record };
	if (formatted.file_resource_type) {
		formatted.resource_type = formatted.file_resource_type.code;
		delete formatted.file_resource_type;
	}
	return formatted;
};

export class FileService {
	constructor(req) {
		this.req = req;
	}

	async uploadFile() {
		const { file } = this.req;
		const { folder } = this.req.body;

		if (!file) {
			throw new AppError('No file provided', HttpStatus.BAD_REQUEST);
		}

		const uploadFolder = folder || process.env.CLOUDINARY_FOLDER || 'buildcode-pro';
		const cloudinaryResult = await uploadToCloudinary(file, uploadFolder);
		const resourceTypeId =
			(await resolveFileResourceTypeId(cloudinaryResult.resource_type || 'image')) ??
			FILE_RESOURCE_TYPE_IDS.IMAGE;

		const record = await prisma.files.create({
			data: {
				public_id: cloudinaryResult.public_id,
				url: cloudinaryResult.url,
				secure_url: cloudinaryResult.secure_url,
				resource_type_id: resourceTypeId,
				folder: uploadFolder,
				original_name: file.originalname,
				mime_type: file.mimetype,
				size: file.size,
				uploaded_by: this.req.user.id,
			},
		});

		if (fs.existsSync(file.path)) {
			fs.unlinkSync(file.path);
		}

		return formatFile(
			await prisma.files.findUnique({
				where: { id: record.id },
				include: { file_resource_type: true },
			}),
		);
	}

	async uploadMultiple() {
		const { files } = this.req;
		const { folder } = this.req.body;

		if (!files || files.length === 0) {
			throw new AppError('No files provided', HttpStatus.BAD_REQUEST);
		}

		const uploadFolder = folder || process.env.CLOUDINARY_FOLDER || 'buildcode-pro';
		const results = [];

		for (const file of files) {
			const cloudinaryResult = await uploadToCloudinary(file, uploadFolder);
			const resourceTypeId =
				(await resolveFileResourceTypeId(cloudinaryResult.resource_type || 'image')) ??
				FILE_RESOURCE_TYPE_IDS.IMAGE;

			const record = await prisma.files.create({
				data: {
					public_id: cloudinaryResult.public_id,
					url: cloudinaryResult.url,
					secure_url: cloudinaryResult.secure_url,
					resource_type_id: resourceTypeId,
					folder: uploadFolder,
					original_name: file.originalname,
					mime_type: file.mimetype,
					size: file.size,
					uploaded_by: this.req.user.id,
				},
			});

			if (fs.existsSync(file.path)) {
				fs.unlinkSync(file.path);
			}

			results.push(
				formatFile(
					await prisma.files.findUnique({
						where: { id: record.id },
						include: { file_resource_type: true },
					}),
				),
			);
		}

		return results;
	}

	async getFiles() {
		const { query } = this.req;
		let { page, limit } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 20;

		const where = { uploaded_by: this.req.user.id };

		const totalCount = await prisma.files.count({ where });
		const totalPages = Math.ceil(totalCount / limit);

		const records = (
			await prisma.files.findMany({
				where,
				skip: (page - 1) * limit,
				take: limit,
				orderBy: { created_at: 'desc' },
				include: { file_resource_type: true },
			})
		).map(formatFile);

		return { records, totalRecords: totalCount, totalPages, page, limit };
	}

	async getFile() {
		const { id } = this.req.params;

		const record = await prisma.files.findFirst({
			where: {
				id: parseInt(id, 10),
				uploaded_by: this.req.user.id,
			},
			include: { file_resource_type: true },
		});

		if (!record) {
			throw new AppError(FILE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return formatFile(record);
	}

	async deleteFile() {
		const { id } = this.req.params;

		const record = await prisma.files.findFirst({
			where: {
				id: parseInt(id, 10),
				uploaded_by: this.req.user.id,
			},
			include: { file_resource_type: true },
		});

		if (!record) {
			throw new AppError(FILE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		await deleteFromCloudinary({
			id: record.public_id,
			type: record.file_resource_type?.code || 'image',
		});

		await prisma.files.delete({ where: { id: record.id } });

		return { id: record.id };
	}
}
