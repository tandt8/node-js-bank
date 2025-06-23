"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const transactionRoutes_1 = __importDefault(require("./presentation/routes/transactionRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'Bank Reconciliation API', version: '1.0.0' },
    },
    apis: ['./src/presentation/controllers/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
async function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.get('/api-docs', (req, res) => res.redirect('/api-docs/'));
    const routes = await transactionRoutes_1.default;
    app.use("/api/transactions", routes);
    return app;
}
exports.default = createApp;
