import { Transaction } from '../../../../src/domain/entities/Transaction';

describe('Transaction Entity', () => {
  it('should create a transaction with valid data', () => {
    const date = new Date('2023-01-01');
    const content = 'Test transaction';
    const amount = 100.50;
    const type = 'Deposit' as const;

    const transaction = new Transaction(date, content, amount, type);

    expect(transaction.date).toBe(date);
    expect(transaction.content).toBe(content);
    expect(transaction.amount).toBe(amount);
    expect(transaction.type).toBe(type);
  });

  it('should accept both Deposit and Withdraw types', () => {
    const date = new Date('2023-01-01');
    const content = 'Test transaction';
    const amount = 100.50;

    const depositTransaction = new Transaction(date, content, amount, 'Deposit');
    const withdrawTransaction = new Transaction(date, content, amount, 'Withdraw');

    expect(depositTransaction.type).toBe('Deposit');
    expect(withdrawTransaction.type).toBe('Withdraw');
  });

  it('should handle negative amounts', () => {
    const date = new Date('2023-01-01');
    const content = 'Test transaction';
    const amount = -50.25;
    const type = 'Withdraw' as const;

    const transaction = new Transaction(date, content, amount, type);

    expect(transaction.amount).toBe(amount);
  });

  it('should handle zero amounts', () => {
    const date = new Date('2023-01-01');
    const content = 'Test transaction';
    const amount = 0;
    const type = 'Deposit' as const;

    const transaction = new Transaction(date, content, amount, type);

    expect(transaction.amount).toBe(amount);
  });
}); 