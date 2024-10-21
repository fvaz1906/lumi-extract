import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import PdfProcessingService from "../../03 - Service/PdfProcessingService";

/**
 * @swagger
 * tags:
 *   name: PDF Upload
 *   description: Endpoints relacionados ao upload e processamento de arquivos PDF
 */
export class UploadController {

    private pdfProcessingService: PdfProcessingService;

    constructor() {
        this.pdfProcessingService = new PdfProcessingService(); // Inicializa o serviço de processamento
    }

    /**
     * @swagger
     * /upload:
     *   post:
     *     summary: Faz o upload de múltiplos arquivos PDF, lê seu conteúdo e salva os dados no banco de dados
     *     tags: [PDF Upload]
     *     consumes:
     *       - multipart/form-data
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               files:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: binary
     *                 description: Arquivos PDF para upload
     *     responses:
     *       201:
     *         description: Todos os PDFs foram enviados e processados com sucesso
     *       400:
     *         description: Erro no upload ou leitura dos PDFs
     */
    public async processPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
                res.status(400).json({ message: 'Nenhum arquivo enviado.' });
                return;
            }

            // Iterar sobre cada arquivo recebido
            for (const file of req.files as Express.Multer.File[]) {
                const pdfPath = file.path;

                try {
                    // Processar o PDF e salvar os dados no banco de dados
                    await this.pdfProcessingService.processPdf(pdfPath);
                } catch (error) {
                    console.error(`Erro ao processar o arquivo ${file.originalname}:`, error);
                    // Continuar com o próximo arquivo
                    continue;
                }
            }

            // Responder com sucesso
            res.status(201).json({ message: 'Todos os PDFs foram enviados e processados com sucesso.' });
        } catch (error) {
            next(error);
        }
    }
}

// Configuração do diretório de uploads
const uploadDir = path.join(__dirname, '../../../uploads');

// Cria o diretório de uploads se não existir
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer para arquivos PDF
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Diretório de destino para os arquivos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro para garantir que o arquivo seja um PDF
const pdfFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Apenas arquivos PDF são permitidos.'));
    }
};

// Middleware de upload configurado para múltiplos PDFs
export const upload = multer({ storage, fileFilter: pdfFilter }).array('files'); // Permite o upload de múltiplos arquivos
