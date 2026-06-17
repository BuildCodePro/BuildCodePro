import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import responseTime from 'response-time';
import swaggerUi from 'swagger-ui-express';

import { PORT } from './config';
import { swaggerSpec } from './config/swagger.config';
import {
	errorMiddleware,
	notFound,
} from './middlewares';
import {
	AuthRoutes,
	RoleRoutes,
	UserRoutes,
	FileRoutes,
} from './routes';
import runSeeders from './seeders';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('dev'));
app.use(responseTime());

app.use(cors({ origin: '*' }));

app.use('/public', express.static(path.join(path.resolve(), 'temp_uploads')));
app.use(express.static(path.join(path.resolve(), 'public')));

app.use(helmet({
	contentSecurityPolicy: false,
}));

/**
 * @swagger
 * /api/v1/docs:
 *   get:
 *     tags: [Health]
 *     summary: API documentation redirect
 */
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
	customSiteTitle: 'BuildCode Pro API Docs',
	customCss: '.swagger-ui .topbar { display: none }',
}));

app.get('/api/v1/docs.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});

app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/role', RoleRoutes);
app.use('/api/v1/files', FileRoutes);

/**
 * @swagger
 * /home:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get('/home', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'BuildCode Pro API is running',
		payload: { port: PORT, docs: '/api/v1/docs' },
	});
});

app.use('*', notFound);
app.use(errorMiddleware);

runSeeders();

if (!fs.existsSync('./temp_uploads')) {
	fs.mkdirSync('./temp_uploads', { recursive: true });
	console.log('temp_uploads folder created!');
}

app.listen(PORT || 3000, () => {
	console.log(`BuildCode Pro API running at port ${PORT}`);
	console.log(`Swagger docs available at http://localhost:${PORT}/api/v1/docs`);
});
