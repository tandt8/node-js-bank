"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const TransactionController_1 = require("../controllers/TransactionController");
const ImportTransactionsUseCase_1 = require("../../application/use-cases/ImportTransactionsUseCase");
const ImportBatchRepository_1 = require("../../infrastructure/orm/ImportBatchRepository");
const StreamImportService_1 = require("../../application/services/StreamImportService");
const ormconfig_1 = __importDefault(require("../../config/ormconfig"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});
exports.default = (async () => {
    await ormconfig_1.default.initialize();
    const batchRepo = new ImportBatchRepository_1.ImportBatchRepository(ormconfig_1.default.getRepository("import_batches"));
    const importer = new StreamImportService_1.StreamImportService(ormconfig_1.default, 1000);
    const useCase = new ImportTransactionsUseCase_1.ImportTransactionsUseCase(batchRepo, importer);
    const controller = new TransactionController_1.TransactionController(useCase);
    /**
   * @openapi
   * /api/transactions/import:
   *   post:
   *     summary: Import transactions from a gzip stream
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
   *               fileName:
   *                 type: string
   *               userId:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Imported batch
   *       500:
   *         description: Server error
   */
    router.post("/import", upload.single("file"), controller.import);
    return router;
})();
