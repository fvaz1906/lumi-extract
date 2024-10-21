import {
    Model, Table, Column, DataType, HasMany,
  } from 'sequelize-typescript';
  import { BillingValueModel } from './BillingValueModel';
  import { ConsumptionHistoryModel } from './ConsumptionHistoryModel';
  import { PaymentInfoModel } from './PaymentInfoModel';
  import { InvoiceModel } from './InvoiceModel';
  import { TechnicalInfoModel } from './TechnicalInfoModel';
  import { InvoicePdfModel } from './InvoicePdfModel'; // Importação do modelo de PDF
  
  @Table({ tableName: 'installations', timestamps: true })
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
    numero_cliente!: string;
  
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
  
    @HasMany(() => InvoicePdfModel) // Relacionamento com o modelo de PDF
    invoicePdfs!: InvoicePdfModel[];
  }
  