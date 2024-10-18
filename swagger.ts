import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = 
{
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Lumi-Extract',
            version: '1.0.0',
            description: 'Documentação da API Lumi-Extract usando Swagger. Acesse o [swagger.json](http://localhost:3000/swagger.json) para exportar.',
        },
        servers: [
            {
                url: 'http://localhost:3000/api', // URL da API
            },
        ],
    },
    apis: ['./src/**/*.ts'], // Caminho para os arquivos onde estarão as anotações JSDoc
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Express, port: number) => 
{
    // Configurar a rota para a documentação Swagger
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Rota para servir o swagger.json
    app.get('/swagger.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log(`Swagger UI disponível em http://localhost:${port}/swagger`);
    console.log(`Swagger JSON disponível em http://localhost:${port}/swagger.json`);

};