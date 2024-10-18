import { Profile } from "../02 - Domain/Entities/Profile";
import { IProfileRepository } from "../02 - Domain/Interfaces/IProfileRepository";

export class ProfileService 
{
    private profileRepository: IProfileRepository;

    constructor(profileRepository: IProfileRepository) 
    {
        this.profileRepository = profileRepository;
    }

    public async findAll(): Promise<Profile[]> 
    {
        return this.profileRepository.findAll();
    }

    public async findById(id: string): Promise<Profile | null> 
    {
        return this.profileRepository.findById(id);
    }

    public async save(data: { role: string, permissions?: string[] }): Promise<Profile> 
    {
        const profile = new Profile({
            role: data.role,
            permissions: data.permissions || [],
        });

        return this.profileRepository.save(profile);
    }

    public async update(id: string, data: { role?: string, permissions?: string[] }): Promise<Profile | null> 
    {
        const profile = await this.profileRepository.findById(id);
        if (!profile) {
            return null;
        }

        profile.role = data.role || profile.role;
        profile.permissions = data.permissions || profile.permissions;

        return this.profileRepository.update(profile);
    }

    public async delete(id: string): Promise<boolean> 
    {
        const profile = await this.profileRepository.findById(id);
        if (!profile) {
            return false;
        }

        await this.profileRepository.delete(profile);
        return true;
    }
}
