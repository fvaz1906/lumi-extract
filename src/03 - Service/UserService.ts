import { User } from "../02 - Domain/Entities/User";
import { UserProfile } from "../02 - Domain/Entities/UserProfile";
import { IUserRepository } from "../02 - Domain/Interfaces/IUserRepository";
import { IUserProfileRepository } from "../02 - Domain/Interfaces/IUserProfileRepository";
import { PasswordHasher } from "../04 - Infrastructure/4.2 - CrossCutting/Security/PasswordHasher";

export class UserService 
{

    private userRepository: IUserRepository;
    private userProfileRepository: IUserProfileRepository;

    constructor(
        userRepository: IUserRepository,
        userProfileRepository: IUserProfileRepository
    ) 
    {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public async findAll(): Promise<User[]> 
    {
        return this.userRepository.findAll();
    }
  
    public async findById(id: string): Promise<User | null> 
    {
        return this.userRepository.findById(id);
    }
  
    public async save(data: { name: string, email: string, password: string, enabled: boolean }): Promise<User> 
    {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) 
        {
            throw new Error('EMAIL_EXISTS'); // Lança um erro se o e-mail já existir
        }

        // Hasheia a senha
        const hashedPassword = await PasswordHasher.hashPassword(data.password);

        // Cria o novo usuário
        const user = await this.userRepository.save(new User({
            ...data,
            password: hashedPassword,
        }));

        const userProfile = new UserProfile({
            userId: user.id!,
            profileId: 2
        });

        await this.userProfileRepository.save(userProfile);

        return user;
    }
  
    public async update(id: string, data: { name?: string, email?: string, password?: string, enabled?: boolean }): Promise<User | null> 
    {
        const user = await this.userRepository.findById(id);
        if (!user) 
        {
            return null;
        }
    
        user.name = data.name || user.name;
        user.email = data.email || user.email;

        // Se uma nova senha for fornecida, hashear antes de atualizar
        if (data.password) 
        {
            user.password = await PasswordHasher.hashPassword(data.password);
        }

        user.enabled = data.enabled !== undefined ? data.enabled : user.enabled;
    
        return this.userRepository.update(user);
    }
  
    public async delete(id: string): Promise<boolean> 
    {
        const user = await this.userRepository.findById(id);
        if (!user) 
        {
            return false;
        }
        
        await this.userRepository.delete(user);
        return true;
    }

}