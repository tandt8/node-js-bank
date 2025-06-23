import { Readable } from 'stream';
import { parseCsvRowsFromStream, TransactionRow } from '../../../../src/application/services/csvRowGenerator';
import { createGzip } from 'zlib';

describe('csvRowGenerator', () => {
  const createGzippedCsvStream = (csvData: string): Readable => {
    const gzip = createGzip();
    const csvStream = new Readable();
    csvStream.push(csvData);
    csvStream.push(null);
    return csvStream.pipe(gzip);
  };

  const createPlainCsvStream = (csvData: string): Readable => {
    const csvStream = new Readable();
    csvStream.push(csvData);
    csvStream.push(null);
    return csvStream;
  };

  describe('parseCsvRowsFromStream', () => {
    it('should parse valid CSV data from gzipped stream', async () => {
      const csvData = 'date,content,amount,type\n2023-01-01,Test transaction,100.50,Deposit\n2023-01-02,Another transaction,-50.25,Withdraw';
      const stream = createGzippedCsvStream(csvData);

      const rows: TransactionRow[] = [];
      for await (const row of parseCsvRowsFromStream(stream)) {
        rows.push(row);
      }

      expect(rows).toHaveLength(2);
      expect(rows[0]).toEqual({
        date: new Date('2023-01-01'),
        description: 'Test transaction',
        amount: 100.50,
        type: 'Deposit'
      });
      expect(rows[1]).toEqual({
        date: new Date('2023-01-02'),
        description: 'Another transaction',
        amount: -50.25,
        type: 'Withdraw'
      });
    });

    it('should handle amounts with commas and plus signs', async () => {
      const csvData = 'date,content,amount,type\n2023-01-01,Test transaction,+1000.50,Deposit\n2023-01-02,Another transaction,-2500.75,Withdraw';
      const stream = createGzippedCsvStream(csvData);

      const rows: TransactionRow[] = [];
      for await (const row of parseCsvRowsFromStream(stream)) {
        rows.push(row);
      }

      expect(rows).toHaveLength(2);
      expect(rows[0].amount).toBe(1000.50);
      expect(rows[1].amount).toBe(-2500.75);
    });

    it('should handle empty stream', async () => {
      const csvData = 'date,content,amount,type\n';
      const stream = createGzippedCsvStream(csvData);

      const rows: TransactionRow[] = [];
      for await (const row of parseCsvRowsFromStream(stream)) {
        rows.push(row);
      }

      expect(rows).toHaveLength(0);
    });

    it('should handle single row', async () => {
      const csvData = 'date,content,amount,type\n2023-01-01,Single transaction,100.00,Deposit';
      const stream = createGzippedCsvStream(csvData);

      const rows: TransactionRow[] = [];
      for await (const row of parseCsvRowsFromStream(stream)) {
        rows.push(row);
      }

      expect(rows).toHaveLength(1);
      expect(rows[0]).toEqual({
        date: new Date('2023-01-01'),
        description: 'Single transaction',
        amount: 100.00,
        type: 'Deposit'
      });
    });

    it('should handle zero amounts', async () => {
      const csvData = 'date,content,amount,type\n2023-01-01,Zero transaction,0.00,Deposit';
      const stream = createGzippedCsvStream(csvData);

      const rows: TransactionRow[] = [];
      for await (const row of parseCsvRowsFromStream(stream)) {
        rows.push(row);
      }

      expect(rows).toHaveLength(1);
      expect(rows[0].amount).toBe(0.00);
    });

    it('should handle decimal amounts', async () => {
      const csvData = 'date,content,amount,type\n2023-01-01,Decimal transaction,123.45,Deposit';
      const stream = createGzippedCsvStream(csvData);

      const rows: TransactionRow[] = [];
      for await (const row of parseCsvRowsFromStream(stream)) {
        rows.push(row);
      }

      expect(rows).toHaveLength(1);
      expect(rows[0].amount).toBe(123.45);
    });

    it('should parse valid CSV data from plain (not gzipped) stream', async () => {
      const csvData = 'date,content,amount,type\n2023-01-01,Test transaction,100.50,Deposit\n2023-01-02,Another transaction,-50.25,Withdraw';
      const stream = createPlainCsvStream(csvData);

      const rows: TransactionRow[] = [];
      for await (const row of parseCsvRowsFromStream(stream)) {
        rows.push(row);
      }

      expect(rows).toHaveLength(2);
      expect(rows[0]).toEqual({
        date: new Date('2023-01-01'),
        description: 'Test transaction',
        amount: 100.50,
        type: 'Deposit'
      });
      expect(rows[1]).toEqual({
        date: new Date('2023-01-02'),
        description: 'Another transaction',
        amount: -50.25,
        type: 'Withdraw'
      });
    });

    it('should handle empty plain CSV stream', async () => {
      const csvData = 'date,content,amount,type\n';
      const stream = createPlainCsvStream(csvData);

      const rows: TransactionRow[] = [];
      for await (const row of parseCsvRowsFromStream(stream)) {
        rows.push(row);
      }

      expect(rows).toHaveLength(0);
    });
  });
}); 