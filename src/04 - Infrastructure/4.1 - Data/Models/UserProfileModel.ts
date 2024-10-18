import { Model, Table, Column, DataType, ForeignKey } from "sequelize-typescript";
import { UserModel } from "./UserModel";
import { ProfileModel } from "./ProfileModel";

@Table({ tableName: "user_profiles", timestamps: true })
export class UserProfileModel extends Model {
    
    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId!: number;

    @ForeignKey(() => ProfileModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    profileId!: number;

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