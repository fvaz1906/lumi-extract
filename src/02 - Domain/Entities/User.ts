export class User 
{
    public id?: number;
    public name: string;
    public email: string;
    public password: string;
    public enabled: boolean;
    public createdAt: Date;
    public updatedAt: Date;
  
    constructor({ id, name, email, password, enabled = true, createdAt = new Date(), updatedAt = new Date() }: 
        { id?: number; name: string; email: string; password: string, enabled?: boolean, createdAt?: Date; updatedAt?: Date; }) 
    {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}