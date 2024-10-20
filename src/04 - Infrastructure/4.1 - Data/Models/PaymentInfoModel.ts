import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { InstallationModel } from "./InstallationModel";

@Table({ tableName: "payment_info", timestamps: true })
export class PaymentInfoModel extends Model {

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
    codigo_debito_automatico!: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    vencimento!: Date;

    @Column({
        type: DataType.DECIMAL,
        allowNull: true,
    })
    total_pagar!: number;

    @BelongsTo(() => InstallationModel)
    installation!: InstallationModel;
}