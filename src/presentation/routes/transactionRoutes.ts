import { Router } from "express";
import multer from "multer";
import { TransactionController } from "../controllers/TransactionController";
import { ImportTransactionsUseCase } from "../../application/use-cases/ImportTransactionsUseCase";
import { ImportBatchRepository } from "../../infrastructure/orm/ImportBatchRepository";
import { StreamImportService } from "../../application/services/StreamImportService";
import dataSource from "../../config/ormconfig";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

export default (async () => {
  await dataSource.initialize();
  const batchRepo = new ImportBatchRepository(
    dataSource.getRepository("import_batches")
  );
  const importer  = new StreamImportService(dataSource, 1000);
  const useCase   = new ImportTransactionsUseCase(batchRepo, importer);
  const controller = new TransactionController(useCase);

  const router = Router();

  /**
   * @openapi
   * /api/transactions:
   *   get:
   *     tags:
   *       - Transactions
   *     summary: List all transactions
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 50
   *         description: Max number of items to return
   *     responses:
   *       '200':
   *         description: A list of transactions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Transaction'
   */
  router.get("/", controller.list);

  /**
   * @openapi
   * /api/transactions/import:
   *   post:
   *     tags:
   *       - Transactions
   *     summary: Import transactions from a CSV or gzip-compressed file
   *     description: >
   *       Uploads a CSV or gzipped CSV file of transactions, streams and processes the contents in batches.
   *       Accepts both plain .csv and .csv.gz files.
   *     consumes:
   *       - multipart/form-data
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: CSV or gzipped CSV file containing transactions
   *               userId:
   *                 type: integer
   *                 description: ID of the user performing the import
   *     responses:
   *       '200':
   *         description: Successfully imported transactions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 importedCount:
   *                   type: integer
   *                   description: Number of transactions imported
   *       '400':
   *         description: Bad request — missing file or invalid format
   *       '500':
   *         description: Internal server error
   */
  router.post(
    "/import",
    upload.single("file"),
    controller.import
  );
  
  return router;
})();
