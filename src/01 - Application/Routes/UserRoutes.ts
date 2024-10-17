import { Router } from "express";
import { UserController } from "../Controllers/UserController";

const userController = new UserController();
const router = Router();

router.post('/usuarios', userController.criarUsuario.bind(userController));
router.get('/usuarios', userController.listarUsuarios.bind(userController));
router.get('/usuarios/:id', userController.buscarUsuarioPorId.bind(userController));
router.put('/usuarios/:id', userController.atualizarUsuario.bind(userController));
router.delete('/usuarios/:id', userController.deletarUsuario.bind(userController));

export { router as userRoutes };