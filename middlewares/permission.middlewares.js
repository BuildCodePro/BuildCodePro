import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { NOT_ENOUGH_RIGHTS } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export const hasPermission = (...requiredPermissions) => {
	return async (req, res, next) => {
		try {
			const user = await prisma.users.findUnique({
				where: { id: req.user.id, deleted: false },
				include: {
					role: {
						include: {
							permissions: {
								include: { permission: true },
							},
						},
					},
				},
			});

			if (!user?.role) {
				throw new AppError(NOT_ENOUGH_RIGHTS, HttpStatus.FORBIDDEN);
			}

			const userPermissions = user.role.permissions.map(
				rp => rp.permission.name,
			);

			const hasAccess = requiredPermissions.some(p =>
				userPermissions.includes(p),
			);

			if (!hasAccess) {
				throw new AppError(NOT_ENOUGH_RIGHTS, HttpStatus.FORBIDDEN);
			}

			req.userPermissions = userPermissions;
			next();
		} catch (error) {
			next(error);
		}
	};
};

export const hasRole = (...roleNames) => {
	return async (req, res, next) => {
		try {
			const user = await prisma.users.findUnique({
				where: { id: req.user.id, deleted: false },
				include: { role: true },
			});

			if (!user?.role || !roleNames.includes(user.role.name)) {
				throw new AppError(NOT_ENOUGH_RIGHTS, HttpStatus.FORBIDDEN);
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};
