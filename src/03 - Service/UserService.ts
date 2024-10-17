import { User } from "../02 - Domain/Entities/User";
import { IUserRepository } from "../02 - Domain/Interfaces/IUserRepository";
import { PasswordHasher } from "../04 - Infrastructure/4.2 - CrossCutting/Security/PasswordHasher ";

export class UserService 
{

    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) 
    {
        this.userRepository = userRepository;
    }

    public async listUsers(): Promise<User[]> 
    {
        return this.userRepository.findAll();
    }
  
    public async findUserById(id: string): Promise<User | null> 
    {
        return this.userRepository.findById(id);
    }
  
    public async createUser(data: { name: string, email: string, password: string, enabled: boolean }): Promise<User> 
    {
        const hashedPassword = await PasswordHasher.hashPassword(data.password);

        const user = new User({
            ...data,
            password: hashedPassword,
        });

        return this.userRepository.save(user);
    }
  
    public async updateUser(id: string, data: { name?: string, email?: string, password?: string, enabled?: boolean }): Promise<User | null> 
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
  
    public async deleteUser(id: string): Promise<boolean> 
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