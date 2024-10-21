import fs from 'fs';
import pdfParse from 'pdf-parse';

import PdfDataService from './PdfDataService';
import path from 'path';

class PdfProcessingService {

    private pdfDataService: PdfDataService;

    constructor() {
        this.pdfDataService = new PdfDataService(); // Instancia o serviço
    }
    
    // Método principal para ler e processar o PDF
    public async processPdf(filePath: string): Promise<any> {
        try {
            // Ler o arquivo PDF
            const dataBuffer = fs.readFileSync(filePath);

            // Extrair o texto usando pdf-parse
            const pdfData = await pdfParse(dataBuffer);
            const pdfContent = pdfData.text;

            // Organizar o conteúdo do PDF em um JSON
            const structuredData = this.organizePdfContent(pdfContent);

            // Obter o nome do arquivo
            const fileName = path.basename(filePath);

            // Adicionar o nome do arquivo aos dados estruturados
            structuredData.fileName = fileName;

            // Enviar dados tratados para o banco de dados
            await PdfDataService.saveToDatabase(structuredData);

            return structuredData;
        } catch (error) {
            console.error('Erro ao processar o PDF:', error);
            throw error;
        }
    }

    // Método para organizar o conteúdo do PDF
    private organizePdfContent(pdfContent: string): any {
        const lines = pdfContent.split('\n').map(line => line.trim());
        const data: any = {
            valoresFaturados: [],
            historicoConsumo: [],
            dadosCliente: {
                numeroInstalacao: '',
                numeroCliente: ''
            },
            informacoesPagamento: {
                mesReferencia: '',
                vencimento: '',
                totalPagar: ''
            }
        };

        let currentSection = '';

        lines.forEach(line => {
            // Detectar seção de valores faturados
            if (line.includes('Valores Faturados')) {
                currentSection = 'valoresFaturados';
                return;
            }

            // Detectar seção de histórico de consumo
            if (line.includes('Histórico de Consumo')) {
                currentSection = 'historicoConsumo';
                return;
            }

            // Detectar número do cliente e instalação
            if (line.includes('Nº DO CLIENTE')) {
                currentSection = 'dadosCliente';
                this.extractDadosCliente(line, lines, data.dadosCliente);
                return;
            }

            // Detectar informações de pagamento
            if (line.includes('Referente a')) {
                currentSection = 'informacoesPagamento';
                this.extractInformacoesPagamento(line, lines, data.informacoesPagamento);
                return;
            }

            // Extração de dados com base na seção atual
            if (currentSection === 'valoresFaturados') {
                this.extractValoresFaturados(line, data.valoresFaturados);
            }

            if (currentSection === 'historicoConsumo') {
                this.extractHistoricoConsumo(line, data.historicoConsumo);
            }
        });

        return data;
    }

    // Extração de valores faturados usando regex
    private extractValoresFaturados(line: string, valoresFaturados: any[]): void {
        // Regex para capturar itens de "Valores Faturados"
        const regex = /(Energia Elétrica|Energia SCEE s\/ ICMS|Energia compensada GD I|Contrib Ilum Publica Municipal)\s*(?:kWh\s+(\d+)\s+([\d,.]+)\s+([-]?[\d,.]+))?/;
        const match = line.match(regex);

        if (match) {
            const item = match[1];
            const quantidade = match[2] ? parseInt(match[2], 10) : null;
            const precoUnitario = match[3] ? parseFloat(match[3].replace(',', '.')) : null;
            const valor = match[4] ? parseFloat(match[4].replace(',', '.')) : parseFloat(line.match(/([\d,.]+)$/)?.[1] ?? '0');

            valoresFaturados.push({
                item,
                quantidade,
                precoUnitario,
                valor
            });
        } else {
            const totalMatch = line.match(/TOTAL\s+([\d,.]+)/);
            if (totalMatch) {
                valoresFaturados.push({
                    item: 'TOTAL',
                    valor: parseFloat(totalMatch[1].replace(',', '.'))
                });
            }
        }
    }

    // Extração do histórico de consumo usando regex
    private extractHistoricoConsumo(line: string, historicoConsumo: any[]): void {
        const regex = /(\w{3}\/\d{2})\s+(\d+)\s+([\d,.]+)\s+(\d+)/;
        const match = line.match(regex);

        if (match) {
            historicoConsumo.push({
                mesAno: match[1],
                consumo: parseInt(match[2], 10),
                media: parseFloat(match[3].replace(',', '.')),
                dias: parseInt(match[4], 10)
            });
        }
    }

    // Extração do número do cliente e instalação
    private extractDadosCliente(line: string, lines: string[], dadosCliente: any): void {
        const clienteLineIndex = lines.findIndex(l => l.includes('Nº DO CLIENTE'));
        if (clienteLineIndex !== -1) {
            const clienteLine = lines[clienteLineIndex + 1];
            const match = clienteLine.match(/(\d+)\s+(\d+)/);
            if (match) {
                dadosCliente.numeroCliente = match[1];
                dadosCliente.numeroInstalacao = match[2];
            }
        }
    }

    // Extração das informações de pagamento
    private extractInformacoesPagamento(line: string, lines: string[], informacoesPagamento: any): void {
        const mesReferenciaMatch = line.match(/Referente a\s+([A-Z]{3}\/\d{4})/);
        if (mesReferenciaMatch) {
            informacoesPagamento.mesReferencia = mesReferenciaMatch[1];
        } else {
            const referenciaLine = lines.find(l => l.match(/^\s*[A-Z]{3}\/\d{4}/));
            if (referenciaLine) {
                const match = referenciaLine.match(/^([A-Z]{3}\/\d{4})/);
                if (match) {
                    informacoesPagamento.mesReferencia = match[1];
                }
            }
        }

        const vencimentoLine = lines.find(l => l.includes('Vencimento'));
        if (vencimentoLine) {
            const match = vencimentoLine.match(/Vencimento\s+(\d{2}\/\d{2}\/\d{4})/);
            if (match) {
                informacoesPagamento.vencimento = match[1];
            }
        }

        const totalPagarLine = lines.find(l => l.includes('Valor a pagar'));
        if (totalPagarLine) {
            const match = totalPagarLine.match(/Valor a pagar\s+\(R\$\)\s+([\d,.]+)/);
            if (match) {
                informacoesPagamento.totalPagar = parseFloat(match[1].replace(',', '.'));
            }
        }
    }
}

export default PdfProcessingService;
