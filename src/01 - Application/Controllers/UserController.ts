import { Request, Response, NextFunction } from "express";
import { UserService } from "../../03 - Service/UserService";
import { UserProfileRepository } from "../../04 - Infrastructure/4.1 - Data/Repository/UserProfileRepository";
import { UserRepository } from "../../04 - Infrastructure/4.1 - Data/Repository/UserRepository";

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints relacionados aos usuários
 */
export class UserController 
{

    private userService: UserService;
  
    constructor() 
    {
        const userRepository = new UserRepository();
        const userProfileRepository = new UserProfileRepository();
        this.userService = new UserService(userRepository, userProfileRepository);
    }

    /**
     * @swagger
     * /user:
     *   get:
     *     summary: Lista todos os usuários
     *     tags: [Usuários]
     *     responses:
     *       200:
     *         description: A lista de usuários
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                   name:
     *                     type: string
     *                   email:
     *                     type: string
     */
    public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const usuarios = await this.userService.findAll();
            res.status(200).json(usuarios);
        } 
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * @swagger
     * /user/{id}:
     *   get:
     *     summary: Obtém um usuário pelo ID
     *     tags: [Usuários]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do usuário
     *     responses:
     *       200:
     *         description: Detalhes do usuário
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 name:
     *                   type: string
     *                 email:
     *                   type: string
     *       404:
     *         description: Usuário não encontrado
     */
    public async findById(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const { id } = req.params;
            const usuario = await this.userService.findById(id);
            
            if (!usuario) 
            {
                res.status(404).json({ message: 'Usuário não encontrado' });
            } 
            else 
            {
                res.status(200).json(usuario);
            }

        } catch (error) 
        {
            next(error);
        }
    }
  
    /**
     * @swagger
     * /user:
     *   post:
     *     summary: Cria um novo usuário
     *     tags: [Usuários]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - password
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       201:
     *         description: Usuário criado com sucesso
     *       400:
     *         description: Erro ao criar usuário
     */
    public async save(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const { name, email, password, enabled } = req.body;
            const usuario = await this.userService.save({ name, email, password, enabled });
            res.status(201).json(usuario);
        } 
        catch (error: any) 
        {
            if (error.message === 'EMAIL_EXISTS') 
            {
                res.status(409).json({ message: 'E-mail já está em uso.' }); // HTTP 409: Conflict
            } 
            else 
            {
                next(error); // Encaminha para o próximo middleware de erro
            }
        }
    }
  
    /**
     * @swagger
     * /user/{id}:
     *   put:
     *     summary: Atualiza um usuário pelo ID
     *     tags: [Usuários]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do usuário
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Usuário atualizado com sucesso
     *       404:
     *         description: Usuário não encontrado
     */
    public async update(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const { id } = req.params;
            const { name, email, password, enabled } = req.body;
            const usuarioAtualizado = await this.userService.update(id, { name, email, password, enabled });

            if (!usuarioAtualizado) 
            {
                res.status(404).json({ message: 'Usuário não encontrado' });
            } 
            else 
            {
                res.status(200).json(usuarioAtualizado);
            }

        } 
        catch (error) 
        {
            next(error);
        }
    }
  
    /**
     * @swagger
     * /user/{id}:
     *   delete:
     *     summary: Remove um usuário pelo ID
     *     tags: [Usuários]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do usuário
     *     responses:
     *       204:
     *         description: Usuário removido com sucesso
     *       404:
     *         description: Usuário não encontrado
     */
    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const { id } = req.params;
            const deletado = await this.userService.delete(id);

            if (!deletado) {
                res.status(404).json({ message: 'Usuário não encontrado' });
            } else {
                res.status(204).send();
            }

        } 
        catch (error) 
        {
            next(error);
        }
    }

}