import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../03 - Service/AuthService';
import { UserRepository } from '../../04 - Infrastructure/4.1 - Data/Repository/UserRepository';
import { UserProfileRepository } from '../../04 - Infrastructure/4.1 - Data/Repository/UserProfileRepository';
import { ProfileRepository } from '../../04 - Infrastructure/4.1 - Data/Repository/ProfileRepository';

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints relacionados à autenticação
 */
export class AuthController 
{

    private authService: AuthService;

    constructor() 
    {
        const userRepository = new UserRepository();
        const userProfileRepository = new UserProfileRepository();
        const profileRepository = new ProfileRepository();
        this.authService = new AuthService(userRepository, userProfileRepository, profileRepository);
    }

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Faz login e gera um token JWT
     *     tags: [Autenticação]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login bem-sucedido. Retorna o token JWT.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   description: O token JWT para autenticação
     *       401:
     *         description: Credenciais inválidas
     */
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {

            const { email, password } = req.body;
            const result = await this.authService.login(email, password);

            if (result) 
            {
                res.status(200).json(result);
            } 
            else 
            {
                res.status(401).json({ message: 'Credenciais inválidas.' });
            }
            
        } 
        catch (error) 
        {
            next(error);
        }
    }

}
