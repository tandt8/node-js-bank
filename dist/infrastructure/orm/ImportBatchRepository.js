"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportBatchRepository = void 0;
class ImportBatchRepository {
    constructor(repo) {
        this.repo = repo;
    }
    async create(fileName, recordCount, userId) {
        const batch = this.repo.create({ file_name: fileName, record_count: recordCount, importedBy: userId ? { id: userId } : undefined });
        return this.repo.save(batch);
    }
    async markComplete(batchId) {
        await this.repo.update(batchId, { status: "completed" });
    }
    async markFailed(batchId, message) {
        await this.repo.update(batchId, { status: "failed", error_message: message });
    }
}
exports.ImportBatchRepository = ImportBatchRepository;
