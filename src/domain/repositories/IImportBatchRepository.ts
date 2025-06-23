import { ImportBatchEntity } from "../../infrastructure/orm/entities/ImportBatchEntity";
export interface IImportBatchRepository {
  create(fileName: string, recordCount: number, userId?: number): Promise<ImportBatchEntity>;
  markComplete(batchId: number): Promise<void>;
  markFailed(batchId: number, message: string): Promise<void>;
}
