import { UserProfile } from "../02 - Domain/Entities/UserProfile";
import { IUserProfileRepository } from "../02 - Domain/Interfaces/IUserProfileRepository";

export class UserProfileService 
{
    private userProfileRepository: IUserProfileRepository;

    constructor(userProfileRepository: IUserProfileRepository) 
    {
        this.userProfileRepository = userProfileRepository;
    }

    public async findAll(): Promise<UserProfile[]> 
    {
        return this.userProfileRepository.findAll();
    }

    public async findById(userId: string): Promise<UserProfile | null> 
    {
        return this.userProfileRepository.findById(userId);
    }

    public async save(data: { userId: number, profileId: number, role: string, permissions?: string[] }): Promise<UserProfile> 
    {
        const userProfile = new UserProfile({
            userId: data.userId,
            profileId: data.profileId
        });
        
        return this.userProfileRepository.save(userProfile);
    }

    public async update(userId: string, data: { profileId: number }): Promise<UserProfile | null> 
    {
        const userProfile = await this.userProfileRepository.findById(userId);
        if (!userProfile) {
            return null;
        }

        userProfile.profileId = data.profileId;

        return this.userProfileRepository.update(userProfile);
    }

    public async delete(userId: string): Promise<boolean> 
    {
        const userProfile = await this.userProfileRepository.findById(userId);
        if (!userProfile) {
            return false;
        }

        await this.userProfileRepository.delete(userProfile);
        return true;
    }
}
