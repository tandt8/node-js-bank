import { Repository } from 'typeorm';
import { ImportBatchRepository } from '../../../../src/infrastructure/orm/ImportBatchRepository';
import { ImportBatchEntity } from '../../../../src/infrastructure/orm/entities/ImportBatchEntity';

describe('ImportBatchRepository', () => {
  let repository: ImportBatchRepository;
  let mockRepo: jest.Mocked<Repository<ImportBatchEntity>>;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    } as any;

    repository = new ImportBatchRepository(mockRepo);
  });

  describe('create', () => {
    it('should create a new import batch', async () => {
      const fileName = 'test.csv';
      const recordCount = 100;
      const userId = 123;

      const mockBatch = new ImportBatchEntity();
      mockBatch.id = 1;
      mockBatch.file_name = fileName;
      mockBatch.record_count = recordCount;
      mockBatch.status = 'pending';

      mockRepo.create.mockReturnValue(mockBatch);
      mockRepo.save.mockResolvedValue(mockBatch);

      const result = await repository.create(fileName, recordCount, userId);

      expect(mockRepo.create).toHaveBeenCalledWith({
        file_name: fileName,
        record_count: recordCount,
        importedBy: { id: userId },
      });
      expect(mockRepo.save).toHaveBeenCalledWith(mockBatch);
      expect(result).toBe(mockBatch);
    });

    it('should create batch without userId', async () => {
      const fileName = 'test.csv';
      const recordCount = 100;

      const mockBatch = new ImportBatchEntity();
      mockBatch.id = 1;
      mockBatch.file_name = fileName;
      mockBatch.record_count = recordCount;
      mockBatch.status = 'pending';

      mockRepo.create.mockReturnValue(mockBatch);
      mockRepo.save.mockResolvedValue(mockBatch);

      const result = await repository.create(fileName, recordCount);

      expect(mockRepo.create).toHaveBeenCalledWith({
        file_name: fileName,
        record_count: recordCount,
        importedBy: undefined,
      });
      expect(mockRepo.save).toHaveBeenCalledWith(mockBatch);
      expect(result).toBe(mockBatch);
    });

    it('should handle creation failure', async () => {
      const error = new Error('Database error');
      mockRepo.create.mockReturnValue({} as any);
      mockRepo.save.mockRejectedValue(error);

      await expect(repository.create('test.csv', 100, 123)).rejects.toThrow('Database error');
    });
  });

  describe('markComplete', () => {
    it('should mark batch as complete', async () => {
      const batchId = 1;

      mockRepo.update.mockResolvedValue({ affected: 1 } as any);

      await repository.markComplete(batchId);

      expect(mockRepo.update).toHaveBeenCalledWith(
        batchId,
        { status: 'completed' }
      );
    });

    it('should handle markComplete failure', async () => {
      const batchId = 1;
      const error = new Error('Update failed');

      mockRepo.update.mockRejectedValue(error);

      await expect(repository.markComplete(batchId)).rejects.toThrow('Update failed');
    });
  });

  describe('markFailed', () => {
    it('should mark batch as failed with error message', async () => {
      const batchId = 1;
      const errorMessage = 'Import failed due to invalid format';

      mockRepo.update.mockResolvedValue({ affected: 1 } as any);

      await repository.markFailed(batchId, errorMessage);

      expect(mockRepo.update).toHaveBeenCalledWith(
        batchId,
        { 
          status: 'failed',
          error_message: errorMessage
        }
      );
    });

    it('should handle markFailed failure', async () => {
      const batchId = 1;
      const errorMessage = 'Import failed';
      const error = new Error('Update failed');

      mockRepo.update.mockRejectedValue(error);

      await expect(repository.markFailed(batchId, errorMessage)).rejects.toThrow('Update failed');
    });
  });
}); 