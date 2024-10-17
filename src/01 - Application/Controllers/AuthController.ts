import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../03 - Service/UserService';
import { JwtToken } from '../../04 - Infrastructure/4.2 - CrossCutting/Security/JwtToken';
import { AuthService } from '../../03 - Service/AuthService';

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints relacionados à autenticação
 */
export class AuthController 
{

    private _authService: AuthService;

    constructor(authService: AuthService) {
        this._authService = authService;
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
            const token = await this._authService.login(email, password);

            // Retorna o token ao cliente
            res.status(200).json({ token });
            
        } 
        catch (error) 
        {
            next(error);
        }
    }

}
