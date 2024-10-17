import { Router } from "express";
import { UserController } from "../Controllers/UserController";
import { JwtMiddleware } from "../../04 - Infrastructure/4.2 - CrossCutting/Middlewares/JwtMiddleware";

const userController = new UserController();
const router = Router();

router.post('/usuarios', userController.criarUsuario.bind(userController));
router.get('/usuarios', JwtMiddleware, userController.listarUsuarios.bind(userController));
router.get('/usuarios/:id', JwtMiddleware, userController.buscarUsuarioPorId.bind(userController));
router.put('/usuarios/:id', JwtMiddleware, userController.atualizarUsuario.bind(userController));
router.delete('/usuarios/:id', JwtMiddleware, userController.deletarUsuario.bind(userController));

export { router as userRoutes };