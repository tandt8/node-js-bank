import { Repository } from "typeorm";
import { TransactionEntity } from "./entities/TransactionEntity";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { ImportBatchEntity } from "./entities/ImportBatchEntity";
import { Transaction } from "../../domain/entities/Transaction";

export class TransactionRepository implements ITransactionRepository {
  constructor(private repo: Repository<TransactionEntity>) {}

  private batch: ImportBatchEntity | undefined;

  setBatch(batch: ImportBatchEntity) {
    this.batch = batch;
  }

  async saveMany(transactions: Transaction[]): Promise<void> {
    if (!this.batch) throw new Error("Batch not set");
    const entities = transactions.map(tx =>
      this.repo.create({
        transaction_date: tx.date,
        description: tx.content,
        amount: tx.amount,
        type: tx.type,
        batch: this.batch,
      })
    );
    await this.repo.save(entities);
  }
}
