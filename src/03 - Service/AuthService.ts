import { UserRepository } from '../04 - Infrastructure/4.1 - Data/Repository/UserRepository';
import { PasswordHasher } from '../04 - Infrastructure/4.2 - CrossCutting/Security/PasswordHasher ';
import { JwtToken } from '../04 - Infrastructure/4.2 - CrossCutting/Security/JwtToken';

export class AuthService 
{
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) 
    {
        this.userRepository = userRepository;
    }

    public async login(email: string, password: string): Promise<{ token: string, expiresAt: Date } | null> 
    {
        const user = await this.userRepository.findAll();
        const filteredUser = user.find(u => u.email === email);

        if (!filteredUser) 
        {
            return null; // Usuário não encontrado
        }

        // Verificar a senha usando PasswordHasher
        const isPasswordValid = await PasswordHasher.comparePassword(password, filteredUser.password);

        if (!isPasswordValid) 
        {
            return null; // Senha incorreta
        }

        // Gerar um token JWT após autenticação bem-sucedida e pegar a data de expiração
        const { token, expiresAt } = JwtToken.generateToken({ id: filteredUser.id, email: filteredUser.email });

        // Retornar o token e a data de expiração
        return { token, expiresAt };
    }

}
