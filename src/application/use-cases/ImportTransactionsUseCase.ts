import { Readable } from "stream";
import { IImportBatchRepository } from "../../domain/repositories/IImportBatchRepository";
import { StreamImportService } from "../services/StreamImportService";

export class ImportTransactionsUseCase {
  constructor(
    private batchRepo: IImportBatchRepository,
    private importer: StreamImportService
  ) {}

  async execute(fileName: string, filePath: Readable, userId?: number) {
    const batch = await this.batchRepo.create(fileName, 0, userId);
    try {
      await this.importer.importFile(filePath, batch.id);
      await this.batchRepo.markComplete(batch.id);
    } catch (err: any) {
      await this.batchRepo.markFailed(batch.id, err.message);
      throw err;
    }
  }
}
