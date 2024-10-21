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
        allowNull: false,
    })
    mes_ano!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    consumo!: number;

    @Column({
        type: DataType.DECIMAL,
        allowNull: false,
    })
    media!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    dias!: number;

    @BelongsTo(() => InstallationModel)
    installation!: InstallationModel;
}
