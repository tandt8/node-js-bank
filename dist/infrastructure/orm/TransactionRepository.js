"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
class TransactionRepository {
    constructor(repo) {
        this.repo = repo;
    }
    setBatch(batch) {
        this.batch = batch;
    }
    async saveMany(transactions) {
        if (!this.batch)
            throw new Error("Batch not set");
        const entities = transactions.map(tx => this.repo.create({
            transaction_date: tx.date,
            description: tx.content,
            amount: tx.amount,
            type: tx.type,
            batch: this.batch,
        }));
        await this.repo.save(entities);
    }
}
exports.TransactionRepository = TransactionRepository;
