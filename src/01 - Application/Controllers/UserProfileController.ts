import { Request, Response, NextFunction } from "express";
import { UserProfileService } from "../../03 - Service/UserProfileService";
import { UserProfileRepository } from "../../04 - Infrastructure/4.1 - Data/Repository/UserProfileRepository";

/**
 * @swagger
 * tags:
 *   name: User Profiles
 *   description: Endpoints relacionados à associação entre usuários e perfis
 */
export class UserProfileController 
{

    private userProfileService: UserProfileService;

    constructor() 
    {
        const userProfileRepository = new UserProfileRepository();
        this.userProfileService = new UserProfileService(userProfileRepository);
    }

    /**
     * @swagger
     * /userprofiles:
     *   get:
     *     summary: Lista todas as associações entre usuários e perfis
     *     tags: [User Profiles]
     *     responses:
     *       200:
     *         description: Lista de associações
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   userId:
     *                     type: string
     *                   profileId:
     *                     type: string
     */
    public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const userProfiles = await this.userProfileService.findAll();
            res.status(200).json(userProfiles);
        } 
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * @swagger
     * /userprofiles/{userId}:
     *   get:
     *     summary: Obtém a associação de um usuário com um perfil
     *     tags: [User Profiles]
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do usuário
     *     responses:
     *       200:
     *         description: Associação encontrada
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 userId:
     *                   type: string
     *                 profileId:
     *                   type: string
     *       404:
     *         description: Associação não encontrada
     */
    public async findById(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const { userId } = req.params;
            const userProfile = await this.userProfileService.findById(userId);

            if (!userProfile) 
            {
                res.status(404).json({ message: 'Associação não encontrada' });
            } 
            else 
            {
                res.status(200).json(userProfile);
            }

        } 
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * @swagger
     * /userprofiles:
     *   post:
     *     summary: Associa um usuário a um perfil
     *     tags: [User Profiles]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - userId
     *               - profileId
     *             properties:
     *               userId:
     *                 type: string
     *               profileId:
     *                 type: string
     *     responses:
     *       201:
     *         description: Associação criada com sucesso
     *       400:
     *         description: Erro ao criar associação
     */
    public async save(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const { userId, profileId, role, permissions } = req.body;
            const userProfile = await this.userProfileService.save({ userId, profileId, role, permissions });
            res.status(201).json(userProfile);
        } 
        catch (error) 
        {
            next(error);
        }
    }    

    /**
     * @swagger
     * /userprofiles/{userId}:
     *   put:
     *     summary: Atualiza a associação de um usuário com um perfil
     *     tags: [User Profiles]
     *     parameters:
     *       - in: path
     *         name: userId
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
     *               profileId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Associação atualizada com sucesso
     *       404:
     *         description: Associação não encontrada
     */
    public async update(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const { userId } = req.params;
            const { profileId } = req.body;
            const userProfileAtualizado = await this.userProfileService.update(userId, { profileId });

            if (!userProfileAtualizado) 
            {
                res.status(404).json({ message: 'Associação não encontrada' });
            } 
            else 
            {
                res.status(200).json(userProfileAtualizado);
            }

        } 
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * @swagger
     * /userprofiles/{userId}:
     *   delete:
     *     summary: Remove a associação de um usuário com um perfil
     *     tags: [User Profiles]
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do usuário
     *     responses:
     *       204:
     *         description: Associação removida com sucesso
     *       404:
     *         description: Associação não encontrada
     */
    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> 
    {
        try 
        {
            const { userId } = req.params;
            const deletado = await this.userProfileService.delete(userId);

            if (!deletado) 
            {
                res.status(404).json({ message: 'Associação não encontrada' });
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
