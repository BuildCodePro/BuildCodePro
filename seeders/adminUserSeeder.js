import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const seedAdminUser = async () => {
	const existing = await prisma.users.findFirst({
		where: { email: 'admin@buildcodepro.com', deleted: false },
	});

	if (existing) {
		console.log('Admin user already exists');
		return;
	}

	const password = await bcrypt.hash('Admin@123', 12);

	await prisma.users.create({
		data: {
			name: 'System Admin',
			email: 'admin@buildcodepro.com',
			password,
			role_id: 1,
			status_id: 1,
			number: '+10000000000',
		},
	});

	console.log('Admin user seeded: admin@buildcodepro.com / Admin@123');
};

export default seedAdminUser;
