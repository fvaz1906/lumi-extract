import { User } from "../Entities/User";

export interface IUserRepository 
{
    findAll(): Promise<User[]> 
    findById(id: string): Promise<User | null> 
    save(user: User): Promise<User> 
    update(user: User): Promise<User | null> 
    delete(user: User): Promise<void> 
}