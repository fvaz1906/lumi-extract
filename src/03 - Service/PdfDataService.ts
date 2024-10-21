import { InstallationModel } from "../04 - Infrastructure/4.1 - Data/Models/InstallationModel";
import { BillingValueModel } from "../04 - Infrastructure/4.1 - Data/Models/BillingValueModel";
import { ConsumptionHistoryModel } from "../04 - Infrastructure/4.1 - Data/Models/ConsumptionHistoryModel";
import { PaymentInfoModel } from "../04 - Infrastructure/4.1 - Data/Models/PaymentInfoModel";
import { InvoicePdfModel } from '../04 - Infrastructure/4.1 - Data/Models/InvoicePdfModel';

class PdfDataService {
    public static async saveToDatabase(data: any): Promise<void> {
      try {
        // Verificar se a instalação já existe
        let installation = await InstallationModel.findOne({
            where: { numero_instalacao: data.dadosCliente.numeroInstalacao }
        });

        // Se a instalação não existir, criar uma nova
        if (!installation) {
            installation = await InstallationModel.create({
                numero_instalacao: data.dadosCliente.numeroInstalacao,
                numero_cliente: data.dadosCliente.numeroCliente
            });
        }

        await InvoicePdfModel.create({
            numero_cliente: data.dadosCliente.numeroCliente,
            mes_referencia: data.informacoesPagamento.mesReferencia,
            installation_id: installation.id,
            file_name: data.fileName
        });

        // Salvar os valores faturados
        for (const valorFaturado of data.valoresFaturados) {
            await BillingValueModel.create({
                installation_id: installation.id,
                item: valorFaturado.item,
                unidade: valorFaturado.unidade || 'kWh',
                quantidade: valorFaturado.quantidade,
                preco_unitario: valorFaturado.precoUnitario,
                valor: valorFaturado.valor,
                mes_referencia: data.informacoesPagamento.mesReferencia // Adiciona o mês de referência
            });
        }

        // Salvar o histórico de consumo
        for (const historico of data.historicoConsumo) {
            await ConsumptionHistoryModel.create({
                installation_id: installation.id,
                mes_ano: historico.mesAno,
                consumo: historico.consumo,
                media: historico.media,
                dias: historico.dias
            });
        }

        // Validar os campos de data para informações de pagamento
        const mesReferencia = data.informacoesPagamento.mesReferencia || null;
        const vencimento = data.informacoesPagamento.vencimento
            ? new Date(data.informacoesPagamento.vencimento)
            : null;
        const totalPagar = data.informacoesPagamento.totalPagar || null;

        // Salvar as informações de pagamento
        await PaymentInfoModel.create({
            installation_id: installation.id,
            mes_referencia: mesReferencia,
            vencimento: vencimento,
            total_pagar: totalPagar
        });

  
        console.log('Dados salvos com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar no banco de dados:', error);
      }
    }
  }
  
  export default PdfDataService;