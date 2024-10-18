import { IUserProfileRepository } from '../02 - Domain/Interfaces/IUserProfileRepository';
import { IUserRepository } from '../02 - Domain/Interfaces/IUserRepository';
import { IProfileRepository } from '../02 - Domain/Interfaces/IProfileRepository';
import { PasswordHasher } from '../04 - Infrastructure/4.2 - CrossCutting/Security/PasswordHasher';
import { JwtToken } from '../04 - Infrastructure/4.2 - CrossCutting/Security/JwtToken';

export class AuthService 
{
    private userRepository: IUserRepository;
    private userProfileRepository: IUserProfileRepository;
    private profileRepository: IProfileRepository;

    constructor(
        userRepository: IUserRepository,
        userProfileRepository: IUserProfileRepository,
        profileRepository: IProfileRepository,
    ) 
    {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.profileRepository = profileRepository;
    }

    public async login(email: string, password: string): Promise<{ token: string, expiresAt: Date } | null> 
    {
        // Buscar o usuário pelo e-mail
        const filteredUser = await this.userRepository.findByEmail(email);
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

        // Verificar se o ID do usuário está definido
        const userId = filteredUser.id;
        if (typeof userId !== 'number') 
        {
            return null; // ID do usuário inválido
        }

        // Buscar o perfil do usuário
        const profileUser = await this.userProfileRepository.findById(userId);
        if (!profileUser || typeof profileUser.profileId !== 'number') 
        {
            return null; // Perfil do usuário não encontrado ou ID do perfil inválido
        }

        // Buscar o perfil completo
        const profile = await this.profileRepository.findById(profileUser.profileId.toString());
        if (!profile) 
        {
            return null; // Perfil não encontrado
        }

        // Gerar um token JWT após autenticação bem-sucedida e obter a data de expiração
        const { token, expiresAt } = JwtToken.generateToken({
            id: userId,
            email: filteredUser.email,
            role: profile.role,
            permission: profile.permissions
        });

        // Retornar o token e a data de expiração
        return { token, expiresAt };
    }

}
