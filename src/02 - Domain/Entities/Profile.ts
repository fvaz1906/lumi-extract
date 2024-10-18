export class Profile 
{
    public id?: number;
    public role: string;
    public permissions: string[];

    constructor({ id, role, permissions = []}:
        { id?: number; role: string; permissions?: string[]; })
    {
        this.id = id;
        this.role = role;
        this.permissions = permissions;
    }
}