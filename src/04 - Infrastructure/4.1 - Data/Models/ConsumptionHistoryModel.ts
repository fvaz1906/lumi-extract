import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { InstallationModel } from "./InstallationModel";

@Table({ tableName: "consumption_history", timestamps: true })
export class ConsumptionHistoryModel extends Model {

    @ForeignKey(() => InstallationModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    installation_id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'mes_ano',
    })
    mesAno!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    consumo!: number;

    @Column({
        type: DataType.DECIMAL,
        allowNull: true,
    })
    media!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    dias!: number;

    @BelongsTo(() => InstallationModel)
    installation!: InstallationModel;
}
