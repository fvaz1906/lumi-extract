import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';

import { expirationTimeInMilliseconds } from '../Helpers/ExpirationTimeInMilliseconds';

// Carregar configurações do appsettings.json
const appsettingsPath = path.join(process.cwd(), 'appsettings.json');
const appsettings = JSON.parse(fs.readFileSync(appsettingsPath, 'utf-8'));

export class JwtToken 
{

    // Pegue as configurações do arquivo appsettings.json
    private static secretKey = appsettings.JwtConfig.SecretKey; // Chave secreta do arquivo de configuração
    private static expiresIn = appsettings.JwtConfig.ExpiresIn; // Tempo de expiração do token

    /**
     * Gera um JWT para um determinado payload (ex: id de usuário)
     * @param payload Dados que serão incluídos no token
     * @returns O token JWT e a data de expiração
     */
    public static generateToken(payload: object): { token: string; expiresAt: Date } 
    {

        const token = jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });

        // Calcular a data de expiração com base no tempo atual e o expiresIn
        const expiresAt = moment().add(expirationTimeInMilliseconds(this.expiresIn), 'milliseconds').tz(appsettings.timezone).toDate();

        return { token, expiresAt };

    }

    /**
     * Verifica se o token JWT é válido
     * @param token O token JWT
     * @returns O payload decodificado (JwtPayload ou string) ou null se inválido
     */
    public static verifyToken(token: string): jwt.JwtPayload | string | null 
    {
        try 
        {
            return jwt.verify(token, this.secretKey);
        } 
        catch (error) 
        {
            return null;
        }
    }
}
