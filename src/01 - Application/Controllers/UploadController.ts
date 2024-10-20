import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { PdfProcessingService } from "../../03 - Service/PdfProcessingService";

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
     *     summary: Faz o upload de um arquivo PDF, lê seu conteúdo e salva os dados no banco de dados
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
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: Arquivo PDF para upload
     *     responses:
     *       201:
     *         description: PDF enviado, lido e processado com sucesso
     *       400:
     *         description: Erro no upload ou leitura do PDF
     */
    public async uploadAndProcessPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'Nenhum arquivo enviado.' });
                return;
            }

            // Caminho do arquivo PDF armazenado
            const pdfPath = req.file.path;

            // Ler o arquivo PDF
            const dataBuffer = fs.readFileSync(pdfPath);

            // Processar o PDF e salvar os dados no banco de dados
            await this.pdfProcessingService.processAndSavePdf(dataBuffer);

            // Responder com sucesso
            res.status(201).json({ message: 'PDF enviado, lido e processado com sucesso.' });
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

// Middleware de upload configurado para PDFs
export const upload = multer({ storage, fileFilter: pdfFilter });
