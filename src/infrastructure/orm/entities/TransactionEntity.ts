import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ImportBatchEntity } from "./ImportBatchEntity";

@Entity("transactions")
export class TransactionEntity {
  @PrimaryGeneratedColumn() id!: number;

  @ManyToOne(() => ImportBatchEntity, batch => batch.transactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "batch_id" })
  batch!: ImportBatchEntity;

  @Column({ type: "timestamptz" }) transaction_date!: Date;
  @Column("text") description!: string;
  @Column("numeric", { precision: 15, scale: 2 }) amount!: number;
  @Column() type!: string;

  @Column({ type: "timestamptz", default: () => "NOW()" }) created_at!: Date;
}
