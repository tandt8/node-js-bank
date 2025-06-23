"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/ormconfig.ts
const typeorm_1 = require("typeorm");
const ImportBatchEntity_1 = require("../infrastructure/orm/entities/ImportBatchEntity");
const TransactionEntity_1 = require("../infrastructure/orm/entities/TransactionEntity");
const UserEnity_1 = require("../infrastructure/orm/entities/UserEnity"); // if you have it
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)({ path: path_1.default.resolve(process.cwd(), '.env.bank') });
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // Entities
    entities: [
        ImportBatchEntity_1.ImportBatchEntity,
        TransactionEntity_1.TransactionEntity,
        UserEnity_1.UserEntity // remove if you're not using users
    ],
    // Use migrations folder if you prefer
    migrations: ["migrations/*.sql"],
    // In dev you can enable auto-sync, but disable in production
    synchronize: false,
    logging: false,
});
