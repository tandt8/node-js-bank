"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
class Transaction {
    constructor(date, content, amount, type) {
        this.date = date;
        this.content = content;
        this.amount = amount;
        this.type = type;
    }
}
exports.Transaction = Transaction;
