import { PrismaClient } from '@prisma/client';

import { PERMISSIONS, PERMISSION_MODULES } from '../constants/permission.constants';

const prisma = new PrismaClient();

const permissions = [
	{ name: PERMISSIONS.USERS_READ, module: PERMISSION_MODULES.USERS, description: 'View users' },
	{ name: PERMISSIONS.USERS_CREATE, module: PERMISSION_MODULES.USERS, description: 'Create users' },
	{ name: PERMISSIONS.USERS_UPDATE, module: PERMISSION_MODULES.USERS, description: 'Update users' },
	{ name: PERMISSIONS.USERS_DELETE, module: PERMISSION_MODULES.USERS, description: 'Delete users' },
	{ name: PERMISSIONS.ROLES_READ, module: PERMISSION_MODULES.ROLES, description: 'View roles' },
	{ name: PERMISSIONS.ROLES_CREATE, module: PERMISSION_MODULES.ROLES, description: 'Create roles' },
	{ name: PERMISSIONS.ROLES_UPDATE, module: PERMISSION_MODULES.ROLES, description: 'Update roles' },
	{ name: PERMISSIONS.ROLES_DELETE, module: PERMISSION_MODULES.ROLES, description: 'Delete roles' },
	{ name: PERMISSIONS.FILES_UPLOAD, module: PERMISSION_MODULES.FILES, description: 'Upload files' },
	{ name: PERMISSIONS.FILES_READ, module: PERMISSION_MODULES.FILES, description: 'View files' },
	{ name: PERMISSIONS.FILES_DELETE, module: PERMISSION_MODULES.FILES, description: 'Delete files' },
	{ name: PERMISSIONS.PROJECTS_READ, module: PERMISSION_MODULES.PROJECTS, description: 'View projects' },
	{ name: PERMISSIONS.PROJECTS_CREATE, module: PERMISSION_MODULES.PROJECTS, description: 'Create projects' },
	{ name: PERMISSIONS.PROJECTS_UPDATE, module: PERMISSION_MODULES.PROJECTS, description: 'Update projects' },
	{ name: PERMISSIONS.PROJECTS_DELETE, module: PERMISSION_MODULES.PROJECTS, description: 'Delete projects' },
	{ name: PERMISSIONS.DESIGNS_READ, module: PERMISSION_MODULES.DESIGNS, description: 'View AI designs' },
	{ name: PERMISSIONS.DESIGNS_CREATE, module: PERMISSION_MODULES.DESIGNS, description: 'Generate AI designs' },
	{ name: PERMISSIONS.DESIGNS_UPDATE, module: PERMISSION_MODULES.DESIGNS, description: 'Update AI designs' },
	{ name: PERMISSIONS.DESIGNS_DELETE, module: PERMISSION_MODULES.DESIGNS, description: 'Delete AI designs' },
	{ name: PERMISSIONS.EXPORTS_READ, module: PERMISSION_MODULES.EXPORTS, description: 'View exports' },
	{ name: PERMISSIONS.EXPORTS_CREATE, module: PERMISSION_MODULES.EXPORTS, description: 'Create exports' },
	{ name: PERMISSIONS.BILLING_READ, module: PERMISSION_MODULES.BILLING, description: 'View billing' },
	{ name: PERMISSIONS.BILLING_MANAGE, module: PERMISSION_MODULES.BILLING, description: 'Manage subscriptions' },
	{ name: PERMISSIONS.SUPPORT_READ, module: PERMISSION_MODULES.SUPPORT, description: 'View support tickets' },
	{ name: PERMISSIONS.SUPPORT_CREATE, module: PERMISSION_MODULES.SUPPORT, description: 'Create support tickets' },
	{ name: PERMISSIONS.SUPPORT_MANAGE, module: PERMISSION_MODULES.SUPPORT, description: 'Manage support tickets' },
];

const rolePermissionMap = {
	Admin: Object.values(PERMISSIONS),
	User: [
		PERMISSIONS.FILES_UPLOAD,
		PERMISSIONS.FILES_READ,
		PERMISSIONS.USERS_READ,
		PERMISSIONS.PROJECTS_READ,
		PERMISSIONS.PROJECTS_CREATE,
		PERMISSIONS.PROJECTS_UPDATE,
		PERMISSIONS.PROJECTS_DELETE,
		PERMISSIONS.DESIGNS_READ,
		PERMISSIONS.DESIGNS_CREATE,
		PERMISSIONS.EXPORTS_READ,
		PERMISSIONS.EXPORTS_CREATE,
		PERMISSIONS.BILLING_READ,
		PERMISSIONS.SUPPORT_READ,
		PERMISSIONS.SUPPORT_CREATE,
	],
	Engineer: [
		PERMISSIONS.FILES_UPLOAD,
		PERMISSIONS.FILES_READ,
		PERMISSIONS.USERS_READ,
		PERMISSIONS.ROLES_READ,
		PERMISSIONS.PROJECTS_READ,
		PERMISSIONS.PROJECTS_UPDATE,
		PERMISSIONS.DESIGNS_READ,
		PERMISSIONS.DESIGNS_CREATE,
		PERMISSIONS.DESIGNS_UPDATE,
		PERMISSIONS.EXPORTS_READ,
		PERMISSIONS.EXPORTS_CREATE,
		PERMISSIONS.SUPPORT_READ,
		PERMISSIONS.SUPPORT_CREATE,
	],
};

const seedPermissions = async () => {
	await prisma.role_permissions.deleteMany();
	await prisma.permissions.deleteMany();

	await prisma.permissions.createMany({ data: permissions });

	const roles = await prisma.roles.findMany({ where: { deleted: false } });
	const allPermissions = await prisma.permissions.findMany();

	for (const role of roles) {
		const permissionNames = rolePermissionMap[role.name] || rolePermissionMap.User;
		const rolePermissions = allPermissions
			.filter(p => permissionNames.includes(p.name))
			.map(p => ({ role_id: role.id, permission_id: p.id }));

		if (rolePermissions.length > 0) {
			await prisma.role_permissions.createMany({ data: rolePermissions });
		}
	}

	console.log('Permissions seeded successfully');
};

export default seedPermissions;
