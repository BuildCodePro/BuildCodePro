import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const roles = [
	{
		id: 1,
		name: 'Admin',
		description: 'Administrator with full access to all platform features',
	},
	{
		id: 2,
		name: 'User',
		description: 'Fire alarm contractor or estimator with project access',
	},
	{
		id: 3,
		name: 'Engineer',
		description: 'Professional engineer with review and approval access',
	},
];

const seedRoles = async () => {
	try {
		// Upsert roles to avoid deleting rows referenced by foreign keys
		for (const role of roles) {
			const { id, ...rest } = role;
			await prisma.roles.upsert({
				where: { name: role.name },
				update: rest,
				create: role,
			});
		}

		console.log('Roles seeded successfully');
		return true;
	} catch (error) {
		console.error('Error seeding roles:', error);
		throw error;
	}
};

export default seedRoles; 