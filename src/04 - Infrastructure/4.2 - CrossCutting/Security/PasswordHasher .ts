import bcrypt from 'bcrypt';

export class PasswordHasher 
{

    private static saltRounds = 10;

    /**
     * Gera um hash a partir da senha fornecida
     * @param password A senha em texto puro
     * @returns O hash da senha
     */
    public static async hashPassword(password: string): Promise<string> 
    {
        return await bcrypt.hash(password, this.saltRounds);
    }

    /**
     * Compara uma senha em texto puro com um hash armazenado
     * @param password A senha em texto puro
     * @param hashedPassword O hash armazenado
     * @returns True se a senha for válida, false caso contrário
     */
    public static async comparePassword(password: string, hashedPassword: string): Promise<boolean> 
    {
        return await bcrypt.compare(password, hashedPassword);
    }

}