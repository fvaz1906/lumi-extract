import { User } from "../../../02 - Domain/Entities/User";
import { IUserRepository } from "../../../02 - Domain/Interfaces/IUserRepository";
import { UserModel } from "../Models/UserModel";

export class UserRepository implements IUserRepository 
{
    
    public async findAll(): Promise<User[]> 
    {
        const users = await UserModel.findAll();
        return users.map(user => user.toJSON() as User);
    }

    public async findById(id: string): Promise<User | null> 
    {
        const user = await UserModel.findByPk(id);
        return user ? user.toJSON() as User : null;
    }

    public async save(user: User): Promise<User> 
    {
        const createdUser = await UserModel.create(user as any);
        return createdUser.toJSON() as User;
    }
    
    public async update(user: User): Promise<User | null> 
    {
        const existingUser = await UserModel.findByPk(user.id);
        if (!existingUser) 
        {
            return null;
        }

        await UserModel.update(user, { where: { id: user.id } });

        const updatedUser = await UserModel.findByPk(user.id);
        return updatedUser ? updatedUser.toJSON() as User : null;
    }
    
    public async delete(user: User): Promise<void> 
    {
        await UserModel.destroy({ where: { id: user.id } });
    }

}