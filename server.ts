// server.ts
import "reflect-metadata";
import express from "express";
import { Sequelize } from "sequelize-typescript";
import fs from 'fs';
import path from 'path';
import cors from 'cors';

import { swaggerDocs } from "./swagger";
import { appRoutes } from "./src/01 - Application/Routes/AppRoutes";
import { authRoutes } from "./src/01 - Application/Routes/AuthRoutes";
import { UserModel } from "./src/04 - Infrastructure/4.1 - Data/Models/UserModel";
import { UserProfileModel } from "./src/04 - Infrastructure/4.1 - Data/Models/UserProfileModel";
import { ProfileModel } from "./src/04 - Infrastructure/4.1 - Data/Models/ProfileModel";
import { BillingValueModel } from "./src/04 - Infrastructure/4.1 - Data/Models/BillingValueModel";
import { ConsumptionHistoryModel } from "./src/04 - Infrastructure/4.1 - Data/Models/ConsumptionHistoryModel";
import { InstallationModel } from "./src/04 - Infrastructure/4.1 - Data/Models/InstallationModel";
import { InvoiceModel } from "./src/04 - Infrastructure/4.1 - Data/Models/InvoiceModel";
import { PaymentInfoModel } from "./src/04 - Infrastructure/4.1 - Data/Models/PaymentInfoModel";
import { TechnicalInfoModel } from "./src/04 - Infrastructure/4.1 - Data/Models/TechnicalInfoModel";

const appsettingsPath = path.resolve(__dirname, 'appsettings.json');
const appsettings = JSON.parse(fs.readFileSync(appsettingsPath, 'utf-8'));

const app = express();

app.use(cors({ origin: '*' }))

app.use(express.json());

const sequelize = new Sequelize({
    dialect: appsettings.database.dialect,
    host: appsettings.database.host,
    username: appsettings.database.username,
    password: appsettings.database.password,
    database: appsettings.database.database,
    models: [
        UserModel,
        UserProfileModel,
        ProfileModel,
        BillingValueModel,
        ConsumptionHistoryModel,
        InstallationModel,
        InvoiceModel,
        PaymentInfoModel,
        TechnicalInfoModel,
    ],
});

sequelize.sync().then(() => {
    console.log("Banco de dados sincronizado.");
});

// recriar todas as tabelas
// sequelize.sync({ force: true }).then(() => {
//     console.log("Banco de dados sincronizado com força. Todas as tabelas foram recriadas.");
// }).catch((error) => {
//     console.error("Erro ao sincronizar o banco de dados:", error);
// });

app.use("/api", authRoutes);
app.use("/api", appRoutes);

const port = appsettings.port || 3000;
swaggerDocs(app, port);

app.listen(port, () => {
    console.log(`Servidor disponível em http://localhost:${port}`);
});