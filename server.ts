// server.ts
import "reflect-metadata";
import express from "express";
import { Sequelize } from "sequelize-typescript";
import fs from 'fs';
import path from 'path';

import { swaggerDocs } from "./swagger";
import { userRoutes } from "./src/01 - Application/Routes/UserRoutes";
import { authRoutes } from "./src/01 - Application/Routes/AuthRoutes";
import { UserModel } from "./src/04 - Infrastructure/4.1 - Data/Models/UserModel";

const appsettingsPath = path.resolve(__dirname, 'appsettings.json');
const appsettings = JSON.parse(fs.readFileSync(appsettingsPath, 'utf-8'));

const app = express();
app.use(express.json());

const sequelize = new Sequelize({
    dialect: appsettings.database.dialect,
    host: appsettings.database.host,
    username: appsettings.database.username,
    password: appsettings.database.password,
    database: appsettings.database.database,
    models: [
        UserModel
    ],
});

sequelize.sync().then(() => {
    console.log("Banco de dados sincronizado.");
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);

const port = appsettings.port || 3000;
swaggerDocs(app, port);

app.listen(port, () => {
    console.log(`Servidor disponível em http://localhost:${port}`);
});