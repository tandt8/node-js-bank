import { Request, Response } from 'express';
import { Readable } from 'stream';
import { TransactionController } from '../../../../src/presentation/controllers/TransactionController';
import { ImportTransactionsUseCase } from '../../../../src/application/use-cases/ImportTransactionsUseCase';

describe('TransactionController', () => {
  let controller: TransactionController;
  let mockUseCase: jest.Mocked<ImportTransactionsUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn(),
    } as any;

    controller = new TransactionController(mockUseCase);

    mockRequest = {
      body: {
        fileName: 'test.csv',
        userId: 123,
      },
      file: {
        buffer: Buffer.from('test data'),
        stream: undefined,
      } as any,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should successfully import transactions', async () => {
    mockUseCase.execute.mockResolvedValue();

    await controller.import(mockRequest as Request, mockResponse as Response);

    expect(mockUseCase.execute).toHaveBeenCalledWith(
      'test.csv',
      expect.any(Readable),
      123
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Imported batch' });
  });

  it('should handle missing file stream', async () => {
    mockRequest.file = undefined;

    await controller.import(mockRequest as Request, mockResponse as Response);

    expect(mockUseCase.execute).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No file stream provided' });
  });

  it('should handle file with stream but no buffer', async () => {
    const mockStream = new Readable();
    mockRequest.file = {
      buffer: undefined,
      stream: mockStream,
    } as any;

    mockUseCase.execute.mockResolvedValue();

    await controller.import(mockRequest as Request, mockResponse as Response);

    expect(mockUseCase.execute).toHaveBeenCalledWith(
      'test.csv',
      mockStream,
      123
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Imported batch' });
  });

  it('should handle import failure', async () => {
    const error = new Error('Import failed');
    mockUseCase.execute.mockRejectedValue(error);

    await controller.import(mockRequest as Request, mockResponse as Response);

    expect(mockUseCase.execute).toHaveBeenCalledWith(
      'test.csv',
      expect.any(Readable),
      123
    );
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Import failed' });
  });

  it('should work without userId', async () => {
    delete mockRequest.body!.userId;
    mockUseCase.execute.mockResolvedValue();

    await controller.import(mockRequest as Request, mockResponse as Response);

    expect(mockUseCase.execute).toHaveBeenCalledWith(
      'test.csv',
      expect.any(Readable),
      undefined
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Imported batch' });
  });

  it('should handle missing fileName', async () => {
    delete mockRequest.body!.fileName;
    mockUseCase.execute.mockResolvedValue();

    await controller.import(mockRequest as Request, mockResponse as Response);

    expect(mockUseCase.execute).toHaveBeenCalledWith(
      undefined,
      expect.any(Readable),
      123
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Imported batch' });
  });
}); 