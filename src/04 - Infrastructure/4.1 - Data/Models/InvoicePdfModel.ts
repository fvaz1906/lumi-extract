import {
    Model, Table, Column, DataType, ForeignKey, BelongsTo,
  } from 'sequelize-typescript';
  import { InstallationModel } from './InstallationModel';
  
  @Table({ tableName: 'invoice_pdfs', timestamps: true })
  export class InvoicePdfModel extends Model {
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    file_name!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    numero_cliente!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    mes_referencia!: string; // Nova coluna para o mês de referência
  
    @ForeignKey(() => InstallationModel)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    installation_id!: number;
  
    @BelongsTo(() => InstallationModel)
    installation!: InstallationModel;
  }
  