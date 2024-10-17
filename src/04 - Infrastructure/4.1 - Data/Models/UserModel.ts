import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({ tableName: "users", timestamps: true })
export class UserModel extends Model 
{
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    })
    enabled!: boolean;
    
}