import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { InstallationModel } from "./InstallationModel";

@Table({ tableName: "invoices", timestamps: true })
export class InvoiceModel extends Model {

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
    numero!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    serie!: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    data_emissao!: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    chave_acesso!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    protocolo_autorizacao!: string;

    @BelongsTo(() => InstallationModel)
    installation!: InstallationModel;
}
