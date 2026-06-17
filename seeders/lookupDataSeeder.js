import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const lookupTables = [
	{
		model: 'user_statuses',
		data: [
			{ id: 1, code: 'ACTIVE', name: 'Active', sort_order: 1 },
			{ id: 2, code: 'INACTIVE', name: 'Inactive', sort_order: 2 },
			{ id: 3, code: 'BLOCKED', name: 'Blocked', sort_order: 3 },
			{ id: 4, code: 'PENDING', name: 'Pending', sort_order: 4 },
			{ id: 5, code: 'SHOULD_CHANGE_PASSWORD', name: 'Should Change Password', sort_order: 5 },
		],
	},
	{
		model: 'auth_log_types',
		data: [
			{ id: 1, code: 'login', name: 'Login', sort_order: 1 },
			{ id: 2, code: 'logout', name: 'Logout', sort_order: 2 },
		],
	},
	{
		model: 'file_resource_types',
		data: [
			{ id: 1, code: 'image', name: 'Image', sort_order: 1 },
			{ id: 2, code: 'raw', name: 'Raw', sort_order: 2 },
			{ id: 3, code: 'video', name: 'Video', sort_order: 3 },
			{ id: 4, code: 'auto', name: 'Auto', sort_order: 4 },
		],
	},
	{
		model: 'project_statuses',
		data: [
			{ id: 1, code: 'DRAFT', name: 'Draft', sort_order: 1 },
			{ id: 2, code: 'ACTIVE', name: 'Active', sort_order: 2 },
			{ id: 3, code: 'PROCESSING', name: 'Processing', sort_order: 3 },
			{ id: 4, code: 'COMPLETED', name: 'Completed', sort_order: 4 },
			{ id: 5, code: 'ARCHIVED', name: 'Archived', sort_order: 5 },
			{ id: 6, code: 'DELETED', name: 'Deleted', sort_order: 6 },
		],
	},
	{
		model: 'design_job_statuses',
		data: [
			{ id: 1, code: 'QUEUED', name: 'Queued', sort_order: 1 },
			{ id: 2, code: 'PROCESSING', name: 'Processing', sort_order: 2 },
			{ id: 3, code: 'COMPLETED', name: 'Completed', sort_order: 3 },
			{ id: 4, code: 'FAILED', name: 'Failed', sort_order: 4 },
			{ id: 5, code: 'CANCELLED', name: 'Cancelled', sort_order: 5 },
		],
	},
	{
		model: 'compliance_statuses',
		data: [
			{ id: 1, code: 'PASS', name: 'Pass', sort_order: 1 },
			{ id: 2, code: 'REVIEW', name: 'Review', sort_order: 2 },
			{ id: 3, code: 'FAIL', name: 'Fail', sort_order: 3 },
		],
	},
	{
		model: 'export_formats',
		data: [
			{ id: 1, code: 'PDF', name: 'PDF', sort_order: 1 },
			{ id: 2, code: 'CSV', name: 'CSV', sort_order: 2 },
		],
	},
	{
		model: 'export_statuses',
		data: [
			{ id: 1, code: 'PENDING', name: 'Pending', sort_order: 1 },
			{ id: 2, code: 'PROCESSING', name: 'Processing', sort_order: 2 },
			{ id: 3, code: 'COMPLETED', name: 'Completed', sort_order: 3 },
			{ id: 4, code: 'FAILED', name: 'Failed', sort_order: 4 },
		],
	},
	{
		model: 'billing_cycles',
		data: [
			{ id: 1, code: 'MONTHLY', name: 'Monthly', sort_order: 1 },
			{ id: 2, code: 'QUARTERLY', name: 'Quarterly', sort_order: 2 },
			{ id: 3, code: 'SEMI_ANNUAL', name: 'Semi-Annual', sort_order: 3 },
			{ id: 4, code: 'ANNUAL', name: 'Annual', sort_order: 4 },
		],
	},
	{
		model: 'subscription_statuses',
		data: [
			{ id: 1, code: 'ACTIVE', name: 'Active', sort_order: 1 },
			{ id: 2, code: 'TRIALING', name: 'Trialing', sort_order: 2 },
			{ id: 3, code: 'PAST_DUE', name: 'Past Due', sort_order: 3 },
			{ id: 4, code: 'CANCELLED', name: 'Cancelled', sort_order: 4 },
			{ id: 5, code: 'EXPIRED', name: 'Expired', sort_order: 5 },
			{ id: 6, code: 'PAUSED', name: 'Paused', sort_order: 6 },
		],
	},
	{
		model: 'invoice_statuses',
		data: [
			{ id: 1, code: 'DRAFT', name: 'Draft', sort_order: 1 },
			{ id: 2, code: 'OPEN', name: 'Open', sort_order: 2 },
			{ id: 3, code: 'PAID', name: 'Paid', sort_order: 3 },
			{ id: 4, code: 'VOID', name: 'Void', sort_order: 4 },
			{ id: 5, code: 'UNCOLLECTIBLE', name: 'Uncollectible', sort_order: 5 },
		],
	},
	{
		model: 'ticket_statuses',
		data: [
			{ id: 1, code: 'OPEN', name: 'Open', sort_order: 1 },
			{ id: 2, code: 'IN_PROGRESS', name: 'In Progress', sort_order: 2 },
			{ id: 3, code: 'WAITING_ON_CUSTOMER', name: 'Waiting on Customer', sort_order: 3 },
			{ id: 4, code: 'RESOLVED', name: 'Resolved', sort_order: 4 },
			{ id: 5, code: 'CLOSED', name: 'Closed', sort_order: 5 },
		],
	},
	{
		model: 'ticket_priorities',
		data: [
			{ id: 1, code: 'LOW', name: 'Low', sort_order: 1 },
			{ id: 2, code: 'MEDIUM', name: 'Medium', sort_order: 2 },
			{ id: 3, code: 'HIGH', name: 'High', sort_order: 3 },
			{ id: 4, code: 'URGENT', name: 'Urgent', sort_order: 4 },
		],
	},
	{
		model: 'activity_entity_types',
		data: [
			{ id: 1, code: 'PROJECT', name: 'Project', sort_order: 1 },
			{ id: 2, code: 'DESIGN_JOB', name: 'Design Job', sort_order: 2 },
			{ id: 3, code: 'EXPORT', name: 'Export', sort_order: 3 },
			{ id: 4, code: 'SUBSCRIPTION', name: 'Subscription', sort_order: 4 },
			{ id: 5, code: 'USER', name: 'User', sort_order: 5 },
			{ id: 6, code: 'TICKET', name: 'Ticket', sort_order: 6 },
		],
	},
	{
		model: 'activity_actions',
		data: [
			{ id: 1, code: 'CREATED', name: 'Created', sort_order: 1 },
			{ id: 2, code: 'UPDATED', name: 'Updated', sort_order: 2 },
			{ id: 3, code: 'DELETED', name: 'Deleted', sort_order: 3 },
			{ id: 4, code: 'UPLOADED', name: 'Uploaded', sort_order: 4 },
			{ id: 5, code: 'GENERATED', name: 'Generated', sort_order: 5 },
			{ id: 6, code: 'EXPORTED', name: 'Exported', sort_order: 6 },
			{ id: 7, code: 'ARCHIVED', name: 'Archived', sort_order: 7 },
			{ id: 8, code: 'RESTORED', name: 'Restored', sort_order: 8 },
			{ id: 9, code: 'SUBSCRIBED', name: 'Subscribed', sort_order: 9 },
			{ id: 10, code: 'CANCELLED', name: 'Cancelled', sort_order: 10 },
			{ id: 11, code: 'LOGIN', name: 'Login', sort_order: 11 },
			{ id: 12, code: 'LOGOUT', name: 'Logout', sort_order: 12 },
		],
	},
	{
		model: 'usage_event_types',
		data: [
			{ id: 1, code: 'DESIGN_GENERATED', name: 'Design Generated', sort_order: 1 },
			{ id: 2, code: 'EXPORT_PDF', name: 'Export PDF', sort_order: 2 },
			{ id: 3, code: 'EXPORT_CSV', name: 'Export CSV', sort_order: 3 },
			{ id: 4, code: 'DRAWING_UPLOADED', name: 'Drawing Uploaded', sort_order: 4 },
			{ id: 5, code: 'PROJECT_CREATED', name: 'Project Created', sort_order: 5 },
		],
	},
	{
		model: 'ai_providers',
		data: [
			{ id: 1, code: 'OPENAI', name: 'OpenAI', sort_order: 1 },
			{ id: 2, code: 'ANTHROPIC', name: 'Anthropic', sort_order: 2 },
		],
	},
];

const seedLookups = async () => {
	for (const { model, data } of lookupTables) {
		const modelClient = prisma[model];
		if (!modelClient) {
			throw new Error(`Prisma client does not contain model: ${model}`);
		}

		try {
			// Use upsert per-record to avoid deleting rows that are referenced by FKs
			for (const record of data) {
				const { id, ...rest } = record;
				await modelClient.upsert({
					where: { code: record.code },
					update: rest,
					create: record,
				});
			}
		} catch (err) {
			console.error(`Error seeding model ${model}:`, err);
			throw err;
		}
	}

	console.log('Lookup tables seeded successfully');
};

export default seedLookups;
