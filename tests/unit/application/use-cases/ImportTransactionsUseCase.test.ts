import { Readable } from 'stream';
import { ImportTransactionsUseCase } from '../../../../src/application/use-cases/ImportTransactionsUseCase';
import { IImportBatchRepository } from '../../../../src/domain/repositories/IImportBatchRepository';
import { StreamImportService } from '../../../../src/application/services/StreamImportService';
import { ImportBatchEntity } from '../../../../src/infrastructure/orm/entities/ImportBatchEntity';

describe('ImportTransactionsUseCase', () => {
  let mockBatchRepo: jest.Mocked<IImportBatchRepository>;
  let mockImporter: jest.Mocked<StreamImportService>;
  let useCase: ImportTransactionsUseCase;
  let mockStream: Readable;

  beforeEach(() => {
    mockBatchRepo = {
      create: jest.fn(),
      markComplete: jest.fn(),
      markFailed: jest.fn(),
    } as any;

    mockImporter = {
      importFile: jest.fn(),
    } as any;

    useCase = new ImportTransactionsUseCase(mockBatchRepo, mockImporter);

    mockStream = new Readable();
    mockStream.push('test data');
    mockStream.push(null);
  });

  it('should successfully import transactions', async () => {
    const mockBatch = new ImportBatchEntity();
    mockBatch.id = 1;
    mockBatch.file_name = 'test.csv';
    mockBatch.record_count = 0;
    mockBatch.status = 'pending';

    mockBatchRepo.create.mockResolvedValue(mockBatch);
    mockImporter.importFile.mockResolvedValue();
    mockBatchRepo.markComplete.mockResolvedValue();

    await useCase.execute('test.csv', mockStream, 123);

    expect(mockBatchRepo.create).toHaveBeenCalledWith('test.csv', 0, 123);
    expect(mockImporter.importFile).toHaveBeenCalledWith(mockStream, 1);
    expect(mockBatchRepo.markComplete).toHaveBeenCalledWith(1);
    expect(mockBatchRepo.markFailed).not.toHaveBeenCalled();
  });

  it('should handle import failure and mark batch as failed', async () => {
    const mockBatch = new ImportBatchEntity();
    mockBatch.id = 1;
    mockBatch.file_name = 'test.csv';
    mockBatch.record_count = 0;
    mockBatch.status = 'pending';

    const importError = new Error('Import failed');

    mockBatchRepo.create.mockResolvedValue(mockBatch);
    mockImporter.importFile.mockRejectedValue(importError);
    mockBatchRepo.markFailed.mockResolvedValue();

    await expect(useCase.execute('test.csv', mockStream, 123)).rejects.toThrow('Import failed');

    expect(mockBatchRepo.create).toHaveBeenCalledWith('test.csv', 0, 123);
    expect(mockImporter.importFile).toHaveBeenCalledWith(mockStream, 1);
    expect(mockBatchRepo.markFailed).toHaveBeenCalledWith(1, 'Import failed');
    expect(mockBatchRepo.markComplete).not.toHaveBeenCalled();
  });

  it('should work without userId', async () => {
    const mockBatch = new ImportBatchEntity();
    mockBatch.id = 1;
    mockBatch.file_name = 'test.csv';
    mockBatch.record_count = 0;
    mockBatch.status = 'pending';

    mockBatchRepo.create.mockResolvedValue(mockBatch);
    mockImporter.importFile.mockResolvedValue();
    mockBatchRepo.markComplete.mockResolvedValue();

    await useCase.execute('test.csv', mockStream);

    expect(mockBatchRepo.create).toHaveBeenCalledWith('test.csv', 0, undefined);
    expect(mockImporter.importFile).toHaveBeenCalledWith(mockStream, 1);
    expect(mockBatchRepo.markComplete).toHaveBeenCalledWith(1);
  });

  it('should handle batch creation failure', async () => {
    const creationError = new Error('Failed to create batch');
    mockBatchRepo.create.mockRejectedValue(creationError);

    await expect(useCase.execute('test.csv', mockStream, 123)).rejects.toThrow('Failed to create batch');

    expect(mockBatchRepo.create).toHaveBeenCalledWith('test.csv', 0, 123);
    expect(mockImporter.importFile).not.toHaveBeenCalled();
    expect(mockBatchRepo.markComplete).not.toHaveBeenCalled();
    expect(mockBatchRepo.markFailed).not.toHaveBeenCalled();
  });

  it('should handle markComplete failure and mark as failed', async () => {
    const mockBatch = new ImportBatchEntity();
    mockBatch.id = 1;
    mockBatch.file_name = 'test.csv';
    mockBatch.record_count = 0;
    mockBatch.status = 'pending';

    const markCompleteError = new Error('Failed to mark complete');

    mockBatchRepo.create.mockResolvedValue(mockBatch);
    mockImporter.importFile.mockResolvedValue();
    mockBatchRepo.markComplete.mockRejectedValue(markCompleteError);
    mockBatchRepo.markFailed.mockResolvedValue();

    await expect(useCase.execute('test.csv', mockStream, 123)).rejects.toThrow('Failed to mark complete');

    expect(mockBatchRepo.create).toHaveBeenCalledWith('test.csv', 0, 123);
    expect(mockImporter.importFile).toHaveBeenCalledWith(mockStream, 1);
    expect(mockBatchRepo.markComplete).toHaveBeenCalledWith(1);
    expect(mockBatchRepo.markFailed).toHaveBeenCalledWith(1, 'Failed to mark complete');
  });
}); 