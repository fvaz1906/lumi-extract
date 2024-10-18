import crypto from 'crypto';

export class PasswordHasher 
{
    private static saltLength = 16;
    private static iterations = 100000;
    private static keylen = 64;
    private static digest = 'sha512';

    /**
     * Gera um hash a partir da senha fornecida
     * @param password A senha em texto puro
     * @returns O hash da senha
     */
    public static async hashPassword(password: string): Promise<string> 
    {
        const salt = crypto.randomBytes(this.saltLength).toString('hex');
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, this.iterations, this.keylen, this.digest, (err, derivedKey) => {
                if (err) reject(err);
                resolve(`${salt}:${derivedKey.toString('hex')}`);
            });
        });
    }

    /**
     * Compara uma senha em texto puro com um hash armazenado
     * @param password A senha em texto puro
     * @param hashedPassword O hash armazenado
     * @returns True se a senha for válida, false caso contrário
     */
    public static async comparePassword(password: string, hashedPassword: string): Promise<boolean> 
    {
        const [salt, key] = hashedPassword.split(':');
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, this.iterations, this.keylen, this.digest, (err, derivedKey) => {
                if (err) reject(err);
                resolve(key === derivedKey.toString('hex'));
            });
        });
    }
}