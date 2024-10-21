import { Sequelize } from 'sequelize-typescript';
import PdfProcessingService from '../03 - Service/PdfProcessingService';
import { InstallationModel } from '../04 - Infrastructure/4.1 - Data/Models/InstallationModel';
import { InvoicePdfModel } from '../04 - Infrastructure/4.1 - Data/Models/InvoicePdfModel';
import { BillingValueModel } from '../04 - Infrastructure/4.1 - Data/Models/BillingValueModel';
import { ConsumptionHistoryModel } from '../04 - Infrastructure/4.1 - Data/Models/ConsumptionHistoryModel';
import { PaymentInfoModel } from '../04 - Infrastructure/4.1 - Data/Models/PaymentInfoModel';
import { InvoiceModel } from '../04 - Infrastructure/4.1 - Data/Models/InvoiceModel';
import { TechnicalInfoModel } from '../04 - Infrastructure/4.1 - Data/Models/TechnicalInfoModel';
import path from 'path';

describe('PdfProcessingService', () => {
  let sequelize: Sequelize;
  const pdfProcessingService = new PdfProcessingService();
  const mockPdfPath = path.resolve(__dirname, 'mock-files', 'teste.pdf');

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: "oovaz",
      password: "P@ssw0rd",
      database: "oovaz",
      logging: false,
    });

    // Adiciona todos os modelos relacionados
    sequelize.addModels([
      InstallationModel,
      InvoicePdfModel,
      BillingValueModel,
      ConsumptionHistoryModel,
      PaymentInfoModel,
      InvoiceModel,
      TechnicalInfoModel
    ]);

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  it('deve realizar o parsing correto do PDF', async () => {
    const result = await pdfProcessingService.processPdf(mockPdfPath);
    expect(result).toHaveProperty('valoresFaturados');
  });

  it('deve extrair corretamente os valores faturados', async () => {
    const result = await pdfProcessingService.processPdf(mockPdfPath);
    expect(result.valoresFaturados).toBeInstanceOf(Array);
  });

  it('deve extrair o histórico de consumo corretamente', async () => {
    const result = await pdfProcessingService.processPdf(mockPdfPath);
    expect(result.historicoConsumo).toBeInstanceOf(Array);
  });
});
