import { Repository } from 'typeorm';
import { TransactionRepository } from '../../../../src/infrastructure/orm/TransactionRepository';
import { TransactionEntity } from '../../../../src/infrastructure/orm/entities/TransactionEntity';
import { ImportBatchEntity } from '../../../../src/infrastructure/orm/entities/ImportBatchEntity';
import { Transaction } from '../../../../src/domain/entities/Transaction';

describe('TransactionRepository', () => {
  let repository: TransactionRepository;
  let mockRepo: jest.Mocked<Repository<TransactionEntity>>;
  let mockBatch: ImportBatchEntity;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    repository = new TransactionRepository(mockRepo);

    mockBatch = new ImportBatchEntity();
    mockBatch.id = 1;
    mockBatch.file_name = 'test.csv';
    mockBatch.record_count = 0;
    mockBatch.status = 'pending';
  });

  describe('setBatch', () => {
    it('should set the batch for the repository', () => {
      repository.setBatch(mockBatch);
      // The batch is set internally, we can't directly test it
      // but we can test that saveMany works after setting the batch
    });
  });

  describe('saveMany', () => {
    it('should save multiple transactions', async () => {
      repository.setBatch(mockBatch);

      const transactions = [
        new Transaction(new Date('2023-01-01'), 'Test 1', 100.50, 'Deposit'),
        new Transaction(new Date('2023-01-02'), 'Test 2', -50.25, 'Withdraw'),
      ];

      const mockEntities = [
        { id: 1, transaction_date: new Date('2023-01-01'), description: 'Test 1', amount: 100.50, type: 'Deposit' },
        { id: 2, transaction_date: new Date('2023-01-02'), description: 'Test 2', amount: -50.25, type: 'Withdraw' },
      ];

      mockRepo.create.mockReturnValueOnce(mockEntities[0] as any);
      mockRepo.create.mockReturnValueOnce(mockEntities[1] as any);
      mockRepo.save.mockResolvedValue(mockEntities as any);

      await repository.saveMany(transactions);

      expect(mockRepo.create).toHaveBeenCalledTimes(2);
      expect(mockRepo.create).toHaveBeenCalledWith({
        transaction_date: transactions[0].date,
        description: transactions[0].content,
        amount: transactions[0].amount,
        type: transactions[0].type,
        batch: mockBatch,
      });
      expect(mockRepo.create).toHaveBeenCalledWith({
        transaction_date: transactions[1].date,
        description: transactions[1].content,
        amount: transactions[1].amount,
        type: transactions[1].type,
        batch: mockBatch,
      });
      expect(mockRepo.save).toHaveBeenCalledWith(mockEntities);
    });

    it('should throw error when batch is not set', async () => {
      const transactions = [
        new Transaction(new Date('2023-01-01'), 'Test 1', 100.50, 'Deposit'),
      ];

      await expect(repository.saveMany(transactions)).rejects.toThrow('Batch not set');
      expect(mockRepo.create).not.toHaveBeenCalled();
      expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('should handle empty transactions array', async () => {
      repository.setBatch(mockBatch);

      await repository.saveMany([]);

      expect(mockRepo.create).not.toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalledWith([]);
    });

    it('should handle single transaction', async () => {
      repository.setBatch(mockBatch);

      const transactions = [
        new Transaction(new Date('2023-01-01'), 'Test 1', 100.50, 'Deposit'),
      ];

      const mockEntity = { id: 1, transaction_date: new Date('2023-01-01'), description: 'Test 1', amount: 100.50, type: 'Deposit' };

      mockRepo.create.mockReturnValue(mockEntity as any);
      mockRepo.save.mockResolvedValue([mockEntity] as any);

      await repository.saveMany(transactions);

      expect(mockRepo.create).toHaveBeenCalledTimes(1);
      expect(mockRepo.save).toHaveBeenCalledWith([mockEntity]);
    });
  });
}); 