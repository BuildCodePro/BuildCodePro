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
    // Delete existing roles
    await prisma.roles.deleteMany();
    
    // Insert new roles
    const createdRoles = await prisma.roles.createMany({
      data: roles
    });
    console.log('Roles seeded successfully:', createdRoles);
    
    return createdRoles;
  } catch (error) {
    console.error('Error seeding roles:', error);
    throw error;
  }
};

export default seedRoles; 