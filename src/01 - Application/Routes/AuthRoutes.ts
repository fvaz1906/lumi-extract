import express from 'express';
import { AuthController } from '../Controllers/AuthController';

const router = express.Router();

// Instanciar o UserService e o AuthController
const authController = new AuthController();

// Rota de login
router.post('/auth/login', authController.login.bind(authController));

export { router as authRoutes };