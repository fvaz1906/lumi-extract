import { Model, Table, Column, DataType, HasMany } from "sequelize-typescript";
import { BillingValueModel } from "./BillingValueModel";
import { ConsumptionHistoryModel } from "./ConsumptionHistoryModel";
import { PaymentInfoModel } from "./PaymentInfoModel";
import { InvoiceModel } from "./InvoiceModel";
import { TechnicalInfoModel } from "./TechnicalInfoModel";

@Table({ tableName: "installations", timestamps: true })
export class InstallationModel extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    numero_instalacao!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    cliente_nome!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    cliente_cnpj!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    cliente_ie!: string;

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    cliente_endereco!: object;

    @HasMany(() => BillingValueModel)
    billingValues!: BillingValueModel[];

    @HasMany(() => ConsumptionHistoryModel)
    consumptionHistory!: ConsumptionHistoryModel[];

    @HasMany(() => PaymentInfoModel)
    paymentInfo!: PaymentInfoModel[];

    @HasMany(() => InvoiceModel)
    invoices!: InvoiceModel[];

    @HasMany(() => TechnicalInfoModel)
    technicalInfo!: TechnicalInfoModel[];
}
