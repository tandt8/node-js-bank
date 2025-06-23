"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamImportService = void 0;
const chunkGenerator_1 = require("../../shared/utils/chunkGenerator");
const csvRowGenerator_1 = require("./csvRowGenerator");
const TransactionEntity_1 = require("../../infrastructure/orm/entities/TransactionEntity");
class StreamImportService {
    constructor(dataSource, batchSize = 1000) {
        this.dataSource = dataSource;
        this.batchSize = batchSize;
    }
    async importFile(filePath, batchId) {
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            const repo = runner.manager.getRepository(TransactionEntity_1.TransactionEntity);
            const rowsGen = (0, csvRowGenerator_1.parseCsvRowsFromStream)(filePath);
            for await (const batch of (0, chunkGenerator_1.chunk)(rowsGen, this.batchSize)) {
                await repo
                    .createQueryBuilder()
                    .insert()
                    .into(TransactionEntity_1.TransactionEntity)
                    .values(batch.map(row => ({
                    transaction_date: row.date,
                    description: row.description,
                    amount: row.amount,
                    type: row.type,
                    batch: { id: batchId },
                })))
                    .execute();
            }
            await runner.commitTransaction();
        }
        catch (err) {
            await runner.rollbackTransaction();
            throw err;
        }
        finally {
            await runner.release();
        }
    }
    async importStream(fileStream, batchId) {
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            const repo = runner.manager.getRepository(TransactionEntity_1.TransactionEntity);
            const rowsGen = (0, csvRowGenerator_1.parseCsvRowsFromStream)(fileStream);
            for await (const batch of (0, chunkGenerator_1.chunk)(rowsGen, this.batchSize)) {
                await repo
                    .createQueryBuilder()
                    .insert()
                    .into(TransactionEntity_1.TransactionEntity)
                    .values(batch.map(row => ({
                    transaction_date: row.date,
                    description: row.description,
                    amount: row.amount,
                    type: row.type,
                    batch: { id: batchId },
                })))
                    .execute();
            }
            await runner.commitTransaction();
        }
        catch (err) {
            await runner.rollbackTransaction();
            throw err;
        }
        finally {
            await runner.release();
        }
    }
}
exports.StreamImportService = StreamImportService;
