import { Router } from 'express';

import {
	login,
	register,
	OtpVerify,
	ResendOTP,
	ForgotPassword,
	ResetPassword,
	getLoggedInUser,
} from '../controllers';
import {
	validate,
	checkAuth,
	varifyOTP,
	isAuth,
	resetCheck,
} from '../middlewares';
import {
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

	loginSchema,
	registerSchema,
	verifySchema,
	resendOTPSchema,
	forgotSchema,
	resetSchema,
} from '../validations';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Registration successful
 */
router.post('/register', checkAuth, validate(registerSchema), register);

/**
 * @swagger
 * /api/v1/auth/verify/{id}:
 *   post:
 *     tags: [Auth]
 *     summary: Verify OTP
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post('/verify/:id', validate(verifySchema), varifyOTP, OtpVerify);

/**
 * @swagger
 * /api/v1/auth/resendOTP/{id}:
 *   get:
 *     tags: [Auth]
 *     summary: Resend OTP
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.get('/resendOTP/:id', validate(resendOTPSchema), ResendOTP);

/**
 * @swagger
 * /api/v1/auth/forgot:
 *   post:
 *     tags: [Auth]
 *     summary: Forgot password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent for password reset
 */
router.post('/forgot', validate(forgotSchema), ForgotPassword);

/**
 * @swagger
 * /api/v1/auth/reset/{id}:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post('/reset/:id', resetCheck, validate(resetSchema), ResetPassword);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get logged in user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/me', isAuth, getLoggedInUser);

export const AuthRoutes = router;
