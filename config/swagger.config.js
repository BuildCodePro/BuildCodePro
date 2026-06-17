import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'BuildCode Pro API',
		version: '1.0.0',
		description:
			'AI Powered Fire Alarm Design & Estimation Platform - REST API documentation',
		contact: {
			name: 'BuildCode Pro Support',
		},
	},
	servers: [
		{
			url: process.env.API_URL || 'http://localhost:3000',
			description: 'Development server',
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
		},
		schemas: {
			SuccessResponse: {
				type: 'object',
				properties: {
					success: { type: 'boolean', example: true },
					message: { type: 'string' },
					payload: { type: 'object' },
				},
			},
			ErrorResponse: {
				type: 'object',
				properties: {
					success: { type: 'boolean', example: false },
					message: { type: 'string' },
				},
			},
			LoginRequest: {
				type: 'object',
				required: ['email', 'password'],
				properties: {
					email: { type: 'string', format: 'email' },
					password: { type: 'string', minLength: 6 },
					role: { type: 'integer' },
				},
			},
			RegisterRequest: {
				type: 'object',
				required: ['name', 'email', 'password', 'number', 'role_id'],
				properties: {
					name: { type: 'string' },
					email: { type: 'string', format: 'email' },
					password: { type: 'string', minLength: 6 },
					number: { type: 'string' },
					role_id: { type: 'integer' },
					address: { type: 'string' },
					city: { type: 'string' },
					state: { type: 'string' },
					country: { type: 'string' },
				},
			},
			User: {
				type: 'object',
				properties: {
					id: { type: 'integer' },
					name: { type: 'string' },
					email: { type: 'string' },
					role_id: { type: 'integer' },
					status: { type: 'string' },
					image: { type: 'string', nullable: true },
					created_at: { type: 'string', format: 'date-time' },
				},
			},
			Role: {
				type: 'object',
				properties: {
					id: { type: 'integer' },
					name: { type: 'string' },
					description: { type: 'string' },
				},
			},
		},
	},
	tags: [
		{ name: 'Auth', description: 'Authentication endpoints' },
		{ name: 'Users', description: 'User management endpoints' },
		{ name: 'Roles', description: 'Role management endpoints' },
		{ name: 'Files', description: 'File upload endpoints' },
	],
};

const options = {
	swaggerDefinition,
	apis: ['./routes/*.js', './server.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
