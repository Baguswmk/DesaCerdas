import express from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import csrfMiddleware  from '../middlewares/csrf.js';
import { registerSchema, loginSchema } from '../validators/auth.js';
const router = express.Router();

router.post('/register',csrfMiddleware, validate(registerSchema), register);
router.post('/login',csrfMiddleware, validate(loginSchema), login);
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getMe);

export default router;
