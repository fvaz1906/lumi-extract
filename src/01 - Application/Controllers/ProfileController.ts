import { Request, Response, NextFunction } from "express";
import { ProfileService } from "../../03 - Service/ProfileService";
import { ProfileRepository } from "../../04 - Infrastructure/4.1 - Data/Repository/ProfileRepository";

/**
 * @swagger
 * tags:
 *   name: Perfis
 *   description: Endpoints relacionados aos perfis de usuário
 */
export class ProfileController 
{

    private profileService: ProfileService;

    constructor() 
    {
        const profileRepository = new ProfileRepository();
        this.profileService = new ProfileService(profileRepository);
    }

    /**
     * @swagger
     * /perfis:
     *   get:
     *     summary: Lista todos os perfis
     *     tags: [Perfis]
     *     responses:
     *       200:
     *         description: A lista de perfis
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                   role:
     *                     type: string
     *                   permissions:
     *                     type: array
     *                     items:
     *                       type: string
     */
    public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const perfis = await this.profileService.findAll();
            res.status(200).json(perfis);
        } 
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * @swagger
     * /perfis/{id}:
     *   get:
     *     summary: Obtém um perfil pelo ID
     *     tags: [Perfis]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do perfil
     *     responses:
     *       200:
     *         description: Detalhes do perfil
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 role:
     *                   type: string
     *                 permissions:
     *                   type: array
     *                   items:
     *                     type: string
     *       404:
     *         description: Perfil não encontrado
     */
    public async findById(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const { id } = req.params;
            const perfil = await this.profileService.findById(id);

            if (!perfil) 
            {
                res.status(404).json({ message: 'Perfil não encontrado' });
            }
            else 
            {
                res.status(200).json(perfil);
            }
        } 
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * @swagger
     * /perfis:
     *   post:
     *     summary: Cria um novo perfil
     *     tags: [Perfis]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - role
     *             properties:
     *               role:
     *                 type: string
     *               permissions:
     *                 type: array
     *                 items:
     *                   type: string
     *     responses:
     *       201:
     *         description: Perfil criado com sucesso
     *       400:
     *         description: Erro ao criar perfil
     */
    public async save(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const { role, permissions } = req.body;
            const perfil = await this.profileService.save({ role, permissions });
            res.status(201).json(perfil);
        } 
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * @swagger
     * /perfis/{id}:
     *   put:
     *     summary: Atualiza um perfil pelo ID
     *     tags: [Perfis]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do perfil
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               role:
     *                 type: string
     *               permissions:
     *                 type: array
     *                 items:
     *                   type: string
     *     responses:
     *       200:
     *         description: Perfil atualizado com sucesso
     *       404:
     *         description: Perfil não encontrado
     */
    public async update(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const { id } = req.params;
            const { role, permissions } = req.body;
            const perfilAtualizado = await this.profileService.update(id, { role, permissions });

            if (!perfilAtualizado) 
            {
                res.status(404).json({ message: 'Perfil não encontrado' });
            } 
            else 
            {
                res.status(200).json(perfilAtualizado);
            }
        } 
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * @swagger
     * /perfis/{id}:
     *   delete:
     *     summary: Remove um perfil pelo ID
     *     tags: [Perfis]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do perfil
     *     responses:
     *       204:
     *         description: Perfil removido com sucesso
     *       404:
     *         description: Perfil não encontrado
     */
    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const { id } = req.params;
            const deletado = await this.profileService.delete(id);

            if (!deletado) 
            {
                res.status(404).json({ message: 'Perfil não encontrado' });
            } 
            else 
            {
                res.status(204).send();
            }
        } 
        catch (error) 
        {
            next(error);
        }
    }
}
