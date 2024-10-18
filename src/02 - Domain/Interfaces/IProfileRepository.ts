import { Profile } from "../Entities/Profile";

export interface IProfileRepository 
{
    findAll(): Promise<Profile[]>;
    findById(id: string): Promise<Profile | null>;
    save(profile: Profile): Promise<Profile>;
    update(profile: Profile): Promise<Profile | null>;
    delete(profile: Profile): Promise<void>;
}