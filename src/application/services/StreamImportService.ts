import { DataSource, QueryRunner } from "typeorm";
import { chunk } from "../../shared/utils/chunkGenerator";
import { parseCsvRows, parseCsvRowsFromStream } from "./csvRowGenerator";
import { TransactionEntity } from "../../infrastructure/orm/entities/TransactionEntity";
import { Readable } from "stream";

export class StreamImportService {
  constructor(
    private dataSource: DataSource,
    private batchSize = 1000
  ) {}

  async importFile(filePath: Readable, batchId: number): Promise<void> {
    const runner: QueryRunner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
      const repo = runner.manager.getRepository(TransactionEntity);

      const rowsGen = parseCsvRowsFromStream(filePath);
      for await (const batch of chunk(rowsGen, this.batchSize)) {
        await repo
          .createQueryBuilder()
          .insert()
          .into(TransactionEntity)
          .values(
            batch.map(row => ({
              transaction_date: row.date,
              description: row.description,
              amount: row.amount,
              type: row.type,
              batch: { id: batchId } as any,
            }))
          )
          .execute();
      }

      await runner.commitTransaction();
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }
  }

  async importStream(fileStream: Readable, batchId: number): Promise<void> {
    const runner: QueryRunner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
      const repo = runner.manager.getRepository(TransactionEntity);

      const rowsGen = parseCsvRowsFromStream(fileStream);
      for await (const batch of chunk(rowsGen, this.batchSize)) {
        await repo
          .createQueryBuilder()
          .insert()
          .into(TransactionEntity)
          .values(
            batch.map(row => ({
              transaction_date: row.date,
              description: row.description,
              amount: row.amount,
              type: row.type,
              batch: { id: batchId } as any,
            }))
          )
          .execute();
      }

      await runner.commitTransaction();
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }
  }
}
