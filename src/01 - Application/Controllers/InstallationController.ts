import { Request, Response, NextFunction } from "express";
import { InstallationModel } from "../../04 - Infrastructure/4.1 - Data/Models/InstallationModel";
import { BillingValueModel } from "../../04 - Infrastructure/4.1 - Data/Models/BillingValueModel";
import { ConsumptionHistoryModel } from "../../04 - Infrastructure/4.1 - Data/Models/ConsumptionHistoryModel";
import { PaymentInfoModel } from "../../04 - Infrastructure/4.1 - Data/Models/PaymentInfoModel";
import { InvoiceModel } from "../../04 - Infrastructure/4.1 - Data/Models/InvoiceModel";
import { TechnicalInfoModel } from "../../04 - Infrastructure/4.1 - Data/Models/TechnicalInfoModel";

/**
 * @swagger
 * tags:
 *   name: Instalações
 *   description: Endpoints relacionados à gestão de instalações e seus dados
 */
export class InstallationController {

    // Método para listar todas as instalações com informações básicas
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
     *                   cliente_nome:
     *                     type: string
     *       404:
     *         description: Nenhuma instalação encontrada
     */
    public async listInstallations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Buscar todas as instalações com informações básicas
            const installations = await InstallationModel.findAll({
                attributes: ['numero_instalacao', 'cliente_nome']
            });

            if (installations.length === 0) {
                res.status(404).json({ message: 'Nenhuma instalação encontrada' });
                return;
            }

            // Retornar a lista de instalações
            res.status(200).json(installations);
        } catch (error) {
            next(error);
        }
    }
    
    /**
     * @swagger
     * /installations/{numero_instalacao}:
     *   get:
     *     summary: Obtém todos os dados relacionados a uma instalação específica pelo número de instalação
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
     *                   type: object
     *                 invoices:
     *                   type: array
     *                 technicalInfo:
     *                   type: object
     *       404:
     *         description: Instalação não encontrada
     */
    public async getInstallationByNumero(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { numero_instalacao } = req.params;

            // Buscar a instalação pelo número de instalação
            const installation = await InstallationModel.findOne({
                where: { numero_instalacao },
                include: [
                    { model: BillingValueModel, as: 'billingValues' },
                    { model: ConsumptionHistoryModel, as: 'consumptionHistory' },
                    { model: PaymentInfoModel, as: 'paymentInfo' },
                    { model: InvoiceModel, as: 'invoices' },
                    { model: TechnicalInfoModel, as: 'technicalInfo' }
                ]
            });

            if (!installation) {
                res.status(404).json({ message: 'Instalação não encontrada' });
                return;
            }

            // Retornar os dados organizados
            res.status(200).json({
                installation,
                billingValues: installation.billingValues,
                consumptionHistory: installation.consumptionHistory,
                paymentInfo: installation.paymentInfo,
                invoices: installation.invoices,
                technicalInfo: installation.technicalInfo
            });
        } catch (error) {
            next(error);
        }
    }
}
