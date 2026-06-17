import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import HttpStatus from 'http-status-codes';

import { USER_NOT_FOUND } from '../constants';
import { USER_STATUS_IDS } from '../constants/lookup.constants';
import { AppError } from '../errors';
import { generateRandomString } from '../utils';
import { formatUserProfile, resolveUserStatusId } from '../utils/lookup.utils';

const prisma = new PrismaClient();

export class UserService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllUsers() {
		const { query } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 100000;

		const options = {
			where: {
				deleted: false,
			},
		};
		if (search.status) {
			const statusId = await resolveUserStatusId(search.status);
			if (statusId) {
				search.status_id = statusId;
			}
			delete search.status;
		}

		if (search) {
			options.where.AND = Object.keys(search).map(key => {
				if(!isNaN(search[key]) && !isNaN(parseFloat(search[key]))) {
					return { [key]: { equals: search[key] } };
				}
				return { [key]: { contains: search[key] } };
			});
		}
		if (sort) {
			const [field, direction] = sort.split(':');
			options.orderBy = [
				{
					[field]: direction,
				},
			];
		}

		const totalCount = await prisma.users.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;
		options.select = {
			id: true,
			name: true,
			email: true,
			image: true,
			status_id: true,
			deleted: true,
			created_at: true,
			updated_at: true,
			user_status: { select: { code: true, name: true } },
		};

		const allRecords = (await prisma.users.findMany(options)).map(formatUserProfile);

		// if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
		// 	throw new AppError(USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getUser() {
		const { id } = this.req.params;
		const record = await prisma.users.findUnique({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			include: { user_status: true },
		});
		return this.publicProfile(record);
	}

	async createUser() {
		const { body, user } = this.req;
		let { password } = body;

		const birthDate = body.birth_date;

		if (!password) {
			password = generateRandomString(6, 20);
		}

		body.password = await bcrypt.hash(password, 12);
		if (birthDate) {
			body.birth_date = new Date(`${birthDate}T00:00:00.000Z`);
		}
		body.status_id = USER_STATUS_IDS.ACTIVE;
		delete body.status;

		body.created_by = user.id;

		const newUser = await prisma.users.create({
			data: body,
			include: { user_status: true },
		});

		return this.publicProfile(newUser);
	}

	async updateUser() {
		const { id } = this.req.params;
		const { body } = this.req;

		if (body.status) {
			body.status_id = await resolveUserStatusId(body.status);
			delete body.status;
		}

		const updateRecord = await prisma.users.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: body,
			include: { user_status: true },
		});

		return this.publicProfile(updateRecord);
	}

	async updateManyUser() {
		const { ids, status } = this.req.body;
		const statusId = await resolveUserStatusId(status);

		const updateRecord = await prisma.users.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data: {
				status_id: statusId,
			},
		});

		return updateRecord;
	}

	async deleteUser() {
		const { id } = this.req.params;

		await prisma.users.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				deleted: true,
			},
		});

		return null;
	}

	async deleteManyUser() {
		const { ids } = this.req.body;

		await prisma.users.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data: {
				deleted: true,
			},
		});

		return null;
	}

	/* eslint-disable-next-line class-methods-use-this */
	publicProfile(user) {
		if (!user || !user.id)
			throw new AppError(USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		return formatUserProfile(user);
	}
}
