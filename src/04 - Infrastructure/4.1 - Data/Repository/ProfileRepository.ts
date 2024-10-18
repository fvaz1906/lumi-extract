import { Profile } from "../../../02 - Domain/Entities/Profile";
import { IProfileRepository } from "../../../02 - Domain/Interfaces/IProfileRepository";
import { ProfileModel } from "../Models/ProfileModel";

export class ProfileRepository implements IProfileRepository 
{

    public async findAll(): Promise<Profile[]> 
    {
        const profiles = await ProfileModel.findAll();
        return profiles.map(profile => profile.toJSON() as Profile);
    }

    public async findById(id: string): Promise<Profile | null> 
    {
        const profile = await ProfileModel.findByPk(id);
        return profile ? profile.toJSON() as Profile : null;
    }

    public async save(profile: Profile): Promise<Profile> 
    {
        const createdProfile = await ProfileModel.create(profile as any);
        return createdProfile.toJSON() as Profile;
    }

    public async update(profile: Profile): Promise<Profile | null> 
    {
        const existingProfile = await ProfileModel.findByPk(profile.id);
        if (!existingProfile) {
            return null;
        }

        await ProfileModel.update(profile, { where: { id: profile.id } });

        const updatedProfile = await ProfileModel.findByPk(profile.id);
        return updatedProfile ? updatedProfile.toJSON() as Profile : null;
    }

    public async delete(profile: Profile): Promise<void> 
    {
        await ProfileModel.destroy({ where: { id: profile.id } });
    }
}
