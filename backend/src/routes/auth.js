// backend/src/routes/auth.js - Updated dengan CSRF
import express from 'express';
import { register, login, logout, getMe } from '../controllers/auth.js';
import { verifyToken } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import smartCSRF from '../middlewares/csrf.js';
import { registerSchema, loginSchema } from '../validators/auth.js';

const router = express.Router();

// Routes dengan CSRF protection untuk state-changing operations
router.post('/register', smartCSRF, validate(registerSchema), register);
router.post('/login', smartCSRF, validate(loginSchema), login);
router.post('/logout', verifyToken, logout); // Logout biasanya tidak perlu CSRF

// GET routes tidak perlu CSRF
router.get('/me', verifyToken, getMe);

export default router;