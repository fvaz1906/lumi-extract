import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { InstallationModel } from "./InstallationModel";

@Table({ tableName: "billing_values", timestamps: true })
export class BillingValueModel extends Model {

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
    item!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    unidade!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    quantidade!: number;

    @Column({
        type: DataType.DECIMAL,
        allowNull: true,
    })
    preco_unitario!: number;

    @Column({
        type: DataType.DECIMAL,
        allowNull: true,
    })
    valor!: number;

    @Column({
        type: DataType.DECIMAL,
        allowNull: true,
    })
    base_calculo!: number;

    @BelongsTo(() => InstallationModel)
    installation!: InstallationModel;
}
