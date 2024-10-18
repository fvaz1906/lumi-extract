import { Request, Response, NextFunction } from 'express';
import { JwtToken } from '../Security/JwtToken';
import { JwtPayload } from 'jsonwebtoken';

// Middleware JWT com verificação de permissões
export const JwtMiddleware = (requiredPermissions: string[] = []) => 
{
    return (req: Request, res: Response, next: NextFunction): void => 
    {
        const authHeader = req.headers.authorization;

        if (!authHeader) 
        {
            res.status(401).json({ message: 'Token não fornecido.' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = JwtToken.verifyToken(token);

        if (!decoded || typeof decoded === 'string') 
        {
            res.status(403).json({ message: 'Token inválido ou expirado.' });
            return;
        }

        // Armazena o usuário no objeto `req.user`
        req.user = decoded as JwtPayload;

        // Verifica as permissões do usuário
        const userPermissions = (decoded as JwtPayload).permission || [];
        const hasPermission = requiredPermissions.every(permission =>
            userPermissions.includes(permission)
        );

        if (!hasPermission) 
        {
            res.status(403).json({ message: 'Acesso negado: Permissões insuficientes.' });
            return;
        }

        // Se o token for válido e as permissões forem suficientes, continua
        next();
    };
};
