import { Router } from 'express';

import {
	getAllRoles,
	getRole,
	createRole,
	updateRole,
	deleteRole,
	deleteManyRole,
} from '../controllers';
import { validate, isAuth, hasPermission } from '../middlewares';
import { PERMISSIONS } from '../constants/permission.constants';
import {
	getRoleSchema,
	addRoleSchema,
	RoleIdSchema,
	updateRoleSchema,
	deleteRolesSchema,
} from '../validations';

const router = Router();

/**
 * @swagger
 * /api/v1/role:
 *   get:
 *     tags: [Roles]
 *     summary: Get all roles
 *     security:
 *       - bearerAuth: []
 */
router.get('/', isAuth, hasPermission(PERMISSIONS.ROLES_READ), validate(getRoleSchema), getAllRoles);

/**
 * @swagger
 * /api/v1/role/{id}:
 *   get:
 *     tags: [Roles]
 *     summary: Get role by ID
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', isAuth, hasPermission(PERMISSIONS.ROLES_READ), validate(RoleIdSchema), getRole);

/**
 * @swagger
 * /api/v1/role:
 *   post:
 *     tags: [Roles]
 *     summary: Create role
 *     security:
 *       - bearerAuth: []
 */
router.post('/', isAuth, hasPermission(PERMISSIONS.ROLES_CREATE), validate(addRoleSchema), createRole);

/**
 * @swagger
 * /api/v1/role/{id}:
 *   put:
 *     tags: [Roles]
 *     summary: Update role
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', isAuth, hasPermission(PERMISSIONS.ROLES_UPDATE), validate(updateRoleSchema), updateRole);

router.delete('/:id', isAuth, hasPermission(PERMISSIONS.ROLES_DELETE), validate(RoleIdSchema), deleteRole);

router.delete('/', isAuth, hasPermission(PERMISSIONS.ROLES_DELETE), validate(deleteRolesSchema), deleteManyRole);

export const RoleRoutes = router;
