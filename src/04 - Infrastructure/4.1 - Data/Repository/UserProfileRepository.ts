import { UserProfile } from "../../../02 - Domain/Entities/UserProfile";
import { IUserProfileRepository } from "../../../02 - Domain/Interfaces/IUserProfileRepository";
import { UserProfileModel } from "../Models/UserProfileModel";

export class UserProfileRepository implements IUserProfileRepository 
{

    public async findAll(): Promise<UserProfile[]> 
    {
        const userProfiles = await UserProfileModel.findAll();
        return userProfiles.map(userProfile => userProfile.toJSON() as UserProfile);
    }

    public async findById(id: string | number): Promise<UserProfile | null> 
    {
        const userProfile = await UserProfileModel.findOne({ where: { userId: id } });
        return userProfile ? userProfile.toJSON() as UserProfile : null;
    }

    public async save(userProfile: UserProfile): Promise<UserProfile> 
    {
        const createdUserProfile = await UserProfileModel.create(userProfile as any);
        return createdUserProfile.toJSON() as UserProfile;
    }

    public async update(userProfile: UserProfile): Promise<UserProfile | null> 
    {
        const existingUserProfile = await UserProfileModel.findOne({ where: { userId: userProfile.userId } });
        if (!existingUserProfile) {
            return null;
        }

        await UserProfileModel.update(userProfile, { where: { userId: userProfile.userId } });

        const updatedUserProfile = await UserProfileModel.findOne({ where: { userId: userProfile.userId } });
        return updatedUserProfile ? updatedUserProfile.toJSON() as UserProfile : null;
    }

    public async delete(userProfile: UserProfile): Promise<void> 
    {
        await UserProfileModel.destroy({ where: { userId: userProfile.userId } });
    }
}
