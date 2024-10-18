import { UserProfile } from "../Entities/UserProfile";

export interface IUserProfileRepository 
{
    findAll(): Promise<UserProfile[]>;
    findById(id: string | number): Promise<UserProfile | null> 
    save(userProfile: UserProfile): Promise<UserProfile>;
    update(userProfile: UserProfile): Promise<UserProfile | null>;
    delete(userProfile: UserProfile): Promise<void>;
}