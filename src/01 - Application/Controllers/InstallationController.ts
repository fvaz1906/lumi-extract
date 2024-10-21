import { Request, Response, NextFunction } from "express";
import { InstallationModel } from "../../04 - Infrastructure/4.1 - Data/Models/InstallationModel";
import { BillingValueModel } from "../../04 - Infrastructure/4.1 - Data/Models/BillingValueModel";
import { ConsumptionHistoryModel } from "../../04 - Infrastructure/4.1 - Data/Models/ConsumptionHistoryModel";
import { PaymentInfoModel } from "../../04 - Infrastructure/4.1 - Data/Models/PaymentInfoModel";
import { InvoiceModel } from "../../04 - Infrastructure/4.1 - Data/Models/InvoiceModel";
import { TechnicalInfoModel } from "../../04 - Infrastructure/4.1 - Data/Models/TechnicalInfoModel";
import { InvoicePdfModel } from "../../04 - Infrastructure/4.1 - Data/Models/InvoicePdfModel";

import path from "path";
import * as fs from "fs";

/**
 * @swagger
 * tags:
 *   name: Instalações
 *   description: Endpoints relacionados à gestão de instalações e seus dados
 */
export class InstallationController {
  /**
   * @swagger
   * /installations:
   *   get:
   *     summary: Lista todas as instalações com informações básicas
   *     tags: [Instalações]
   *     responses:
   *       200:
   *         description: Lista de instalações
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   numero_instalacao:
   *                     type: string
   *                   numero_cliente:
   *                     type: string
   *       404:
   *         description: Nenhuma instalação encontrada
   */
  public async listInstallations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const installations = await InstallationModel.findAll({
        attributes: ['numero_instalacao', 'numero_cliente']
      });

      if (installations.length === 0) {
        res.status(404).json({ message: 'Nenhuma instalação encontrada' });
        return;
      }

      res.status(200).json(installations);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /installations/{numero_cliente}:
   *   get:
   *     summary: Obtém todos os dados relacionados a uma instalação específica pelo número de cliente
   *     tags: [Instalações]
   *     parameters:
   *       - in: path
   *         name: numero_instalacao
   *         schema:
   *           type: string
   *         required: true
   *         description: Número de instalação
   *     responses:
   *       200:
   *         description: Dados da instalação encontrados
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 installation:
   *                   type: object
   *                 billingValues:
   *                   type: array
   *                 consumptionHistory:
   *                   type: array
   *                 paymentInfo:
   *                   type: array
   *                 invoices:
   *                   type: array
   *                 technicalInfo:
   *                   type: array
   *       404:
   *         description: Instalação não encontrada
   */
  public async getInstallationByNumeroCliente(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { numero_cliente } = req.params;

      const installation = await InstallationModel.findOne({
        where: { numero_cliente },
        include: [
          { model: BillingValueModel, as: 'billingValues' },
          { model: ConsumptionHistoryModel, as: 'consumptionHistory' },
          { model: PaymentInfoModel, as: 'paymentInfo' },
          { model: InvoiceModel, as: 'invoices' },
          { model: TechnicalInfoModel, as: 'technicalInfo' }
        ]
      });

      if (!installation) {
        res.status(404).json({ message: 'Cliente não encontrado' });
        return;
      }

      res.status(200).json(installation);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /installations/faturas/{numero_cliente}:
   *   get:
   *     summary: Lista todas as faturas de um cliente específico
   *     description: Busca todas as faturas relacionadas a um determinado número de cliente.
   *     tags: [Instalações]
   *     parameters:
   *       - in: path
   *         name: numero_cliente
   *         required: true
   *         schema:
   *           type: string
   *         description: O número do cliente
   *     responses:
   *       200:
   *         description: Lista de faturas do cliente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   numero_cliente:
   *                     type: string
   *                   mes_referencia:
   *                     type: string
   *                   file_name:
   *                     type: string
   *       404:
   *         description: Nenhuma fatura encontrada para o cliente
   *       500:
   *         description: Erro ao processar a solicitação
   */
  public async getInvoicesByClientNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { numero_cliente } = req.params;

      // Busca todas as faturas do cliente
      const invoices = await InvoicePdfModel.findAll({
        where: { numero_cliente },
        attributes: ['id', 'numero_cliente', 'mes_referencia', 'file_name']
      });

      if (invoices.length === 0) {
        res.status(404).json({ message: 'Nenhuma fatura encontrada para o cliente' });
        return;
      }

      res.status(200).json(invoices);
    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao processar a solicitação', error: error.message });
      next(error);
    }
  }

  /**
   * @swagger
   * /installations/download/{id}:
   *   get:
   *     summary: Faz o download de uma fatura específica
   *     description: Permite o download de um arquivo PDF de uma fatura específica usando seu ID.
   *     tags: [Instalações]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: O ID da fatura
   *     responses:
   *       200:
   *         description: Download do arquivo PDF
   *         content:
   *           application/pdf:
   *             schema:
   *               type: string
   *               format: binary
   *       404:
   *         description: Fatura ou arquivo não encontrado
   *       500:
   *         description: Erro ao processar a solicitação
   */
  public async downloadInvoiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Busca a fatura pelo ID
      const invoice = await InvoicePdfModel.findByPk(id);

      if (!invoice) {
        res.status(404).json({ message: 'Fatura não encontrada' });
        return;
      }

      // Caminho do arquivo PDF
      const filePath = path.join(__dirname, '../../../uploads', invoice.file_name);

      // Verifica se o arquivo existe
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ message: 'Arquivo não encontrado no servidor' });
        return;
      }

      // Realiza o download do arquivo
      res.download(filePath, invoice.file_name);
    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao processar a solicitação', error: error.message });
      next(error);
    }
  }
}
