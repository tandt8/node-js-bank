import { Transaction } from "../entities/Transaction";
export interface ITransactionRepository {
  saveMany(transactions: Transaction[]): Promise<void>;
}
