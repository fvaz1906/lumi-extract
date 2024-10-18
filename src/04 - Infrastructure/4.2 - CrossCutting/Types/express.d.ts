import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload | string; // Ajuste conforme a estrutura do token
        }
    }
}