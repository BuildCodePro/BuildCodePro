import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nfpaEditions = [
	{
		code: 'NFPA72_2016',
		name: 'NFPA 72 2016',
		nfpa_year: 2016,
		ibc_year: 2018,
		ifc_year: 2018,
		description: 'NFPA 72 2016 tied to 2018 IBC and IFC',
		is_default: false,
	},
	{
		code: 'NFPA72_2019',
		name: 'NFPA 72 2019',
		nfpa_year: 2019,
		ibc_year: 2021,
		ifc_year: 2021,
		description: 'NFPA 72 2019 tied to 2021 IBC and IFC',
		is_default: false,
	},
	{
		code: 'NFPA72_2022',
		name: 'NFPA 72 2022',
		nfpa_year: 2022,
		ibc_year: 2024,
		ifc_year: 2024,
		description: 'NFPA 72 2022 tied to 2024 IBC and IFC (primary baseline)',
		is_default: true,
	},
	{
		code: 'NFPA72_2025',
		name: 'NFPA 72 2025',
		nfpa_year: 2025,
		ibc_year: 2027,
		ifc_year: 2027,
		description: 'NFPA 72 2025 tied to 2027 IBC edition',
		is_default: false,
	},
];

const manufacturers = [
	{ name: 'Notifier', slug: 'notifier', description: 'Honeywell NOTIFIER fire alarm systems' },
	{ name: 'Edwards', slug: 'edwards', description: 'Edwards fire detection and alarm' },
	{ name: 'Simplex', slug: 'simplex', description: 'Simplex (Johnson Controls) fire alarm' },
	{ name: 'Siemens', slug: 'siemens', description: 'Siemens fire safety systems' },
	{ name: 'System Sensor', slug: 'system-sensor', description: 'System Sensor detection devices' },
	{ name: 'Fire-Lite', slug: 'fire-lite', description: 'Fire-Lite Alarms by Honeywell' },
	{ name: 'Silent Knight', slug: 'silent-knight', description: 'Silent Knight fire alarm panels' },
	{ name: 'Other', slug: 'other', description: 'Other or unspecified manufacturer' },
];

const occupancyTypes = [
	{ code: 'ASSEMBLY', name: 'Assembly', description: 'Places of assembly (A occupancies)' },
	{ code: 'BUSINESS', name: 'Business', description: 'Business occupancies (B)' },
	{ code: 'EDUCATIONAL', name: 'Educational', description: 'Educational occupancies (E)' },
	{ code: 'FACTORY', name: 'Factory & Industrial', description: 'Factory and industrial (F)' },
	{ code: 'HAZARDOUS', name: 'High Hazard', description: 'High hazard occupancies (H)' },
	{ code: 'INSTITUTIONAL', name: 'Institutional', description: 'Institutional occupancies (I)' },
	{ code: 'MERCANTILE', name: 'Mercantile', description: 'Mercantile occupancies (M)' },
	{ code: 'RESIDENTIAL', name: 'Residential', description: 'Residential occupancies (R)' },
	{ code: 'STORAGE', name: 'Storage', description: 'Storage occupancies (S)' },
	{ code: 'UTILITY', name: 'Utility & Miscellaneous', description: 'Utility and miscellaneous (U)' },
];

const subscriptionPlans = [
	{
		name: 'Starter',
		slug: 'starter',
		description: 'For small contractors getting started with AI estimation',
		price_monthly: 99.0,
		price_quarterly: 282.0,
		price_semi_annual: 534.0,
		price_annual: 990.0,
		monthly_design_limit: 5,
		features: { pdf_export: true, csv_export: true, email_support: true },
		sort_order: 1,
	},
	{
		name: 'Professional',
		slug: 'professional',
		description: 'For growing teams with regular bidding requirements',
		price_monthly: 249.0,
		price_quarterly: 709.0,
		price_semi_annual: 1342.0,
		price_annual: 2490.0,
		monthly_design_limit: 25,
		features: { pdf_export: true, csv_export: true, priority_support: true, version_history: true },
		sort_order: 2,
	},
	{
		name: 'Enterprise',
		slug: 'enterprise',
		description: 'Unlimited designs for high-volume contractors',
		price_monthly: 599.0,
		price_quarterly: 1707.0,
		price_semi_annual: 3234.0,
		price_annual: 5990.0,
		monthly_design_limit: null,
		features: { pdf_export: true, csv_export: true, priority_support: true, version_history: true, ahj_rules: true },
		sort_order: 3,
	},
];

const deviceTypes = [
	{ code: 'SMOKE_PHOTO', name: 'Photoelectric Smoke Detector', category: 'Detection' },
	{ code: 'SMOKE_ION', name: 'Ionization Smoke Detector', category: 'Detection' },
	{ code: 'HEAT_FIXED', name: 'Fixed Temperature Heat Detector', category: 'Detection' },
	{ code: 'HEAT_RATE', name: 'Rate-of-Rise Heat Detector', category: 'Detection' },
	{ code: 'DUCT_DETECTOR', name: 'Duct Smoke Detector', category: 'Detection' },
	{ code: 'PULL_STATION', name: 'Manual Pull Station', category: 'Initiation' },
	{ code: 'HORN_STROBE', name: 'Horn/Strobe Notification Appliance', category: 'Notification' },
	{ code: 'SPEAKER', name: 'Speaker (Voice Evacuation)', category: 'Notification' },
	{ code: 'FACP', name: 'Fire Alarm Control Panel', category: 'Control' },
	{ code: 'NAC_POWER', name: 'NAC Power Supply', category: 'Power' },
	{ code: 'MONITOR_MODULE', name: 'Monitor Module', category: 'Modules' },
	{ code: 'CONTROL_MODULE', name: 'Control Module', category: 'Modules' },
	{ code: 'FLOW_SWITCH', name: 'Water Flow Switch', category: 'Supervisory' },
	{ code: 'TAMPER_SWITCH', name: 'Tamper Switch', category: 'Supervisory' },
];

const faqCategories = [
	{ name: 'Getting Started', slug: 'getting-started', description: 'Account setup and first project', sort_order: 1 },
	{ name: 'Uploading Drawings', slug: 'uploading-drawings', description: 'File formats and upload tips', sort_order: 2 },
	{ name: 'AI Design', slug: 'ai-design', description: 'How AI generates designs and BOMs', sort_order: 3 },
	{ name: 'Billing', slug: 'billing', description: 'Plans, invoices, and usage', sort_order: 4 },
];

const seedReferenceData = async () => {
	await prisma.nfpa_editions.createMany({ data: nfpaEditions, skipDuplicates: true });
	await prisma.manufacturers.createMany({ data: manufacturers, skipDuplicates: true });
	await prisma.occupancy_types.createMany({ data: occupancyTypes, skipDuplicates: true });
	await prisma.subscription_plans.createMany({ data: subscriptionPlans, skipDuplicates: true });
	await prisma.device_types.createMany({ data: deviceTypes, skipDuplicates: true });
	await prisma.faq_categories.createMany({ data: faqCategories, skipDuplicates: true });

	console.log('Reference data seeded successfully');
};

export default seedReferenceData;
