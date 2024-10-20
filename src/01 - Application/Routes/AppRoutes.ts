import { Router } from "express";
import { UserController } from "../Controllers/UserController";
import { UserProfileController } from "../Controllers/UserProfileController";
import { ProfileController } from "../Controllers/ProfileController";
import { JwtMiddleware } from "../../04 - Infrastructure/4.2 - CrossCutting/Middlewares/JwtMiddleware";
import { UploadController, upload } from "../Controllers/UploadController";
import { InstallationController } from "../Controllers/InstallationController";

const userController = new UserController();
const userProfileController = new UserProfileController();
const profileController = new ProfileController();
const uploadController = new UploadController();
const installationController = new InstallationController();

const router = Router();

// users
router.get('/user', JwtMiddleware(['read']), userController.findAll.bind(userController));
router.get('/user/:id', JwtMiddleware(['read']), userController.findById.bind(userController));
router.post('/user', userController.save.bind(userController));
router.put('/user/:id', JwtMiddleware(['update']), userController.update.bind(userController));
router.delete('/user/:id', JwtMiddleware(['delete']), userController.delete.bind(userController));

// userProfiles
router.get('/userProfile', JwtMiddleware(['read']), userProfileController.findAll.bind(userProfileController));
router.get('/userProfile/:id', JwtMiddleware(['read']), userProfileController.findById.bind(userProfileController));
router.post('/userProfile', JwtMiddleware(['create']), userProfileController.save.bind(userProfileController));
router.put('/userProfile/:id', JwtMiddleware(['update']), userProfileController.update.bind(userProfileController));
router.delete('/userProfile/:id', JwtMiddleware(['delete']), userProfileController.delete.bind(userProfileController));

// profiles
router.get('/profile', JwtMiddleware(['read']), profileController.findAll.bind(profileController));
router.get('/profile/:id', JwtMiddleware(['read']), profileController.findById.bind(profileController));
router.post('/profile', JwtMiddleware(['create']), profileController.save.bind(profileController));
router.put('/profile/:id', JwtMiddleware(['update']), profileController.update.bind(profileController));
router.delete('/profile/:id', JwtMiddleware(['delete']), profileController.delete.bind(profileController));

// upload
router.post('/upload', JwtMiddleware(['create']), upload.single('file'), uploadController.uploadAndProcessPdf.bind(uploadController));

// Rota para listar todas as instalações com informações básicas
router.get('/installations', JwtMiddleware(['read']), installationController.listInstallations.bind(installationController));

// obter dados por numero de instalação
router.get('/installations/:numero_instalacao', JwtMiddleware(['read']), installationController.getInstallationByNumero.bind(installationController));

export { router as appRoutes };