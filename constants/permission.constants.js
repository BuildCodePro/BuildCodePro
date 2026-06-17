export const PERMISSIONS = {
	// Users
	USERS_READ: 'users:read',
	USERS_CREATE: 'users:create',
	USERS_UPDATE: 'users:update',
	USERS_DELETE: 'users:delete',
	// Roles
	ROLES_READ: 'roles:read',
	ROLES_CREATE: 'roles:create',
	ROLES_UPDATE: 'roles:update',
	ROLES_DELETE: 'roles:delete',
	// Files
	FILES_UPLOAD: 'files:upload',
	FILES_READ: 'files:read',
	FILES_DELETE: 'files:delete',
	// Projects
	PROJECTS_READ: 'projects:read',
	PROJECTS_CREATE: 'projects:create',
	PROJECTS_UPDATE: 'projects:update',
	PROJECTS_DELETE: 'projects:delete',
	// Designs
	DESIGNS_READ: 'designs:read',
	DESIGNS_CREATE: 'designs:create',
	DESIGNS_UPDATE: 'designs:update',
	DESIGNS_DELETE: 'designs:delete',
	// Exports
	EXPORTS_READ: 'exports:read',
	EXPORTS_CREATE: 'exports:create',
	// Billing
	BILLING_READ: 'billing:read',
	BILLING_MANAGE: 'billing:manage',
	// Support
	SUPPORT_READ: 'support:read',
	SUPPORT_CREATE: 'support:create',
	SUPPORT_MANAGE: 'support:manage',
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const PERMISSION_MODULES = {
	USERS: 'users',
	ROLES: 'roles',
	FILES: 'files',
	PROJECTS: 'projects',
	DESIGNS: 'designs',
	EXPORTS: 'exports',
	BILLING: 'billing',
	SUPPORT: 'support',
};

export const FILE_UPLOAD_SUCCESS = 'File uploaded successfully';
export const FILE_DELETE_SUCCESS = 'File deleted successfully';
export const FILE_NOT_FOUND = 'File not found';
export const GET_FILES_SUCCESS = 'Files fetched successfully';
export const INVALID_FILE_TYPE = 'File type not supported';
