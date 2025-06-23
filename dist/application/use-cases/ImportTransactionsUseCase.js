"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportTransactionsUseCase = void 0;
class ImportTransactionsUseCase {
    constructor(batchRepo, importer) {
        this.batchRepo = batchRepo;
        this.importer = importer;
    }
    async execute(fileName, filePath, userId) {
        const batch = await this.batchRepo.create(fileName, 0, userId);
        try {
            await this.importer.importFile(filePath, batch.id);
            await this.batchRepo.markComplete(batch.id);
        }
        catch (err) {
            await this.batchRepo.markFailed(batch.id, err.message);
            throw err;
        }
    }
}
exports.ImportTransactionsUseCase = ImportTransactionsUseCase;
