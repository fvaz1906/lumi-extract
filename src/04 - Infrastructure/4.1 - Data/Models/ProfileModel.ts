import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({ tableName: "profiles", timestamps: true })
export class ProfileModel extends Model {
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    role!: string;

    @Column({
        type: DataType.JSON,
        allowNull: true,
        defaultValue: [],
    })
    permissions!: string[];

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    createdAt!: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    updatedAt!: Date;
}