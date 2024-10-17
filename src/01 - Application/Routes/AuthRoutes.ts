import express from 'express';
import { AuthController } from '../Controllers/AuthController';
import { AuthService } from '../../03 - Service/AuthService';
import { UserRepository } from '../../04 - Infrastructure/4.1 - Data/Repository/UserRepository';

const router = express.Router();

// Instanciar o UserService e o AuthController
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Rota de login
router.post('/auth/login', authController.login.bind(authController));

export { router as authRoutes };