export class User 
{
    
    public id?: number;
    public name: string;
    public email: string;
    public password: string;
    public enabled: boolean;
  
    constructor({ id, name, email, password, enabled = true }: 
        { id?: number; name: string; email: string; password: string, enabled?: boolean }) 
    {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
    }
    
}