export class Transaction {
  constructor(
    public date: Date,
    public content: string,
    public amount: number,
    public type: 'Deposit' | 'Withdraw'
  ) {}
}
