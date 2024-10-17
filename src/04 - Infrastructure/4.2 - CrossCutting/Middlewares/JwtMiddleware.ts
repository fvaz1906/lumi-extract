import { Request, Response, NextFunction } from 'express';
import { JwtToken } from '../Security/JwtToken';

export const JwtMiddleware = (req: Request, res: Response, next: NextFunction): void => 
{
    const authHeader = req.headers.authorization;

    if (!authHeader) 
    {
        // Retorna uma resposta ao cliente, interrompendo o fluxo
        res.status(401).json({ message: 'Token não fornecido.' });
        return; // Garante que o tipo de retorno seja `void`
    }

    const token = authHeader.split(' ')[1]; // O token JWT geralmente é enviado no formato "Bearer <token>"

    const decoded = JwtToken.verifyToken(token);

    if (!decoded) 
    {
        // Retorna uma resposta ao cliente, interrompendo o fluxo
        res.status(403).json({ message: 'Token inválido ou expirado.' });
        return; // Garante que o tipo de retorno seja `void`
    }

    // Se o token for válido, prossegue para o próximo middleware ou controlador
    next(); // Aqui o retorno é `void`, conforme esperado pelo Express
};