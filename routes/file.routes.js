import { Router } from 'express';

import {
	deleteFile,
	getFile,
	getFiles,
	uploadFile,
	uploadMultipleFiles,
} from '../controllers';
import { createUpload, hasPermission, isAuth } from '../middlewares';
import { PERMISSIONS } from '../constants/permission.constants';

const router = Router();
const upload = createUpload();

/**
 * @swagger
 * /api/v1/files:
 *   post:
 *     tags: [Files]
 *     summary: Upload a single file
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */
router.post(
	'/',
	isAuth,
	hasPermission(PERMISSIONS.FILES_UPLOAD),
	upload.single('file'),
	uploadFile,
);

/**
 * @swagger
 * /api/v1/files/multiple:
 *   post:
 *     tags: [Files]
 *     summary: Upload multiple files
 *     security:
 *       - bearerAuth: []
 */
router.post(
	'/multiple',
	isAuth,
	hasPermission(PERMISSIONS.FILES_UPLOAD),
	upload.array('files', 10),
	uploadMultipleFiles,
);

/**
 * @swagger
 * /api/v1/files:
 *   get:
 *     tags: [Files]
 *     summary: List uploaded files
 *     security:
 *       - bearerAuth: []
 */
router.get(
	'/',
	isAuth,
	hasPermission(PERMISSIONS.FILES_READ),
	getFiles,
);

/**
 * @swagger
 * /api/v1/files/{id}:
 *   get:
 *     tags: [Files]
 *     summary: Get file by ID
 *     security:
 *       - bearerAuth: []
 */
router.get(
	'/:id',
	isAuth,
	hasPermission(PERMISSIONS.FILES_READ),
	getFile,
);

/**
 * @swagger
 * /api/v1/files/{id}:
 *   delete:
 *     tags: [Files]
 *     summary: Delete file by ID
 *     security:
 *       - bearerAuth: []
 */
router.delete(
	'/:id',
	isAuth,
	hasPermission(PERMISSIONS.FILES_DELETE),
	deleteFile,
);

export const FileRoutes = router;
