import { Repository } from "typeorm";
import { ImportBatchEntity } from "./entities/ImportBatchEntity";
import { IImportBatchRepository } from "../../domain/repositories/IImportBatchRepository";

export class ImportBatchRepository implements IImportBatchRepository {
  constructor(private repo: Repository<ImportBatchEntity>) {}

  async create(fileName: string, recordCount: number, userId?: number) {
    const batch = this.repo.create({ file_name: fileName, record_count: recordCount, importedBy: userId ? { id: userId } as any : undefined });
    return this.repo.save(batch);
  }

  async markComplete(batchId: number) {
    await this.repo.update(batchId, { status: "completed" });
  }

  async markFailed(batchId: number, message: string) {
    await this.repo.update(batchId, { status: "failed", error_message: message });
  }
}
