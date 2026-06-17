import seedLookups from './lookupDataSeeder';
import seedRoles from './roleSeeder';
import seedPermissions from './permissionSeeder';
import seedAdminUser from './adminUserSeeder';
import seedReferenceData from './referenceDataSeeder';

const runSeeders = async () => {
	try {
		await seedLookups();
		await seedRoles();
		await seedPermissions();
		await seedReferenceData();
		await seedAdminUser();
		console.log('All seeders completed successfully');
	} catch (error) {
		console.error('Error running seeders:', error);
	}
};

export default runSeeders;
