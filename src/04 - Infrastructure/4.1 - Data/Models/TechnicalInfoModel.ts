import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { InstallationModel } from "./InstallationModel";

@Table({ tableName: "technical_info", timestamps: true })
export class TechnicalInfoModel extends Model {

    @ForeignKey(() => InstallationModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    installation_id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    classe!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    subclasse!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    modalidade!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    leitura_anterior!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    leitura_atual!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    dias!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    consumo_energia!: number;

    @BelongsTo(() => InstallationModel)
    installation!: InstallationModel;
}
