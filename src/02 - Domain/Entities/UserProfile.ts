export class UserProfile 
{
    public id?: number;
    public userId: number;
    public profileId: number;
    public createdAt: Date;
    public updatedAt: Date;

    constructor({ id, userId, profileId, createdAt = new Date(), updatedAt = new Date()}: 
        { id?: number; userId: number; profileId: number; createdAt?: Date; updatedAt?: Date; })
    {
        this.id = id;
        this.userId = userId;
        this.profileId = profileId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}