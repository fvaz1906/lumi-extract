import { InstallationModel } from "../04 - Infrastructure/4.1 - Data/Models/InstallationModel";
import { BillingValueModel } from "../04 - Infrastructure/4.1 - Data/Models/BillingValueModel";
import { ConsumptionHistoryModel } from "../04 - Infrastructure/4.1 - Data/Models/ConsumptionHistoryModel";
import { PaymentInfoModel } from "../04 - Infrastructure/4.1 - Data/Models/PaymentInfoModel";
import { InvoiceModel } from "../04 - Infrastructure/4.1 - Data/Models/InvoiceModel";
import { TechnicalInfoModel } from "../04 - Infrastructure/4.1 - Data/Models/TechnicalInfoModel";

import pdfParse from "pdf-parse";


export class PdfProcessingService {

    // Método principal para ler, processar e inserir dados no banco de dados
    public async processAndSavePdf(dataBuffer: Buffer): Promise<void> {
        // 1. Extrair o texto do PDF
        const pdfData = await pdfParse(dataBuffer);
        const pdfContent = pdfData.text;

        // 2. Organizar os dados do PDF em uma estrutura legível
        const structuredData = this.organizePdfContent(pdfContent);

        console.log(structuredData);

        // 3. Inserir os dados no banco de dados
        await this.saveToDatabase(structuredData);
    }

    // Método para organizar o conteúdo do PDF em uma estrutura compreensível
    private organizePdfContent(pdfContent: string): any {
        // Exemplo de organização, ajuste de acordo com seus dados
        return {
            numeroInstalacao: this.extractNumeroInstalacao(pdfContent),
            dadosCliente: this.extractDadosCliente(pdfContent),
            valoresFaturados: this.extractValoresFaturados(pdfContent),
            historicoConsumo: this.extractHistoricoConsumo(pdfContent),
            informacoesPagamento: this.extractInformacoesPagamento(pdfContent),
            notaFiscal: this.extractNotaFiscal(pdfContent),
            informacoesTecnicas: this.extractInformacoesTecnicas(pdfContent)
        };
    }

    // Métodos de extração de dados específicos
    private extractNumeroInstalacao(content: string): string {
        const regex = /Nº DA INSTALAÇÃO\s+(\d+)/;
        const match = content.match(regex);
        return match ? match[1] : '';
    }

    private extractDadosCliente(content: string): any {
        // Regex para capturar o nome do cliente
        const nomeRegex = /(?<=Nome|NOME DO CLIENTE|CLIENTE\s*:\s*)([A-Z\s]+)/;
        const cnpjRegex = /CNPJ\s*:\s*(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/;
        const ieRegex = /INSCRIÇÃO ESTADUAL\s*:\s*(\d+)/;
        const enderecoRegex = /RUA\s+([A-Z0-9\s]+),?\s*(.*),?\s*(\d{5}-\d{3}),?\s*([A-Z]{2})/;
    
        const nomeMatch = content.match(nomeRegex);
        const cnpjMatch = content.match(cnpjRegex);
        const ieMatch = content.match(ieRegex);
        const enderecoMatch = content.match(enderecoRegex);
    
        return {
            nome: nomeMatch ? nomeMatch[1].trim() : "",
            cnpj: cnpjMatch ? cnpjMatch[1] : "",
            inscricaoEstadual: ieMatch ? ieMatch[1] : "",
            endereco: enderecoMatch ? {
                logradouro: enderecoMatch[1],
                bairro: enderecoMatch[2],
                cidade: "MONTES CLAROS", // Substituir pela captura, se disponível no PDF
                estado: enderecoMatch[4],
                cep: enderecoMatch[3]
            } : {}
        };
    }

    private extractValoresFaturados(content: string): any[] {
        // Regex genérico para capturar itens de faturamento, independente do tipo de item
        const regex = /([A-Za-z\s]+)\s+kWh\s+(\d+)\s+([\d,.]+)\s+([\d,.]+)\s+([\d,.]+)/g;
        const matches = Array.from(content.matchAll(regex));
    
        return matches.map(match => ({
            item: match[1].trim(),
            unidade: "kWh",
            quantidade: parseInt(match[2]),
            precoUnitario: parseFloat(match[3].replace(',', '.')),
            valor: parseFloat(match[4].replace(',', '.')),
            baseCalculo: parseFloat(match[5])
        }));
    }
    
    private extractHistoricoConsumo(content: string): any[] {
        // Regex para capturar o histórico de consumo (mês/ano, consumo, média, dias)
        const regex = /(\w{3}\/\d{2})\s+(\d+)\s+([\d,.]+)\s+(\d+)/g;
        const matches = Array.from(content.matchAll(regex));
    
        return matches.map(match => ({
            mesAno: match[1],
            consumo: parseInt(match[2]),
            media: parseFloat(match[3].replace(',', '.')),
            dias: parseInt(match[4])
        }));
    }
    
    private extractInformacoesPagamento(content: string): any {
        // Regex genérica para capturar informações de pagamento
        const regex = /Código de Débito Automático.*?(\d+).*?Vencimento\s*:\s*(\d{2}\/\d{2}\/\d{4}).*?Valor a pagar.*?([\d,.]+)/;
        const match = content.match(regex);
    
        return match ? {
            codigoDebitoAutomatico: match[1],
            vencimento: new Date(match[2].split('/').reverse().join('-')), // Converte para formato de data
            totalPagar: parseFloat(match[3].replace(',', '.'))
        } : {};
    }
    
    private extractNotaFiscal(content: string): any {
        // Regex genérica para capturar dados da nota fiscal
        const regex = /NOTA FISCAL Nº\s+(\d+).*?SÉRIE\s+(\d+).*?Data de emissão\s*:\s*(\d{2}\/\d{2}\/\d{4}).*?chave de acesso\s*:\s*(\d+).*?Protocolo de autorização\s*:\s*(\d+)/;
        const match = content.match(regex);
    
        return match ? {
            numero: match[1],
            serie: match[2],
            dataEmissao: new Date(match[3].split('/').reverse().join('-')),
            chaveAcesso: match[4],
            protocoloAutorizacao: match[5]
        } : {};
    }
    
    private extractInformacoesTecnicas(content: string): any {
        // Regex genérica para capturar informações técnicas
        const regex = /Classe\s*:\s*(\w+).*?Subclasse\s*:\s*(\w+).*?Modalidade Tarifária\s*:\s*(\w+).*?Anterior\s*:\s*(\d{2}\/\d{2}).*?Atual\s*:\s*(\d{2}\/\d{2}).*?(\d+)/;
        const match = content.match(regex);
    
        return match ? {
            classe: match[1],
            subclasse: match[2],
            modalidade: match[3],
            datasLeitura: {
                anterior: match[4],
                atual: match[5],
                dias: parseInt(match[6])
            },
            consumoEnergia: {
                consumo: parseInt(match[6])
            }
        } : {};
    }

    // Método para inserir os dados no banco de dados
    private async saveToDatabase(data: any): Promise<void> {
        // Verificar se a instalação já existe pelo número de instalação
        let installation = await InstallationModel.findOne({
            where: { numero_instalacao: data.numeroInstalacao }
        });

        if (!installation) {
            // Criar a instalação no banco de dados se não existir
            installation = await InstallationModel.create({
                numero_instalacao: data.numeroInstalacao,
                cliente_nome: data.dadosCliente.nome,
                cliente_cnpj: data.dadosCliente.cnpj,
                cliente_ie: data.dadosCliente.inscricaoEstadual,
                cliente_endereco: data.dadosCliente.endereco
            });
        } else {
            // Atualizar as informações da instalação existente
            await installation.update({
                cliente_nome: data.dadosCliente.nome,
                cliente_cnpj: data.dadosCliente.cnpj,
                cliente_ie: data.dadosCliente.inscricaoEstadual,
                cliente_endereco: data.dadosCliente.endereco
            });
        }

        // Inserir valores faturados
        for (const valor of data.valoresFaturados) {
            await BillingValueModel.create({
                installation_id: installation.id,
                ...valor
            });
        }

        // Inserir histórico de consumo
        for (const consumo of data.historicoConsumo) {
            await ConsumptionHistoryModel.create({
                installation_id: installation.id,
                ...consumo
            });
        }

        // Inserir informações de pagamento
        await PaymentInfoModel.create({
            installation_id: installation.id,
            ...data.informacoesPagamento
        });

        // Inserir nota fiscal
        await InvoiceModel.create({
            installation_id: installation.id,
            ...data.notaFiscal
        });

        // Inserir informações técnicas
        await TechnicalInfoModel.create({
            installation_id: installation.id,
            ...data.informacoesTecnicas
        });
    }

}
