import { PrismaClient } from '@prisma/client';

import { USER_STATUS_IDS } from '../constants/lookup.constants';

const prisma = new PrismaClient();

export async function resolveUserStatusId(code) {
	if (!code) return null;
	const record = await prisma.user_statuses.findUnique({ where: { code } });
	return record?.id ?? USER_STATUS_IDS[code] ?? null;
}

export async function resolveFileResourceTypeId(code) {
	if (!code) return null;
	const record = await prisma.file_resource_types.findUnique({ where: { code } });
	return record?.id ?? null;
}

export function formatUserProfile(user) {
	if (!user) return user;

	const record = { ...user };

	if (record.user_status) {
		record.status = record.user_status.code;
		delete record.user_status;
	}

	delete record.status_id;

	if (record.password) delete record.password;
	if (record.remember_token) delete record.remember_token;

	return record;
}
