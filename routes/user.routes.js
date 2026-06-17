import { Router } from 'express';

import {
	getAllUsers,
	getUser,
	createUser,
	updateUser,
	updateManyUser,
	deleteUser,
	deleteManyUser,
} from '../controllers';
import { validate, isAuth, hasPermission } from '../middlewares';
import { PERMISSIONS } from '../constants/permission.constants';
import {
	getUsersSchema,
	registerSchema,
	userIdSchema,
	updateUserSchema,
	deleteUsersSchema,
	updateManyUserSchema,
} from '../validations';

const router = Router();

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Users list
 */
router.get('/', isAuth, hasPermission(PERMISSIONS.USERS_READ), validate(getUsersSchema), getAllUsers);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', isAuth, hasPermission(PERMISSIONS.USERS_READ), validate(userIdSchema), getUser);

/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     tags: [Users]
 *     summary: Create user
 *     security:
 *       - bearerAuth: []
 */
router.post('/', isAuth, hasPermission(PERMISSIONS.USERS_CREATE), validate(registerSchema), createUser);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', isAuth, hasPermission(PERMISSIONS.USERS_UPDATE), validate(updateUserSchema), updateUser);

router.put('/', isAuth, hasPermission(PERMISSIONS.USERS_UPDATE), validate(updateManyUserSchema), updateManyUser);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', isAuth, hasPermission(PERMISSIONS.USERS_DELETE), validate(userIdSchema), deleteUser);

router.delete('/', isAuth, hasPermission(PERMISSIONS.USERS_DELETE), validate(deleteUsersSchema), deleteManyUser);

export const UserRoutes = router;
